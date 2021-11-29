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
    constructor(playerEntity, rootContainer, sizeX, sizeY, chunkSize=256) {
        // To save some hassle, playerEntity should be of type Player for now.
        // The properties is that users can move the player every render loop.
        // Due to dynamic loading, cannot assert to check here.

        this.root = rootContainer;
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.chunkSize = chunkSize;

        // private
        this._containerLookup = {};

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

        this.getContainer(
            playerEntity.position.x,
            playerEntity.position.y
        ).addChild(this.playerEntity.container);
    }

    // Private functions
    _addContainer(container, x, y) {
        this._containerLookup[[x, y].toString()] = container;
    }

    // Public functions
    // Should be called every render loop
    update(delta) {
        let containers = this.getActiveContainers(this.playerEntity.position.x, this.playerEntity.position.y);

        // Update each container
        for (let con of containers) {
            for (let child of con.children) {
                child.entity.update(delta);
            }
        }
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

    // Get all active containers that should be updated
    // Preferable from player position
    getActiveContainers(x, y) {
        // Clip the coordinates to nearest 4 containers by looking at the containing container
        // and it's quadrants
        assert(x !== undefined, "Invalid coordinates given");
        assert(y !== undefined, "Invalid coordinates given");
        let containingChunkX = Math.floor(x / this.chunkSize) * this.chunkSize;
        let containingChunkY = Math.floor(y / this.chunkSize) * this.chunkSize;

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

    addWall(wall) {

    }

    addEnemy(enemy) {
        this.getContainer(enemy.position.x, enemy.position.y).addChild(enemy.container);
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
        let loadPlayer = this.eLoader.load("player", this.playContainer, new G_PIXI.Point(0,  200), this).then((v)=>{
            this.entities.player = v;
        });


        let loadEnemies = this.eLoader.load("enemy_basic", this.playContainer, new G_PIXI.Point(0, 90), this).then((v)=>{
            this.entities.enemies.push(v);
        });

        // Set a period of resetting the enemy
        setInterval(() => {
            if (this.entities.enemies.length == 1) {
                this.entities.enemies[0].teardown();
            }
            this.entities.enemies = [];
            this.eLoader.load("enemy_basic", this.playContainer, new G_PIXI.Point(0, 90), this).then((v) => {
                this.entities.enemies.push(v);
            })
        }, 3000);

        return Promise.all([loadPlayer, loadEnemies]).then(() => {
            this.boardTree = new BoardTree(this.entities.player, this.playContainer, 768, 768);
            this.boardTree.addEnemy(this.entities.enemies[0], 10, 10);
        });
    }

    update(delta) {
<<<<<<< HEAD
        this.elapsed += delta;
        this.entities.player.update(delta);
        this.entities.enemies.forEach((enemy)=>{
            enemy.update(this.elapsed);
        });

        this.entities.bullets.forEach((bullet, idx, bullets)=>{
            bullet.update(delta);
            // destroy bullet if off screen
            let bpos = bullet.container.position;
            if(bpos.x < 0 || bpos.x > this.playAreaDim.width || bpos.y < 0 || bpos.y > this.playAreaDim.height) {
                bullets.splice(idx, 1);
                bullet.teardown();
            }
        });
=======
        this.boardTree.update(delta);
>>>>>>> e80a3e7 (Add working snapshot)
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
