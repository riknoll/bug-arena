namespace hourOfAi.tower {
    export function createWaftsworth() {
        return new Challenger(
            {
                colorPalette: [13, 15, 12],
                legLength: 5,
                bodyRadius: 5,
                noseRadius: 2,
                fillColor: 7
            },
            "Waftsworth",
            [
                tower.dialog("Let's see... Let's see... Need trash... Need trash...", introCutscene),
                tower.dialog("Ooohh! <wavy><slow>Oooooohh!</slow></wavy> Maybe in here!?"),
                tower.dialog("*rummage* *rummage* *rummage*"),
                tower.dialog("Boring! Boring! Don't want! Don't want!"),
                tower.dialog("Oh, wait... What's this? Are you climbing the tower?"),
                tower.dialog("That means you have to fight me, right? <wavy><slow>Right...?"),
                tower.dialog("If I win, give me all your trash! Give me!"),
                tower.dialog("No choice! Have to! Must win! Must win!")
            ],
            "Randomly wanders around the arena",
            [
                tower.dialog("Bwahaha! Smell ya later! Later!", playerLoseCutscene),
                tower.dialog("Precious trash! All mine! <wavy>All mine!<wavy>")
            ],
            [
                tower.dialog("Awwwww... Fine! Fine! I didn't want your trash anyway!", playerWinCutscene)
            ],
            imgs.stinky,
            hourOfAi.algorithms.randomWalk
        )
    }

    function introCutscene(context: DialogContext) {
        const dumpster = initBG();

        const cat = sprites.create(imgs.cat[0], SpriteKind.DialogSprite);
        cat.x = 104;
        cat.y = 30;

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

            pauseUntil(() => context.currentStep >= 2);

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
            animation.runMovementAnimation(cat, "q 0 -20 0 0", 300);
            pause(200);
            animation.stopAnimation(animation.AnimationTypes.MovementAnimation, dumpster);
            pause(300);
            animation.runMovementAnimation(cat, "q 30 -40 60 -10", 1000)
            dumpster.bottom = 70;
            dumpster.left = 17;
            pause(500)

            pauseUntil(() => context.currentStep >= 4);
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
    }

    function playerLoseCutscene(context: DialogContext) {
        initBG();

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
    }

    function playerWinCutscene(context: DialogContext) {
        playerLoseCutscene(context);
    }

    function initBG() {
        const bg = sprites.create(imgs.alleyway, SpriteKind.DialogSprite);
        bg.top = 0;
        bg.z = -4
        scene.setBackgroundColor(14);

        const dumpster = sprites.create(imgs.dumpster, SpriteKind.DialogSprite);
        dumpster.bottom = 70;
        dumpster.left = 17

        dumpster.z = -3;

        const wall = sprites.create(imgs.wall, SpriteKind.DialogSprite);
        wall.top = 0;
        wall.right = 160;
        wall.z = 2;

        return dumpster;
    }
}