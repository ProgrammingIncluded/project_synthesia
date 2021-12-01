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
        this.playspace.zIndex = 1;
        this.rootNode.addChild(this.playspace);
        this.rootNode.sortableChildren = true;

        this.ui = {
            // editor: null,
            textbox: null,
            profile: null,
            background: null,
            hack_button: null,
            mutate_button: null,
            movement_button: null,
            render_button: null
        }

        this.posUI = {
            // editor: new G_PIXI.Point(900, 180),
            textbox: new G_PIXI.Point(180 / 4 * 3 - 30, -7),
            profile: new G_PIXI.Point(5, 0),
            background: new G_PIXI.Point(0, 0),
            hack_button: new G_PIXI.Point(1011, 160),
            mutate_button: new G_PIXI.Point(1015, 400),
            movement_button: new G_PIXI.Point(1015, 540),
            render_button: new G_PIXI.Point(1015, 610)
        }

        this.dimsUI = {
            profile: {width: 160, height: 160},
            editor: {width: 360, height: 500},
            background: {width: 1280, height: 720}
        }

        this.zIndex = {
            background: 3
        }

    }

    // Returns an array of all the UI elements
    async loadUI() {
        // Load all values
        let loading = [];
        for (const uin of Object.keys(this.ui)) {
            let promise = this.eLoader.load(uin, this.rootNode, this.posUI[uin]).then((entity) => {
                entity.sprite.anchor.set(0);
                if (uin in this.dimsUI) {
                    const {width, height} = this.dimsUI[uin];
                    entity.sprite.width = width;
                    entity.sprite.height = height;
                }
                if (uin in this.zIndex) {
                    entity.container.zIndex = this.zIndex[uin];
                }
                else {
                    entity.container.zIndex = 4;
                }
                this.ui[uin] = entity;
                return entity;
            });
            loading.push(promise);
        }
        return Promise.all(loading);
    }
}

export {
    Playscreen
};
