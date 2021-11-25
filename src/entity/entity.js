import * as esprima from "esprima";
import * as escodegen from "escodegen";

import { ENTITIES } from "../constants.js";
import { G_LOGGER, assert } from "../logger.js";
import { MUTATIONS } from "./code_mutations.js";

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
        // Should not be modified directly
        this.node = undefined;
    }

    setNode(node) {
        if (this.node !== undefined) {
            this.node.removeChild(this.sprite);
        }
        this.node = node;
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
        this.node.removeChild(this.sprite);
        this.sprite.destroy();
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

    addArrayToStack(stack, children) {
        // Slice is necessary to make a copy
        stack.push(...children.slice().reverse());
    }

    addChildren(stack, node) {
        assert(node !== undefined);
        // Add to the stack
        if (["Program", "BlockStatement"].includes(node.type)) {
            this.addArrayToStack(stack, node.body);
        }
        else if (["FunctionDeclaration", "ArrowFunctionExpression"].includes(node.type)) {
            this.addArrayToStack(stack, (node.params.concat([node.body])));
        }
        else if (node.type == "VariableDeclaration") {
            this.addArrayToStack(stack, node.declarations);
        }
        else if (node.type == "VariableDeclarator") {
            this.addArrayToStack(stack, [node.id, node.init]);
        }
        else if (node.type == "ExpressionStatement") {
            stack.push(node.expression);
        }
        else if (node.type == "BinaryExpression") {
            this.addArrayToStack(stack, [node.left, node.right]);
        }
        else if (node.type == "IfStatement") {
            this.addArrayToStack(stack, [node.test, node.consequent, node["alternate?"]]);
        }
        else if (node.type == "CallExpression") {
            this.addArrayToStack(stack, ([node.callee].concat(node.arguments)));
        }
        else if (node.type == "SequenceExpression") {
            this.addArrayToStack(stack, node.expressions);
        }
        else if (node.type == "ReturnStatement") {
            stack.push(node.argument)
        }
        else if (node.type == "ArrayExpression") {
            this.addArrayToStack(stack, node.elements);
        }
        else if (node.type == "Identifier") {
        }
    }

    // Returns early if func 'false' is returned
    iterateGraph(root, accum, func) {
        // Traverse through the program tree while applying all available mutations
        // Generate verifications overtime
        let stack = [root];

        // variable bindings
        let index = 0;

        while(stack.length != 0) {
            let node = stack.pop();
            if (node === undefined) { continue; }


            // Return should be {"node": ..., "accum": {}}
            // Where node is the next node to traverse down
            let ret = func(index, node, accum)

            if (!ret) { return false; }

            accum = ret.accum;

            this.addChildren(stack, ret.node);
            index += 1;
        }
        return {"node": root, "accum": accum};
    }

    mutate(entity) {
        let pt = esprima.parseScript(entity.movement.toString());
        assert(pt.type == "Program", "Loading invalid program");
        assert(pt.body.length == 1, "Should only be passing in one function.");

        // Convert any global functions to lambdas
        // So eval will work properly
        if (pt.body[0].type == "FunctionDeclaration") {
            let fd = pt.body[0];
            pt.body = [{
                "type": "ArrowFunctionExpression",
                "id": null,
                "params": fd.params,
                "body": fd.body,
                "async": false,
                "generator": false,
                "expression": false
            }];
        }

        // TODO: Siphon mutations stage

        // Check if mutation is allowed, store a pointer to all available locations
        let validLocations = {};
        for (const m of MUTATIONS) {
            validLocations[m.constructor.name] = [];
        }
        let mutation = undefined;

        this.iterateGraph(pt, entity.preStates, (idx, node, accum) => {
            for (const m of MUTATIONS) {
                if (m.check(node, accum)) {
                    mutation = m;
                    validLocations[mutation.constructor.name].push(idx);
                    return {"node": node, "accum": accum};
                }
            }
            return {"node": node, "accum": accum};
        });

        if (mutation === undefined) {
            assert(mutation === undefined, "Code cannot be mutated, too powerful.")
        }

        let mutated = false;
        validLocations = validLocations[mutation.constructor.name];
        let randomValidLocation = validLocations[Math.floor(Math.random() * validLocations.length)];
        let mutationRet = this.iterateGraph(pt, entity.preStates, (idx, node, accum) => {
            if (mutated || idx != randomValidLocation) {
                return {"node": node, "accum": accum}
            }
            let ret = mutation.mutate(node, accum);
            mutated = true;
            return {"node": ret.node, "accum": ret.state};
        })

        let newCode = escodegen.generate(mutationRet.node);
        G_LOGGER.debug(newCode);
        entity.movement = eval(newCode);

        // TODO: Verification
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
        entity.setNode(node);
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
