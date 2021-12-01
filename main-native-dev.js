// Polyfill Requirement for ES6 Async
// https://babeljs.io/docs/en/babel-polyfill/
import "@babel/polyfill";
import {setLevel, LOGGER_LEVEL_DEBUG, G_LOGGER} from "./src/logger.js"
import { bootstrap } from "./src/bootstrap.js";
setLevel(LOGGER_LEVEL_DEBUG);


// Start the game
import Game from "./src/game.js";

let game;
bootstrap().then(()=>{
    game = new Game();
    game.loadScene.bind(game, "end")();
    return game
}).then((game) => {
    game.start();
}).catch(async (err) => {
    // TODO: Fix external
    G_LOGGER.error(err);
    game.start();
});
