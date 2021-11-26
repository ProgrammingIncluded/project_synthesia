// Very basic asset manager interface.
// engine
import { G_PIXI } from "./bootstrap.js";
import { BUILD_ASSET_FOLDER, ASSETS } from "./constants.js";
const { G_LOGGER } = require("./logger.js");

// std
const path = require("path");

class PixiJSAssetManager {
    constructor(pixijs = G_PIXI,
                assetFolder = BUILD_ASSET_FOLDER,
                assetMap = ASSETS) {
        this.pixijs = pixijs;
        this.assetFolder = assetFolder;
        this.assetMap = assetMap;
    }

    getAssetFile(assetName) {
        if (!(assetName in this.assetMap)) {
            G_LOGGER.warning(`"Unable to load ${assetName}, using default image.`)
            return this.assetMap["missing"];
        }

        return this.assetMap[assetName];
    }

    loadSprite(assetName) {
        let fpath = path.join(BUILD_ASSET_FOLDER, this.getAssetFile(assetName));
        return this.pixijs.Sprite.from(fpath);
    }

    loadAnimation() {

    }
}

module.exports = PixiJSAssetManager;
