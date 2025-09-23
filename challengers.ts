namespace hourOfAi {
    export class Challenger {
        font: fancyText.BaseFont;
        constructor(
            public design: BugDesign,
            public name: string,
            public dialog: tower.DialogPart[],
            public description: string,
            public winText: tower.DialogPart[],
            public loseText: tower.DialogPart[],
            public portrait: Image,
            public algorithm: (agent: Agent) => void,
            font?: fancyText.BaseFont
        ) {
            this.font = font || fancyText.bold_sans_7;
        }
    }

    const lightColorRamp = img`
        . 1 2 3 4 5 6 7 8 9 a b c d e f
        . b 3 4 5 1 7 5 9 b 2 b b c d e
    `;

    let lightColorBuffer: Buffer;

    function initLightColorBuffer() {
        if (lightColorBuffer) return;
        const shadeLevels = 4;
        lightColorBuffer = control.createBuffer(16 * (shadeLevels + 1));

        for (let x = 0; x < 16; x++) {
            lightColorBuffer[lightColorBuffer.length  - 16 + x] = x;
        }

        for (let i = shadeLevels - 1; i > 0; i--) {
            for (let x = 0; x < 16; x++) {
                const index = x + (i << 4);
                lightColorBuffer[index] = lightColorRamp.getPixel(lightColorBuffer[index + 16], 1);
            }
        }
    }

    let shadeImage: Image;


    export let challengers: Challenger[];

    export function initChallengers() {
        if (challengers) return;
        challengers = [
        new Challenger(
            {
                colorPalette: [4, 15, 2],
                legLength: 5,
                bodyRadius: 5,
                noseRadius: 2
            },
            "Stinky",
            [
                tower.dialog("Let's see... Let's see... Need trash... Need trash...", context => {
                    const bg = sprites.create(imgs.alleyway, SpriteKind.DialogSprite);
                    bg.top = 0;
                    bg.z = -4
                    scene.setBackgroundColor(14);


                    const dumpster = sprites.create(imgs.dumpster, SpriteKind.DialogSprite);
                    dumpster.bottom = 70;
                    dumpster.left = 17

                    dumpster.z = -3;

                    const cat = sprites.create(imgs.cat[0], SpriteKind.DialogSprite);

                    cat.x = 104;
                    cat.y = 30;

                    const wall = sprites.create(imgs.wall, SpriteKind.DialogSprite);
                    wall.top = 0;
                    wall.right = 160;
                    wall.z = 2;

                    const stinky = sprites.create(imgs.tiny_stinky[0], SpriteKind.DialogSprite);
                    animation.runImageAnimation(stinky, imgs.tiny_stinky, 50, true);
                    stinky.z = 3

                    const exclamation_point = sprites.create(imgs.exclamation_point, SpriteKind.DialogSprite);
                    exclamation_point.setFlag(SpriteFlag.Invisible, true);
                    exclamation_point.z = 4;

                    control.runInBackground(() => {
                        while (context.currentStep < 1) {
                            tower.moveSprite(stinky, dumpster.x + 50 + randint(0, 30), dumpster.y + randint(-10, 10), 100)
                            pause(100)
                        }

                        exclamation_point.setFlag(SpriteFlag.Invisible, false);
                        exclamation_point.x = stinky.x;
                        exclamation_point.bottom = stinky.top - 2;

                        animation.runMovementAnimation(exclamation_point, "v -2 v 2", 100);
                        pause(500);
                        exclamation_point.setFlag(SpriteFlag.Invisible, true);
                        tower.moveSprite(stinky, dumpster.x + 8, dumpster.top - 5, 100);

                         pauseUntil(() => context.currentStep === 2);

                        animation.runMovementAnimation(stinky, "q 0 -20 0 16", 500);
                        pause(500);
                        stinky.setFlag(SpriteFlag.Invisible, true);

                        cat.setImage(imgs.cat[1]);
                        while (context.currentStep < 3) {
                            animation.runMovementAnimation(dumpster, "v 1 h 1 v -1 h -1", 100, true);
                            pause(200);
                            animation.stopAnimation(animation.AnimationTypes.MovementAnimation, dumpster);
                            dumpster.bottom = 70;
                            dumpster.left = 17;
                            pause(1000);
                        }

                        animation.runMovementAnimation(dumpster, "v 1 h 1 v -1 h -1", 100, true);
                        stinky.setFlag(SpriteFlag.Invisible, false);
                        animation.runMovementAnimation(stinky, "q 0 -40 0 -16", 500);
                        cat.setImage(imgs.cat[2]);
                        pause(200);
                        animation.stopAnimation(animation.AnimationTypes.MovementAnimation, dumpster);
                        pause(300);
                        animation.runMovementAnimation(cat, "q 30 -40 60 -10", 1300)
                        dumpster.bottom = 70;
                        dumpster.left = 17;
                        pause(500)

                        pauseUntil(() => context.currentStep === 4);
                        tower.moveSprite(stinky, 80, 60, 100);

                        exclamation_point.setFlag(SpriteFlag.Invisible, false);
                        exclamation_point.x = stinky.x;
                        exclamation_point.bottom = stinky.top - 2;

                        animation.runMovementAnimation(exclamation_point, "v -2 v 2", 100);
                        pause(1200);
                        exclamation_point.setFlag(SpriteFlag.Invisible, true);

                        pauseUntil((() => context.currentStep >= 5));

                        const startTime = game.runtime();
                        while (!context.isFinished()) {
                            stinky.y = 60 + Math.sin((game.runtime() - startTime) / 200) * 8;
                            pause(1);
                        }

                    });
                }),
                tower.dialog("Ooohh! <wavy><slow>Oooooohh!</slow></wavy> Maybe in here!?"),
                tower.dialog("*rummage* *rummage* *rummage*"),
                tower.dialog("Boring! Boring! Don't want pizza crusts and coffee grounds!"),
                tower.dialog("Oh, wait... What's this? Are you climbing the tower?"),
                tower.dialog("That means you have to fight me, right? <wavy><slow>Right...?"),
                tower.dialog("If I win, give me all your trash! Give me!"),
                tower.dialog("No choice! Have to! Gotta win! Gotta win!")
            ],
            "Randomly wanders around the arena",
            [
                tower.dialog("Bwahaha! Smell ya later! Later!", context => {
                    const bg = sprites.create(imgs.alleyway, SpriteKind.DialogSprite);
                    bg.top = 0;
                    bg.z = -4
                    scene.setBackgroundColor(14);


                    const dumpster = sprites.create(imgs.dumpster, SpriteKind.DialogSprite);
                    dumpster.bottom = 70;
                    dumpster.left = 17

                    dumpster.z = -3;

                    const stinky = sprites.create(imgs.tiny_stinky[0], SpriteKind.DialogSprite);
                    animation.runImageAnimation(stinky, imgs.tiny_stinky, 50, true);
                    stinky.z = 3
                    stinky.y = 60;

                    control.runInBackground(() => {
                        const startTime = game.runtime();
                        while (!context.isFinished()) {
                            stinky.y = 60 + Math.sin((game.runtime() - startTime) / 200) * 8;
                            pause(1);
                        }
                    })
                }),
                tower.dialog("Precious trash! All mine! <wavy>All mine!<wavy>")
            ],
            [ tower.dialog("Awwwww... Fine! Fine! I didn't want your trash anyway!", context => {
                    const bg = sprites.create(imgs.alleyway, SpriteKind.DialogSprite);
                    bg.top = 0;
                    bg.z = -4
                    scene.setBackgroundColor(14);

                    const dumpster = sprites.create(imgs.dumpster, SpriteKind.DialogSprite);
                    dumpster.bottom = 70;
                    dumpster.left = 17

                    dumpster.z = -3;

                    const stinky = sprites.create(imgs.tiny_stinky[0], SpriteKind.DialogSprite);
                    animation.runImageAnimation(stinky, imgs.tiny_stinky, 50, true);
                    stinky.z = 3
                    stinky.y = 60;

                    control.runInBackground(() => {
                        const startTime = game.runtime();
                        while (!context.isFinished()) {
                            stinky.y = 60 + Math.sin((game.runtime() - startTime) / 200) * 8;
                            pause(1);
                        }
                    })
            }) ],
            imgs.stinky,
            hourOfAi.algorithms.randomWalk
        ),
        new Challenger(
            {
                colorPalette: [4, 15, 2],
                legLength: 5,
                bodyRadius: 5,
                noseRadius: 2
            },
            "Bugsly",
            [
                tower.dialog("That's right! Give'm the ol' one-two!", context => {
                    const bugsly = sprites.create(imgs.tiny_bugsly[0], SpriteKind.DialogSprite);
                    bugsly.z = 1;

                    const bg = scene.createRenderable(-4, () => {
                        if (bugsly.flags & sprites.Flag.Destroyed) {
                            return;
                        }

                        screen.fill(6);
                        screen.drawImage(imgs.gym, 0, 0)
                        screen.fillRect(
                            118,
                            0,
                            2,
                            20,
                            15
                        );
                        screen.fillRect(
                            119,
                            20,
                            4,
                            1,
                            15
                        )
                    });

                    const punchingBag = sprites.create(imgs.punching_bag[0], SpriteKind.DialogSprite);
                    punchingBag.x = 120;
                    punchingBag.top = 20;

                    const cx = punchingBag.right - 10;
                    const cy = punchingBag.y  + 5;

                    bugsly.bottom = cy;
                    bugsly.right = cx;
                    animation.runImageAnimation(bugsly, imgs.tiny_bugsly, 50, true);

                    const speed = 100;

                    control.runInBackground(() => {
                        while (!(punchingBag.flags & sprites.Flag.Destroyed)) {
                            for (let i = 0; i < 3; i++) {
                                tower.moveSprite(
                                    bugsly,
                                    cx + (Math.random() - 0.5) * 10,
                                    cy + (Math.random() - 0.5) * 10,
                                    speed
                                );
                                pause(500);
                            }
                            tower.moveSprite(
                                bugsly,
                                cx,
                                cy,
                                speed
                            );
                            pause(1000);
                            tower.moveSprite(
                                bugsly,
                                cx - 10,
                                cy,
                                300
                            );

                            animation.runImageAnimation(punchingBag, imgs.punching_bag, 80, false);

                            tower.moveSprite(
                                bugsly,
                                cx,
                                cy,
                                300
                            );
                        }
                        bg.destroy();
                    })
                }),
                tower.dialog("Ohohoh! What's this?"),
                tower.dialog("Oh, I'm just giving my AI some much needed training!"),
                tower.dialog("But maybe you'll make a better sparring partner!"),
                tower.dialog("C'mon young'n, let's see what you've got!")
            ],
            "Spirals from the outside in.",
            [ tower.dialog("That's how the pros do it!") ],
            [ tower.dialog("What....? Well you got me fair and square.") ],
            imgs.bugsly,
            hourOfAi.algorithms.spiral
        ),
        new Challenger(
            {
                colorPalette: [4, 15, 2],
                legLength: 5,
                bodyRadius: 5,
                noseRadius: 2
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
                                pause(randint(180, 210))
                            } else if (sound == 1) {
                                music.play(music.createSoundEffect(WaveShape.Noise, 452, 1, 120, 0, 500, SoundExpressionEffect.None, InterpolationCurve.Linear), music.PlaybackMode.UntilDone)
                                pause(randint(180, 210))
                            } else {
                                music.play(music.createSoundEffect(WaveShape.Sawtooth, 2120, 452, 120, 0, 100, SoundExpressionEffect.None, InterpolationCurve.Linear), music.PlaybackMode.UntilDone)
                                pause(50)
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
                            pause(duration);
                        }

                        while (context.currentStep < 2) {
                            pause(10);
                        }
                        tv.destroy();
                        animation.runImageAnimation(bugslyJr, imgs.tiny_bugsly, 50, true);
                        animation.runMovementAnimation(bugslyJr, `q 0 -30 0 -20`, 500);

                        while (context.currentStep < 3) {
                            pause(10);
                        }

                        while (!(bugslyJr.flags & sprites.Flag.Destroyed)) {
                            tower.moveSprite(
                                bugslyJr,
                                tv.x - 16,
                                tv.y - 10,
                                200
                            );
                            pause(300);
                            tower.moveSprite(
                                bugslyJr,
                                tv.x + 14,
                                tv.y - 6,
                                200
                            );
                            pause(300);
                            tower.moveSprite(
                                bugslyJr,
                                tv.x - 1,
                                tv.y + 4,
                                200
                            );
                            pause(300);
                        }
                    })
                }),
                tower.dialog("Huh?", context => {
                    music.play(music.createSoundEffect(WaveShape.Sine, 5000, 0, 255, 0, 2000, SoundExpressionEffect.Warble, InterpolationCurve.Linear), music.PlaybackMode.UntilDone)
                    pause(100)
                    music.play(music.createSoundEffect(WaveShape.Sine, 101, 1550, 255, 0, 120, SoundExpressionEffect.None, InterpolationCurve.Linear), music.PlaybackMode.UntilDone)
                    pause(50)
                    music.play(music.createSoundEffect(WaveShape.Sine, 1, 1342, 255, 0, 120, SoundExpressionEffect.None, InterpolationCurve.Linear), music.PlaybackMode.UntilDone)
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
        ),
        new Challenger(
            {
                colorPalette: [4, 15, 2],
                legLength: 5,
                bodyRadius: 5,
                noseRadius: 2
            },
            "Bumble",
            [
                tower.dialog("Bzzzz.... Bzzzz.... Bzzzz....", context => {
                    const bg = sprites.create(imgs.honeycomb, SpriteKind.DialogSprite);
                    bg.z = -4
                    const bumble = sprites.create(imgs.bumble_small, SpriteKind.DialogSprite);

                    bumble.x = 130;
                    bumble.y = 40;

                    const snotBubble = sprites.create(imgs.snot_bubble[0], SpriteKind.DialogSprite);
                    snotBubble.y = bumble.y + 3;
                    snotBubble.right = bumble.left - 1;

                    scene.setBackgroundColor(4);

                    const bubble1 = [imgs.snot_bubble[3], imgs.snot_bubble[2], imgs.snot_bubble[1], imgs.snot_bubble[0]];
                    const bubble2 = [imgs.snot_bubble[0], imgs.snot_bubble[1], imgs.snot_bubble[2], imgs.snot_bubble[3]];
                    game.stats = true;

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

                            pause(100)
                        }
                    })

                    control.runInBackground(() => {
                        while (context.currentStep < 1) {
                            animation.runImageAnimation(snotBubble, bubble1, 100, false);
                            music.play(music.createSoundEffect(WaveShape.Sine, 675, 2520, 255, 0, 400, SoundExpressionEffect.Vibrato, InterpolationCurve.Linear), music.PlaybackMode.InBackground)
                            for (let i = 0; i < 5; i++) {
                                if (context.currentStep < 1) {
                                    pause(100);
                                }
                            }

                            if (context.currentStep < 1) {
                                animation.runImageAnimation(snotBubble, bubble2, 100, false);
                                music.play(music.createSoundEffect(WaveShape.Sine, 2520, 675, 255, 0, 500, SoundExpressionEffect.Vibrato, InterpolationCurve.Linear), music.PlaybackMode.InBackground)
                            }

                            for (let i = 0; i < 10; i++) {
                                if (context.currentStep < 1) {
                                    pause(100);
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
                            pause(1);
                        }
                    })
                }, imgs.bumble_asleep),
                tower.dialog("Oh!"),
                tower.dialog("Hello! Did you need something?"),
                tower.dialog("What? A battle!?")
            ],
            "Bounces around the edge of the arena",
            [ tower.dialog("Thanks for the bzzzzz-bzzzzz-battle!") ],
            [ tower.dialog("Awwww... Well, at least I can go back to my nap!") ],
            imgs.bumble,
            hourOfAi.algorithms.curveAndBounce
        ),
        new Challenger(
            {
                colorPalette: [4, 15, 2],
                legLength: 5,
                bodyRadius: 5,
                noseRadius: 2
            },
            "Legs-olas",
            [
                tower.dialog("Hail and well met!", context => {
                    const bg = sprites.create(imgs.dungeon, SpriteKind.DialogSprite);
                    bg.z = -4
                    bg.top = 0;
                    scene.setBackgroundColor(14);

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
                            pause(400 + Math.random() * 800);
                        }
                    })
                }),
                tower.dialog("I am Legs-olas, defender of the Bug Kingdom!"),
                tower.dialog("You must be the challenger who seeks to climb the tower!"),
                tower.dialog("A noble quest! You have the bearing of a true knight!"),
                tower.dialog("But I'm afraid it is my duty to stop you here."),
                tower.dialog("I will best thee in honorable combat! Ready thy AI!"),
                tower.dialog("En garde!")
            ],
            "Moves in random diagonal lines.",
            [ tower.dialog("Well fought! You show promise, but you have much to learn!") ],
            [ tower.dialog("Your sword was true! I shall train harder for our next encounter!") ],
            imgs.legsolas,
            hourOfAi.algorithms.diagonals
        ),
        new Challenger(
            {
                colorPalette: [4, 15, 2],
                legLength: 5,
                bodyRadius: 5,
                noseRadius: 2
            },
            "Crick",
            [
                tower.dialog("Oh? Why hello there!", context => {
                    let bgRenderable: scene.Renderable;

                    bgRenderable = scene.createRenderable(-4, () => {
                        if (context.isFinished()) {
                            bgRenderable.destroy();
                            return;
                        }

                        screen.fill(6);
                        screen.drawImage(imgs.apartment, 0, 0)
                    })

                    const crick = sprites.create(imgs.tiny_crick, SpriteKind.DialogSprite);
                    crick.z = 1;
                    crick.bottom = 52;
                    crick.x = 114;

                    const steam = sprites.create(imgs.steam[0], SpriteKind.DialogSprite);
                    steam.bottom = 48;
                    steam.x = 104;

                    animation.runImageAnimation(steam, imgs.steam, 150, true);

                    const catClock = sprites.create(imgs.cat_clock[0], SpriteKind.DialogSprite);
                    catClock.x = 78;
                    catClock.y = 24;
                    animation.runImageAnimation(catClock, imgs.cat_clock, 130, true);

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

                            pause(duration + randint(0, 500));

                            flip = !flip;
                        }
                    })
                }),
                tower.dialog("You've caught me just before tea!"),
                tower.dialog("Ah, trying to climb the tower, eh?"),
                tower.dialog("Well, I'm afraid I cannot allow that."),
                tower.dialog("Let's have a quick battle, shall we?")
            ],
            "Targets the opponent's color.",
            [ tower.dialog("Jolly good! Better luck next time, eh?") ],
            [ tower.dialog("Well, I say! Smashing!") ],
            imgs.crick,
            hourOfAi.algorithms.followOpponentColor
        ),
        new Challenger(
            {
                colorPalette: [4, 15, 2],
                legLength: 5,
                bodyRadius: 5,
                noseRadius: 2
            },
            "Hopper",
            [
                tower.dialog("You beat that old fool Crick, eh?", context => {
                    const bg = sprites.create(imgs.apartment2, SpriteKind.DialogSprite);
                    bg.z = -4
                    bg.top = 0;

                    const flippedCatImages = imgs.cat.map(img => {
                        const copy = img.clone();
                        copy.flipX();
                        return copy;
                    });

                    const cat = sprites.create(flippedCatImages[0], SpriteKind.DialogSprite);
                    cat.left = 118;
                    cat.top = 8;

                    scene.setBackgroundColor(2);
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
                            music.play(music.createSoundEffect(WaveShape.Square, freq, freq * freq / 100, 104, 0, randint(80, 100), SoundExpressionEffect.None, InterpolationCurve.Linear), music.PlaybackMode.InBackground)

                            pause(duration + randint(0, 500));

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
                            pause(800);
                            music.thump.play();
                            scene.cameraShake(4, 500);

                            if (!catJumped) {
                                cat.setImage(flippedCatImages[2]);
                                pause(400);
                                animation.runMovementAnimation(cat, "q -15 -30 -30 -30", 500);
                                catJumped = true;
                            }
                            pause(1500);
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
            "Draws squiggly lines all over.",
            [ tower.dialog("Hahaha! Too easy!") ],
            [ tower.dialog("Now I'm hopping mad!") ],
            imgs.hopper,
            hourOfAi.algorithms.squiggles
        ),
        new Challenger(
            {
                colorPalette: [4, 15, 2],
                legLength: 5,
                bodyRadius: 5,
                noseRadius: 2
            },
            "Shadow",
            [
                tower.dialog("Keh heh heh heh!", context => {
                    initLightColorBuffer();
                    initCandleHalos();

                    const cx = 80;
                    const cy = 40;

                    const radius = 40;
                    const numCandles = 16;
                    game.stats = true;

                    let candles: tourney.FireSprite[] = [];

                    shadeImage = image.create(screen.width, 80);
                    shadeImage.fill(4);


                    const bgRenderable = scene.createRenderable(-3, () => {
                        screen.fill(15)
                        helpers.mapImage(
                            screen,
                            shadeImage,
                            0,
                            0,
                            lightColorBuffer
                        )
                    });


                    for (let i = 0; i < numCandles; i++) {
                        const angle = (i / numCandles) * 2 * Math.PI + 0.2;
                        const candle = new tourney.FireSprite(4, 16, true);
                        candle.setStrength(12);
                        candle.x = cx + Math.cos(angle) * radius,
                        candle.bottom = cy + Math.sin(angle) * radius / 2
                        candle.z = 0.5 + (candle.bottom / 200);
                        candles.push(candle);
                        candle.setKind(SpriteKind.DialogSprite);
                        candle.data.haloIndex = candleHalos.length + i;

                        pause(100)
                        candle.setStrength(4);
                    }

                    pause(1000);
                    const shadow = sprites.create(imgs.small_shadow[0], SpriteKind.DialogSprite);
                    shadow.bottom = 0;
                    shadow.z = 1;
                    animation.runImageAnimation(shadow, imgs.small_shadow, 150, true);

                    animation.runMovementAnimation(shadow, `q 0 35 0 35`, 1000);
                    for (let i = 0; i < 30; i++) {
                        shadeImage.fill(4);
                        const halo = candleHalos[Math.min(i >> 1, candleHalos.length - 1)];
                        // console.log(halo.height)
                        for (const candle of candles) {
                            candle.setStrength(i + 4);
                            helpers.mergeImage(
                                shadeImage,
                                halo,
                                candle.x - (halo.width >> 1) | 0,
                                candle.bottom - (halo.height >> 1) | 0
                            );
                        }
                        pause(10)
                    }


                    control.runInBackground(() => {
                        context.pauseUntilFinished();
                        bgRenderable.destroy();
                    });

                }, imgs.shadow_silhouette, "?????"),
                tower.dialog("Well, what do we have here?"),
                tower.dialog("Another fool climbing the tower!"),
                tower.dialog("I suppose you expect to defeat me? Not likely."),
                tower.dialog("Let's see how you fare against true darkness...", context => {
                    const dialogSprites = sprites.allOfKind(SpriteKind.DialogSprite);
                    const candles = dialogSprites.filter(s => s instanceof tourney.FireSprite) as tourney.FireSprite[];

                    let stillGoing = true;
                    animation.runMovementAnimation(dialogSprites.filter(s => !(s instanceof tourney.FireSprite))[0], `q 0 -50 0 -50`, 1000);
                    while (stillGoing) {
                        shadeImage.fill(4);
                        stillGoing = false;
                        for (const candle of candles) {
                            const haloIndex = candle.data.haloIndex;
                            candle.data.haloIndex = haloIndex - 1;

                            if (haloIndex < 0) {
                                candle.destroy();
                            }
                            else {
                                const halo = candleHalos[Math.min(haloIndex, candleHalos.length - 1)];
                                helpers.mergeImage(
                                    shadeImage,
                                    halo,
                                    candle.x - (halo.width >> 1) | 0,
                                    candle.bottom - (halo.height >> 1) | 0
                                );
                                stillGoing = true;
                                candle.setStrength(haloIndex);
                            }
                        }
                        pause(50);
                    }
                    candleHalos = [];
                })
        ],
            "Follows the opponent's bug.",
            [
                tower.dialog("Ha! A waste of time!"),
                tower.dialog("You cannot defeat true darkness!")
            ],
            [ tower.dialog("Curses! But I'll have the last laugh, I swear it!") ],
            imgs.shadow,
            hourOfAi.algorithms.followOpponent
        ),
        new Challenger(
            {
                colorPalette: [4, 15, 2],
                legLength: 5,
                bodyRadius: 5,
                noseRadius: 2
            },
            "Bug President",
            [ tower.dialog("You've come a long way, but I'm afraid I can't let my constituents down! Let's see what you've got!") ],
            "TBD",
            [ tower.dialog("Better luck next time! Now I've got a nation to run!") ],
            [ tower.dialog("Well, you won fair and square. I hope I can still count on your vote!") ],
            imgs.president,
            hourOfAi.algorithms.zigzag
        ),
    ];
    }

    let candleHalos: Image[] = [];

    function initCandleHalos() {
        if (candleHalos.length) return;
        for (let i = 0; i < 16; i++) {
            const img = image.create(8 + (i << 2), 4 + (i << 1));
            img.fill(4);
            const rx = (img.width >> 1) - 1;
            const ry = (img.height >> 1) - 1;

            fillEllipse(img, img.width >> 1, img.height >> 1, rx | 0, ry | 0, 3);
            fillEllipse(img, img.width >> 1, img.height >> 1, (rx * 2 / 3) | 0, (ry * 2 / 3) | 0, 2);
            fillEllipse(img, img.width >> 1, img.height >> 1, (rx / 3) | 0, (ry / 3) | 0, 1);
            candleHalos.push(img);
        }
    }

    function fillEllipse(image: Image, cx: number, cy: number, rx: number, ry: number, color: number) {
        midpointEllipse(cx, cy, rx, ry, (x1, y1, x2, y2) => {
            image.fillRect(x1, y1, x2 - x1 + 1, 1, color);
        })
    }

    function midpointEllipse(cx: number, cy: number, rx: number, ry: number, handler: (x: number, y: number, x2: number, y2: number) => void) {
        let x = 0;
        let y = ry;

        let ry2 = ry * ry;
        let rx2 = rx * rx;

        let d1 = ry2 - (rx2 * ry) + (0.25 * rx2);
        let dx = 2 * ry2 * x;
        let dy = 2 * rx2 * y;

        while (dx < dy) {
            handler(cx - x, cy + y, cx + x, cy + y);
            handler(cx - x, cy - y, cx + x, cy - y);

            if (d1 < 0) {
                x++;
                dx += 2 * ry2;
                d1 = d1 + dx + ry2;
            }
            else {
                x++;
                y--;
                dx += 2 * ry2;
                dy -= 2 * rx2;
                d1 = d1 + dx - dy + ry2;
            }
        }

        let d2 = (ry2 * ((x + 0.5) * (x + 0.5))) +
            (rx2 * ((y - 1) * (y - 1))) -
            (rx2 * ry2);

        while (y >= 0) {
            handler(cx - x, cy + y, cx + x, cy + y);
            handler(cx - x, cy - y, cx + x, cy - y);

            if (d2 > 0) {
                y--;
                dy = dy - (2 * rx2);
                d2 = d2 + rx2 - dy;
            }
            else {
                y--;
                x++;
                dx = dx + (2 * ry2);
                dy = dy - (2 * rx2);
                d2 = d2 + dx - dy + rx2;
            }
        }
    }
}