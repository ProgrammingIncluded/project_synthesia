// Some shared constants in the application
const DEV_MODE = false;
const BUILD_ASSET_FOLDER = "assets"
// Required inlined module to bake into bundle.js
// Otherwise require streaming and other abstracted fs.
const SCENES = {
    "title": require("./scene/title.js"),
    "sandbox": require("./scene/sandbox.js")
}

const ENTITIES = {
    "enemy_basic": require("./entity/enemy_basic.js"),
    "player": require("./entity/player.js")
}

const ASSETS = {
    "missing": "sample.jpg"
}

export {
    DEV_MODE,
    BUILD_ASSET_FOLDER,
    SCENES,
    ENTITIES,
    ASSETS
}
