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
        assert(x !== undefined, "Invalid coordinates given");
        assert(y !== undefined, "Invalid coordinates given");

        let containingChunkX = Math.floor(x / this.chunkSize) * this.chunkSize;
        let containingChunkY = Math.floor(y / this.chunkSize) * this.chunkSize;

        // Clip to within board game size, possible with positive values
        containingChunkX = Math.min(containingChunkX, this.sizeX - this.chunkSize);
        containingChunkY = Math.min(containingChunkY, this.sizeY - this.chunkSize);

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
            let layerChildren = values[1];

            // Get all the other children
            let allOtherChildren = Object.entries(allChildren)
                                    .slice(idx + 1)
                                    .reduce((acc, curVal) => acc.concat(curVal[1]), []);

            layerChildren.forEach((container, idx) => {
                for (let otherIdx = 0; otherIdx < allOtherChildren.length; ++otherIdx) {
                    // TODO: can be faster with cache
                    let otherContainer = allOtherChildren[otherIdx];

                    // Work around to allow for teardown() during hit due to array modification and getBounds.
                    if (container.entity.dead) {
                        break;
                    }
                    if (otherContainer.entity.dead) {
                        continue;
                    }

                    const bounds1 = container.entity.container.getBounds();
                    const bounds2 = otherContainer.entity.container.getBounds();
                    let onHit = (bounds1.x < bounds2.x + bounds2.width
                                && bounds1.x + bounds1.width > bounds2.x
                                && bounds1.y < bounds2.y + bounds2.height
                                && bounds1.y + bounds1.height > bounds2.y);

                    if (onHit) {
                        container.entity.onHit(otherContainer.entity);
                        otherContainer.entity.onHit(container.entity);

                        if(container.entity.dead) {
                            container.entity.teardown();
                        }

                        if(otherContainer.entity.dead) {
                            otherContainer.entity.teardown();
                        }
                    }
                }
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
        return this.eLoader.load(entityName, container, new G_PIXI.Point(x % this.chunkSize, y % this.chunkSize), this, ...varArgs);
    }
}

class Board {
    // TODO: Level encoding
    constructor(eLoader, playarea, levelEncoding, levelSize=1024*8, chunkSize=1024) {
        this.eLoader = eLoader;
        this.playAreaDim = {height: 540, width: Math.floor(540 * (16.0 / 9))};
        this.playContainer = playarea;
        this.playContainer.height = this.playAreaDim.height;
        this.playContainer.width = this.playAreaDim.width;

        this.boardTree = null;
        this.levelSize = levelSize;
        this.chunkSize = chunkSize;

        this.entities = {
            player: null,
            playerBullets: []
        }

        this.levelEncoding = levelEncoding;
    }

    getEncodingMap() {
        return {
            "*": "wall",
            "e": "enemy_basic",
            "p": "player"
        }
    }

    async processLevelEncoding(boardTree, levelEncoding, spacing=32) {
        let encoding = this.getEncodingMap();
        let value = undefined;
        levelEncoding.forEach((row, y) => {
            for (let x = 0; x < row.length; ++x) {
                value = encoding[row[x]];
                if(value == undefined) {
                    continue;
                }
                boardTree.addEntity(value, x * spacing, y * spacing);
            }
        });
    }

    async createPlayer(levelEncoding, spacing=32) {
       // First find where the player is located
        let px = -1;
        let py = -1;
        let srow;
        for (let y = 0; y < levelEncoding.length; ++y) {
            let row = levelEncoding[y];
            px = row.indexOf("p");
            if(px  >= 0) {
                srow = row;
                py = y;
                break;
            }
        }

        let playerEntity = await this.eLoader.load("player", this.playContainer, new G_PIXI.Point(px * spacing, py * spacing), this);
        this.entities.player = playerEntity;
        // Duplicate array via ES6 method
        let result = [...levelEncoding];
        result[py] = srow.substring(0, px) + " " + srow.substring(px + 1);
        return result;

    }

    // Fires a bullet that is immune to chunk culling
    fireGlobalBullet(maxSpeed, containerOrigin) {
        this.eLoader.load(
            "bullet",
            this.playContainer,
            new G_PIXI.Point(containerOrigin.x, containerOrigin.y),
            this.boardTree,
            maxSpeed,
            containerOrigin.rotation,
            false
        ).then((bullet) =>{
            this.entities.playerBullets.push(bullet);
        });
    }

    async load() {
        // Player must exist before world is created because trees need observers
        let noPlayerEncoding = await this.createPlayer(this.levelEncoding);

        // TODO: Fill in procedural game logic generation
        // 2. Add alternate sprites (e.g. taking damage)
        this.boardTree = new BoardTree(this.entities.player, this.playContainer, this.eLoader, this.levelSize, this.levelSize, this.chunkSize);

        this.processLevelEncoding(this.boardTree, noPlayerEncoding);
    }

    update(delta) {
        this.boardTree.update(delta);
        this.entities.playerBullets = this.entities.playerBullets.reduce((acc, curVal) => {
            curVal.update(delta);
            if (!curVal.dead) {
                acc.push(curVal);
            }
            return acc;
        }, []);
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
