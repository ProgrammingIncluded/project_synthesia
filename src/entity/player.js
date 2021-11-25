import { Entity } from "./entity.js";
import { playerBlueprint } from "./blueprints.js";
import { PIXI_APP_G } from "../bootstrap.js";

class Player extends Entity  {

    constructor() {
        super(playerBlueprint);
        this.elapsed = 0;
        this.spriteName = "player";
        this.maxSpeed = 5;
        this.vx = 0, this.vy = 0;
        this.mouseX = 0, this.mouseY = 0;
        this.dirX = 0, this.dirY = 0;
        this.shooting = false;
        this.keysPressed = {"left": false, "right": false, "up": false, "down": false};
        window.addEventListener('keydown', this.onKeyPress.bind(this));
        window.addEventListener('keyup', this.onKeyUp.bind(this));
    }

    attack(delta, curPos, player, enemies, space) {
        return 0;
    }

    movement(elapsed, curPos, player, enemies, space) {
        let newX = Math.max(0, Math.min(PIXI_APP_G.screen.width - this.sprite.width, curPos[0] + this.maxSpeed * this.dirX));
        let newY = Math.max(0, Math.min(PIXI_APP_G.screen.height - this.sprite.height, curPos[1] + this.maxSpeed * this.dirY));
        // this.sprite.angle = elapsed;
        return [newX, newY];
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
        this.sprite.position.set(posBuf[0], posBuf[1]);
        // Rotate towards mouse location
        let mousePosition = PIXI_APP_G.renderer.plugins.interaction.mouse.global;

        let angle = this.lookTowards(this.sprite.position.x + this.sprite.width/2,
                                    this.sprite.position.y + this.sprite.height/2,
                                    mousePosition.x,
                                    mousePosition.y);
        // rotation is the radian property; angle is the degree on.
        // per Pixi docs, they do the same thing
        this.sprite.rotation = angle;
    }

    teardown() {
        window.removeEventListener('keydown', this.onKeyPress);
        window.removeEventListener('keyup', this.onKeyUp);
        super.teardown();
    }

    // Compute angle between (x1, y1) and (x2, y2)
    // Returns: the angle in radians
    lookTowards(x1, y1, x2, y2) {
        let op = y2 - y1;
        let ad = x2 - x1;
        return Math.acos((ad) / Math.hypot(op, ad));
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
