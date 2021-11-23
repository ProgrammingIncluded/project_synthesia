import * as esprima from "esprima";

// STD
import { ENTITIES } from "../constants.js";
import { G_LOGGER, assert } from "../logger.js";

/**
 * Houses logic for loading entities into the file.
 */
class Entity {
    constructor(blueprint) {
        // Metadata
        this.blueprint = blueprint;
        this.states = {...blueprint.defaultStates};
        this.name = "DNE";
        this.spriteName = "missing";

        // Engine level objects
        this.sprite = undefined;
    }


    // Engine level API
    update(delta) {

    }

    teardown() {
        this.sprite.unload();
    }

    pause() {

    }
}

class EntityLoader {
    constructor(assetManager) {
        this.assetManager = assetManager;
        this.sourceCode = {};
        // Load a copy of all source code to file
        for (const [key, value] of Object.entries(ENTITIES)) {
            this.sourceCode[key] = value;
        }
    }

    mutate(entity) {
        let pt = esprima.parse(entity.movement.toString());
        assert(pt.type == "Program", "Loading invalid program");
    }

    load(entityName, node, startingPosition, scale=1) {
        let entity = new this.sourceCode[entityName]();
        if (!(entity instanceof Entity)) {
            let name = entity.constructor.name;
            G_LOGGER.error(`Attempted to load ${name} which is not an entity.`)
            throw "NOT AN ENTITY: " + name;
        }

        // Load the sprite into the engine and store the ptr
        entity.sprite = this.assetManager.loadSprite(entity.spriteName);
        node.addChild(entity.sprite);
        return entity;
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

export {
    Entity,
    EntityLoader
}
