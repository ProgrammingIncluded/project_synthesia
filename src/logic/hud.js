import { G_PIXI } from "../bootstrap.js";

class HUD {
    constructor(root, eLoader) {
        this.eLoader = eLoader;
        this.rootNode = root;

        this.sphereContainer = new G_PIXI.Container();
        this.spheres = [];
        this.spheresLoc = new G_PIXI.Point(560, 26);
        this.sphereCount = 3;
    }

    async load() {
        let randomNumber = (x, y) => {
            return Math.ceil(Math.random() * (y - x)) + x;
        };

        for (let i = 0; i < this.sphereCount; ++i) {
            let location = new G_PIXI.Point(this.spheresLoc.x + i * 25, this.spheresLoc.y);
            let sphere = await this.eLoader.load(
                                            "hacksphere",
                                            this.sphereContainer,
                                            location
                                        );
            sphere.animationSpeed = 0.5;

            sphere.sprite.onComplete = () => {
                sphere.sprite.gotoAndStop(0);
            };

            this.spheres.push(sphere)
        }

        let runFunc = () => {
            for (let sphere of this.spheres) {
                sphere.sprite.play();
            }

            setTimeout(runFunc.bind(this), randomNumber(5, 10) * 1000);
        }

        // Play this some random interval
        setTimeout(runFunc.bind(this), randomNumber(5, 10) * 1000);
        this.rootNode.addChild(this.sphereContainer);
    }
}

export {
    HUD
}
