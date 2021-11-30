import { Entity } from "../entity.js";

class LineEffectTwo extends Entity {
    constructor() {
        super({});

        this.spriteName = "animation/line_two.json"
        this.animationProp.loop = false;
        this.animationProp.animationSpeed = 0.5;
        this.container.zIndex = 1;
    }

    load() {
        this.curAnimation = "normal";
    }
}

module.exports = LineEffectTwo;
