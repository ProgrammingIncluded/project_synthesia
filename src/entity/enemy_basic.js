import { Entity } from "./entity.js";
import { enemyBlueprint } from "./blueprints.js";
import { G_SELECT } from "../shared.js";
import { G_LOGGER } from "../logger.js";
import { G_EDITOR } from "../logic/editor.js";
import { G_HOWL } from "../bootstrap.js"

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
        this.alive = true;
        this.elapsed = 0;
        // set during load
        this.boardTree = undefined;
    }

    fireBullet() {
        this.boardTree.addEntity(
            "bullet",
            this.position.x,
            this.position.y,
            this.maxSpeed,
            this.container.rotation + Math.PI, false
        );
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
        let resultX = 100.0 + Math.cos(elapsed/50.0) * 100.0;
        // this.enforce((resultX - curPosX) <= this.preStates.movement.maxVelocity);
        return new this.helpers.Pixi.Point(resultX, pos.y + 0);
    }

    render(elapsed, sprite) {
        return sprite;
    }

    onHit(otherEntity) {
        this.damage();
    }

    damage() {
        if (!alive) {
            return;
        }
        this.ouchfx.play();
        this.health-=1;
        alive = this.health > 0;
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
            src: ["assets/audio/effects/Moonshot.Sfx.Hit.Enemy.SoftImpact"],
            loop: false
        });
    }

    update(delta) {
        this.elapsed += delta;
        let posBuf = this.movement(this.elapsed, this.position, undefined, undefined, undefined);
        this.prevPosition = this.position;
        this.position = posBuf;
        this.attack(this.elapsed, this.position, undefined, undefined, undefined);
    }
}

module.exports = EnemyBasic;
