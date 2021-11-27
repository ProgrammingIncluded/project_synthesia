/**
 * Houses logic for piecing together play UI.
 */

import {G_PIXI} from "../bootstrap.js";
import { G_LOGGER } from "../logger.js";

class Playscreen {
    constructor(root, eLoader) {
        this.eLoader = eLoader;
        this.rootNode = root;

        // Playspace container
        this.playspace = new G_PIXI.Container();
        // Only set the default position relative to UI
        // The Board class will modify the width and height appropriately
        this.playspace.position = new G_PIXI.Point(0, 180);
        this.rootNode.addChild(this.playspace);

        this.ui = {
            editor: null,
            textbox: null,
            profile: null
        }

        this.posUI = {
            editor: new G_PIXI.Point(900, 180),
            textbox: new G_PIXI.Point(180 / 4 * 3, 0),
            profile: new G_PIXI.Point(0, 0)
        }

        this.dimsUI = {
            profile: {width: 180, height: 180},
            editor: {width: 360, height: 500}
        }

    }

    // Returns an array of all the UI elements
    async loadUI() {
        // Load all values
        let promises = [];
        for (const uin of Object.keys(this.ui)) {
            let promise = this.eLoader.load(uin, this.rootNode, this.posUI[uin]).then((entity) => {
                entity.sprite.anchor.set(0);
                if (uin in this.dimsUI) {
                    const {width, height} = this.dimsUI[uin];
                    entity.sprite.width = width;
                    entity.sprite.height = height;
                }
                this.ui[uin] = entity;
                return entity;
            });

            promises.push(promise);
        }

        return Promise.all(promises);
    }

    /* Helper shortcuts */
}

export {
    Playscreen
};
