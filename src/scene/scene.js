import { EntityManager } from "../entity/entity.js";

class Scene {
    constructor(
        rootNode,
        pixi,
        howl,
        assets
    ) {
        this.rootNode = rootNode;
        this.pixi = pixi;
        this.howl = howl;
        this.assets = assets;
        this.eLoader = new EntityManager(assets);

        // Check to see if teardown await is required before next loading of scene
        this.teardownAwait = false;
    }
    async load() {
        // Returns self after loading
        return this;
    }

    update(delta) {
        throw("Undefined function");
    }

    async teardown() {
        throw("Undefined function");
    }

    async pause() {
        throw("Undefined function");
    }
}

module.exports = Scene;
