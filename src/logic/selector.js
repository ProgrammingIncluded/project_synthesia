import { G_EDITOR } from "../logic/editor.js";

// Selects enemy
class Selector {

    constructor() {
        this.selectedEntity = undefined;
        this.selectedFunction = "movement";
    }


    injectCode(funcName, code) {
        // Mutates current selection
        return;
    }

    select(entity) {
        if (this.selectedEntity !== undefined) {
            this.selectedEntity.sprite.tint = 0xFFFFFF;
        }
        this.selectedEntity = entity;
        this.selectedEntity.sprite.tint = 0x1BD933;
        if (this.selectedFunction in this.selectedEntity) {
            G_EDITOR.displaySafe(this.selectedEntity[this.selectedFunction].toString());
        }
        else {
            G_EDITOR.displaySafe(`// Function ${this.selectedFunction} not found.`)
        }
    }
}

export {
    Selector
}
