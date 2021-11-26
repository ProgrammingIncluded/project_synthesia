// Bootstrap should execute before game imports
import {G_PIXI_APP, G_HOWL, G_PIXI} from "./bootstrap.js";

// engine
import AssetManager from "./assets.js";
import {G_LOGGER, getLevel, setLevel} from "./logger.js";
import {SCENES, BUILD_ASSET_FOLDER, ASSETS, PLAY_AREA} from "./constants.js";

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

        // Asset management
        this.assetManager = new AssetManager(
            this.pixi,
            BUILD_ASSET_FOLDER,
            ASSETS
        );

        // Scene management
        this.currentScene = null;

        // Virtual screen
        this.playArea = PLAY_AREA;

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
            G_LOGGER.log(width);
            G_LOGGER.log(height);
            this.resize(width, height);
        });
    }

    //! Start the game
    async start() {
        this.app.ticker.add((delta) => {
            this.currentScene.update(delta);
        });
    }

    async loadScene(sceneName) {
        if (!(sceneName in SCENES)) {
            G_LOGGER.error(sceneName + " is not a valid scene.")
        }

        let Scene = SCENES[sceneName];
        G_LOGGER.debug(`Loading scene ${sceneName}`);

        // Load file
        let scene = new Scene(
            this.rootNode,
            this.pixi,
            this.howler,
            this.assetManager
        );
        this.currentScene = scene;

        // Load scene, may time some time
        return await scene.load();
    }
}

module.exports = Game;
