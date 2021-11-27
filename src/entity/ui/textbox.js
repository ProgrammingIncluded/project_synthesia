import { Entity } from "../entity.js";
import { G_LOGGER } from "../../logger.js";

class Textbox extends Entity {
    constructor() {
        super({});

        this.animationFiles = [
            "animation/textbox.json"
        ];
        this.animationProp.loop = false;
        this.animationProp.animationSpeed = 0.5;
    }

    load() {
        this.curAnimation = "textbox";
    }
}

module.exports = Textbox;
