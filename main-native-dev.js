// Polyfill Requirement for ES6 Async
// https://babeljs.io/docs/en/babel-polyfill/
import "@babel/polyfill";
import {setLevel, LOGGER_LEVEL_DEBUG, G_LOGGER} from "./src/logger.js"
import { loadFonts } from "./src/bootstrap.js";
setLevel(LOGGER_LEVEL_DEBUG);


// Start the game
import Game from "./src/game.js";

let game;
loadFonts().then(()=>{
    game = new Game();
    return game.loadScene.bind(game, "sandbox")();
}).then((game) => {
    game.start();
}).catch((err) => {
    // TODO: Fix external
    G_LOGGER.error(err);
    game.start();
});
