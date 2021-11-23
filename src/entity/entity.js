import * as esprima from "esprima";

// STD
import { ENTITIES } from "../constants.js";
import { G_LOGGER } from "../logger.js";

/**
 * Houses logic for loading entities into the file.
 */

class EntityLoader {
    constructor(assetManager) {
        this.assetManager = assetManager;
        this.sourceCode = {};
        // Load a copy of all source code to file
        for (const [key, value] of Object.entries(ENTITIES)) {
            this.sourceCode[key] = value;
        }
    }

    load(entityName, startingPosition, scale=1) {
        let entity = this.sourceCode[entityName];
        G_LOGGER.debug(esprima.parse(entity.MOVEMENT));
    }
}

// Restrict grammar to
// expr := N | x | expr + expr
// cmd :=
//        | x := expr
//        | x += expr  <- x := x + expr
//        | cmd; cmd
//        | if( expr ) cmd else cmd;
//        | return expr;


class Entity {
    constructor() {
        this.program = undefined;
        this.state = undefined;
    }
}

export {
    EntityLoader
}
