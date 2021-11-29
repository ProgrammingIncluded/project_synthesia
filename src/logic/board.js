/**
 * Contains logic for the play area
 */

import { G_PIXI } from "../bootstrap.js";
import assert from "assert";
import { G_LOGGER } from "../logger.js";

// Renders playspace as chunks of chunksize for collision detection and placement of objects.
// Basically groups chunksize into their own containers.
// Does some basic optimizations
// - Any player adjacent chunk that is within 1/3 the distance is toggled to update and render
// - Any chunk outside that range no longer updates
class BoardTree {
    constructor(playerEntity, rootContainer, eLoader, sizeX, sizeY, chunkSize=256) {
        // To save some hassle, playerEntity should be of type Player for now.
        // The properties is that users can move the player every render loop.
        // Due to dynamic loading, cannot assert to check here.

        this.root = rootContainer;
        this.eLoader = eLoader;
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.chunkSize = chunkSize;

        // private
        this._containerLookup = {};
        this._renderedContainers = [];

        // the player is specially tracked because they are what makes the world update
        this.playerEntity = playerEntity;

        // Make sure size is always a multiple of chunksize
        assert(this.sizeX % chunkSize == 0, "Must be a multiple of chunk size.")
        assert(this.sizeY % chunkSize == 0, "Must be a multiple of chunk size.")

        // Generate the containers
        for (let x = 0; x < sizeX; x += chunkSize) {
            for (let y = 0; y < sizeY; y += chunkSize) {
                let container = new G_PIXI.Container();
                container.x = x;
                container.y = y;
                container.width = this.chunkSize;
                container.length = this.chunkSize;

                this._addContainer(container, x, y);
            }
        }
    }

    // Private functions
    _addContainer(container, x, y) {
        container.renderable = false;
        this._containerLookup[[x, y].toString()] = container;
        this.root.addChild(container);
    }

    // Public functions
    // Should be called every render loop
    update(delta) {
        this.playerEntity.update(delta);
        let containers = this.getActiveContainers(this.playerEntity.position.x, this.playerEntity.position.y);

        // toggle off all containers
        for (let con of this._renderedContainers) {
            con.renderable = false;
        }
        this._renderedContainers = [];

        // Update each container
        for (let con of containers) {
            con.renderable = true;
            this._renderedContainers.push(con);
            for (let child of con.children) {
                child.entity.update(delta);
            }
        }

        this.calculateCollision(containers);
    }

    getContainer(x, y) {
        // Clip the coordinates to nearest 4 containers by looking at the containing container
        // and it's quadrants
        assert(x !== undefined, "Invalid coordinates given");
        assert(y !== undefined, "Invalid coordinates given");

        let containingChunkX = Math.floor(x / this.chunkSize) * this.chunkSize;
        let containingChunkY = Math.floor(y / this.chunkSize) * this.chunkSize;

        return this._containerLookup[[containingChunkX, containingChunkY]];
    }

    calculateCollision(containers) {
        let allChildren = {};
        // Add the player
        if (this.playerEntity.collidable) {
            allChildren[this.playerEntity.collideLayer] = [this.playerEntity.container];
        }

        // Only observe collidables
        // Sort by each collidable layer
        for (const cont of containers) {
            for (const child of cont.children) {
                let entity = child.entity;
                let layer = entity.collideLayer;
                if (entity.collidable) {
                    if (!(layer in allChildren)) {
                        allChildren[layer] = [child]
                    }
                    else {
                        allChildren[layer].push(child);
                    }
                }
            }
        }

        Object.entries(allChildren).forEach((values, idx) => {
            let layer = values[0];
            let layerChildren = values[1];

            // Get all the other children
            let allOtherChildren = Object.entries(allChildren)
                                    .slice(idx + 1)
                                    .reduce((acc, curVal) => acc.concat(curVal[1]), []);

            layerChildren.forEach((container, idx) => {
                allOtherChildren.forEach((otherContainer, idx) => {
                    // TODO: can be faster with cache
                    const bounds1 = container.entity.container.getBounds();
                    const bounds2 = otherContainer.entity.container.getBounds();
                    let onHit = (bounds1.x < bounds2.x + bounds2.width
                                && bounds1.x + bounds1.width > bounds2.x
                                && bounds1.y < bounds2.y + bounds2.height
                                && bounds1.y + bounds1.height > bounds2.y);

                    if (onHit) {
                        container.entity.onHit(otherContainer.entity);
                        otherContainer.entity.onHit(container.entity);
                    }
                });
            });
        });

    }

    // Get all active containers that should be updated
    // Preferable from player position
    getActiveContainers(x, y) {
        // Clip the coordinates to nearest 4 containers by looking at the containing container
        // and it's quadrants
        assert(x !== undefined, "Invalid coordinates given");
        assert(y !== undefined, "Invalid coordinates given");
        let containingChunkX = Math.floor(x / this.chunkSize) * this.chunkSize;
        let containingChunkY = Math.floor(y / this.chunkSize) * this.chunkSize;

        // Clip to within board game size, possible with positive values
        containingChunkX = Math.min(containingChunkX, this.sizeX - this.chunkSize);
        containingChunkY = Math.min(containingChunkY, this.sizeY - this.chunkSize);

        // Grab containing chunk and determine quadrant
        // Grab midpoint
        let midpointOffset = Math.floor(this.chunkSize/2);
        let midpointX = containingChunkX + midpointOffset;
        let midpointY = containingChunkY + midpointOffset;

        // Depending on the quadrant, go and change the values
        let xOffset = (midpointX > midpointOffset ? 1 : -1) * this.chunkSize;
        let yOffset = (midpointY > midpointOffset ? 1: -1) * this.chunkSize;

        let coordsRelativeToContainingChunk = [
            [0, 0],
            [xOffset, 0],
            [0, yOffset],
            [xOffset, yOffset]
        ];

        let fetchedContainerResults = [];
        coordsRelativeToContainingChunk.forEach((coords) => {
            let xActual = coords[0] + containingChunkX;
            let yActual = coords[1] + containingChunkY;
            let key = [xActual, yActual];
            let value = this._containerLookup[key];
            if (value !== undefined) {
                fetchedContainerResults.push(value);
            }
        });

        assert(fetchedContainerResults.length >= 1, "There must be atleast one container being fetched.")
        return fetchedContainerResults;
    }

    async addEntity(entityName, x, y, ...varArgs) {
        assert(x < this.sizeX, "Entity placed farther than gamespace");
        assert(y < this.sizeY, "Entity placed farther than gamespace");

        let container = this.getContainer(x, y);
        return this.eLoader.load(entityName, container, new G_PIXI.Point(x, y), this, ...varArgs);
    }
}

class Board {
    // TODO: Level encoding
    constructor(eLoader, playarea, levelEncoding) {
        this.eLoader = eLoader;
        this.playAreaDim = {height: 540, width: Math.floor(540 * (16.0 / 9))};
        this.playContainer = playarea;
        this.playContainer.height = this.playAreaDim.height;
        this.playContainer.width = this.playAreaDim.width;

        this.boardTree = null;

        this.entities = {
            player: null,
            enemies: [],
            bullets: [],
            deadBullets: []
        }
    }

    async load() {
        // TODO: Fill in procedural game logic generation
        // TODO:
        // 1. Add player sprite
        // 2. Add alternate sprites (e.g. taking damage)
        let playerEntity = await this.eLoader.load("player", this.playContainer, new G_PIXI.Point(0,  200), this);
        this.entities.player = playerEntity;

        let boardSize = 1024 * 4;
        let chunkSize = 256;
        this.boardTree = new BoardTree(playerEntity, this.playContainer, this.eLoader, boardSize, boardSize, chunkSize);
        for (let i = 0; i < 1; ++i) {
            this.boardTree.addEntity("enemy_basic",
                Math.floor(Math.random()),
                Math.floor(Math.random()))
        }

        // Set a period of resetting the enemy
        // setInterval(() => {
            // if (this.entities.enemies.length == 1) {
                // this.entities.enemies[0].teardown();
            // }
            // this.entities.enemies = [];
            // this.eLoader.load("enemy_basic", this.playContainer, new G_PIXI.Point(0, 90)).then((v) => {
                // this.entities.enemies.push(v);
            // })
        // }, 3000);
    }

    update(delta) {
        this.boardTree.update(delta);
    }

    async teardown() {
        for(let entity of Object.values(this.entities)) {
            if (typeof(entity) === Array) {
                entity.foreach((en) => { en.teardown(); });
            }
            else {
                entity.teardown();
            }
        }
    }
}

export {
    Board
}
