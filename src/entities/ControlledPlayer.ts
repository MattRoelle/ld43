import { Player } from "./Player";

export class ControlledPlayer extends Player {
    init(): void {
    }

    control(): void {
        // game jam hacks!
        if (this.playerOrdinal == 1) {
            if (this.btns.plyr1Right) this.move(1);
            else if (this.btns.plyr1Left) this.move(-1);
            if (this.btns.plyr1Up) this.jump();
            if (this.btns.plyr1Down) this.moveDown();
        } else {
            if (this.btns.plyr2Right) this.move(1);
            else if (this.btns.plyr2Left) this.move(-1);
            if (this.btns.plyr2Up) this.jump();
            if (this.btns.plyr2Down) this.moveDown();
        }
    }
}