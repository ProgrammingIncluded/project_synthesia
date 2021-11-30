import * as G_PIXI from "pixi.js";
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

        // Set to fetch sprites intead of animation
        this.spriteName = undefined;

        // animation prperties, use before load()
        this._curAnimation = undefined;
        // Set to fetch animation instead of sprites
        this.animationNames = [];
        this.animationProp = {
            loop: false,
            animationSpeed: 1
        };
        this.immovable = false;

        // Engine level objects
        this.container = new G_PIXI.Container();
        this.collidable = false;
        this.collideLayer = 0;
        // Useful reference for logic and other custom classes.
        this.container.entity = this;
        this._sprite = undefined;
        this._animations = {};
        this.functions = [];
        this.eLoader = null;
        this.parent = null;

        // Helper functions
        this.helpers = {
            "Pixi": G_PIXI
        }
    }

    // Use only in load() otherwise use this._curAnimation
    set curAnimation(ca) {
        if (this._curAnimation == undefined) {
            this._curAnimation = this.animationNames[0];
        }

        let anim = this._animations[this._curAnimation];
        anim.stop();
        anim.renderable = false;
        this._curAnimation = ca;
        this._animations[ca].renderable = true;
    }

    get sprite() {
        if (this._sprite === undefined) {
            return this._animations[this._curAnimation];
        }
        else {
            return this._sprite;
        }
    }

    set sprite(s) {
        assert(false, "Cannot set sprite, use EntityManager");
    }

    /* Syntactic helpers */
    get position() { return this.container.position; }
    set position(p) { this.container.position = p; }
    play() { this.sprite.play(); }
    stop() { this.sprite.stop(); }

    // Used for binding mutators
    enforce(expr) { assert(expr); }

    // Engine level API
    load() {

    }

    update(delta) {

    }

    teardown() {
        this.container.destroy();
    }

    pause() {

    }

    // Rotate current sprite towards given coordinates
    // Returns: the angle in radians
    lookTowards(target) {
        assert(target.type === G_PIXI.IPoint, "Target of lookTowards must be a PIXI IPoint object.");
        assert(target.x !== null && target.y !== null, "lookTowards target x or y was null.");
        let x1 = this.container.position.x;
        let y1 = this.container.position.y;
        let op = target.y - y1;
        let ad = target.x - x1;
        let sigma = Math.atan(op/ad); // angle between mouse pointer and horizontal
        // assume the sprite is the origin for a moment. There are different
        // behaviors based on what quadrant the mouse pointer is in relative to
        // the sprite. There are also boundary conditions to handle because
        // tangent isn't defined at +/- pi/2.
        // positive value means mouse right of cursor
        let leftRight = Math.sign(ad);
        let theta = sigma === NaN || leftRight === 0 ? this.container.rotation : leftRight * Math.PI/2 + sigma;
        // rotation is the radian property; angle is the degree on.
        // per Pixi docs, they do the same thing
        this.container.rotation = theta;
    }
}


class EntityManager {
    constructor() {
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
        else if (["FunctionDeclaration", "FunctionExpression", "ArrowFunctionExpression"].includes(node.type)) {
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
        G_LOGGER.log(pt);
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
        G_LOGGER.info("Still working");

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
            assert(mutation === undefined, "Code cannot be mutated, too powerful.");
        }

        let mutated = false;
        validLocations = validLocations[mutation.constructor.name];
        let randomValidLocation = validLocations[Math.floor(Math.random() * validLocations.length)];
        let mutationRet = this.iterateGraph(pt, entity.preStates, (idx, node, accum) => {
            if (mutated || idx != randomValidLocation) {
                return {"node": node, "accum": accum};
            }
            let ret = mutation.mutate(node, accum);
            mutated = true;
            return {"node": ret.node, "accum": ret.state};
        });

        let newCode = escodegen.generate(mutationRet.node);
        G_LOGGER.info(newCode);


        // HACK to provide a context for the function
        let context = function() {
            return eval(newCode);
        }.bind(entity);

        // Required to bind context
        entity.movement = context();

        // TODO: Verification
    }

    async load(entityName, node, startingPosition=new G_PIXI.Point(0, 0), ...varArgs) {
        let entity = new this.sourceCode[entityName]();
        if (!(entity instanceof Entity)) {
            let name = entity.constructor.name;
            G_LOGGER.error(`Attempted to load ${name} which is not an entity.`)
            throw "NOT AN ENTITY: " + name;
        }

        let hasAnimations = entity.spriteName.endsWith(".json");
        // Load the sprite into the engine and store the ptr
        let loader = G_PIXI.Loader.shared;
        let resources = loader.resources;
        if (loader.loading) {
            loader = new G_PIXI.Loader();
        }

        if (hasAnimations) {
            let jsonLoc = `assets/${entity.spriteName}`;
            if (!loader.resources[jsonLoc]) {
                loader = loader.add(jsonLoc);
                resources = await new Promise((resolve, reject) => loader.load((loader, resources) => resolve(resources)));
            }

            let sheet = resources[jsonLoc].spritesheet;
            entity.animationNames = Object.keys(sheet.animations);

            for (let animationName of entity.animationNames) {
                let animationSprite = new G_PIXI.AnimatedSprite(sheet.animations[animationName]);
                entity._animations[animationName] = animationSprite;
                animationSprite.position = startingPosition;
                animationSprite.loop = entity.animationProp.loop;
                animationSprite.animationSpeed = entity.animationProp.animationSpeed;
                animationSprite.anchor.set(0.5);
                animationSprite.renderable = false;
                entity.container.addChild(animationSprite);
            }

            entity.eLoader = this;
            entity.load();
            entity.position = startingPosition;
            entity.parent = node;
            node.addChild(entity.container);
            return entity;
        }
        else {
            entity._sprite = G_PIXI.Sprite.from(`assets/${entity.spriteName}`);
            entity.sprite.anchor.set(0.5); // Can't be called in entity constructor because sprite isn't loaded yet
            entity.position = startingPosition;

            entity.eLoader = this;
            entity.load(...varArgs);
            entity.container.addChild(entity._sprite);
            entity.parent = node;
            node.addChild(entity.container);
            return entity;
        }

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
