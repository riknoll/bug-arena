namespace hourOfAi.tower {
    export function createBumble() {
        return new Challenger(
            {
                colorPalette: [5, 15, 4],
                legLength: 6,
                bodyRadius: 6,
                noseRadius: 2,
                fillColor: 1
            },
            "Bumble",
            [
                tower.dialog("Bzzzz.... Bzzzz.... Bzzzz....", context => {
                    initBumbleBG(context);
                    const bumble = sprites.create(imgs.bumble_small, SpriteKind.DialogSprite);

                    bumble.x = 130;
                    bumble.y = 40;

                    const snotBubble = sprites.create(imgs.snot_bubble[0], SpriteKind.DialogSprite);
                    snotBubble.y = bumble.y + 3;
                    snotBubble.right = bumble.left - 1;

                    const bubble1 = [imgs.snot_bubble[3], imgs.snot_bubble[2], imgs.snot_bubble[1], imgs.snot_bubble[0]];
                    const bubble2 = [imgs.snot_bubble[0], imgs.snot_bubble[1], imgs.snot_bubble[2], imgs.snot_bubble[3]];

                    control.runInBackground(() => {
                        while (context.currentStep < 1) {
                            animation.runImageAnimation(snotBubble, bubble1, 100, false);
                            music.play(music.createSoundEffect(WaveShape.Sine, 675, 2520, 255, 0, 400, SoundExpressionEffect.Vibrato, InterpolationCurve.Linear), music.PlaybackMode.InBackground)
                            for (let i = 0; i < 5; i++) {
                                if (context.currentStep < 1) {
                                    if (i & 1) {
                                        const z = sprites.create(imgs.sleep_z, SpriteKind.DialogSprite);
                                        z.bottom = bumble.top;
                                        z.right = bumble.left;
                                        z.lifespan = 1000;
                                        z.vx = 20;
                                        z.vy = -20;
                                    }
                                    context.pause(100);
                                }
                            }

                            if (context.currentStep < 1) {
                                animation.runImageAnimation(snotBubble, bubble2, 100, false);
                                music.play(music.createSoundEffect(WaveShape.Sine, 2520, 675, 255, 0, 500, SoundExpressionEffect.Vibrato, InterpolationCurve.Linear), music.PlaybackMode.InBackground)
                            }

                            for (let i = 0; i < 10; i++) {
                                if (context.currentStep < 1) {
                                    if (i & 1) {
                                        const z = sprites.create(imgs.sleep_z, SpriteKind.DialogSprite);
                                        z.bottom = bumble.top;
                                        z.right = bumble.left;
                                        z.lifespan = 1000;
                                        z.vx = 20;
                                        z.vy = -20;
                                    }
                                    context.pause(100);
                                }
                            }
                        }
                        music.play(music.createSoundEffect(WaveShape.Square, 798, 2071, 255, 0, 100, SoundExpressionEffect.None, InterpolationCurve.Linear), music.PlaybackMode.InBackground)
                        snotBubble.destroy();
                        animation.runMovementAnimation(bumble, "q 0 -30 0 0", 200);
                        context.pauseUntilNextStep();
                        const startTime = game.runtime();
                        while (!context.isFinished()) {
                            bumble.y = 40 + Math.sin((game.runtime() - startTime) / 200) * 8;
                            context.pause(1);
                        }
                    })
                }, imgs.bumble_asleep),
                tower.dialog("Oh!"),
                tower.dialog("Hello! Did you need something?"),
                tower.dialog("What? A battle!?")
            ],
            "Bounces around the edge of the arena",
            [
                tower.dialog("What? That's all?", context => {
                    initBumbleBG(context);

                    const bumble = sprites.create(imgs.bumble_small, SpriteKind.DialogSprite);

                    bumble.x = 130;
                    bumble.y = 40;

                    const snotBubble = sprites.create(imgs.snot_bubble[0], SpriteKind.DialogSprite);
                    snotBubble.y = bumble.y + 3;
                    snotBubble.right = bumble.left - 1;
                    snotBubble.setFlag(SpriteFlag.Invisible, true);

                    control.runInBackground(() => {
                        context.pauseUntilNextStep();
                        context.pauseUntilNextStep();
                        music.play(music.createSoundEffect(WaveShape.Square, 798, 2071, 255, 0, 100, SoundExpressionEffect.None, InterpolationCurve.Linear), music.PlaybackMode.InBackground)
                        animation.runMovementAnimation(bumble, "q 0 -30 0 0", 200);
                        context.pause(200);
                    })
                }),
                tower.dialog("Well, I suppose I can get back to my nap-"),
                tower.dialog("Err.... I mean work! Yeah, work! Bzzzzzzz....")
            ],
            [
                tower.dialog("Bzzzzz!!!", context => {
                    initBumbleBG(context);
                    const bumble = sprites.create(imgs.bumble_small, SpriteKind.DialogSprite);

                    bumble.x = 130;
                    bumble.y = 40;

                    const snotBubble = sprites.create(imgs.snot_bubble[0], SpriteKind.DialogSprite);
                    snotBubble.y = bumble.y + 3;
                    snotBubble.right = bumble.left - 1;
                    snotBubble.setFlag(SpriteFlag.Invisible, true);

                    const bubble1 = [imgs.snot_bubble[3], imgs.snot_bubble[2], imgs.snot_bubble[1], imgs.snot_bubble[0]];
                    const bubble2 = [imgs.snot_bubble[0], imgs.snot_bubble[1], imgs.snot_bubble[2], imgs.snot_bubble[3]];

                    control.runInBackground(() => {
                        context.pause(200);
                        for (let i = 0; i < 3; i++) {
                            music.play(music.createSoundEffect(WaveShape.Square, 798, 2071, 255, 0, 100, SoundExpressionEffect.None, InterpolationCurve.Linear), music.PlaybackMode.InBackground)
                            animation.runMovementAnimation(bumble, "q 0 -30 0 0", 200);
                            context.pause(200);
                        }

                        context.pauseUntilNextStep();
                        const startTime = game.runtime();
                        while (context.currentStep < 3) {
                            bumble.y = 40 + Math.sin((game.runtime() - startTime) / 200) * 8;
                            context.pause(1);
                        }

                        tower.moveSprite(bumble, 130, 40, 20, true);
                        snotBubble.setFlag(SpriteFlag.Invisible, false);

                        while (!context.isFinished()) {
                            animation.runImageAnimation(snotBubble, bubble1, 100, false);
                            music.play(music.createSoundEffect(WaveShape.Sine, 675, 2520, 255, 0, 400, SoundExpressionEffect.Vibrato, InterpolationCurve.Linear), music.PlaybackMode.InBackground)
                            for (let i = 0; i < 5; i++) {
                                if (!context.isFinished()) {
                                    if (i & 1) {
                                        const z = sprites.create(imgs.sleep_z, SpriteKind.DialogSprite);
                                        z.bottom = bumble.top;
                                        z.right = bumble.left;
                                        z.lifespan = 1000;
                                        z.vx = 20;
                                        z.vy = -20;
                                    }
                                    context.pause(100);
                                }
                            }

                            if (!context.isFinished()) {
                                animation.runImageAnimation(snotBubble, bubble2, 100, false);
                                music.play(music.createSoundEffect(WaveShape.Sine, 2520, 675, 255, 0, 500, SoundExpressionEffect.Vibrato, InterpolationCurve.Linear), music.PlaybackMode.InBackground)
                            }

                            for (let i = 0; i < 10; i++) {
                                if (!context.isFinished()) {
                                    if (i & 1) {
                                        const z = sprites.create(imgs.sleep_z, SpriteKind.DialogSprite);
                                        z.bottom = bumble.top;
                                        z.right = bumble.left;
                                        z.lifespan = 1000;
                                        z.vx = 20;
                                        z.vy = -20;
                                    }
                                    context.pause(100);
                                }
                            }
                        }
                    })
                }),
                tower.dialog("Awww... Well, at least I can get back to work."),
                tower.dialog("A bee's job is never done!"),
                tower.dialog("Bzzzz.... Bzzzz.... Bzzzz....", undefined, imgs.bumble_asleep)
            ],
            imgs.bumble,
            hourOfAi.algorithms.curveAndBounce
        )
    }

    function initBumbleBG(context: tower.DialogContext) {
        const bg = sprites.create(imgs.honeycomb, SpriteKind.DialogSprite);
        bg.z = -4

        scene.setBackgroundColor(4);

        control.runInBackground(() => {
            const flippedLilBee = imgs.lil_bee.clone();
            flippedLilBee.flipX();
            while (!context.isFinished()) {
                const lilBee = sprites.create(imgs.lil_bee, SpriteKind.DialogSprite);

                lilBee.z = -5

                lilBee.lifespan = 1500;

                lilBee.y = randint(0, 80);

                const speed = randint(150, 200);
                if (Math.percentChance(50)) {
                    lilBee.x = -10;
                    tower.moveSprite(lilBee, 170, randint(0, 80), speed, false);
                }
                else {
                    lilBee.x = 170;
                    lilBee.setImage(flippedLilBee);
                    tower.moveSprite(lilBee, -10, randint(0, 80), speed, false);
                }

                context.pause(100)
            }
        })
    }
}