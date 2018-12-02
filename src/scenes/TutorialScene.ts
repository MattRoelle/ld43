import { Player } from "../entities/Player";
import helpers from "../helpers";
import { Cloud } from "../entities/Cloud";
import { UIButton } from "../entities/UIButton";
import { MainScene } from "./MainScene";
import { SoundHelper } from "../SoundHelper";

export class TutorialScene extends Phaser.Scene {
    exited: boolean = false;
    timeStarted: number;
    soundHelper: SoundHelper;

    constructor() {
        super({
            key: "TutorialScene"
        });
    }

    preload() {
        this.load.image("tutorial", "/assets/export-tutorial.png");
    }

    create() {
        this.soundHelper = new SoundHelper(this);
        this.soundHelper.playBgm();
        const tut = this.add.sprite(0, 0, "tutorial").setOrigin(0, 0);
        helpers.fadeIn(this, () => {});
        this.timeStarted = this.time.now;
        this.exited = false;

        const exitButton = new UIButton(this, 175, 130, {
            label: "Back",
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
