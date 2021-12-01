import { Entity } from "./entity.js";
import { winBlueprint } from "./blueprints.js";
import { G_HOWL } from "../bootstrap.js";
import { PixelateFilter } from "@pixi/filter-pixelate";
import { G_SELECT } from "../shared.js";
import { G_LOGGER } from "../logger.js";

class WinZone extends Entity {

    constructor() {
        super(winBlueprint);
        this.spriteName = "animation/hacksphere.json"
        this.animationProp.loop = false;
        this.animationProp.animationSpeed = 0.5;

        this.collidable = true;
        this.collideLayer = 3;
        this.immovable = true;

        // set in load
        this.currentScene = undefined;
        this.nextScene = undefined;
        this.dead = false;
        this.howl = G_HOWL;
    }

    load(boardTree, currentScene, nextScene) {
        this.curAnimation = "normal";
        this.currentScene = currentScene;
        this.nextScene = nextScene;
    }

    // change scene if player touches this
    onHit(otherEntity) {
        if (!otherEntity.isPlayer) {
            return;
        }
        this.dead = true;
        this.sceneChange();
    }

    // // Engine level API

    sceneChange() {
        let filterSize = 1;
        let filterSpeed = 100;
        let filterMax = 50;
        let rate = 5;
        this.currentScene.playscreen.playspace.filters = [new PixelateFilter(filterSize)];

        let effect = new this.howl({
                src: ["assets/audio/effects/Moonshot.Sfx.SlipTime.wav"],
                loop: true,
            });
        effect.play();

        let increaseFilters = () => {
            this.currentScene.playscreen.playspace.filters[0].size = filterSize;
            filterSize += rate;
            if (filterSize < filterMax) {
                setTimeout(increaseFilters.bind(this), filterSpeed);
            }
            else {
                effect.unload();
                this.currentScene.game.loadScene(this.nextScene);
            }
        }

        setTimeout(increaseFilters, filterSpeed);
    }

    teardown() {
        super.teardown();
    }
}

module.exports = WinZone;
