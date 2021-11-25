import { Entity } from "./entity.js";
import { enemyBlueprint } from "./blueprints.js";
import { G_LOGGER } from "../logger.js";

class EnemyBasic extends Entity  {
    constructor() {
        super(enemyBlueprint);

        // set maxvelocity to 10
        this.preStates["movement"]["maxVelocity"] = 10.0;
    }

    attack(delta, curPosX, curPosY, player, enemies, space) {
        return 0;
    }

    movement(elapsed, curPosX, curPosY, player, enemies, space) {
        let resultX = 100.0 + Math.cos(elapsed/50.0) * 100.0;
        // this.enforce((resultX - curPosX) <= this.preStates.movement.maxVelocity);
        return [resultX, curPosY + 0];
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

    update(elapsed) {
        let posBuf = this.movement(elapsed, this.sprite.x, this.sprite.y, undefined, undefined, undefined);
        this.sprite.position.set(posBuf[0], posBuf[1]);
    }
}

module.exports = EnemyBasic;
