export class InputBtnManager {
    btnA: Phaser.Input.Keyboard.Key;
    btnD: Phaser.Input.Keyboard.Key;
    btnW: Phaser.Input.Keyboard.Key;
    btnS: Phaser.Input.Keyboard.Key;
    btnLeft: Phaser.Input.Keyboard.Key;
    btnRight: Phaser.Input.Keyboard.Key;
    btnUp: Phaser.Input.Keyboard.Key;
    btnDown: Phaser.Input.Keyboard.Key;

    constructor(public scene: Phaser.Scene, public multiplayer: boolean) {
        this.btnA = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.btnD = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.btnW = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.btnS = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);

        this.btnLeft = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.btnRight = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.btnUp = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.btnDown = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    }

    get plyr1Up(): boolean {
        if (this.multiplayer) {
            return this.btnW.isDown;
        } else {
            return this.btnUp.isDown || this.btnW.isDown;
        }
    }

    get plyr1Down(): boolean {
        if (this.multiplayer) {
            return this.btnS.isDown;
        } else {
            return this.btnDown.isDown || this.btnS.isDown;
        }
    }

    get plyr1Left(): boolean {
        if (this.multiplayer) {
            return this.btnA.isDown;
        } else {
            return this.btnLeft.isDown || this.btnA.isDown;
        }
    }

    get plyr1Right(): boolean {
        if (this.multiplayer) {
            return this.btnD.isDown;
        } else {
            return this.btnRight.isDown || this.btnD.isDown;
        }
    }

    get plyr2Up(): boolean {
        return this.btnUp.isDown;
    }

    get plyr2Down(): boolean {
        return this.btnDown.isDown;
    }

    get plyr2Left(): boolean {
        return this.btnLeft.isDown;
    }

    get plyr2Right(): boolean {
        return this.btnRight.isDown;
    }
}