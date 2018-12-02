import { Player } from "./Player";
import helpers from "../helpers";

enum AIStates {
    Sleep = 0,
    BallChase = 1,
}

export class AIPlayer extends Player {
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
    up: Phaser.Input.Keyboard.Key;
    state: AIStates;
    changeTimeout: number;
    lastStateChangeT: number;

    init(): void {
        this.setTexture("bplayer");
        this.displayOriginX = 13;
        this.left = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.right = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.up = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.state = AIStates.Sleep;
    }

    control(): void {
        const t = this.scene.time.now;
        const dt = t - this.lastStateChangeT;
        const ballDx = this.ball.x - this.x;
        const ballDy = this.ball.y - this.y;
        const ballTheta = Math.atan2(ballDy, ballDx);
        const ballDistToMyGoal = helpers.dist(this.ball, this.myGoal);
        const ballDistToTargetGoal = helpers.dist(this.ball, this.targetGoal);

        const targetGoalDx = this.ball.x - this.targetGoal.x;

        switch(this.state) {
            case AIStates.Sleep:
                if (!this.changeTimeout) {
                    this.changeTimeout = setTimeout(() => {
                        this.changeTimeout = null;
                        this.state = AIStates.BallChase;
                    }, 1500);
                }
                break;
            case AIStates.BallChase:
                if (targetGoalDx < 0 && ballDx < 0)  {
                    this.move(-1);
                } else if (targetGoalDx > 0 && ballDx > 0) {
                    this.move(1);
                } else {
                    if (ballDx < 0) this.move(-1);
                    else this.move(1);
                }

                if (ballDy < -10) this.jump();

                if (dt > 1500) this.switchState(AIStates.Sleep);
                break;
        }
    }

    switchState(newState: AIStates) {
        this.lastStateChangeT = this.scene.time.now;
        this.state = newState;
    }
}