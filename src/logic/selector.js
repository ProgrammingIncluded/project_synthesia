import { G_EDITOR } from "../logic/editor.js";

// Selects enemy
class Selector {

    constructor() {
        this.selectedEntity = undefined;
        this.selectedFunction = "movement";
        this.selectButton = undefined;
    }


    injectCode(code) {
        // Mutates current selection
        this.selectedEntity.eLoader.inject(this.selectedEntity, this.selectedFunction, code);
        this.selectFunction(this.selectedFunction, this.selectButton);
    }

    selectFunction(functionName, button) {
        if (this.selectButton !== undefined) {
            this.selectButton.sprite.tint = 0xFFFFFF;
        }
        this.selectedFunction = functionName;

        if (button !== undefined) {
            this.selectButton = button;
            this.selectButton.sprite.tint = 0x9B9A9A;
        }
        if (this.selectedFunction in this.selectedEntity) {
            G_EDITOR.displaySafe(this.selectedEntity[this.selectedFunction].toString());
        }
        else {
            G_EDITOR.displaySafe(`// Function ${this.selectedFunction} not found.`)
        }
    }

    select(entity) {
        if (this.selectedEntity !== undefined) {
            this.selectedEntity.sprite.tint = 0xFFFFFF;
        }
        this.selectedEntity = entity;
        this.selectedEntity.sprite.tint = 0x1BD933;
        if (this.selectedFunction in this.selectedEntity) {
            this.selectFunction(this.selectedFunction, this.selectButton);
        }
        else {
            // TODO: There is no way to actually acquire the default button.
            this.selectFunction("movement", undefined);
        }
    }
}

export {
    Selector
}
