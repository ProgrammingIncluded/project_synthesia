import { G_LOGGER } from "../logger.js";

/**
 * Houses various helper blueprints
 */
class Blueprint {
    constructor() {
        this.name = "unamed_blueprint";
        this.constraints = {};
        this.preStates = {};
    }

    add(other) {
        this.constraints = {...this.constraints, ...other.constraints};
        this.preStates = {...this.preStates, ...other.preStates};
    }

    addConstraint(functionName, constraint) {
        this.constraints[functionName] = this.constraints[functionName].concat(constraint);
    }

    getState(functionName) {
        return this.preStates[functionName];
    }
}

class RenderBlueprint extends Blueprint {
    constructor() {
        super();
        this.name = "render";
        this.constraints["render"] = [];
        this.preStates["render"] = {};
    }
}

class MovementBlueprint extends Blueprint {
    constructor() {
        super();
        this.name = "movement";
        this.constraints["movement"] = [];
        this.preStates["movement"] = {
            "maxVelocity": 1.0
        };
    }
}

class AttackBlueprint extends Blueprint {
    constructor() {
        super();
        this.name = "attack";
        this.constraints["attack"] = [];
        this.preStates["attack"] = {};
    }
}

class HackingBlueprint extends Blueprint {
    constructor() {
        super();
        this.name = "hacking";
        this.constraints["hacking"] = [];
        this.preStates["hacking"] = "";
    }
}

class CollidableBlueprint extends Blueprint {
    constructor() {
        super();
        this.name = "onHit";
        this.constraints["onHit"] = [];
        this.preStates["onHit"] = "";
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
                                  RenderBlueprint,
                                  CollidableBlueprint
                                ]);

let playerBlueprint = blueFactory([
                                  AttackBlueprint,
                                  MovementBlueprint,
                                  RenderBlueprint,
                                  HackingBlueprint,
                                  CollidableBlueprint
                                ]);

let bulletBlueprint = blueFactory([
                                  MovementBlueprint,
                                  RenderBlueprint,
                                  CollidableBlueprint
                                ]);

let wallBlueprint = blueFactory([CollidableBlueprint, RenderBlueprint]);

let winBlueprint = blueFactory([CollidableBlueprint, RenderBlueprint]);

export {
    enemyBlueprint,
    playerBlueprint,
    bulletBlueprint,
    wallBlueprint,
    winBlueprint
}
