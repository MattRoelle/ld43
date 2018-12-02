import { Player } from "../entities/Player";
import helpers from "../helpers";
import { Cloud } from "../entities/Cloud";
import { UIButton } from "../entities/UIButton";
import { MainScene } from "./MainScene";
import { SoundHelper } from "../SoundHelper";

export class PostGameScene extends Phaser.Scene {
    exited: boolean = false;
    timeStarted: number;

    static whoWon: string;
    soundHelper: any;

    constructor() {
        super({
            key: "PostGameScene"
        });
    }

    preload() {
        this.load.image("brickbg", "/assets/export-brickbg.png");
        this.load.image("postgame", "/assets/export-postgame.png");
        this.load.image("redwin", "/assets/export-redwin.png");
        this.load.image("bluewin", "/assets/export-bluewin.png");
    }

    create() {
        this.soundHelper = new SoundHelper(this);
        this.soundHelper.playBgm();

        const bg = this.add.sprite(0, 0, "brickbg").setOrigin(0, 0);
        const postgame = this.add.sprite(<number>this.game.config.width/2, 10, "postgame").setOrigin(0.5, 0);

        if (PostGameScene.whoWon == "r") {
            const wspr = this.add.sprite(<number>this.game.config.width/2, 50, "redwin").setOrigin(0.5, 0);
        } else {
            const wspr = this.add.sprite(<number>this.game.config.width/2, 50, "bluewin").setOrigin(0.5, 0);
        }

        helpers.fadeIn(this, () => {});
        this.timeStarted = this.time.now;
        this.exited = false;

        const exitButton = new UIButton(this, <number>this.game.config.width/2, 200, {
            label: "Title",
            clickCb: () => {
                if (!this.exited) {
                    this.exited = true;
                    helpers.fadeOut(this, () => {
                        this.scene.start("TitleScene");
                    });
                }
            }
        });
    }
}
