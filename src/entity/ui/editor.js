import { Entity } from "../entity.js";
import { G_LOGGER } from "../../logger.js";

class Editor extends Entity {
    constructor() {
        super({});

        this.spriteName = "editor.png";
    }

    load() {
    }
}

module.exports = Editor;
