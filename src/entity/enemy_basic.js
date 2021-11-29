import { Entity } from "./entity.js";
import { enemyBlueprint } from "./blueprints.js";
import { G_LOGGER } from "../logger.js";
import { G_EDITOR } from "../logic/editor.js";

class EnemyBasic extends Entity  {
    constructor() {
        super(enemyBlueprint);

        // set maxvelocity to 10
        this.spriteName = "sample.jpg";
        this.preStates["movement"]["maxVelocity"] = 10.0;
        this.shootFreq = 50;
        this.lastAttacked = 0;
    }

    attack(elapsed, curPos, player, enemies, space) {
        if (elapsed - this.lastAttacked < this.shootFreq) {
            return;
        }
        // simple, linear bullet fire
        this.board.eLoader.load("bullet", this.board.playContainer, this.container.position, this.maxSpeed, this.container.rotation + Math.PI, false).then((b)=>{
            this.board.entities.bullets.push(b);
        });
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

    damage() {
        G_LOGGER.debug("c r i t i c a l  e r r o r");
    }

    // Engine level API
    load(board) {
        // set some interactive properties
        this.container.interactive = true;
        this.container.buttonMode = true;

        this.container.on("pointerdown", (event) => {
            this.eLoader.mutate(this);
            G_EDITOR.displaySafe(this.movement.toString());
        });

        this.board = board;
    }

    update(elapsed) {
        let posBuf = this.movement(elapsed, this.position, undefined, undefined, undefined);
        this.position = posBuf;
        this.attack(elapsed, this.position, undefined, undefined, undefined);
    }
}

module.exports = EnemyBasic;
