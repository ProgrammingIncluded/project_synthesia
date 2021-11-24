import { Entity } from "./entity.js";
import { enemyBlueprint } from "./blueprints.js";
import assert from "assert";
import { G_LOGGER } from "../logger.js";

class EnemyBasic extends Entity  {
    constructor() {
        super(enemyBlueprint);
        this.elapsed = 0;

        // set maxvelocity to 10
        this.preStates["movement"]["maxVelocity"] = 10.0;
    }

    attack(delta, curPosX, curPosY, player, enemies, space) {
        return 0;
    }

    movement(elapsed, curPosX, curPosY, player, enemies, space) {
        // [100.0 + Math.cos(elapsed/50.0) * 100.0, curPos[1]];
        let resultX = curPosX + 1.0;
        // INSERT
        assert((resultX - curPosX) <= this.preStates.movement.maxVelocity);
        return [resultX, curPosY];
    }

    render(elapsed, sprite) {
        return sprite;
    }

    // Engine level API
    load() {
        // set some interactive properties
        this.sprite.interactive = true;
        this.sprite.buttonMode = true;
    }

    update(delta) {
        this.elapsed += delta;
        let posBuf = this.movement(this.elapsed, this.sprite.x, this.sprite.y, undefined, undefined, undefined);
        this.sprite.position.set(posBuf[0], posBuf[1]);
    }
}

module.exports = EnemyBasic;
