import { Entity } from "../entity.js";
import { G_LOGGER } from "../../logger.js";
import { G_PIXI } from "../../bootstrap.js";

class Background extends Entity {
    constructor() {
        super({});

        this.spriteName = "background.png";

        this.effects = new G_PIXI.Container();
        this.container.addChild(this.effects);
        this.container.sortableChildren = true;
    }

    async load() {
        this.effects.lineOne = await this.eLoader.load(
                                        "line_one",
                                        this.container,
                                        new G_PIXI.Point(405, 20));
        this.effects.lineTwo = await this.eLoader.load(
                                        "line_two",
                                        this.container,
                                        new G_PIXI.Point(490, 190));

        this.effects.lineOne.sprite.onComplete = () => {
            this.effects.lineOne.sprite.gotoAndStop(0);
        };

        this.effects.lineTwo.sprite.onComplete = () => {
            this.effects.lineTwo.sprite.gotoAndStop(0);
        };

        let randomNumber = (x, y) => {
            return Math.ceil(Math.random() * (y - x)) + x;
        };
        let runFunc = () => {
            this.effects.lineOne.sprite.play();
            this.effects.lineTwo.sprite.play();
            setTimeout(runFunc.bind(this), randomNumber(10, 20) * 1000);
        }

        // Play this some random interval
        setTimeout(runFunc.bind(this), randomNumber(10, 20) * 1000);
    }
}

module.exports = Background;
