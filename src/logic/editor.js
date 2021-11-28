/**
 * Basic wrapper around bootstrap editor
 */

import { EDITOR } from "../bootstrap.js";
import { EMOJI } from "../emoji.js";

class Editor {
    constructor() {
        this.locked = false;
    }

    // Display a random emote on the editor
    randomEmote(emotion) {
        let emotes = Object.values(EMOJI[emotion]);
        let emote = emotes[Math.floor(Math.random() * emotes.length)];
        this.display(emote);
    }

    display(msg) {
        EDITOR.session.setValue(msg);
    }

    // Displays the code for a highlighted enemy
    // Checks to makesure that lock is disabled, otherwise
    // this function will noop.
    displaySafe(msg) {
        if (this.locked) { return false; }
        this.display(msg);
    }

    // Lock the editor
    lock() {
        this.locked = true;
        EDITOR.setReadOnly(true);
    }

    unlock() {
        this.locked = false;
        EDITOR.setReadOnly(false);
    }
}

const G_EDITOR = new Editor();

export {
    G_EDITOR
}
