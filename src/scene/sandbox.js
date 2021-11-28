import Scene from "./scene.js";
import { Playscreen } from "../logic/playscreen.js";
import { Board } from "../logic/board.js";
import { G_LOGGER, assert } from "../logger.js";

class SandboxScene extends Scene {
    async load() {
        this.playscreen = new Playscreen(this.rootNode, this.eLoader);
        this.playscreen.loadUI().then(()=>{
            this.playscreen.ui.textbox.sprite.onComplete = () => {
                this.playscreen.ui.textbox.animateText("> Why, hel0w0l there! H0w are you?", 0.01);
            };
            this.playscreen.ui.textbox.play();
        });

        this.board = new Board(this.eLoader, this.playscreen.playspace, "");
        await this.board.load();

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
