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

    render(elapsed, sprite) {
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
    }

    teardown() {
        super.teardown();
    }
}

module.exports = Wall;
