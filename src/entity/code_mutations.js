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

class BasicColorMutation extends Mutation {
    constructor() {
        super();
        this.allowed = [
            "ArrowFunctionExpression"
        ];
    }

    check(node, state) {
        if (this.allowed.includes(node.type)) {
            let found = false;
            node.params.forEach((o) => {
                if (o.name == "sprite") {
                    found = true;
                    return ;
                }
            });

            return found;
        }

        return false;
    }

    mutate(node, state) {
        if(node.type == "ArrowFunctionExpression") {
            let newNode = {
                "type": "ExpressionStatement",
                "expression": {
                    "type": "AssignmentExpression",
                    "operator": "=",
                    "left": {
                    "type": "MemberExpression",
                    "computed": false,
                    "object": {
                        "type": "Identifier",
                        "name": "sprite"
                    },
                    "property": {
                        "type": "Identifier",
                        "name": "tint"
                    }
                    },
                    "right": {
                        "type": "BinaryExpression",
                        "operator": "*",
                        "left": {
                            "type": "Literal",
                            "value": 16777215,
                            "raw": "0xFFFFFF"
                        },
                        "right": {
                            "type": "CallExpression",
                            "callee": {
                            "type": "MemberExpression",
                            "computed": false,
                            "object": {
                                "type": "Identifier",
                                "name": "Math"
                            },
                            "property": {
                                "type": "Identifier",
                                "name": "random"
                            }
                            },
                            "arguments": []
                        }
                    }
                }
            };
            node.body = [newNode].concat(node.body);
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
    new BasicConstOpMutation(),
];

export {
    MUTATIONS
}
