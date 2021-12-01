import { Entity } from "./entity.js";
import { playerBlueprint } from "./blueprints.js";
import { G_PIXI, G_PIXI_APP, G_HOWL } from "../bootstrap.js";
import { G_SELECT } from "../shared.js";
import { G_LOGGER } from "../logger.js";
import { Bullet } from "./bullet.js";

class Player extends Entity  {

    constructor() {
        super(playerBlueprint);
        this.elapsed = 0;
        this.spriteName = "temp_player.png";
        this.maxSpeed = 5;
        this.health = 3;
        this.dead = false;
        this.shootFreq = 10;
        this.vx = 0, this.vy = 0;
        this.dirX = 0, this.dirY = 0;
        this.keysPressed = {"left": false, "right": false, "up": false, "down": false, "space": false};
        this.collidable = true;
        this.collideLayer = 1;
        this.prevPosition = null;
        this.isPlayer = true; // hack for winzone detection

        window.addEventListener('keydown', this.onKeyPress.bind(this));
        window.addEventListener('keyup', this.onKeyUp.bind(this));

        // set during load
        this.board = undefined;
    }

    fireBullet() {
        this.board.boardTree.addEntity(
            "bullet",
            this.position.x,
            this.position.y,
            this.maxSpeed,
            this.container.rotation,
            true
        );
    }

    attack(elapsed, curPos, player, enemies, space) {
        if (elapsed < this.shootFreq) {
            return;
        }
        this.fireBullet();
        this.shootfx.play();
        this.elapsed = 0; // reset counter if we fired
    }

    movement(delta, curPos, player, enemies, space) {
        let newX = Math.max(
            this.sprite.width/2,
            Math.min(
                this.board.playAreaDim.width - this.sprite.width / 2,
                curPos.x + this.maxSpeed * delta * this.dirX
            )
        );
        let newY = Math.max(
            this.sprite.height/2,
            Math.min(
                this.board.playAreaDim.height - this.sprite.height / 2,
                curPos.y + this.maxSpeed * delta * this.dirY
            )
        );
        return new this.helpers.Pixi.Point(newX, newY);
    }

    onHit(otherEntity) {
        if (otherEntity.immovable) {
            this.position = this.prevPosition;
        }
        else if (otherEntity.isBullet) {
            this.damage();
        }
    }

    render(elapsed, sprite) {
        return sprite;
    }

    damage() {
        if (this.dead) {
            return;
        }
        this.health--;
        this.ouchfx.play();
        G_LOGGER.log(this.health);
        this.dead = this.health <= 0;
        // on death, play big, dramatic sound. PICHUUUNNNN~
        if (this.dead) {
            this.deathrattle.play();
        }
    }

    // Engine level API
    load(board) {
        this.board = board;
        this.howl = G_HOWL;
        this.shootfx = new this.howl({
            src: ["assets/audio/effects/Moonshot.Sfx.Graze.wav"],
            loop: false
        });
        this.ouchfx = new this.howl({
            src: ["assets/audio/effects/Moonshot.Sfx.Hit.Player.wav"],
            loop: false
        });
        this.deathrattle = new this.howl({
            src: ["assets/audio/effects/Moonshot.Sfx.Explosion.Player.Death.wav"],
            loop: false
        });
    }

    update(delta) {
        // Elapsed serves as our counter to limit bullet firing frequency
        this.elapsed += delta;
        // NESW movement
        let posBuf = this.movement(delta, this.container.position, undefined, undefined, undefined);
        this.prevPosition = new G_PIXI.Point(this.container.position.x, this.container.position.y);
        this.container.position = posBuf;
        // Rotate towards mouse location
        // Convert mouse target point to game field coordinate system
        this.lookTowards(this.parent.toLocal(G_PIXI_APP.renderer.plugins.interaction.mouse.global));
        // Hit testing
        // Shooting
        if(this.keysPressed["space"]) {
            this.attack(this.elapsed, this.container.position, undefined, undefined, undefined);
        }
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
            case "Space":
                this.keysPressed["space"] = true;
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
            case "Space":
                this.keysPressed["space"] = false;
                break;
        }
    }
}

module.exports = Player;
