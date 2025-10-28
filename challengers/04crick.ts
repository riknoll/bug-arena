namespace hourOfAi.tower {
    export function createCrick() {
        return new Challenger(
            {
                colorPalette: [10, 15, 2],
                legLength: 5,
                bodyRadius: 5,
                noseRadius: 2,
                fillColor: 13
            },
            "Crick",
            [
                tower.dialog("Oh? Why hello there!", context => {
                    initCrickBg(context);

                    const crick = sprites.create(imgs.tiny_crick, SpriteKind.DialogSprite);
                    crick.z = 1;
                    crick.bottom = 52;
                    crick.x = 114;

                    control.runInBackground(() => {
                        let flip = false;
                        while (!(crick.flags & sprites.Flag.Destroyed)) {
                            const height = randint(15, 30);
                            const duration = height * 400 / 20;
                            if (flip) {
                                animation.runMovementAnimation(crick, `q 2.5 -${height} 5 0`, duration)
                            }
                            else {
                                animation.runMovementAnimation(crick, `q -2.5 -${height} -5 0`, duration)
                            }
                            const freq = randint(500, 600);
                            music.play(music.createSoundEffect(WaveShape.Square, freq, freq * freq / 100, 104, 0, randint(80, 100), SoundExpressionEffect.None, InterpolationCurve.Linear), music.PlaybackMode.InBackground)

                            context.pause(duration + randint(0, 500));

                            flip = !flip;
                        }
                    })
                }),
                tower.dialog("You've caught me just before tea!"),
                tower.dialog("Ah, trying to climb the tower, eh?"),
                tower.dialog("Well, I'm afraid tea will have to wait then."),
                tower.dialog("You see, I can't allow you to pass."),
                tower.dialog("Let's have a quick battle, shall we?")
            ],
            "Draws squiggly lines all over.",
            [
                tower.dialog("Jolly good! Better luck next time, eh?", context => {
                    initCrickBg(context);

                    const crick = sprites.create(imgs.tiny_crick, SpriteKind.DialogSprite);
                    crick.z = 1;
                    crick.bottom = 52;
                    crick.x = 114;
                })
            ],
            [
                tower.dialog("Well, I say! Smashing!", context => {
                    initCrickBg(context);

                    const crick = sprites.create(imgs.tiny_crick, SpriteKind.DialogSprite);
                    crick.z = 1;
                    crick.bottom = 52;
                    crick.x = 114;

                    control.runInBackground(() => {
                        const laugh = sprites.create(imgs.laughing, SpriteKind.DialogSprite);
                        const angles = [240, 270, 300].map(a => a * Math.PI / 180);
                        const radius = 12;

                        while (context.currentStep < 1) {
                            for (const angle of angles) {
                                laugh.x = 114 + Math.cos(angle) * radius;
                                laugh.y = 52 + Math.sin(angle) * radius;
                                context.pause(300);
                            }
                        }

                        laugh.destroy();
                    })

                    control.runInBackground(() => {
                        while (context.currentStep < 1) {
                            const height = randint(7, 15)
                            const duration = height * 400 / 20;
                            animation.runMovementAnimation(crick, `q 0 -${height} 0 0`, duration)

                            const freq = randint(500, 600);
                            music.play(music.createSoundEffect(WaveShape.Square, freq, freq * freq / 100, 104, 0, randint(80, 100), SoundExpressionEffect.None, InterpolationCurve.Linear), music.PlaybackMode.InBackground)

                            context.pause(duration + randint(0, 500));
                        }
                    })
                }),
                tower.dialog("Good show! Jolly good show!"),
                tower.dialog("You've certainly shown me!"),
                tower.dialog("Now, onwards! Show this tower what for!")
            ],
            imgs.crick,
            hourOfAi.algorithms.squiggles
        )
    }

    function initCrickBg(context: tower.DialogContext) {
        let bgRenderable: scene.Renderable;

        bgRenderable = scene.createRenderable(-4, () => {
            if (context.isFinished()) {
                bgRenderable.destroy();
                return;
            }

            screen.fill(6);
            screen.drawImage(imgs.apartment, 0, 0)
        })

        const steam = sprites.create(imgs.steam[0], SpriteKind.DialogSprite);
        steam.bottom = 47;
        steam.x = 104;

        animation.runImageAnimation(steam, imgs.steam, 150, true);

        const catClock = sprites.create(imgs.cat_clock[0], SpriteKind.DialogSprite);
        catClock.x = 78;
        catClock.y = 24;
        animation.runImageAnimation(catClock, imgs.cat_clock, 130, true);
    }
}