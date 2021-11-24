import { Entity } from "./entity.js";
import { playerBlueprint } from "./blueprints.js";

class Player extends Entity  {
    constructor() {
        super(playerBlueprint);
        this.elapsed = 0;
    }

    attack(delta, curPos, player, enemies, space) {
        return 0;
    }

    movement(elapsed, curPos, player, enemies, space) {
        return [curPos[0], 100.0 + Math.cos(elapsed/50.0) * 100.0];
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

module.exports = Player;
