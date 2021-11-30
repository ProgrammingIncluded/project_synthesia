import Scene from "./scene.js";
import { Playscreen } from "../logic/playscreen.js";
import { Board } from "../logic/board.js";
import { G_LOGGER, assert } from "../logger.js";
import { G_EDITOR } from "../logic/editor.js";
import { HUD } from "../logic/hud.js";

class SandboxScene extends Scene {
    async load() {
        // Unlock for now. TODO: Add more lock and unlock depending on game.
        G_EDITOR.unlock();
        G_EDITOR.randomEmote("happy");

        this.rootNode.sortableChildren = true;
        this.playscreen = new Playscreen(this.rootNode, this.eLoader);
        this.playscreen.loadUI().then(()=>{
            this.playscreen.ui.textbox.sprite.onComplete = () => {
                this.playscreen.ui.textbox.animateText("> Why, hel0w0l there! H0w are you?", 0.01);
            };
            this.playscreen.ui.textbox.play();
        });

        this.hud = new  HUD(this.rootNode, this.eLoader);
        this.hud.load();
        this.hud.sphereContainer.zIndex = 4;

        this.board = new Board(this.eLoader, this.playscreen.playspace, "");
        this.board.load();

        this.bgm = new this.howl({
            src: ["assets/audio/peace_1.mp3"],
            loop: true
        });
        //this.bgm.play();
        return this;
    }

    update(delta) {
        this.board.update(delta);
    }

    async teardown() {
        await this.board.teardown();
    }

    async pause() {
        throw("Undefined function");
    }
}

module.exports = SandboxScene;
