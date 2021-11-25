import Scene from "./scene.js";
import { G_LOGGER, assert } from "../logger.js";


class SandboxScene extends Scene {
    generateEnemies(number) {
        if (this.enemySprites === undefined) {
            this.enemySprites = []
        }
        else if (this.enemySprites.length > 0) {
            for (let es of this.enemySprites) {
                es.teardown();
            }
            this.enemySprites = [];
        }

        for (let i = 0; i < number; ++i) {
            this.enemySprites.push(this.eLoader.load("enemy_basic", this.rootNode));
        }

        for (let es of this.enemySprites) {
            es.sprite.on("pointerdown", (event) => {
                this.eLoader.mutate(es);
            })
        }
    }

    async load() {
        this.generateEnemies(1);
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
        for (const es of this.enemySprites) {
            es.update(this.elapsed);
        }

        if (this.elapsed > 500) {
            this.generateEnemies(1);
            G_LOGGER.debug("Resetting orb.")
            this.elapsed = 0;
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
