import { Player } from "./Player";

export class ControlledPlayer extends Player {
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
    up: Phaser.Input.Keyboard.Key;
    down: Phaser.Input.Keyboard.Key;

    init(): void {
        this.left = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.right = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.up = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.down = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    }

    control(): void {
        if (this.left.isDown) this.move(-1);
        else if (this.right.isDown) this.move(1);
        
        if (this.up.isDown) this.jump();
        if (this.down.isDown) this.moveDown();
    }
}