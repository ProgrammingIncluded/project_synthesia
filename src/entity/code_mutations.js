// Encodes mutations for code

import { G_LOGGER } from "../logger";

// Encode the state modifiers
class Mutation {
    check(node, state) {

    }

    mutate(node, state) {
        return {"node": node, "state": state};
    }
}

// Adds a value to a random variable
// Inject for: a <+-> C where C is some random constant.
class BasicConstOpMutation extends Mutation {
    constructor() {
        super();
        this.allowed = [
            "BinaryExpression"
        ];
        this.validOps = [
            "+",
            "-"
        ];
    }

    getRandomOp() {
        return this.validOps[Math.floor(Math.random() * this.validOps.length)];
    }

    check(node, state) {
        if (this.allowed.includes(node.type)) {
            return true;
        }
        return false;
    }

    mutate(node, state) {
        if (node.type == "BinaryExpression") {
            let newValue = Math.floor(Math.random() * 10);
            let newNode = {
                "type": "BinaryExpression",
                "operator": this.getRandomOp(),
                "left": node.left,
                "right": {
                    "type": "Literal",
                    "value": newValue,
                    "raw": newValue.toString()
                }
            }
            node.left = newNode;
            return {"node": node, "state": state};
        }
        return {"node": node, "state": state};
    }
}

const MUTATIONS = [
    new BasicConstOpMutation()
];

export {
    MUTATIONS
}
