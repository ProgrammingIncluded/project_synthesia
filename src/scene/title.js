import Scene from "./scene.js";
import { G_LOGGER } from "../logger.js";

class TitleScene extends Scene {
    async load() {
        this.sprite = this.assets.loadSprite("missing");
        this.rootNode.addChild(this.sprite);
        this.elapsed = 0.0;

        this.bgm = new this.howl({
            src: ["assets/audio/peace_1.mp3"],
            loop: true
        });
        this.bgm.play();

        return this;
    }

    update(delta) {
        this.elapsed += delta;
        this.sprite.x = 100.0 + Math.cos(this.elapsed/50.0) * 100.0;
    }

    async teardown() {
        this.sprite.unload();
    }

    async pause() {
        throw("Undefined function");
    }
}

module.exports = TitleScene;
