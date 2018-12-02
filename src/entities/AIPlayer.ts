import { Player } from "./Player";
import helpers from "../helpers";

enum AIStates {
    Sleep = 0,
    BallChase = 1,
    Defense = 2
}

export class AIPlayer extends Player {
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
    up: Phaser.Input.Keyboard.Key;
    state: AIStates;
    changeTimeout: number;
    lastStateChangeT: number;
    framesWithLowVel: number = 0;

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
        const defGoalDx = this.x - this.myGoal.x;
        const defGoalDy = this.y - this.myGoal.y;

        if (Math.abs((<Matter.Body>this.body).velocity.x) < 1) this.framesWithLowVel++;
        else this.framesWithLowVel = 0;

        switch(this.state) {
            case AIStates.Sleep:
                if (!this.changeTimeout) {
                    this.changeTimeout = setTimeout(() => {
                        this.changeTimeout = null;
                        this.switchState(AIStates.BallChase);
                    }, 1000);
                }
                break;
            case AIStates.BallChase:

                if (ballDy > 50) this.moveDown();

                if (ballDistToTargetGoal > ballDistToMyGoal) {
                    this.switchState(AIStates.Defense);
                    return;
                }

                if (Math.abs(ballDx) < 10 && Math.abs(ballDy) < 10) {
                    this.move(1);
                } else {
                    if (ballDx > 0) this.move(1);
                    else this.move(-1);
                    if (ballDy < -15) this.jump();
                }

                if (this.framesWithLowVel > 20) this.jump();

                break;
            case AIStates.Defense:
                if (ballDistToTargetGoal < ballDistToMyGoal) {
                    this.switchState(AIStates.BallChase);
                    return;
                }
                if (defGoalDx > 0) this.move(-1);
                else this.move(1);
                if (defGoalDy < -15) this.jump();

                if (this.framesWithLowVel > 20) this.jump();
                break;
        }
    }

    switchState(newState: AIStates) {
        this.lastStateChangeT = this.scene.time.now;
        this.state = newState;
    }
}