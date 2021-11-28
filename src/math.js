/**
 * Different helper functions for transforming animations
 * Kudos to: https://www.youtube.com/watch?v=mr5xkf6zSzk
 * for the time transformation ideas.
 */

import { G_PIXI } from "./bootstrap.js";

let smoothStart = (pow) => {
    return (t) => {
        return t ** pow;
    }
};

let smoothStop = (pow) => {
    return (t) => {
        return 1 - (1 - t)**pow;
    }
};

let blend = (F, G, weight) => {
    return (t) => {
        return (1 - weight) * F(t) + weight * G(t);
    }
}

let crossfade = (F, G) => {
    return (t) => {
        return (1-t) * F(t) + t* G(t);
    }
}

// Time Transforms
let TT = {
    smoothStop: smoothStop,
    smoothStart: smoothStart,
    blend: blend,
    crossfade: crossfade
}

function linearMove(start, end, totalTime, elapsed, timeTransform=smoothStart(1)) {
    let distanceX = end.x - start.x;
    let distanceY = end.y - start.y;
    let t = timeTransform(elapsed/totalTime);

    return new G_PIXI.Point(
        distanceX * t + start.x,
        distanceY * t + start.y
    );
}

export {
    TT,
    linearMove
}
