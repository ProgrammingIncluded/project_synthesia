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
class BasicVariableAddMutation {
    stateTransform(state) {
        let newRandomState = {};

        return {...state, ...{}};
    }
}

module.exports = [
    BasicVariableAddMutation
]
