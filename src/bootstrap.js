// Load core modules
import { Howl as G_HOWL } from "howler";
import * as G_PIXI from "pixi.js";
import { G_LOGGER } from "./logger.js";

// Render options
G_PIXI.settings.SCALE_MODE = G_PIXI.SCALE_MODES.NEAREST;

// Load application window
// Create the application helper and add its render target to the page
let targetDOM = document.getElementById("render");
let targetSize = {resizeTo: targetDOM, antialias: false, autoDensity: true};
const G_PIXI_APP = new G_PIXI.Application(targetSize);
targetDOM.appendChild(G_PIXI_APP.view);

// Load custom fonts for the game
import * as WebFont from "webfontloader";

let FONTNAMES = {
    dialogue: "M PLUS 1 Code"
};

let BITMAP_FONTS = {};
async function loadFonts() {
    return new Promise((resolve, reject) => {
        WebFont.load({
            google: {
                families: Object.values(FONTNAMES)
            },
            active: (e) => {
                G_LOGGER.debug("Fonts have been loaded.");
                G_LOGGER.debug(e);

                // Compile bitmap fonts
                BITMAP_FONTS = {
                    "dialogue": G_PIXI.BitmapFont.from("dialogue", {
                        fontFamily: FONTNAMES.dialogue,
                        fontSize: 16,
                        strokeThickness: 2,
                        fill: "white",
                        lineHeight: 20
                    }, {
                        chars: G_PIXI.BitmapFont.ASCII,
                        resolution: 2,
                    })
                };

                resolve();
            },
            inactive: (e) => {
                G_LOGGER.error("Unable to download fonts. Are you connected to the internet?")
                reject(e);
            }
        });
    });
}


export {
    G_HOWL,
    G_LOGGER,
    G_PIXI_APP,
    G_PIXI,
    FONTNAMES,
    BITMAP_FONTS,
    loadFonts
}
