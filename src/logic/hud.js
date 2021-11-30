import { G_PIXI } from "../bootstrap.js";

class HUD {
    constructor(root, eLoader) {
        this.eLoader = eLoader;
        this.rootNode = root;

        this.sphereContainer = new G_PIXI.Container();
        this.healthSpheres = [];
        this.hackSpheres = []
        this.hackSpheresLoc = new G_PIXI.Point(560, 28);
        this.healthSpheresLoc = new G_PIXI.Point(390, 55);
        this.sphereCount = 3;
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

        // Play this some random interval
        this.rootNode.addChild(this.sphereContainer);
    }
}

export {
    HUD
}
