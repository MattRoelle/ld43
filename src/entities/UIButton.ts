export interface ButtonConfig {
    label: string;
    clickCb: Function;
}
export class UIButton extends Phaser.GameObjects.Sprite {
    label: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene, x: number, y: number, public config: ButtonConfig) {
        super(scene, x, y, "button", 0);
        this.scene.add.existing(this);
        this.setInteractive();

        this.label = this.scene.add.text(0, 0, this.config.label, {
            align: "center",
            fontSize: 20,
            color: "white"
        });
        this.label.setOrigin(0.5, 0.5);

        this.on("pointerover", () => {
            this.setTexture("buttonactv");
        });

        this.on("pointerout", () => {
            this.setTexture("button");
        });

        this.on("pointerdown", () => {
            this.config.clickCb();
        });
    }

    preUpdate(t: number, delta: number) {
        super.preUpdate(t, delta);
        this.label.x = this.x;
        this.label.y = this.y;
    }
}