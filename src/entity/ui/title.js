import { Entity } from "../entity.js";
import { G_PIXI } from "../../bootstrap.js";
import { VIRTUAL_WINDOW } from "../../constants.js";
import { TT, linearMove } from "../../math.js";
import { G_LOGGER } from "../../logger.js";

// Houses Title UI logic and incldues animation of buttons
// But does not house click logic, that is in the scene
class Title extends Entity {
    constructor() {
        super({});
        this.spriteName = "main_menu/main_menu.png";

        // Buttons
        this.buttons = {
            start: null,
            extra: null,
            credits: null
        }

        this.buttonStart = {
            start: new G_PIXI.Point(70, 140),
            extra: new G_PIXI.Point(140, 160),
            credits: new G_PIXI.Point(210, 180)
        }

        // Just add a bunch of distance
        this.buttonEnd = {}
        this.buttonDistance = 125;
        let idx = 0;
        Object.keys(this.buttonStart).forEach((k) => {
            let start = this.buttonStart[k];
            this.buttonEnd[k] = new G_PIXI.Point(start.x, start.y);
            this.buttonEnd[k].y +=  (this.buttonDistance * idx);
            idx += 1;
        });


        // Animate
        this.elapsed = 0.0
        this.animateButtons = true
        this.animationTime = 50;
    }

    load() {
        // Use zindex
        this.container.sortableChildren = true;

        // Size constraints
        this.sprite.width = VIRTUAL_WINDOW.width;
        this.sprite.height = VIRTUAL_WINDOW.height;
        this.sprite.anchor.set(0);

        // Load the buttons
        this.buttons.start = G_PIXI.Sprite.from("assets/main_menu/start_button.png");
        this.buttons.extra = G_PIXI.Sprite.from("assets/main_menu/extra_button.png");
        this.buttons.credits = G_PIXI.Sprite.from("assets/main_menu/credits_button.png");
        Object.keys(this.buttons).forEach((k) => {
            this.buttons[k].position = this.buttonStart[k];
        });

        // Add as children
        Object.values(this.buttons).forEach((sprite) => {
            sprite.zIndex = 10;
            sprite.scale.x = 0.5;
            sprite.scale.y = 0.5;
            sprite.interactive = true;
            sprite.buttonMode = true;
            this.container.addChild(sprite);
        })
    }

    update(delta) {
        if (this.animateButtons) {
            this.elapsed += delta;

            Object.keys(this.buttons).forEach((k) => {
                this.buttons[k].position = linearMove(
                                                this.buttonStart[k],
                                                this.buttonEnd[k],
                                                this.animationTime,
                                                this.elapsed,
                                                TT.crossfade(TT.smoothStart(3), TT.smoothStop(2))
                                            );
            });

            if (this.elapsed > this.animationTime) {
                this.animateButtons = false;
            }
        }
    }
}

module.exports = Title;
