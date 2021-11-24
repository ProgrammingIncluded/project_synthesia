import Scene from "./scene.js";
import G_LOGGER from "../logger.js";


class SandboxScene extends Scene {
    async load() {
        this.enemySprites = [
            this.eLoader.load("enemy_basic", this.rootNode)
        ]

        // TODO:
        // 1. Add player sprite
        // 2. Add alternate sprites (e.g. taking damage)
        this.playerSprites = [
          this.eLoader.load("player", this.rootNode)
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
        for (const es of this.playerSprites) {
            es.update(delta);
        }
    }

    async teardown() {
        for (const es of this.enemySprites) {
            es.teardown();
        }
        for (const es of this.playerSprites) {
            es.teardown();
        }
    }

    async pause() {
        throw("Undefined function");
    }
}

module.exports = SandboxScene;
