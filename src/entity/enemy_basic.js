let SPRITE = "missing";


let CONSTRAINT = ``

let MOVEMENT = `
(delta, curPos, player, enemies, space) => {
    return curPos + 1;
}
`;

let RENDER = `
(delta, sprite) => {
    return sprite;
}
`;

let ATTACK = `
(delta, curPos, player, enemies, space) => {
    return 0;
}
`;

export {
    SPRITE,
    CONSTRAINT,
    MOVEMENT,
    RENDER,
    ATTACK
}
