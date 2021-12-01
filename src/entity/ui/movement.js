import { G_SELECT } from "../../shared.js";
import { Entity } from "../entity.js";

class MovementButton extends Entity {
    constructor() {
        super({});

        this.spriteName = "movement_button.png"
        this.container.zIndex = 1;
    }

    load() {
        this.container.interactive = true;
        this.container.buttonMode = true;

        this.container.on("pointerdown", (event) => {
            G_SELECT.selectFunction("movement", this);
        });
    }
}

module.exports = MovementButton;
