import { Player } from "../entities/Player";
import helpers from "../helpers";
import { Cloud } from "../entities/Cloud";
import { ControlledPlayer } from "../entities/ControlledPlayer";
import { AIPlayer } from "../entities/AIPlayer";
import { Goal } from "../entities/Goal";
import { Ball } from "../entities/Ball";
import { InputBtnManager } from "../InputBtnManager";

const DEBUG = false;
const SCORE_DIST = 17;

enum GameStates {
    Playing = 1,
    Ended = 2
}

export class MainScene extends Phaser.Scene {
    clouds: Cloud[]
    rGoal: Goal;
    bGoal: Goal;
    rPlayer: Player;
    bPlayer: Player;
    state: GameStates = GameStates.Playing;
    debugText: Phaser.GameObjects.Text;

    static nPlayers: number = 1;
    static rScore: number = 0;
    static bScore: number = 0;
    ball: Ball;

    constructor() {
        super({
            key: "MainScene"
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
        this.load.image("redscore", "/assets/export-redscore.png");
        this.load.image("bluescore", "/assets/export-bluescore.png");

        this.load.spritesheet("bgoalexpl", "/assets/export-bgoalexpl.png", {
            frameWidth: 70,
            frameHeight: 70,
            startFrame: 0,
            endFrame: 8,
        });

        this.load.spritesheet("rgoalexpl", "/assets/export-rgoalexpl.png", {
            frameWidth: 70,
            frameHeight: 70,
            startFrame: 0,
            endFrame: 8,
        });

        this.load.spritesheet("stoplight", "/assets/stoplight.png", {
            frameWidth: 111,
            frameHeight: 205,
            startFrame: 0,
            endFrame: 15,
        });
    }

    create() {
        this.anims.create({
            key: "bgoalexpl",
            frameRate: 15,
            repeat: 0,
            frames: this.anims.generateFrameNumbers("bgoalexpl", { start: 0, end: 8 })
        });

        this.anims.create({
            key: "rgoalexpl",
            frameRate: 15,
            repeat: 0,
            frames: this.anims.generateFrameNumbers("rgoalexpl", { start: 0, end: 8 })
        });

        this.anims.create({
            key: "stoplight",
            frameRate: 10,
            repeat: 0,
            frames: this.anims.generateFrameNumbers("stoplight", { start: 0, end: 15 })
        });

        this.state = GameStates.Playing;
        const bg = this.add.sprite(0, 0, "bg").setOrigin(0, 0);

        this.clouds = [];
        for(let i = 0; i < 14; i++) {
            this.clouds.push(new Cloud(this, -100 + (Math.random()*450), -10 + Math.random()*30));
        }

        const lside = this.add.sprite(0, <number>this.game.config.height, "lside").setOrigin(0, 1);
        const rside = this.add.sprite(<number>this.game.config.width, <number>this.game.config.height, "rside").setOrigin(1, 1);
        const ground = this.add.sprite(0, <number>this.game.config.height, "ground").setOrigin(0, 1);

        const pGround = this.matter.add.rectangle(0, 280, 1000, 100, { isStatic: true });
        const pLside = this.matter.add.rectangle(0, 236, 110, 100, { isStatic: true, angle: 0.8 });
        const pRside = this.matter.add.rectangle(481, 236, 110, 100, { isStatic: true, angle: -0.8 });

        this.matter.world.setBounds();

        this.ball = new Ball(this, <number>this.game.config.width/2, 140);

        this.rGoal = new Goal(this, 51, 131, "r");
        this.bGoal = new Goal(this, <number>this.game.config.width - 50, 131, "b");


        if (MainScene.nPlayers == 1) {
            const inputMngr = new InputBtnManager(this, false);
            this.rPlayer = new ControlledPlayer(this, 100, 140, this.ball, this.rGoal, this.bGoal, "r", inputMngr, 1);
            this.bPlayer = new AIPlayer(this, 380, 140, this.ball, this.bGoal, this.rGoal, "b", inputMngr, 2);
        } else {
            const inputMngr = new InputBtnManager(this, true);
            this.rPlayer = new ControlledPlayer(this, 100, 140, this.ball, this.rGoal, this.bGoal, "r", inputMngr, 1);
            this.bPlayer = new ControlledPlayer(this, 380, 140, this.ball, this.bGoal, this.rGoal, "b", inputMngr, 2);
        }

        if (DEBUG) {
            this.debugText = this.add.text(100, 100, "100", {
                fontSize: 20
            });
        }

        const uiBg = this.add.sprite(0, 0, "ui").setOrigin(0, 0);

        const lScoreText = this.add.text(43, 240, MainScene.rScore.toString(), {
            fontSize: 18,
            align: "center"
        });

        const rScoreText = this.add.text(<number>this.game.config.width - 53, 240, MainScene.bScore.toString(), {
            fontSize: 18,
            align: "center"
        });

        this.rPlayer.canMove = false;
        this.bPlayer.canMove = false;
        this.rPlayer.setStatic(true);
        this.bPlayer.setStatic(true);
        this.ball.setStatic(true);
        helpers.fadeIn(this, () => {
            const stoplight = this.add.sprite(<number>this.game.config.width/2, -300, "stoplight", 0);
            stoplight.setOrigin(0.5, 0);

            this.tweens.add({
                targets: stoplight,
                y: 0,
                duration: 800,
                ease: "Quad.easeOut",
                onComplete: () => {
                    stoplight.anims.play("stoplight");
                    setTimeout(() => {
                        this.tweens.add({
                            targets: stoplight,
                            y: -300,
                            duration: 1000,
                            ease: "Quad.easeOut"
                        });
                        this.rPlayer.canMove = true;
                        this.bPlayer.canMove = true;
                        this.rPlayer.setStatic(false);
                        this.bPlayer.setStatic(false);
                        this.ball.setStatic(false);
                    }, 1800);
                }
            });
        });

        //this.goal("r");
    }

    update() {
        this.rGoal.update();
        this.bGoal.update();

        const bGoalDist = helpers.dist(this.bGoal, this.ball);

        if (DEBUG) {
            this.debugText.text = bGoalDist.toString();
        }

        if (helpers.dist(this.rGoal, this.ball) < SCORE_DIST) this.goal("r");
        if (bGoalDist < SCORE_DIST) this.goal("b");
    }

    goal(side: string) {
        if (this.state == GameStates.Ended) return;
        this.state = GameStates.Ended;

        const deadPlayer = side == "r" ? this.rPlayer : this.bPlayer;
        const scoringPlayer = side == "r" ? this.bPlayer : this.rPlayer;

        this.ball.setVisible(false);
        this.ball.trailGfx.setVisible(false);

        let score: Phaser.GameObjects.Sprite;
        if (side == "r") {
            this.rGoal.explode();
            MainScene.bScore++;
            score = this.add.sprite(<number>this.game.config.width/2, <number>this.game.config.height/2, "bluescore", 0);
        }
        if (side == "b") {
            this.bGoal.explode();
            MainScene.rScore++;
            score = this.add.sprite(<number>this.game.config.width/2, <number>this.game.config.height/2, "redscore", 0);
        }

        score.scaleX = 0;
        score.scaleY = 0;
        score.angle = 300;

        this.tweens.add({
            targets: score,
            angle: 0,
            scaleX: 0,
            scaleY: 0,
            ease: "Quad.easeOut",
            duration: 500,
            onComplete: () => {
                setTimeout(() => {
                    score.destroy();
                }, 500);
            }
        })

        deadPlayer.canMove = false;

        this.cameras.main.shake(300, 0.03);
        deadPlayer.die(() => {
            helpers.fadeOut(this, () => {
                this.scene.start("MainScene");
            });
        });
    }
}