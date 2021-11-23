import { Entity } from "./entity.js";
import { enemyBlueprint } from "./blueprints.js";

class EnemyBasic extends Entity  {
    constructor() {
        super(enemyBlueprint);
        this.elapsed = 0;
    }

    attack(delta, curPos, player, enemies, space) {
        return 0;
    }

    movement(elapsed, curPos, player, enemies, space) {
        return [100.0 + Math.cos(elapsed/50.0) * 100.0, curPos[1]];
    }

    render(elapsed, sprite) {
        return sprite;
    }

    // Engine level API
    update(delta) {
        this.elapsed += delta;
        let posBuf = [this.sprite.position.x, this.sprite.position.y];
        posBuf = this.movement(this.elapsed, posBuf, undefined, undefined, undefined);
        this.sprite.position.set(posBuf[0], posBuf[1]);
    }
}

module.exports = EnemyBasic;
