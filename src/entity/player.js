import { Entity } from "./entity.js";
import { playerBlueprint } from "./blueprints.js";

class Player extends Entity  {


    constructor() {
        super(playerBlueprint);
        this.elapsed = 0;
        this.spriteName = "player";
        this.maxSpeed = 5;
        this.accel = 1;
        this.vx = 0, this.vy = 0;
        this.shooting = false;
        window.addEventListener('keydown', this.onKeyPress);
        window.addEventListener('keyup', this.onKeyUp);
    }

    attack(delta, curPos, player, enemies, space) {
        return 0;
    }

    movement(elapsed, curPos, player, enemies, space) {
        return [curPos[0], 100.0 + Math.cos(elapsed/50.0) * 100.0];
    }

    render(elapsed, sprite) {
        return sprite;
    }

    // Engine level API
    update(delta) {
        this.elapsed += delta;
        let posBuf = [this.sprite.position.x, this.sprite.position.y];
        posBuf = this.movement(this.elapsed, posBuf, undefined, undefined, undefined);
        this.sprite.position.set(posBuf[0], posBuf[1]);
    }

    teardown() {
        window.removeEventListener('keydown', onKeyPress);
        window.removeEventListener('keyup', onKeyUp);
        super.teardown();
    }

    onKeyPress(e) {
        let key = e.code;
        switch(key){
            case "KeyW":
                console.log("Up");
                break;
            case "KeyS":
                console.log("Down");
                break;
            case "KeyA":
                console.log("Left");
                break;
            case "KeyD":
                console.log("Right");
                break;
            case "Space":
                console.log("peko peko peko");
                this.shooting = true;
                break;
        }
    }

    onKeyUp(e) {
        let key = e.code;
        switch(key){
            case "Space":
                this.shooting = false;
                console.log("Matte peko");
                break;
        }
    }
}

module.exports = Player;
