// Very basic asset manager interface.
// engine
import {PIXI_G} from "./bootstrap.js";
import { BUILD_ASSET_FOLDER, ASSETS } from "./constants.js";
const LOGGER_G = require("./logger.js");

// std
const path = require("path");

class PixiJSAssetManager {
    constructor(pixijs = PIXI_G,
                assetFolder = BUILD_ASSET_FOLDER,
                assetMap = ASSETS) {
        this.pixijs = pixijs;
        this.assetFolder = assetFolder;
        this.assetMap = assetMap;
    }

    getAssetFile(assetName) {
        if (!(assetName in this.assetMap)) {
            LOGGER_G.warning(`"Unable to load ${assetName}, using default image.`)
            return this.assetMap["missing"];
        }

        return this.assetMap[assetName];
    }

    loadSprite(assetName) {
        let fpath = path.join(BUILD_ASSET_FOLDER, this.getAssetFile(assetName));
        return this.pixijs.Sprite.from(fpath);
    }
}

module.exports = PixiJSAssetManager;
