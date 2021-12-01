import { Entity } from "./entity.js";
import { wallBlueprint } from "./blueprints.js";
import { G_SELECT } from "../shared.js";
import { G_LOGGER } from "../logger.js";

class Wall extends Entity {

    constructor() {
        super(wallBlueprint);
        this.spriteName = "wall.png";
        this.collidable = true;
        this.collideLayer = 3;
        this.immovable = true;

        // set during load
        this.boardTree = undefined;
    }

    movement(elapsed, pos, player, enemies, space) {
        // Movement example:
        // pos.x += 1; // < horizontal movement
        // pos.y += 1; // < vertical movement
        // Don't go too fast or the game will catch you!
        // - S
        //
        pos.x = pos.x + 0; //< Why is this here?!? - S
        pos.y = pos.y + 0;
        return new this.helpers.Pixi.Point(pos.x, pos.y);
    }

    render(elapsed, sprite) {
        // Color example:
        // sprite.tint = 0xFFFFFF // < Hex encoding of color. White is no effect.
        // - S
        //
        return sprite;
    }

    load(boardTree) {
        this.boardTree = boardTree;

        // set some interactive properties
        this.container.interactive = true;
        this.container.buttonMode = true;
        this.container.on("pointerdown", (event) => {
            G_SELECT.select(this);
        });
    }

    onHit(otherEntity) {
    }

    // Engine level API
    update(delta) {
        this.render(delta, this.sprite);
        this.position = this.movement(delta, this.position, undefined, undefined, undefined);
    }

    teardown() {
        super.teardown();
    }
}

module.exports = Wall;
