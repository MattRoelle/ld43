import ScaleManager from "./scaleManager";
import { MainScene } from "./scenes/MainScene";

export class LD43 {
    private _game: Phaser.Game;

    constructor() {
        this._game = new Phaser.Game({
            width: 480,
            height: 270,
            type: Phaser.AUTO,
            zoom: 1,
            render: {
                pixelArt: true,
                antialias: false,
                roundPixels: true,
                transparent: false,
            },
            scene: MainScene,
            physics: {
                default: "matter",
                matter: {
                    gravity: { x: 0, y: 0.65 },
                    //debug: true
                }
            },
            callbacks: {
                postBoot: () => {
                    new ScaleManager(this._game.canvas, !this._game.device.os.desktop);
                }
            }
        });
    }
}