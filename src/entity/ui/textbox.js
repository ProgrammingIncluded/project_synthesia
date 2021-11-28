import { Entity } from "../entity.js";
import { G_LOGGER } from "../../logger.js";
import { G_PIXI } from "../../bootstrap.js";
import { BitmapFont } from "@pixi/text-bitmap";
import { AnimatedSprite } from "@pixi/sprite-animated";

class Textbox extends Entity {
    constructor() {
        super({});

        this.spriteName = "animation/textbox.json";
        this.animationProp.loop = false;
        this.animationProp.animationSpeed = 0.5;
        this.cursorIdx = 0;
        this.textBuffer = "";
        this.textSprite = null;
        // change while text is writing to go faster
        this.textSpeed = 0.5; // secs

        // Max chars per line
        this.charPerLine = 35

        // Allows for centering the text in the image
        this.textSpriteOffset = new G_PIXI.Point(65, 50);
    }

    load() {
        // Alow zindex
        this.container.sortableChildren = true;
        this.curAnimation = "normal";
    }

    // Helper for animateText
    _animateText() {
        return new Promise((resolve) => {
            if (this.cursorIdx == this.textBuffer) {
                this.textBuffer = "";
                return resolve(this);
            }

            this.cursorIdx += 1;
            this.displayText(this.textBuffer.substr(0, this.cursorIdx));
            setTimeout(this._animateText.bind(this), this.textSpeed * 1000);
        })
    }

    async animateText(text, speed, interrupt=false) {
        if (!interrupt && this.textBuffer.length > 0) {
            throw "Text is currently writing."
        }
        this.textBuffer = text;
        this.cursorIdx = 0;
        this.textSpeed = speed;
        return this._animateText();
    }

    // Display text directly without animation
    displayText(text) {
        if (this.textSprite != null) {
            this.textSprite.destroy();
        }
        this.textSprite = new G_PIXI.BitmapText(text, {fontName: "dialogue"});

        this.textSprite.zIndex = 10;
        this.textSprite.position.x = this.position.x + this.textSpriteOffset.x;
        this.textSprite.position.y = this.position.y + this.textSpriteOffset.y;
        this.container.addChild(this.textSprite);

    }
}

module.exports = Textbox;
