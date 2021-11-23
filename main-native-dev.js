// Polyfill Requirement for ES6 Async
// https://babeljs.io/docs/en/babel-polyfill/
import "@babel/polyfill";
import {setLevel, LOGGER_LEVEL_DEBUG} from "./src/logger.js"
setLevel(LOGGER_LEVEL_DEBUG);


// Start the game
import Game from "./src/game.js";

let GAME = new Game();
GAME.loadScene.bind(GAME, "sandbox")().then(() => {GAME.start();});
