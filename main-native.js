// Polyfill Requirement for ES6 Async
// https://babeljs.io/docs/en/babel-polyfill/

import "@babel/polyfill";

// Start the game
import Game from "./src/game.js";

let GAME = new Game();
GAME.loadScene.bind(GAME, "title")().then(() => {GAME.start(); console.log("load complete");});
