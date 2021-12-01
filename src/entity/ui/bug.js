import { G_EDITOR } from "../../logic/editor.js";
import { G_SELECT } from "../../shared.js";
import { Entity } from "../entity.js";

class BugButton extends Entity {
    constructor() {
        super({});

        this.spriteName = "bug_button.png"
        this.container.zIndex = 1;
    }

    load() {
        this.container.interactive = true;
        this.container.buttonMode = true;

        this.container.on("pointerdown", (event) => {
            G_SELECT.injectCode(G_EDITOR.getValue());
        });
    }
}

module.exports = BugButton;
