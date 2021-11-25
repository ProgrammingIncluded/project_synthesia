// Load core modules
import { Howl as G_HOWL } from "howler";
import * as G_PIXI from "pixi.js";
import { G_LOGGER } from "./logger.js";

// Load application window
// Create the application helper and add its render target to the page
// TODO: Dynamic height adjustment
const G_PIXI_APP = new G_PIXI.Application({ width: 640, height: 360});
document.body.appendChild(G_PIXI_APP.view);

export {
    G_HOWL,
    G_LOGGER,
    G_PIXI_APP,
    G_PIXI
}
