import { Entity } from "../entity.js";

class Hacksphere extends Entity {
    constructor() {
        super({});

        this.spriteName = "animation/hacksphere.json"
        this.animationProp.loop = false;
        this.animationProp.animationSpeed = 0.5;
    }

    load() {
        this.curAnimation = "normal";
    }
}

module.exports = Hacksphere;
