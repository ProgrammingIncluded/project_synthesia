// Bootstrap should execute before game imports
import {G_PIXI_APP, G_HOWL, G_PIXI} from "./bootstrap.js";

// engine
import {G_LOGGER} from "./logger.js";
import {SCENES, VIRTUAL_WINDOW} from "./constants.js";
import { G_EDITOR } from "./logic/editor.js";

// STD
const path = require("path");

class Game {
    // Bounded to event listener
    resize(width, height) {
        this.rootNode.scale.x = width / this.playArea.width;
        this.rootNode.scale.y = height / this.playArea.height;
    }

    constructor() {
        // Game level constants binding
        this.scenes = SCENES;
        this.app = G_PIXI_APP
        this.howler = G_HOWL;
        this.pixi = G_PIXI;

        // Scene management
        this.currentScene = null;

        // Virtual screen
        this.playArea = VIRTUAL_WINDOW;

        let container = new G_PIXI.Container();
        container.width = this.playArea.width;
        container.height = this.playArea.height;
        container.x = 0;
        container.y = 0;
        this.rootNode = container;

        // Force a resize before binding to render
        const { width, height } = G_PIXI_APP.screen;
        this.resize(width, height);
        G_PIXI_APP.stage.addChild(this.rootNode);

        G_PIXI_APP.renderer.on("resize", (width, height) => {
            this.resize(width, height);
        });

        // gamespeed
        this.gamespeed = 1;
        this.loading = false;
    }

    //! Start the game
    async start() {
        this.app.ticker.add((delta) => {
            if (this.loading) {return;}
            this.currentScene.update(delta * this.gamespeed);
        });
    }

    async loadScene(sceneName) {
        if (!(sceneName in SCENES)) {
            G_LOGGER.error(sceneName + " is not a valid scene.")
        }

        if (this.currentScene != null) {
            await this.currentScene.teardown();
        }

        let Scene = SCENES[sceneName];
        G_LOGGER.debug(`Loading scene ${sceneName}`);

        // Load file
        let scene = new Scene(
            this.rootNode,
            this.pixi,
            this.howler,
            this
        );
        this.loading = true;
        this.currentScene = scene;

        // Hook slowdown code
        G_EDITOR.onFocus(() => {
            this.gamespeed = 0.02;
        });

        G_EDITOR.onBlur(()=>{
            this.gamespeed = 1;
        })

        // Load scene, may time some time
        await scene.load();
        this.loading = false;
    }
}

module.exports = Game;
