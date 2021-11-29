/**
 * Contains logic for the play area
 */

import { G_PIXI } from "../bootstrap.js";

class Board {
    // TODO: Level encoding
    constructor(eLoader, playarea, levelEncoding) {
        this.eLoader = eLoader;
        this.playAreaDim = {height: 540, width: Math.floor(540 * (16.0 / 9))};
        this.playContainer = playarea;
        this.playContainer.height = this.playAreaDim.height;
        this.playContainer.width = this.playAreaDim.width;

        this.elapsed = 0.0;
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


        let loadEnemies = this.eLoader.load("enemy_basic", this.playContainer, new G_PIXI.Point(0, 90)).then((v)=>{
            this.entities.enemies.push(v);
        });

        setInterval(() => {
            if (this.entities.enemies.length == 1) {
                this.entities.enemies[0].teardown();
            }
            this.entities.enemies = [];
            this.eLoader.load("enemy_basic", this.playContainer, new G_PIXI.Point(0, 90)).then((v) => {
                this.entities.enemies.push(v);
            })
        }, 3000);

        return Promise.all([loadPlayer, loadEnemies]);
    }

    update(delta) {
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
