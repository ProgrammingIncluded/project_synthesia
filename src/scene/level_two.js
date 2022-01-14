import Scene from "./scene.js";
import { Playscreen } from "../logic/playscreen.js";
import { Board } from "../logic/board.js";
import { G_EDITOR } from "../logic/editor.js";
import { HUD } from "../logic/hud.js";

import { G_LOGGER, assert } from "../logger.js";

const LEVEL_ENCODING = [
    "******************************",
    "*             *      e       *",
    "*   p         *              *",
    "*             *      e       *",
    "*             *          w   *",
    "*             *              *",
    "*             *      e       *",
    "*             *              *",
    "*             *              *",
    "*             *      e       *",
    "*             *              *",
    "*             *              *",
    "*             *      e       *",
    "*             *              *",
    "******************************",
];

const NEXT_SCENES = ["bossroom"];

class SandboxScene extends Scene {
    async load() {
        // Unlock for now. TODO: Add more lock and unlock depending on game.
        G_EDITOR.unlock();
        G_EDITOR.randomEmote("happy");

        this.rootNode.sortableChildren = true;
        this.playscreen = new Playscreen(this.rootNode, this.eLoader);
        await this.playscreen.loadUI();
        this.playscreen.ui.textbox.sprite.onComplete = () => {
            this.playscreen.ui.textbox.animateText("> Dev1ant autom4ta suppress0rs?!\nOh nyo!", 0.01);
        };
        this.playscreen.ui.textbox.play();

        this.board = new Board(this.eLoader, this.playscreen, LEVEL_ENCODING, this, NEXT_SCENES);
        this.board.load();

        this.hud = new HUD(this.rootNode, this.eLoader, this.board);
        this.hud.load();
        this.hud.sphereContainer.zIndex = 4;

        this.bgmLoop = new this.howl({
            src: ["assets/audio/bgm/bgm_stage_loop.wav"],
            loop: true
        });

        this.bgmIntro = new this.howl({
            src: ["assets/audio/bgm/bgm_stage_intro.wav"],
            loop: false,
            onend: () => {
                this.bgmLoop.play();
            }
        });
        this.bgmIntro.play();

        return this;
    }

    update(delta) {
        this.board.update(delta);
        this.hud.update();
    }

    async teardown() {
        this.bgmLoop.stop();
        this.bgmLoop.unload();
        if (this.bgmIntro.playing()) {
            this.bgmIntro.stop();
            this.bgmIntro.unload();
        }
        await this.board.teardown();
    }

    async pause() {
        throw("Undefined function");
    }
}

module.exports = SandboxScene;

