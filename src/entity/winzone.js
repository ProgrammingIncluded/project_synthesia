import { Entity } from "./entity.js";
import { winBlueprint } from "./blueprints.js";
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
    }

    load(boardTree, currentScene, nextScene) {
        console.log(currentScene);
        this.curAnimation = "normal";
        this.currentScene = currentScene;
        this.nextScene = nextScene;
    }

    // change scene if player touches this
    onHit(otherEntity) {
        if (!otherEntity.isPlayer) {
            return;
        }
        this.sceneChange();
    }

    // // Engine level API

    sceneChange() {
        this.currentScene.game.loadScene(this.nextScene);
        // TODO: Fix because this would be cool
        // let filterSize = 1;
        // let filterSpeed = 100;
        // let filterMax = 40;
        // let rate = 2.5;
        // this.currentScene.background.container.filters = [new PixelateFilter(filterSize)];
        //
        // let increaseFilters = () => {
        //     this.currentScene.background.container.filters[0].size = filterSize;
        //     filterSize += rate;
        //     if (filterSize < filterMax) {
        //         setTimeout(increaseFilters, filterSpeed);
        //     }
        //     else {
        //         this.game.loadScene(this.nextScene);
        //     }
        // }
        //
        // setTimeout(increaseFilters, filterSpeed);
    }

    teardown() {
        super.teardown();
    }
}

module.exports = WinZone;
