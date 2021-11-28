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
        return this.allowed.includes(node.type);
    }

    mutate(node, state) {
        if (node.type == "BinaryExpression") {
            let newValue = Math.floor(Math.random() * 10);
            let replaceLeft = (Math.floor(Math.random()) < 0.5);
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
            let literal = {
                "type": "Literal",
                "value": newValue,
                "raw": newValue.toString()
            }

            // This can be compressed but may reduce readability
            if (replaceLeft) {
                newNode["left"] = node.left;
                newNode["right"] = literal;
                node.left = newNode;
            }
            else {
                newNode["right"] = node.right;
                newNode["left"] = literal;
                node.right = newNode;
            }
            return {"node": node, "state": state};
        }
        return {"node": node, "state": state};
    }
}

class BasicCyclicMutation extends Mutation {
    constructor() {
        super();
        this.allowed = [
            "BinaryExpression"
        ];
    }

    check(node, state) {
        return this.allowed.includes(node.type);
    }

    mutate(node, state) {
        // TODO: fill me
    }
}

const MUTATIONS = [
    new BasicConstOpMutation()
];

export {
    MUTATIONS
}
