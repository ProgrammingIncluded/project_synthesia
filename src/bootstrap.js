// Load core modules
import * as G_PIXI from "pixi.js";
import $ from "jquery";
import { Howl as G_HOWL } from "howler";
import { G_LOGGER } from "./logger.js";

// Render options
G_PIXI.settings.SCALE_MODE = G_PIXI.SCALE_MODES.NEAREST;

// Load application window
// Create the application helper and add its render target to the page
let G_PIXI_APP = undefined;

// keep play space the same aspect ratio
async function setupSize() {
    let calculateDivDims = () => {
        let fullwidth = $(window).width();
        $(".container").height($(window).height());
        $(".container").width(fullwidth);

        let renderwidth = fullwidth / 4 * 3
        let renderheight = renderwidth * (9 / 16);
        $("#render").width(renderwidth);
        $("#render").height(renderheight);

        let tewidth = fullwidth / 4 * 1 - 5;
        $("#text-editor").width(tewidth);
        $("#text-editor").height(renderheight);
    }
    $(window).on('resize', calculateDivDims);
    return new Promise((resolve) => {
        $(window).on("load", function() {
            calculateDivDims();

            let targetDOM = $("#render")[0];
            let targetSize = {resizeTo: targetDOM, antialias: false, autoDensity: true};
            G_PIXI_APP = new G_PIXI.Application(targetSize);
            targetDOM.appendChild(G_PIXI_APP.view);
            resolve();
        });
    });
}


// Setup editor
import * as ace from "brace";
require("brace/mode/javascript");
require("brace/theme/monokai");
let EDITOR = ace.edit("text-editor");
EDITOR.getSession().setMode("ace/mode/javascript");
EDITOR.setTheme("ace/theme/monokai");

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
                        fontFamily: FONTNAMES.dialogue, // TODO: use local fonts
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

async function bootstrap() {
    return Promise.all([
        loadFonts(),
        setupSize()
    ]);
}

export {
    G_HOWL,
    G_LOGGER,
    G_PIXI_APP,
    G_PIXI,
    FONTNAMES,
    BITMAP_FONTS,
    EDITOR,
    bootstrap
}
