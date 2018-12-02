import helpers from "../helpers";
import { MainScene } from "../scenes/MainScene";

export class Cloud extends Phaser.GameObjects.Sprite {
    speed: number;

    constructor(scene: MainScene, x: number, y: number) {
        super(scene, x, y, Math.random() < 0.3 ? "cloud2" : "cloud1", 0);
        this.scene = <Phaser.Scene>scene;
        this.scene.add.existing(this);
        this.speed = Math.random() + 0.6;
    }

    preUpdate(t: number, delta: number) {
        super.preUpdate(t, delta)
        this.x += this.speed;
        if (this.x > <number>this.scene.game.config.width + 100) this.x = -100;
    }
}