import { Player } from "../entities/Player";
import helpers from "../helpers";
import { Cloud } from "../entities/Cloud";
import { UIButton } from "../entities/UIButton";
import { MainScene } from "./MainScene";
import { PostGameScene } from "./PostGameScene";

export class TitleScene extends Phaser.Scene {
    clouds: Cloud[]
    shineGfx: Phaser.GameObjects.Graphics;
    exited: boolean = false;

    constructor() {
        super({
            key: "TitleScene"
        });
    }

    preload() {
        this.load.image("ball", "/assets/export-ball.png");
        this.load.image("beam", "/assets/export-beam.png");
        this.load.image("bg", "/assets/export-bg.png");
        this.load.image("bgoal", "/assets/export-bgoal.png");
        this.load.image("bgoal_accent", "/assets/export-bgoal_accent.png");
        this.load.image("bplayer", "/assets/export-bplayer.png");
        this.load.image("cloud1", "/assets/export-cloud1.png");
        this.load.image("cloud2", "/assets/export-cloud2.png");
        this.load.image("ground", "/assets/export-ground.png");
        this.load.image("Layer", "/assets/export-Layer");
        this.load.image("lside", "/assets/export-lside.png");
        this.load.image("m1", "/assets/export-m1.png");
        this.load.image("m2", "/assets/export-m2.png");
        this.load.image("particle", "/assets/export-particle.png");
        this.load.image("rgoal", "/assets/export-rgoal.png");
        this.load.image("rgoal_accent", "/assets/export-rgoal_accent.png");
        this.load.image("rgoal", "/assets/export-rgoal-expl.png");
        this.load.image("rplayer", "/assets/export-rplayer.png");
        this.load.image("rside", "/assets/export-rside.png");
        this.load.image("sun", "/assets/export-sun.png");
        this.load.image("ui", "/assets/export-ui.png");
        this.load.image("title", "/assets/export-title.png");
        this.load.image("credits", "/assets/export-credits-text.png");
        this.load.image("button", "/assets/export-button.png");
        this.load.image("buttonactv", "/assets/export-buttonactv.png");
    }

    create() {
        const bg = this.add.sprite(0, 0, "bg").setOrigin(0, 0);


        const title = this.add.sprite(<number>this.game.config.width / 2, -230, "title");
        title.depth = 1000;
        this.tweens.add({
            targets: title,
            y: 60,
            duration: 2000,
            delay: 500,
            ease: "Bounce.easeOut"
        });

        this.clouds = [];
        for (let i = 0; i < 14; i++) {
            this.clouds.push(new Cloud(this, -100 + (Math.random() * 450), -10 + Math.random() * 30));
        }

        this.shineGfx = this.add.graphics({ fillStyle: { color: 0xFFFFFF } });
        this.shineGfx.y = 150;
        this.shineGfx.depth = 2000;
        this.shineGfx.mask = title.createBitmapMask();

        const credits = this.add.sprite(<number>this.game.config.width / 2, <number>this.game.config.height, "credits");
        credits.setOrigin(0.5, 1);

        helpers.fadeIn(this, () => { });

        this.exited = false;
        const player1Btn = new UIButton(this, 135, 130, {
            label: "1 Player",
            clickCb: () => {
                if (!this.exited) {
                    this.exited = true;
                    helpers.fadeOut(this, () => {
                    MainScene.rScore = 0;
                    MainScene.bScore = 0;
                        MainScene.nPlayers = 1;
                        this.scene.start("MainScene");
                    });
                }
            }
        });

        const player2Btn = new UIButton(this, 345, 130, {
            label: "2 Players",
            clickCb: () => {
                    if (!this.exited) {
                        this.exited = true;
                        helpers.fadeOut(this, () => {
                            MainScene.rScore = 0;
                            MainScene.bScore = 0;
                            MainScene.nPlayers = 2;
                            this.scene.start("MainScene");
                        });
                    }
                    }
    });

    const tutorialBtn = new UIButton(this, 135, 180, {
        label: "Tutorial",
        clickCb: () => {
            if (!this.exited) {
                this.exited = true;
                helpers.fadeOut(this, () => {
                    this.scene.start("TutorialScene");
                });
            }
        }
    });

    /*
    const historyBtn = new UIButton(this, 345, 180, {
        label: "History",
        clickCb: () => { console.log("clicked"); }
    });
    */
}

update() {
    this.shineGfx.clear();
    this.shineGfx.fillRect(0, 0, <number>this.game.config.width, 4);
    this.shineGfx.y -= 0.5;
    if (this.shineGfx.y < 20) this.shineGfx.y = 150;

    /*
    }
    */
}
}
