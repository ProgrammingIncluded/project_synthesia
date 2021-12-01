import { Entity } from "./entity.js";
import { bulletBlueprint } from "./blueprints.js";
import { G_LOGGER } from "../logger.js";

class Bullet extends Entity {

    constructor() {
        super(bulletBlueprint);
        this.spriteName = "bullet.png";
        this.collidable = true;
        this.collideLayer = 2;
        this.dead = false;
        this.isBullet = true;

        // set during load
        this.boardTree = undefined;
        this.maxSpeed = undefined;
        this.friendly = undefined;
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

    load(boardTree, maxSpeed, rotation, friendly) {
        this.boardTree = boardTree;
        this.maxSpeed = maxSpeed ?? 5;
        this.container.rotation = rotation - Math.PI/2 ?? 0;
        this.sprite.rotation -= Math.PI/2;
        this.friendly = friendly;
        if(friendly){
            this.sprite.tint = 0x00FAFA;
        }
    }

    onHit(otherEntity) {
        // Due to how teardown works, hit requires dead flag which then cleans up the sprite
        // and calls teardown for you.
        this.dead = true;
    }

    // Engine level API
    update(delta) {
        this.elapsed += delta;
        let bpos = this.movement(undefined, this.container.position, undefined, undefined, undefined);
        if(bpos.x < 0 || bpos.x > this.boardTree.sizeX || bpos.y < 0 || bpos.y > this.boardTree.sizeY) {
            this.teardown();
            return
        }

        this.container.position = bpos;
    }

    teardown() {
        this.dead = true;
        super.teardown();
    }
}

module.exports = Bullet;
