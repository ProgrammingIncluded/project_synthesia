import { Entity } from "./entity.js";
import { bulletBlueprint } from "./blueprints.js";
import { G_PIXI_APP } from "../bootstrap.js";
import { G_LOGGER } from "../logger.js";

class Bullet extends Entity {

    constructor() {
        super(bulletBlueprint);
        this.spriteName = "bullet.png";
    }

    // by default, bullets just move in a straight line at a fixed speed.
    movement(elapsed, curPos, player, enemies, space) {
        let newX = curPos.x + this.maxSpeed * Math.cos(this.container.rotation);
        let newY = curPos.y + this.maxSpeed * Math.sin(this.container.rotation);
        return new this.helpers.Pixi.Point(newX, newY);
    }

    render(elapsed, sprite) {
        return sprite;
    }

    load(maxSpeed, rotation, friendly) {
        this.maxSpeed = maxSpeed ?? 5;
        this.container.rotation = rotation - Math.PI/2 ?? 0;
        this._sprite.rotation -= Math.PI/2;
        this.friendly = friendly;
        if(friendly){
            this._sprite.tint = 0x00FAFA;
        }
    }

    // Engine level API
    update(delta) {
        this.elapsed += delta;
        // NESW movement
        let posBuf = this.movement(undefined, this.container.position, undefined, undefined, undefined);
        this.container.position = posBuf;
    }

    teardown() {
        super.teardown();
    }
}

module.exports = Bullet;
