import { Player } from "../entities/Player";
import helpers from "../helpers";
import { Cloud } from "../entities/Cloud";
import { ControlledPlayer } from "../entities/ControlledPlayer";
import { AIPlayer } from "../entities/AIPlayer";
import { Goal } from "../entities/Goal";

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
    ball: Phaser.Physics.Matter.Sprite;
    state: GameStates = GameStates.Playing;
    debugText: Phaser.GameObjects.Text;

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
        this.load.image("lside", "/assets/export-lside.png");
        this.load.image("m1", "/assets/export-m1.png");
        this.load.image("m2", "/assets/export-m2.png");
        this.load.image("particle", "/assets/export-particle.png");
        this.load.image("rgoal", "/assets/export-rgoal.png");
        this.load.image("rgoal_accent", "/assets/export-rgoal_accent.png");
        this.load.image("rplayer", "/assets/export-rplayer.png");
        this.load.image("rside", "/assets/export-rside.png");
        this.load.image("sun", "/assets/export-sun.png");
    }

    create() {
        this.state = GameStates.Playing;
        const bg = this.add.sprite(0, 0, "bg").setOrigin(0, 0);

        const sun = this.add.sprite(<number>this.game.config.width/2, 0, "sun").setOrigin(0.5, 0.);

        this.clouds = [];
        for(let i = 0; i < 14; i++) {
            this.clouds.push(new Cloud(this, -100 + (Math.random()*450), Math.random()*40));
        }

        const m1 = this.add.sprite(0, 100, "m1", 0).setOrigin(0, 0);

        const lside = this.add.sprite(0, <number>this.game.config.height, "lside").setOrigin(0, 1);
        const rside = this.add.sprite(<number>this.game.config.width, <number>this.game.config.height, "rside").setOrigin(1, 1);
        const ground = this.add.sprite(0, <number>this.game.config.height, "ground").setOrigin(0, 1);

        const pGround = this.matter.add.rectangle(0, 280, 1000, 100, { isStatic: true });
        const pLside = this.matter.add.rectangle(0, 236, 110, 100, { isStatic: true, angle: 0.8 });
        const pRside = this.matter.add.rectangle(481, 236, 110, 100, { isStatic: true, angle: -0.8 });

        this.matter.world.setBounds();

        const ball = this.matter.add.sprite(<number>this.game.config.width/2, 100, "ball", 0);
        ball.setBody({
            type: "circle",
            radius: 8
        }, {});
        ball.setBounce(1);
        ball.setFrictionAir(0);
        ball.setFrictionStatic(0);
        console.log(ball);
        (<any>ball).body.mass = 0.01;

        this.ball = ball;

        this.rGoal = new Goal(this, 55, 120, "r");
        this.bGoal = new Goal(this, 425, 120, "b");

        this.rPlayer = new ControlledPlayer(this, 100, 100, ball, this.rGoal, this.bGoal);
        this.bPlayer = new AIPlayer(this, 380, 100, ball, this.bGoal, this.rGoal);

        if (DEBUG) {
            this.debugText = this.add.text(100, 100, "100", {
                fontSize: 20
            });
        }

        this.goal("r");
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

        //this.cameras.main.zoomTo(2, 1000, "Quad.easeOut");

        const deadPlayer = side == "r" ? this.rPlayer : this.bPlayer;
        const scoringPlayer = side == "r" ? this.bPlayer : this.rPlayer;

        deadPlayer.canMove = false;

        this.cameras.main.shake(300, 0.03);
        deadPlayer.die(() => {
            this.scene.start("MainScene");
        });
    }
}