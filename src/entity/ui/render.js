import { Entity } from "../entity.js";
import { G_SELECT } from "../../shared.js";

class RenderButton extends Entity {
    constructor() {
        super({});

        this.spriteName = "render_button.png"
        this.container.zIndex = 1;
    }

    load() {
        this.container.interactive = true;
        this.container.buttonMode = true;

        this.container.on("pointerdown", (event) => {
            G_SELECT.selectFunction("render", this);
        });
    }
}

module.exports = RenderButton;
