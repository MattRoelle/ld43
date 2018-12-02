import helpers from "../helpers";
import { MainScene } from "../scenes/MainScene";

export class Goal extends Phaser.GameObjects.Container {
    speed: number;
    accent: Phaser.GameObjects.Sprite;
    sprite: Phaser.GameObjects.Sprite;

    constructor(scene: MainScene, x: number, y: number, public color: string) {
        super(scene, x, y);
        this.scene = <Phaser.Scene>scene;
        this.sprite = this.scene.add.sprite(0, 0, `${color}goal`);
        this.add(this.sprite);
        //this.accent = this.scene.add.sprite(0, 0, `${color}goal_accent`);
        //this.add(this.accent);
        this.scene.add.existing(this);
    }

    update() {
        super.update();
        //this.accent.angle += 1.5;
        this.sprite.angle += -2;

        /*
        const t = this.scene.time.now;
        const s = 1 + Math.sin(t*0.005)*0.15;
        this.scaleX = s;
        this.scaleY = s;
        */
    }

    explode() {
        const explSprite = this.scene.add.sprite(this.x, this.y, `${this.color}goalexpl`);
        explSprite.angle = Math.random()*360;
        explSprite.setScale(2, 2);
        explSprite.anims.play(`${this.color}goalexpl`);
    }
}