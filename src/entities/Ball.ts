import helpers from "../helpers";
import { MainScene } from "../scenes/MainScene";

export class Ball extends Phaser.Physics.Matter.Sprite {
    trailPoints: number[][] = [];
    trailGfx: Phaser.GameObjects.Graphics;

    constructor(scene: MainScene, x: number, y: number) {
        super(scene.matter.world, x, y, "ball", 0);
        this.trailGfx = this.scene.add.graphics({
            lineStyle: {
                width: 2,
                alpha: 0.25,
                color: 0xFFFFFF
            }
        });
        this.scene = <Phaser.Scene>scene;
        this.scene.add.existing(this);
        this.setBody({
            type: "circle",
            radius: 8
        }, {});
        this.setBounce(1);
        this.setFrictionAir(0);
        this.setFrictionStatic(0);
        (<any>this).body.mass = 0.01;
    }

    preUpdate(t: number, delta: number) {
        super.preUpdate(t, delta)

        this.trailPoints.push([ this.x, this.y ]);
        while (this.trailPoints.length > 20) this.trailPoints.shift();

        const firstPoint = this.trailPoints[0];

        this.trailGfx.clear();

        this.trailGfx.beginPath();
        this.trailGfx.lineStyle(5, 0xFFFFFF, 0.2);
        this.trailGfx.moveTo(firstPoint[0], firstPoint[1]);
        for(let i = 1; i < this.trailPoints.length; i++) { const p = this.trailPoints[i]; this.trailGfx.lineTo(p[0], p[1]); 
        }
        this.trailGfx.strokePath();
    }
}