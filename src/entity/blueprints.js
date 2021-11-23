import { G_LOGGER } from "../logger.js";

/**
 * Houses various helper blueprints
 */
class Blueprint {
    constructor() {
        this.name = "unamed_blueprint";
        this.constraints = {};
        this.defaultStates = {};
    }

    add(other) {
        this.constraints = {...this.constraints, ...other.constraints};
        this.defaultStates = {...this.defaultStates, ...other.states};
    }

    addConstraint(functionName, constraint) {
        this.constraints[functionName] = this.constraints[functionName].concat(constraint);
    }

    getState(functionName) {
        return this.defaultStates[functionName];
    }
}

class RenderBlueprint extends Blueprint {
    constructor() {
        super();
        this.name = "render_blueprint";
        this.constraints["render"] = [];
        this.defaultStates["render"] = "";
    }
}

class MovementBlueprint extends Blueprint {
    constructor() {
        super();
        this.name = "movement_blueprint";
        this.constraints["movement"] = [];
        this.defaultStates["movement"] = "";
    }
}

class AttackBlueprint extends Blueprint {
    constructor() {
        super();
        this.name = "attack_blueprint";
        this.constraints["attack"] = [];
        this.defaultStates["attack"] = "";
    }
}

function blueFactory(blueprints) {
    if (blueprints.length == 0) {
        G_LOGGER.error("no blue prints specified for factory");
        throw "fatal error in intializing blueprints";
    }
    else if (blueprints.length == 1) {
        return new blueprints[0]();
    }

    let prints = new blueprints[0]();
    for (const bp of blueprints.slice(1)) {
        prints.add(new bp());
    }

    return prints
}

let enemyBlueprint = blueFactory([
                                  AttackBlueprint,
                                  MovementBlueprint,
                                  RenderBlueprint
                                ]);

export {
    enemyBlueprint
}
