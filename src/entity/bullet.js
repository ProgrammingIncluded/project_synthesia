import { Entity } from "./entity.js";
import { bulletBlueprint } from "./blueprints.js";
import { G_PIXI_APP } from "../bootstrap.js";
import { G_LOGGER } from "../logger.js";

class Bullet extends Entity {

    constructor() {

    }

    // by default, bullets just move in a straight line at a fixed speed.
    movement(elapsed, curPos, player, enemies, space) {
        let newX = curPos.x + this.maxSpeed * Math.cos(this.rotation);
        let newY = curPos.y + this.maxSpeed * Math.sin(this.rotation);
        return new this.helpers.Pixi.Point(newX, newY);
    }

    render(elapsed, sprite) {
        return sprite;
    }

    // Engine level API
    load(board) {
        this.board = board;
    }

    update(delta) {
        this.elapsed += delta;
        // NESW movement
        let posBuf = this.movement(this.elapsed, this.container.position, undefined, undefined, undefined);

        this.container.position = posBuf;
    }

    teardown() {
        super.teardown();
    }
}
