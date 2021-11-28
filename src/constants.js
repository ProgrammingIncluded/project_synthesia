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
    "player": require("./entity/player.js"),
    "textbox": require("./entity/ui/textbox.js"),
    "editor": require("./entity/ui/editor.js"),
    "profile": require("./entity/ui/profile.js"),
    "title": require("./entity/ui/title.js")
}

// Setup play field constant scaling
// Set the game's playfield to support auto-scaling
// Think of this as max design. Any lower and pixels get down sized
// any higher and pixels get up-scaled.
const VIRTUAL_WINDOW = {
    width: 1280,
    height:720
}

export {
    DEV_MODE,
    VIRTUAL_WINDOW,
    BUILD_ASSET_FOLDER,
    SCENES,
    ENTITIES
}
