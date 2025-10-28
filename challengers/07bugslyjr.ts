namespace hourOfAi.tower {
    export function createBugslyJr() {
        return new Challenger(
            {
                colorPalette: [9, 15, 8],
                legLength: 4,
                bodyRadius: 4,
                noseRadius: 2,
                fillColor: 13
            },
            "Bugsly Jr.",
            [
                tower.dialog("Finally! Now I just need to dodge these spikes and...", context => {
                    scene.setBackgroundColor(6)
                    const bg = sprites.create(imgs.bedroom, SpriteKind.DialogSprite);
                    bg.z = -4
                    bg.top = 0;

                    const tv = sprites.create(imgs.tv[0], SpriteKind.DialogSprite);
                    animation.runImageAnimation(tv, imgs.tv.slice(1), 200, true);
                    tv.left = 74;
                    tv.top = 30;

                    const bugslyJr = sprites.create(imgs.tiny_bugsly[0], SpriteKind.DialogSprite);
                    bugslyJr.x = tv.x + 1;
                    bugslyJr.top = tv.bottom + 8;

                    control.runInBackground(() => {
                        while (context.currentStep < 1) {
                            let sound = randint(0, 3)
                            if (sound == 0) {
                                music.play(music.createSoundEffect(WaveShape.Square, 324, 1027, 120, 0, 100, SoundExpressionEffect.None, InterpolationCurve.Linear), music.PlaybackMode.UntilDone)
                                context.pause(randint(180, 210))
                            } else if (sound == 1) {
                                music.play(music.createSoundEffect(WaveShape.Noise, 452, 1, 120, 0, 500, SoundExpressionEffect.None, InterpolationCurve.Linear), music.PlaybackMode.UntilDone)
                                context.pause(randint(180, 210))
                            } else {
                                music.play(music.createSoundEffect(WaveShape.Sawtooth, 2120, 452, 120, 0, 100, SoundExpressionEffect.None, InterpolationCurve.Linear), music.PlaybackMode.UntilDone)
                                context.pause(50)
                            }
                        }
                    })

                    control.runInBackground(() => {
                        let flip = false;
                        while (context.currentStep < 1) {
                            const height = randint(4, 6);
                            const duration = height * 400 / 10;
                            if (flip) {
                                animation.runMovementAnimation(bugslyJr, `q 2.5 -${height} 4 0`, duration)
                            }
                            else {
                                animation.runMovementAnimation(bugslyJr, `q -2.5 -${height} -4 0`, duration)
                            }
                            flip = !flip
                            context.pause(duration);
                        }

                        while (context.currentStep < 2) {
                            context.pause(10);
                        }
                        tv.destroy();
                        animation.runImageAnimation(bugslyJr, imgs.tiny_bugsly, 50, true);
                        animation.runMovementAnimation(bugslyJr, `q 0 -30 0 -20`, 500);

                        while (context.currentStep < 3) {
                            context.pause(10);
                        }

                        while (!(bugslyJr.flags & sprites.Flag.Destroyed)) {
                            tower.moveSprite(
                                bugslyJr,
                                tv.x - 16,
                                tv.y - 10,
                                200
                            );
                            context.pause(300);
                            tower.moveSprite(
                                bugslyJr,
                                tv.x + 14,
                                tv.y - 6,
                                200
                            );
                            context.pause(300);
                            tower.moveSprite(
                                bugslyJr,
                                tv.x - 1,
                                tv.y + 4,
                                200
                            );
                            context.pause(300);
                        }
                    })
                }),
                tower.dialog("Huh?", context => {
                    if (context.isFinished()) return;
                    music.play(music.createSoundEffect(WaveShape.Sine, 5000, 0, 255, 0, 2000, SoundExpressionEffect.Warble, InterpolationCurve.Linear), music.PlaybackMode.InBackground)
                    context.pause(2100)
                    music.play(music.createSoundEffect(WaveShape.Sine, 101, 1550, 255, 0, 120, SoundExpressionEffect.None, InterpolationCurve.Linear), music.PlaybackMode.InBackground)
                    context.pause(170)
                    music.play(music.createSoundEffect(WaveShape.Sine, 1, 1342, 255, 0, 120, SoundExpressionEffect.None, InterpolationCurve.Linear), music.PlaybackMode.InBackground)
                    context.pause(120)
                }),
                tower.dialog("Hey! What's the big idea!? You made me game over!"),
                tower.dialog("I've never made it to level 8 before! You're gonna pay!"),
                tower.dialog("You think my dad was tough? Wait till you see me!")
            ],
            "Zigzags across the arena.",
            [ tower.dialog("You'll always remember the Bugsly name!") ],
            [ tower.dialog("*sniffle* Waaah! Daddy...!") ],
            imgs.bugslyJr,
            hourOfAi.algorithms.zigzag
        );
    }
}