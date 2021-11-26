import Scene from "./scene.js";
import { G_LOGGER, assert } from "../logger.js";


class SandboxScene extends Scene {
    async generateEnemies(number) {
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
            this.enemySprites.push((await this.eLoader.load("enemy_basic", this.rootNode, new this.pixi.Point(80, 80))));
        }

        for (let es of this.enemySprites) {
            es.container.on("pointerdown", (event) => {
                G_LOGGER.log(event);
                this.eLoader.mutate(es);
            });
        }
    }

    loadUI() {
        let setupCB =  () => {
            let sheet = this.pixi.Loader.shared.resources["assets/animation/textbox.json"].spritesheet;
            let animationSprite = new this.pixi.AnimatedSprite(Object.values(sheet.textures));
            animationSprite.position = new this.pixi.Point(80, 90);
            this.rootNode.addChild(animationSprite);
            animationSprite.loop = false;
            animationSprite.animationSpeed = 0.5;
            animationSprite.play();
        };
        this.pixi.Loader.shared.add("assets/animation/textbox.json").load(setupCB);
    }

    async load() {
        await this.generateEnemies(1);
        this.elapsed = 0.0;

        // TODO:
        // 1. Add player sprite
        // 2. Add alternate sprites (e.g. taking damage)
        this.playerSprites = [
          (await this.eLoader.load("player", this.rootNode, new this.pixi.Point(0, 90)))
        ]

        this.bgm = new this.howl({
            src: ["assets/audio/peace_1.mp3"],
            loop: true
        });
        //this.bgm.play();

        // this.loadUI();

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
        for (const ps of this.playerSprites) {
            ps.update(delta);
        }
    }

    async teardown() {
        for (const es of this.enemySprites) {
            es.teardown();
        }
        for (const ps of this.playerSprites) {
            ps.teardown();
        }
    }

    async pause() {
        throw("Undefined function");
    }
}

module.exports = SandboxScene;
