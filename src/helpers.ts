export default {
    lerp: (value1: number, value2: number, amount: number) => {
        amount = amount < 0 ? 0 : amount;
        amount = amount > 1 ? 1 : amount;
        return value1 + (value2 - value1) * amount;
    },
    dist: (g1: any, g2: any): number => {
        return Math.sqrt(Math.pow(g1.y - g2.y, 2) + Math.pow(g1.x - g2.x, 2));
    },
    clamp: (min: number, max: number, v: number): number => {
        return Math.min(Math.max(v, min), v);
    },
    fadeOut: (scene: Phaser.Scene, cb: Function): void => {
        const g = scene.add.graphics({
            fillStyle: {
                color: 0x000000
            }
        });
        g.fillRect(0, 0, <number>scene.game.config.width, <number>scene.game.config.height);
        g.alpha = 0;
        g.depth = 10000;
        scene.tweens.add({
            targets: g,
            alpha: 1,
            duration: 1000,
            onComplete: cb
        });
    },
    fadeIn: (scene: Phaser.Scene, cb: Function): void => {
        const g = scene.add.graphics({
            fillStyle: {
                color: 0x000000
            }
        });
        g.fillRect(0, 0, <number>scene.game.config.width, <number>scene.game.config.height);
        g.depth = 10000;
        scene.tweens.add({
            targets: g,
            alpha: 0,
            duration: 1000,
            onComplete: () => {
                cb();
                g.destroy();
            }
        });
    }
}