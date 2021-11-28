import { Entity } from "../entity.js";
import { G_LOGGER } from "../../logger.js";

class Profile extends Entity {
    constructor() {
        super({});

        this.spriteName = "selene.png";
    }

    load() {
    }

}

module.exports = Profile;
