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

export {
    G_HOWL,
    G_LOGGER,
    G_PIXI_APP,
    G_PIXI
}
