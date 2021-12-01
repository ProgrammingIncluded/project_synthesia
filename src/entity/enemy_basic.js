import { Entity } from "./entity.js";
import { enemyBlueprint } from "./blueprints.js";
import { G_SELECT } from "../shared.js";
import { G_LOGGER } from "../logger.js";
import { G_EDITOR } from "../logic/editor.js";
import { G_HOWL, G_PIXI } from "../bootstrap.js"

class EnemyBasic extends Entity  {
    constructor() {
        super(enemyBlueprint);

        // set maxvelocity to 10
        this.spriteName = "sample.jpg";
        this.preStates["movement"]["maxVelocity"] = 10.0;
        this.shootFreq = 50;
        this.lastAttacked = 0;
        this.collidable = true;
        this.collideLayer = 2;
        this.prevPosition = null;
        this.health = 2;
        this.dead = false;
        this.elapsed = 0;
        // set during load
        this.boardTree = undefined;

        this.prevPosition = null;
    }

    fireBullet() {
        this.boardTree.addEntity(
            "bullet",
            this.position.x,
            this.position.y,
            this.maxSpeed,
            this.container.rotation + 2 * Math.PI * Math.random(),
            false
        );
        this.shootfx.play();
    }

    attack(elapsed, curPos, player, enemies, space) {
        if (elapsed - this.lastAttacked < this.shootFreq) {
            return;
        }

        // simple, linear bullet fire
        this.fireBullet();
        this.lastAttacked = elapsed; // reset counter if we fired
    }

    movement(elapsed, pos, player, enemies, space) {
        let resultX = pos.x + Math.cos(elapsed/50.0);
        // this.enforce((resultX - curPosX) <= this.preStates.movement.maxVelocity);
        return new this.helpers.Pixi.Point(resultX, pos.y + 0);
    }

    render(elapsed, sprite) {
        return sprite;
    }

    onHit(otherEntity) {
        if(otherEntity.isBullet) {
            this.damage();
        }
        else if(otherEntity.immovable) {
            this.position = this.prevPosition;
        }
    }

    damage() {
        if (this.dead) {
            return;
        }

        this.ouchfx.play();
        this.health-=1;
        this.dead = this.health <= 0;
    }

    // Engine level API
    load(boardTree) {
        this.howl = G_HOWL;
        this.boardTree = boardTree;
        // set some interactive properties
        this.container.interactive = true;
        this.container.buttonMode = true;

        this.container.on("pointerdown", (event) => {
            G_SELECT.select(this);
        });

        this.shootfx = new this.howl({
            src: ["assets/audio/effects/Moonshot.Sfx.Graze.wav"],
            loop: false
        });

        this.ouchfx = new this.howl({
            src: ["assets/audio/effects/Moonshot.Sfx.Hit.Enemy.Normal.wav"],
            loop: false
        });
    }

    update(delta) {
        this.elapsed += delta;
        let posBuf = this.movement(this.elapsed, this.position, undefined, undefined, undefined);
        this.prevPosition = new G_PIXI.Point(this.container.position.x, this.container.position.y);
        this.position = posBuf;
        this.attack(this.elapsed, this.position, undefined, undefined, undefined);
    }
}

module.exports = EnemyBasic;
