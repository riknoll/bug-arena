namespace hourOfAi.tower {
    export function createHopper() {
        return new Challenger(
            {
                colorPalette: [7, 15, 8],
                legLength: 5,
                bodyRadius: 5,
                noseRadius: 2,
                fillColor: 8
            },
            "Hopper",
            [
                tower.dialog("You beat that old fool Crick, eh?", context => {
                    initHopperBg(context);

                    const flippedCatImages = imgs.cat.map(img => {
                        const copy = img.clone();
                        copy.flipX();
                        return copy;
                    });

                    const cat = sprites.create(flippedCatImages[0], SpriteKind.DialogSprite);
                    cat.left = 118;
                    cat.top = 8;

                    const lilHopper = sprites.create(imgs.tiny_hopper, SpriteKind.DialogSprite);

                    control.runInBackground(() => {
                        let flip = false;
                        while (context.currentStep < 3) {
                            const height = randint(15, 30);
                            const duration = height * 400 / 20;
                            if (flip) {
                                animation.runMovementAnimation(lilHopper, `q 2.5 -${height} 5 0`, duration)
                            }
                            else {
                                animation.runMovementAnimation(lilHopper, `q -2.5 -${height} -5 0`, duration)
                            }
                            const freq = randint(500, 600);
                            music.play(music.createSoundEffect(WaveShape.Square, freq, freq * freq / 100, 80, 0, randint(80, 100), SoundExpressionEffect.None, InterpolationCurve.Linear), music.PlaybackMode.InBackground)

                            context.pause(duration + randint(0, 500));

                            flip = !flip;
                        }

                        cat.setImage(flippedCatImages[1]);

                        music.play(music.createSoundEffect(WaveShape.Noise, 1, 500, 104, 0, 200, SoundExpressionEffect.None, InterpolationCurve.Linear), music.PlaybackMode.UntilDone)
                        music.play(music.createSoundEffect(WaveShape.Noise, 1, 800, 104, 0, 400, SoundExpressionEffect.None, InterpolationCurve.Linear), music.PlaybackMode.UntilDone)
                        music.play(music.createSoundEffect(WaveShape.Noise, 1, 2500, 104, 0, 2000, SoundExpressionEffect.None, InterpolationCurve.Linear), music.PlaybackMode.InBackground)
                        const bigHopper = sprites.create(imgs.hopper_small, SpriteKind.DialogSprite);
                        bigHopper.x = lilHopper.x;
                        bigHopper.y = lilHopper.y;
                        bigHopper.scale = 0;

                        const anim = new tower.Animation(2000, tower.easeOutCirc, t => bigHopper.scale = t);
                        anim.start();

                        anim.pauseUntilDone();
                        lilHopper.destroy();

                        flip = true;
                        let catJumped = false;

                        while (!(bigHopper.flags & sprites.Flag.Destroyed)) {
                            music.play(music.createSoundEffect(WaveShape.Square, 1, 534, 104, 0, 200, SoundExpressionEffect.None, InterpolationCurve.Linear), music.PlaybackMode.InBackground)
                            if (flip) {
                                animation.runMovementAnimation(bigHopper, `q 8 -50 16 0`, 800);
                            }
                            else {
                                animation.runMovementAnimation(bigHopper, `q -8 -50 -16 0`, 800);
                            }
                            context.pause(800);
                            music.thump.play();
                            scene.cameraShake(4, 500);

                            if (!catJumped) {
                                cat.setImage(flippedCatImages[2]);
                                context.pause(400);
                                animation.runMovementAnimation(cat, "q -15 -30 -30 -30", 500);
                                catJumped = true;
                            }
                            context.pause(1500);
                            flip = !flip;
                        }

                    })
                }),
                tower.dialog("Guess I better take this seriously..."),
                tower.dialog("Let's see how you handle my <wavy>ultimate form!</wavy>"),
                tower.dialog("<rainbow><wavy>TRANSFORM!", null, null, null, fancyText.bold_sans_7),
                tower.dialog("Bwahahaha! <shaky>Tremble</shaky> before my might!"),
                tower.dialog("To battle!")
            ],
            "Follows the opponent's bug.",
            [tower.dialog("Hahaha! Too easy!", context => initHopperBg(context))],
            [tower.dialog("Now I'm hopping mad!", context => initHopperBg(context))],
            imgs.hopper,
            hourOfAi.algorithms.followOpponent
        )
    }

    function initHopperBg(context: tower.DialogContext) {
        const bg = sprites.create(imgs.apartment2, SpriteKind.DialogSprite);
        bg.z = -4
        bg.top = 0;
        scene.setBackgroundColor(2);
    }
}