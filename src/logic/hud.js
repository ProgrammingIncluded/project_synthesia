import { G_PIXI } from "../bootstrap.js";
import { G_SELECT } from "../shared.js";

class HUD {
    constructor(root, eLoader, board) {
        this.eLoader = eLoader;
        this.rootNode = root;
        this.board = board;

        this.sphereContainer = new G_PIXI.Container();
        this.healthSpheres = [];
        this.hackSpheres = []
        this.hackSpheresLoc = new G_PIXI.Point(562, 30);
        this.healthSpheresLoc = new G_PIXI.Point(390, 55);
        this.sphereCount = 3;
        this.curHealth = 3;
        this.curHack = 3;
    }

    update() {
        // Hack: Inefficient but works for now
        let health = Math.max(0, this.board.entities.player.health);
        health = Math.min(health, this.sphereCount);

        if (health != this.curHealth) {
            this.healthSpheres.forEach((v, idx) => {
                v.container.renderable = (health - idx - 1 >= 0);
            })

            this.curHealth = health;
        }

        // Hack orbs
        if (G_SELECT.hacks != this.curHack) {
            this.curHack = G_SELECT.hacks;
            this.hackSpheres.forEach((v, idx) => {
                v.container.renderable = (this.curHack - idx - 1 >= 0);
            })

        }

    }

    async load() {
        let randomNumber = (x, y) => {
            return Math.ceil(Math.random() * (y - x)) + x;
        };

        let generateSpheres = async (track, container, loc, anim) => {
            for (let i = 0; i < this.sphereCount; ++i) {
                let location = new G_PIXI.Point(loc.x + i * 25, loc.y);
                let sphere = await this.eLoader.load(
                                                "hacksphere",
                                                container,
                                                location
                                            );
                sphere.animationSpeed = 0.5;

                sphere.sprite.onComplete = () => {
                    sphere.sprite.gotoAndStop(0);
                };

                track.push(sphere)
            }

            let runFunc = () => {
                for (let sphere of track) {
                    sphere.sprite.play(anim);
                }

                setTimeout(runFunc.bind(this), randomNumber(5, 10) * 1000);
            }
            setTimeout(runFunc.bind(this), randomNumber(5, 10) * 1000);
        };

        generateSpheres(this.hackSpheres, this.sphereContainer, this.hackSpheresLoc, "normal");
        generateSpheres(this.healthSpheres, this.sphereContainer, this.healthSpheresLoc, "health");
        this.healthSpheres.reverse();

        // Play this some random interval
        this.rootNode.addChild(this.sphereContainer);
    }
}

export {
    HUD
}
