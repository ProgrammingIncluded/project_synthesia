import Scene from "./scene.js";
import { PixelateFilter } from "@pixi/filter-pixelate";
import { EDITOR } from "../bootstrap.js";
import { G_LOGGER, assert } from "../logger.js";


class TitleScene extends Scene {
    async load() {
        EDITOR.setReadOnly(true);
        EDITOR.session.setValue('"psst, click on that start button..." \n - S');

        this.background = await this.eLoader.load("title", this.rootNode, new this.pixi.Point(0, 0));
        this.bgm = new this.howl({
            src: ["assets/audio/bgm/title.mp3"],
            loop: true
        });
        this.bgm.play();

        // Button click logic
        // sounds
        this.buttonClickFX = new this.howl({
            src: ["assets/audio/effects/menu_button_press.wav"],
            loop: false
        })

        this.freezeButtons = false;

        // Set the logic for title clicks
        // register events
        // Start logic
        this.background.buttons.start.on("pointerdown", (event) => {
            if (this.freezeButtons) { return; }
            this.buttonClickFX.on("end", () => {
                let filterSize = 1;
                let filterSpeed = 100;
                let filterMax = 40;
                let rate = 2.5;
                this.background.container.filters = [new PixelateFilter(filterSize)];

                let increaseFilters = () => {
                    this.background.container.filters[0].size = filterSize;
                    filterSize += rate;
                    if (filterSize < filterMax) {
                        setTimeout(increaseFilters, filterSpeed);
                    }
                    else {
                        this.game.loadScene("sandbox");
                    }
                }

                setTimeout(increaseFilters, filterSpeed);
            });
            this.freezeButtons = true;
            this.buttonClickFX.play();
        });

        this.background.buttons.extra.on("pointerdown", (event) => {
            if (this.freezeButtons) { return; }
            this.buttonClickFX.play();
        });

        this.background.buttons.credits.on("pointerdown", (event) => {
            if (this.freezeButtons) { return; }
            this.buttonClickFX.play();
        });

        return this;
    }

    update(delta) {
        this.background.update(delta);
    }

    async teardown() {
        this.background.teardown();
        this.bgm.unload();
        this.buttonClickFX.unload();
    }

    async pause() {
        throw("Undefined function");
    }
}

module.exports = TitleScene;
