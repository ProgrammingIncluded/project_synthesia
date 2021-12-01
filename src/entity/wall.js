import { Entity } from "./entity.js";
import { wallBlueprint } from "./blueprints.js";
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

    render(elapsed, sprite) {
        return sprite;
    }

    load(boardTree) {
        this.boardTree = boardTree;
    }

    onHit(otherEntity) {
    }

    // Engine level API
    update(delta) {
        this.render(delta, this.sprite);
    }

    teardown() {
        super.teardown();
    }
}

module.exports = Wall;
