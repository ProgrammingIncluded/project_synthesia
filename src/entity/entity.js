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
        this.preStates = {...blueprint.preStates};
        this.name = "DNE";
        this.spriteName = "missing";

        // Engine level objects
        this.sprite = undefined;
        this.functions = [];
    }

    enforce(expr) {
        assert(expr);
    }

    // Engine level API
    load() {

    }

    update(delta) {

    }

    teardown() {
        this.sprite.unload();
    }

    pause() {

    }
}


class EntityManager {
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


        // Traverse through the program tree while applying all available mutations
        // Generate verifications overtime
        let stack = [pt];

        // Helper for pushing to stack
        let addChildren = (children) => {
            stack.push(...children.reverse());
        }

        // variable bindings
        let state = {};
        while(stack.length != 0) {
            let node = stack.pop();
            if (node === undefined) { continue; }

            G_LOGGER.log(node.type);

            // Add to the stack
            if (["Program", "BlockStatement"].includes(node.type)) {
                addChildren(node.body);
            }
            else if (node.type == "FunctionDeclaration") {
                addChildren((node.params.concat([node.body])));
            }
            else if (node.type == "VariableDeclaration") {
                addChildren(node.declarations);
            }
            else if (node.type == "VariableDeclarator") {
                addChildren([node.id, node.init]);
            }
            else if (node.type == "ExpressionStatement") {
                stack.push(node.expression);
            }
            else if (node.type == "BinaryExpression") {
                addChildren([node.left, node.right]);
            }
            else if (node.type == "CallExpression") {
                addChildren(([node.callee].concat(node.arguments)));
            }
            else if (node.type == "SequenceExpression") {
                addChildren(node.expressions);
            }
            else if (node.type == "ReturnStatement") {
                stack.push(node.argument)
            }
            else if (node.type == "ArrayExpression") {
                addChildren(node.elements);
            }
            else if (node.type == "Identifier") {
                G_LOGGER.log("Hit identifier " + node.name);
            }
            G_LOGGER.log(node);
        }
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
        entity.load();
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
    EntityManager
}
