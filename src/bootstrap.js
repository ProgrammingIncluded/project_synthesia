// Load core modules
import {Howl as HOWL_G} from "howler";
import * as PIXI_G from "pixi.js";
import LOGGER_G from "./logger.js";

// Load application window
// Create the application helper and add its render target to the page
// TODO: Dynamic height adjustment
const PIXI_APP_G = new PIXI_G.Application({ width: 640, height: 360});
document.body.appendChild(PIXI_APP_G.view);

export {
    HOWL_G,
    LOGGER_G,
    PIXI_APP_G,
    PIXI_G
}
