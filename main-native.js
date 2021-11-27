// Polyfill Requirement for ES6 Async
// https://babeljs.io/docs/en/babel-polyfill/
import "@babel/polyfill";
import { loadFonts } from "./src/bootstrap.js";

// Start the game
import Game from "./src/game.js";

loadFonts().then(()=>{
    let game = new Game();
    return game.loadScene.bind(game, "sandbox")();
}).then((game) => {
    game.start();
});
