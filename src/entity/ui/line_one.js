import { Entity } from "../entity.js";

class LineEffectOne extends Entity {
    constructor() {
        super({});

        this.spriteName = "animation/line_one.json"
        this.animationProp.loop = false;
        this.animationProp.animationSpeed = 0.5;
        this.container.zIndex = 1;
    }

    load() {
        this.curAnimation = "normal";
    }
}

module.exports = LineEffectOne;
