import Scene from "./scene.js";
import { EntityLoader } from "../entity/entity.js";
import G_LOGGER from "../logger.js";

// Pixi
import { ObservablePoint } from "@pixi/math";


class SandboxScene extends Scene {
    async load() {
        this.enemySprites = [
            this.eLoader.load("enemy_basic", this.rootNode)
        ]

        this.bgm = new this.howl({
            src: ["assets/audio/peace_1.mp3"],
            loop: true
        });
        this.bgm.play();

        return this;
    }

    update(delta) {
        for (const es of this.enemySprites) {
            es.update(delta);
        }
    }

    async teardown() {
        for (const es of this.enemySprites) {
            es.teardown();
        }
    }

    async pause() {
        throw("Undefined function");
    }
}

module.exports = SandboxScene;
