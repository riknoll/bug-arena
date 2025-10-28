namespace hourOfAi.tower {
    export function createLegsolas() {
        return new Challenger(
            {
                colorPalette: [7, 15, 8],
                legLength: 5,
                bodyRadius: 5,
                noseRadius: 2,
                fillColor: 10
            },
            "Legs-olas",
            [
                tower.dialog("Hail and well met!", introCutscene),
                tower.dialog("I am Legs-olas, defender of the Bug Kingdom!"),
                tower.dialog("You must be the challenger climbing the tower!"),
                tower.dialog("A noble quest! You have the bearing of a true knight!"),
                tower.dialog("But I'm afraid it is my duty to stop you here."),
                tower.dialog("I will best thee in honorable combat! Ready thy AI!"),
                tower.dialog("En garde!")
            ],
            "Moves in random diagonal lines.",
            [
                tower.dialog("Ha ha! Well fought!", playerLoseCutscene),
                tower.dialog("You show promise, but you have much to learn!"),
                tower.dialog("Now, train your AI harder and return!"),
                tower.dialog("I await our next encounter!")
            ],
            [
                tower.dialog("Ah! Your sword was true!", playerWinCutscene),
                tower.dialog("I shall train my AI harder for our next encounter!"),
                tower.dialog("Now, ascend! The top of the tower awaits you!")
            ],
            imgs.legsolas,
            // hourOfAi.algorithms.svgPathFollower("L 56.7 69.8 L 72.9 69.8 L 81 83.57 L 72.9 98.15 L 56.7 98.15 L 48.6 83.57 L 56.7 69.8 L 72.9 69.8 L 81 56.03 L 97.2 56.03 L 105.3 69.8 L 97.2 83.57 L 81 83.57 L 72.9 69.8 L 81 56.03 L 72.9 41.45 L 81 27.68 L 97.2 27.68 L 105.3 41.45 L 97.2 56.03 L 81 56.03 L 72.9 41.45 L 56.7 41.45 L 48.6 27.68 L 56.7 13.91 L 72.9 13.91 L 81 27.68 L 72.9 41.45 L 56.7 41.45 L 48.6 56.03 L 32.4 56.03 L 24.3 41.45 L 32.4 27.68 L 48.6 27.68 L 56.7 41.45 L 48.6 56.03 L 56.7 69.8 L 48.6 83.57 L 32.4 83.57 L 24.3 69.8 L 32.4 56.03 L 48.6 56.03 L 56.7 69.8")
            hourOfAi.algorithms.diagonals
        )
    }

    function initBG() {
        const bg = sprites.create(imgs.dungeon, SpriteKind.DialogSprite);
        bg.z = -4
        bg.top = 0;
    }

    function introCutscene(context: DialogContext) {
        initBG();

        const legsolas = sprites.create(imgs.legsolas_small[0], SpriteKind.DialogSprite);
        legsolas.x = 130;
        legsolas.y = 30

        control.runInBackground(() => {
            while (!(legsolas.flags & sprites.Flag.Destroyed)) {
                animation.runImageAnimation(legsolas, imgs.legsolas_small, 50, true);
                tower.moveSprite(
                    legsolas,
                    130 + randint(-20, 20),
                    30 + randint(-20, 20),
                    50
                )
                animation.stopAnimation(animation.AnimationTypes.ImageAnimation, legsolas);
                legsolas.setImage(imgs.legsolas_small[0]);
                context.pause(400 + Math.random() * 800);
            }
        })
    }

    function playerLoseCutscene(context: DialogContext) {
        initBG();

        const legsolas = sprites.create(imgs.legsolas_small[0], SpriteKind.DialogSprite);
        legsolas.x = 130;
        legsolas.y = 30;

        control.runInBackground(() => {
            context.pause(500);

            const laugh = sprites.create(imgs.laughing, SpriteKind.DialogSprite);
            const angles = [240, 270, 300].map(a => a * Math.PI / 180);
            const radius = 12;
            for (const angle of angles) {
                laugh.x = legsolas.x + Math.cos(angle) * radius;
                laugh.y = legsolas.y + Math.sin(angle) * radius;
                context.pause(300);
            }

            laugh.destroy();
            animation.runImageAnimation(legsolas, imgs.legsolas_small, 200, true);

            context.pauseUntilNextStep();
            context.pauseUntilNextStep();

            while (!(legsolas.flags & sprites.Flag.Destroyed)) {
                animation.runImageAnimation(legsolas, imgs.legsolas_small, 50, true);
                tower.moveSprite(
                    legsolas,
                    130 + randint(-20, 20),
                    30 + randint(-20, 20),
                    50
                )
                animation.stopAnimation(animation.AnimationTypes.ImageAnimation, legsolas);
                legsolas.setImage(imgs.legsolas_small[0]);
                context.pause(400 + Math.random() * 800);
            }
        });
    }

    function playerWinCutscene(context: DialogContext) {
        initBG();

        const legsolas = sprites.create(imgs.legsolas_small[0], SpriteKind.DialogSprite);
        legsolas.x = 125;
        legsolas.y = 15

        animation.runImageAnimation(legsolas, imgs.legsolas_small, 200, true);
    }
}