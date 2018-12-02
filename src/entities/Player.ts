import helpers from "../helpers";
import { MainScene } from "../scenes/MainScene";
import { Goal } from "./Goal";

export abstract class Player extends Phaser.Physics.Matter.Sprite {
    lastJumpT: number;
    canMove: boolean = true;
    dying: boolean = false;
    deathSprite: Phaser.GameObjects.Sprite;

    constructor(scene: MainScene, x: number, y: number, public ball: Phaser.Physics.Matter.Sprite, public myGoal: Goal, public targetGoal: Goal) {
        super(scene.matter.world, x, y, "rplayer", 0);
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
        this.setBounce(0.9);
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
    }

    move(dx: number) {
        const v = this.mBody.velocity.x;
        let speed = 0.2;
        if (Math.abs(v) < 2) speed *= 1.5;
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
            duration: 1500,
            onComplete: () => {

                this.scene.tweens.add({
                    targets: spr,
                    y: 100,
                    ease: "Quad.easeInOut",
                    duration: 1500
                });

                setTimeout(() => {
                    const beamSprite = this.scene.add.sprite(this.deathSprite.x, 0, "beam").setOrigin(0.5, 0);

                    beamSprite.alpha = 0;
                    beamSprite.depth = 100;

                    beamSprite.blendMode = Phaser.BlendModes.OVERLAY;

                    this.scene.tweens.add({
                        targets: beamSprite,
                        alpha: 0.6,
                        duration: 1500,
                        onComplete: () => {
                            setTimeout(() => {
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
                                }, 1000);
                            }, 500);
                        }
                    });

                }, 500);
            }
        });

        this.scene.tweens.add({
            targets: this.scene.cameras.main,
            //x: this.deathSprite.x,
            //y: this.deathSprite.y,
            zoom: 1.6,
            duration: 1000,
            ease: "Quad.easeInOut",
        });

        this.dying = true;
    }

    abstract init(): void;
    abstract control(): void;
}