// Encodes mutations for code
// Encode the state modifiers
class Mutation {
    check(node, state) {

    }

    mutate(node, state) {
        return {"node": node, "state": state};
    }
}

// Adds a value to a random variable
// Inject for: a + C where C is some random constant.
class BasicVariableAddMutation extends Mutation {
    check(node, state) {
        variables = Object.keys(state);
        return (variables.length != 0);
    }

    mutate(node, state) {

    }
}

module.exports = [
    BasicVariableAddMutation
]
