namespace SpriteKind {
    export const DialogSprite = SpriteKind.create();
}

namespace hourOfAi.tower {
    const SOFT_RESET = false;
    export const DEBUG = false;

    export function initTower() {
        const state = getTowerState();
        const challengerIndex = getCurrentTowerLevel() === -1 ? 0 : getCurrentTowerLevel();

        // const state = TowerState.StartIntroCutscene as number;
        // const challengerIndex = 8 as number;

        // if (!DEBUG) {
        //     if (settings.exists(TOWER_STATE_KEY)) {
        //         state = settings.readNumber(TOWER_STATE_KEY);
        //     }
        //     if (settings.exists(TOWER_INDEX_KEY)) {
        //         challengerIndex = settings.readNumber(TOWER_INDEX_KEY);
        //     }
        // }

        const isIntroCutscene = state === TowerState.StartIntroCutscene || state === TowerState.NotStarted;

        if (isIntroCutscene) {
            setTowerState(TowerState.IntroCutscene);
        }

        const bg = new TowerScene();
        bg.xOffset = (screen.width >> 1) - (imgs.tower_section.width >> 1);

        // Pause on the tower scene for a moment before zooming in
        if (state === TowerState.NotStarted) {
            pause(2000);
        }

        if (isIntroCutscene) {
            // Check if we are continuing from a previous match
            if (challengerIndex !== 0) {
                bg.scrollTo(challengerIndex - 1, true);
                bg.zoomOut();
                pause(1000);
            }

            bg.scrollTo(challengerIndex, false);
            bg.zoomIn();
        }
        else {
            // Jump to the current challenger if we're resuming a game
            bg.scrollTo(challengerIndex, true);
        }

        const challenger = challengers[challengerIndex];

        if (isIntroCutscene) {
            bg.visible = false;
            showIntroScene(challenger);

            setTowerState(TowerState.StartMatch);
            reset();
        }
        else if (state === TowerState.WinCutscene) {
            bg.visible = false;
            bg.zoomIn(true);
            showWinCutscene(challenger);

            setCurrentTowerLevel(challengerIndex + 1);
            setTowerState(TowerState.StartIntroCutscene);

            reset(true);
        }
        else if (state === TowerState.LoseCutscene) {
            bg.visible = false;
            bg.zoomIn(true);
            showLoseCutscene(challenger);
            bg.visible = true;
            bg.zoomOut();

            startGameMode(GameMode.MainMenu);
        }
        else if (state === TowerState.StartMatch) {
            setTowerState(TowerState.InMatch);
            bg.visible = false;
            const player1Won = startMatch(challenger);

            if (player1Won) {
                setTowerState(TowerState.WinCutscene);
            }
            else {
                setTowerState(TowerState.LoseCutscene);
            }

            reset(true);
        }
    }

    function reset(soft = false) {
        if (SOFT_RESET || soft) {
            for (const sprite of (game.currentScene().physicsEngine as any).sprites as Sprite[]) {
                sprite.destroy();
            }
            initTower();
        }
        else {
            game.reset();
        }
    }

    export function showIntroScene(challenger: Challenger) {
        showDialogChain(challenger, challenger.dialog);
    }

    export function showWinCutscene(challenger: Challenger) {
        showDialogChain(challenger, challenger.loseText);
    }

    export function showLoseCutscene(challenger: Challenger) {
        showDialogChain(challenger, challenger.winText);
    }

    function showDialogChain(challenger: Challenger, dialogParts: DialogPart[]) {
        const context = new tower.DialogContext();

        for (let i = 0; i < dialogParts.length; i++) {
            const dialog = dialogParts[i];
            let handlerComplete = true;

            if (dialog.onDialogStart) {
                handlerComplete = false;
                control.runInBackground(() => {
                    dialog.onDialogStart(context);
                    handlerComplete = true;
                });
            }

            showDialog(
                context,
                dialog.characterName || challenger.name,
                dialog.text,
                dialog.characterPortrait || challenger.portrait,
                i === 0,
                dialog.font
            );

            pauseUntil(() => handlerComplete);
            context.currentStep++;
        }

        context.finish();
        sprites.destroyAllSpritesOfKind(SpriteKind.DialogSprite);
    }

    export function startMatch(challenger: Challenger) {
        return initSingleMatch(true, true, true, challenger);
    }

    export function runImageAnimationWhileTrue(sprite: Sprite, images: Image[], interval: number, condition: () => boolean) {
        let frameHandler: control.FrameCallback;
        let frameTimer = interval;
        let frame = 0;

        sprite.setImage(images[0]);


        frameHandler = game.eventContext().registerFrameHandler(scene.UPDATE_PRIORITY, () => {
            if (!condition()) {
                game.eventContext().unregisterFrameHandler(frameHandler);
                sprite.setImage(images[0]);
                return;
            }

            frameTimer -= game.eventContext().deltaTimeMillis;

            while (frameTimer <= 0) {
                frameTimer += interval;
                frame = (frame + 1) % images.length;
                sprite.setImage(images[frame]);
            }
        });
    }
}