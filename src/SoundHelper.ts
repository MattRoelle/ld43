import { Sound } from "phaser";

export class SoundHelper {
    static theme: Phaser.Sound.BaseSound;
    static hit1: Phaser.Sound.BaseSound;
    static hit2: Sound.BaseSound;
    static goal: Sound.BaseSound;
    static goalexp: Sound.BaseSound;
    static stoplight: Sound.BaseSound;
    static muted: boolean = false;

    constructor(public scene: Phaser.Scene) {
        if (!SoundHelper.theme) {
            SoundHelper.theme = scene.sound.add("theme");
            SoundHelper.hit1 = scene.sound.add("hit1");
            SoundHelper.hit2 = scene.sound.add("hit2");
            SoundHelper.goal = scene.sound.add("goal");
            SoundHelper.goalexp = scene.sound.add("goalexp");
            SoundHelper.stoplight = scene.sound.add("stoplight");
        }

        const muteBtn = scene.add.sprite(2, 2, SoundHelper.muted ? "unmute" : "mute");
        muteBtn.setOrigin(0, 0);
        muteBtn.setInteractive();
        muteBtn.depth = 100000;
        muteBtn.on("pointerdown", () => {
            SoundHelper.muted = !SoundHelper.muted;
            scene.sound.mute = SoundHelper.muted;
            muteBtn.setTexture(SoundHelper.muted ? "unmute" : "mute")
        });

        scene.sound.mute = SoundHelper.muted;
    }

    playBgm() {
        if (!SoundHelper.theme.isPlaying) {
            SoundHelper.theme.play("", { loop: true, volume: 0.125 });
        }
    }

    pauseBgm() {
        SoundHelper.theme.pause();
    }

    playSfx(k: string) {
        switch(k) {
            case "hit": (Math.random() < 0.5 ? SoundHelper.hit1 : SoundHelper.hit2).play("", { volume: 0.6 }); break;
            case "goal": SoundHelper.goal.play("", { volume: 0.4 }); break;
            case "goalexp": SoundHelper.goalexp.play("", { volume: 0.2 }); break;
            case "stoplight": SoundHelper.stoplight.play("", { volume: 0.3 }); break;
        }
    }
}