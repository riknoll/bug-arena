namespace hourOfAi.tower {
    export function createPresident() {
        return new Challenger(
            {
                colorPalette: [4, 15, 2],
                legLength: 5,
                bodyRadius: 5,
                noseRadius: 2
            },
            "Bug President",
            [
                tower.dialog("...", introCutscene, imgs.shadow_silhouette, "?????"),
                tower.dialog("...Oh? Is someone there? One moment!", undefined, imgs.shadow_silhouette, "?????"),
                tower.dialog("Ahem...", undefined, imgs.shadow_silhouette, "?????"),
                tower.dialog("Congratulations on making it this far, challenger."),
                tower.dialog("I am Bug President. Leader of this tower..."),
                tower.dialog("And of the entire bug nation."),
                tower.dialog("I created this tower as a test to refine our AI tech."),
                tower.dialog("My advisors tell me you've done quite well to reach here!"),
                tower.dialog("However..."),
                tower.dialog("I need to ensure that only the best AI reaches the top."),
                tower.dialog("I owe it to my constituents!"),
                tower.dialog("Therefore, I must ask you to battle me."),
                tower.dialog("Do your best!"),
                tower.dialog("Become the champion!"),
                tower.dialog("And create the greatest AI!"),
            ],
            "The leader of the entire Bug Nation",
            [
                tower.dialog("Better luck next time! Now I've got a nation to run!", playerLoseCutscene)
            ],
            [
                tower.dialog("Well, you won fair and square.", playerWinCutscene),
                tower.dialog("I hope I can still count on your vote!")
            ],
            imgs.president,
            hourOfAi.algorithms.zigzag
        );
    }

    function introCutscene(context: DialogContext) {
        const bg = sprites.create(imgs.press_office_bg, SpriteKind.DialogSprite);
        bg.z = -4
        bg.top = 0;
        scene.setBackgroundColor(14);
        initDarkColorBuffer();

        const podium = sprites.create(imgs.podium, SpriteKind.DialogSprite);
        podium.bottom = 80;
        podium.x = 80;
        podium.z = -3.5;

        const president = sprites.create(imgs.bug_president[0], SpriteKind.DialogSprite);
        president.bottom = podium.y - 4;
        president.x = podium.x;
        president.z = -3.6;
        // animation.runImageAnimation(president, imgs.bug_president, 100, true);

        president.setFlag(SpriteFlag.Invisible, true);
        let phase = 0;

        const renderable = scene.createRenderable(-3.4, () => {
            if (phase === 0) return;
            if (phase === 1) {
                screen.fill(15);
                return;
            }
            else {
                helpers.mapImage(
                    screen,
                    imgs.spotlight,
                    0,
                    0,
                    darkColorBuffer
                )
            }
        });
        const bigShift = "v -2 v 2";
        const littleShift = "v -1 v 1";

        control.runInBackground(() => {
            pauseUntil(() => context.currentStep >= 2);
            phase = 1;
            playLightSwitchOff();
            context.pause(2000);
            playLightSwitchOn();
            president.setFlag(SpriteFlag.Invisible, false);
            bg.setImage(imgs.press_office_bg_spotlight);
            phase = 2;
            podium.z = -3.2;
            president.z = -3.3
            animation.runMovementAnimation(president, bigShift, 500, false);
            context.pauseUntilNextStep();
            while (!context.isFinished()) {
                if (context.currentStep === 7 || context.currentStep === 10 || context.currentStep === 14) {
                    animation.runMovementAnimation(president, bigShift, 500, false);
                    tower.runImageAnimationWhileTrue(president, imgs.bug_president.slice(2, 4), 100, () => context.isPrinting);
                }
                else {
                    animation.runMovementAnimation(president, littleShift, 500, false);
                    tower.runImageAnimationWhileTrue(president, imgs.bug_president.slice(0, 2), 100, () => context.isPrinting);
                }
                context.pauseUntilNextStep();
            }

            renderable.destroy();
        });
    }

    function playerLoseCutscene(context: DialogContext) {

    }

    function playerWinCutscene(context: DialogContext) {

    }

    function playLightSwitchOn() {
        let mySound = sound.create()
        sound.addPart(
            mySound,
            sound.Waveform.TunableNoise,
            3000,
            450,
            10,
            3000,
            50
        )
        sound.addPart(
            mySound,
            sound.Waveform.TunableNoise,
            3000,
            50,
            500,
            3060,
            0
        )
        sound.play(mySound, false, 10)
        mySound = sound.create()
        sound.addPart(
            mySound,
            sound.Waveform.TunableNoise,
            800,
            0,
            10,
            800,
            500
        )
        sound.addPart(
            mySound,
            sound.Waveform.TunableNoise,
            800,
            500,
            490,
            800,
            0
        )
        sound.play(mySound, false, 10)
    }

    function playLightSwitchOff() {
        let mySound = sound.create()
        sound.addPart(
            mySound,
            sound.Waveform.TunableNoise,
            2500,
            450,
            10,
            2500,
            50
        )
        sound.addPart(
            mySound,
            sound.Waveform.TunableNoise,
            2500,
            50,
            500,
            2580,
            0
        )
        sound.play(mySound, false, 10)
        mySound = sound.create()
        sound.addPart(
            mySound,
            sound.Waveform.TunableNoise,
            600,
            0,
            10,
            600,
            500
        )
        sound.addPart(
            mySound,
            sound.Waveform.TunableNoise,
            600,
            500,
            490,
            600,
            0
        )
        sound.play(mySound, false, 10)
    }

    let darkColorBuffer: Buffer;
    let darkColorRamp = img`
        . 1 2 3 4 5 6 7 8 9 a b c d e f
        . b a 2 3 4 e 6 d 8 e c d e f f
    `;

    function initDarkColorBuffer() {
        if (darkColorBuffer) return;
        const shadeLevels = 5;
        darkColorBuffer = control.createBuffer(16 * (shadeLevels + 1));

        for (let x = 0; x < 16; x++) {
            darkColorBuffer[darkColorBuffer.length - 16 + x] = x;
        }

        for (let i = shadeLevels - 1; i > 0; i--) {
            for (let x = 0; x < 16; x++) {
                const index = x + (i << 4);
                darkColorBuffer[index] = darkColorRamp.getPixel(darkColorBuffer[index + 16], 1);
            }
        }
    }
}