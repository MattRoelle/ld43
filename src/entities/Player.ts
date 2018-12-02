import helpers from "../helpers";
import { MainScene } from "../scenes/MainScene";
import { Goal } from "./Goal";
import { Ball } from "./Ball";
import { BlendModes } from "phaser";

export abstract class Player extends Phaser.Physics.Matter.Sprite {
    lastJumpT: number;
    canMove: boolean = true;
    dying: boolean = false;
    deathSprite: Phaser.GameObjects.Sprite;
    trailPoints: number[][] = [];
    trailGfx: Phaser.GameObjects.Graphics;

    constructor(scene: MainScene, x: number, y: number, public ball: Ball, public myGoal: Goal, public targetGoal: Goal) {
        super(scene.matter.world, x, y, "rplayer", 0);
        this.trailGfx = this.scene.add.graphics({
            lineStyle: {
                width: 2,
                alpha: 0.25,
                color: 0xFFFFFF
            }
        });
        this.trailGfx.blendMode = Phaser.BlendModes.ADD;
        this.scene = <Phaser.Scene>scene;
        this.scene.add.existing(this);
        this.setBody({
            type: "circle",
            radius: 12,
        }, {
            });
        this.displayOriginX = 17;
        this.displayOriginY = 17;
        this.lastJumpT = -100;
        this.setBounce(0.8);
        this.setFrictionAir(0);
        this.setFrictionStatic(0);
        this.init();
        this.mBody.mass = 0.5;
    }

    get mBody(): Matter.Body { return <Matter.Body>this.body; }

    preUpdate(t: number, delta: number) {
        super.preUpdate(t, delta);

        if (this.canMove) {
            this.control();
        } else {
            this.setVelocity(0, 0);
        }

        if (this.mBody.velocity.x > 7) this.setVelocityX(7);
        if (this.mBody.velocity.x < -7) this.setVelocityX(-7);

        if (this.dying) {
            this.deathSprite.angle = Math.sin(this.scene.time.now * 0.06) * 30;
        }

        if (this.dying) {
            this.trailPoints.push([ this.deathSprite.x, this.deathSprite.y ]);
        } else {
            this.trailPoints.push([ this.x, this.y ]);
        }
        while (this.trailPoints.length > 20) this.trailPoints.shift();

        const firstPoint = this.trailPoints[0];

        this.trailGfx.clear();

        this.trailGfx.beginPath();
        this.trailGfx.lineStyle(10, 0xFFFFFF, 0.2);
        this.trailGfx.moveTo(firstPoint[0], firstPoint[1]);
        for(let i = 1; i < this.trailPoints.length; i++) {
            const p = this.trailPoints[i];
            this.trailGfx.lineTo(p[0], p[1]); 
        }
        this.trailGfx.strokePath();

        this.trailGfx.beginPath();
        this.trailGfx.lineStyle(2, 0xFFFFFF, 0.2);
        this.trailGfx.moveTo(firstPoint[0], firstPoint[1]);
        for(let i = 1; i < this.trailPoints.length; i++) { const p = this.trailPoints[i]; this.trailGfx.lineTo(p[0], p[1] - 12); 
        }
        this.trailGfx.strokePath();

        this.trailGfx.beginPath();
        this.trailGfx.lineStyle(2, 0xFFFFFF, 0.2);
        this.trailGfx.moveTo(firstPoint[0], firstPoint[1]);
        for(let i = 1; i < this.trailPoints.length; i++) { const p = this.trailPoints[i]; this.trailGfx.lineTo(p[0], p[1] + 12); 
        }
        this.trailGfx.strokePath();
    }

    move(dx: number) {
        const v = this.mBody.velocity.x;
        let speed = 0.11;
        if (Math.abs(v) < 2) speed *= 1.4;
        this.setVelocityX(v + (dx * speed));
    }

    moveDown() {
        const v = this.mBody.velocity.y;
        this.setVelocityY(v + 0.2);
    }

    jump() {
        const t = this.scene.time.now;
        const dt = t - this.lastJumpT;
        if (dt < 500) return;
        this.lastJumpT = t;
        this.setVelocityY(-5);
    }

    die(cb: Function) {
        this.setVisible(false);
        const spr = this.scene.add.sprite(this.x, this.y, this.texture.key, 0);
        spr.angle = this.angle;

        this.deathSprite = spr;

        this.scene.tweens.add({
            targets: spr,
            x: <number>this.scene.game.config.width / 2,
            y: 130,
            angle: 720,
            ease: "Quad.easeInOut",
            duration: 1000,
            onComplete: () => {

                this.scene.tweens.add({
                    targets: spr,
                    y: 100,
                    scaleX: 1.5,
                    scaleY: 1.5,
                    ease: "Quad.easeInOut",
                    duration: 1000
                });

                setTimeout(() => {
                    const beamSprite = this.scene.add.sprite(this.deathSprite.x, 0, "beam").setOrigin(0.5, 0);

                    beamSprite.alpha = 0;
                    beamSprite.blendMode = Phaser.BlendModes.ADD;
                    beamSprite.depth = 100;
                    beamSprite.scaleX = 0;

                    this.scene.tweens.add({
                        targets: beamSprite,
                        alpha: 0.3,
                        scaleX: 1,
                        duration: 1250,
                        onComplete: () => {
                            this.deathSprite.setVisible(false);

                            const emitter0 = this.scene.add.particles("particle").createEmitter({
                                x: 0,
                                y: 0,
                                speed: { min: -500, max: 500 },
                                angle: { min: 0, max: 360 },
                                scale: { start: 1, end: 0.7 },
                                //blendMode: 'SCREEN',
                                //active: false,
                                lifespan: 2000,
                                gravityY: 400
                            });

                            emitter0.explode(100, this.deathSprite.x, this.deathSprite.y);

                            setTimeout(() => {
                                cb();
                            }, 500);
                        }
                    });

                }, 100);
            }
        });

        this.scene.tweens.add({
            targets: this.scene.cameras.main,
            //x: this.deathSprite.x,
            //y: this.deathSprite.y,
            zoom: 1.6,
            duration: 1000,
            delay: 250,
            ease: "Quad.easeInOut",
        });

        this.dying = true;
    }

    abstract init(): void;
    abstract control(): void;
}