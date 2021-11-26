import { Entity } from "./entity.js";
import { playerBlueprint } from "./blueprints.js";
import { G_PIXI_APP } from "../bootstrap.js";
import { PLAY_AREA } from "../constants.js";

class Player extends Entity  {

    constructor() {
        super(playerBlueprint);
        this.elapsed = 0;
        this.spriteName = "player";
        this.maxSpeed = 5;
        this.vx = 0, this.vy = 0;
        this.dirX = 0, this.dirY = 0;
        this.keysPressed = {"left": false, "right": false, "up": false, "down": false};
        window.addEventListener('keydown', this.onKeyPress.bind(this));
        window.addEventListener('keyup', this.onKeyUp.bind(this));
    }

    attack(delta, curPos, player, enemies, space) {
        return 0;
    }

    movement(elapsed, curPos, player, enemies, space) {
        let newX = Math.max(
            this.sprite.width/2,
            Math.min(
                PLAY_AREA.width - this.sprite.width / 2,
                curPos[0] + this.maxSpeed * this.dirX
            )
        );
        let newY = Math.max(
            this.sprite.height/2,
            Math.min(
                PLAY_AREA.height - this.sprite.height / 2,
                curPos[1] + this.maxSpeed * this.dirY
            )
        );
        return new this.helpers.Pixi.Point(newX, newY);
    }

    render(elapsed, sprite) {
        return sprite;
    }

    // Engine level API
    update(delta) {
        this.elapsed += delta;
        // NESW movement
        let posBuf = [this.sprite.position.x, this.sprite.position.y];
        posBuf = this.movement(this.elapsed, posBuf, undefined, undefined, undefined);
        this.sprite.position.set(posBuf.x, posBuf.y);
        // Rotate towards mouse location
        this.lookTowards(G_PIXI_APP.renderer.plugins.interaction.mouse.global);
    }

    teardown() {
        window.removeEventListener('keydown', this.onKeyPress);
        window.removeEventListener('keyup', this.onKeyUp);
        super.teardown();
    }

    onKeyPress(e) {
        let key = e.code;
        switch(key){
            case "KeyW":
                this.dirY = this.keysPressed["down"] ? 0 : -1;
                this.keysPressed["up"] = true;
                break;
            case "KeyS":
                this.dirY = this.keysPressed["up"] ? 0 : 1;
                this.keysPressed["down"] = true;
                break;
            case "KeyA":
                this.dirX = this.keysPressed["right"] ? 0 : -1;
                this.keysPressed["left"] = true;
                break;
            case "KeyD":
                this.dirX = this.keysPressed["left"] ? 0 : 1;
                this.keysPressed["right"] = true;
                break;
        }
    }

    onKeyUp(e) {
        let key = e.code;
        switch(key){
            case "KeyW":
                this.dirY = this.keysPressed["down"] ? 1 : 0;
                this.keysPressed["up"] = false;
                break;
            case "KeyS":
                this.dirY = this.keysPressed["up"] ? -1 : 0;
                this.keysPressed["down"] = false;
                break;
            case "KeyA":
                this.dirX = this.keysPressed["right"] ? 1 : 0;
                this.keysPressed["left"] = false;
                break;
            case "KeyD":
                this.dirX = this.keysPressed["left"] ? -1 : 0;
                this.keysPressed["right"] = false;
                break;
        }
    }
}

module.exports = Player;
