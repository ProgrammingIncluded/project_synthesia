// Polyfill Requirement for ES6 Async
// https://babeljs.io/docs/en/babel-polyfill/
import "@babel/polyfill";
import { loadFonts } from "./src/bootstrap.js";
import {G_LOGGER} from "./src/logger.js";

// Start the game
import Game from "./src/game.js";

let game;
loadFonts().then(()=>{
    game = new Game();
    game.loadScene.bind(game, "title")();
    return game;
}).then((game) => {
    game.start();
}).catch((err) => {
    // TODO: Fix external
    G_LOGGER.error(err);
    game.start();
});
