import Scene from "./scene.js";
import { Playscreen } from "../logic/playscreen.js";
import { Board } from "../logic/board.js";
import { G_EDITOR } from "../logic/editor.js";
import { HUD } from "../logic/hud.js";

import { G_LOGGER, assert } from "../logger.js";

const LEVEL_ENCODING = [
    "******************************",
    "*             w              *",
    "*     e    e    e    e       *",
    "*            p               *",
    "*          e     e           *",
    "*     e            e         *",
    "*                            *",
    "*                            *",
    "******************************",
];

const NEXT_SCENES = ["sandbox"];

class BossRoomScene extends Scene {
    async load() {
        // Unlock for now. TODO: Add more lock and unlock depending on game.
        G_EDITOR.unlock();
        G_EDITOR.randomEmote("happy");

        this.rootNode.sortableChildren = true;
        this.playscreen = new Playscreen(this.rootNode, this.eLoader);
        this.playscreen.loadUI().then(()=>{
            this.playscreen.ui.textbox.sprite.onComplete = () => {
                this.playscreen.ui.textbox.animateText("> Dev1ant autom4ta suppress0rs?! Oh nyo!", 0.01);
            };
            this.playscreen.ui.textbox.play();
        });

        this.hud = new HUD(this.rootNode, this.eLoader);
        this.hud.load();
        this.hud.sphereContainer.zIndex = 4;


        this.board = new Board(this.eLoader, this.playscreen.playspace, LEVEL_ENCODING, this, NEXT_SCENES);
        this.board.load();

        this.bgmLoop = new this.howl({
            src: ["assets/audio/bgm/bgm_boss_loop.wav"],
            loop: true
        });

        this.bgmIntro = new this.howl({
            src: ["assets/audio/bgm/bgm_boss_intro.wav"],
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
    }

    async teardown() {
        this.bgmLoop.unload();
        if (this.bgmIntro.playing()) {
            this.bgmIntro.unload();
        }
        await this.board.teardown();
    }

    async pause() {
        throw("Undefined function");
    }
}

module.exports = BossRoomScene;
