// Bootstrap should execute before game imports
import {PIXI_APP_G, HOWL_G, PIXI_G} from "./bootstrap.js";

// engine
import AssetManager from "./assets.js";
import G_LOGGER from "./logger.js";
import {SCENES, BUILD_ASSET_FOLDER, ASSETS} from "./constants.js";

// STD
const path = require("path");

class Game {
    constructor() {
        this.scenes = SCENES;
        this.app = PIXI_APP_G
        this.rootNode = PIXI_APP_G.stage
        G_LOGGER.info(HOWL_G);
        this.howler = HOWL_G;
        this.pixi = PIXI_G;
        this.assetManager = new AssetManager(
            this.pixi,
            BUILD_ASSET_FOLDER,
            ASSETS
        );
        this.currentScene = null;
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
