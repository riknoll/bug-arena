namespace SpriteKind {
    export const DialogSprite = SpriteKind.create();
}

namespace hourOfAi.tower {
    const SOFT_RESET = false;

    export function initTower(bg?: TowerScene) {
        const state = getTowerState();
        const challengerIndex = getCurrentTowerLevel() === -1 ? 0 : getCurrentTowerLevel();

        // 0 stinky
        // 1 bumble
        // 2 legsolas
        // 3 crick
        // 4 hopper
        // 5 bugsly
        // 6 bugsly jr
        // 7 shadow
        // 8 president

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

        setIsChallengerUnlocked(challengerIndex, true);
        const isIntroCutscene = state === TowerState.StartIntroCutscene || state === TowerState.NotStarted;

        if (isIntroCutscene) {
            setTowerState(TowerState.IntroCutscene);
        }

        if (!bg) {
            bg = new TowerScene();
            bg.xOffset = (screen.width >> 1) - (imgs.tower_section.width >> 1);
        }

        // Pause on the tower scene for a moment before zooming in
        if (state === TowerState.NotStarted) {
            pause(2000);
        }

        if (isIntroCutscene) {
            // Check if we are continuing from a previous match
            if (challengerIndex === challengers.length) {
                const usedContinue = getTowerUsedContinue();
                clearTowerProgress();
                setBeatTower(true);
                bg.scrollTo(challengerIndex - 1, true);
                bg.doOutroAnimation(usedContinue);
                return;
            }
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
            bg.setVisible(false)
            showIntroScene(challenger);

            setTowerState(TowerState.StartMatch);
            reset();
        }
        else if (state === TowerState.WinCutscene) {
            bg.setVisible(false)
            bg.zoomIn(true);
            showWinCutscene(challenger);

            setCurrentTowerLevel(challengerIndex + 1);
            setTowerState(TowerState.StartIntroCutscene);

            reset(true);
        }
        else if (state === TowerState.LoseCutscene) {
            bg.setVisible(false)
            bg.zoomIn(true);
            showLoseCutscene(challenger);
            bg.setVisible(true)
            bg.zoomOut();

            startGameMode(GameMode.MainMenu);
        }
        else if (state === TowerState.StartMatch) {
            setTowerState(TowerState.InMatch);
            bg.setVisible(false)
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

    export function reset(soft = false) {
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

        const { skipRenderable, isCancelled } = createSkipRenderable(context);

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
                isCancelled,
                dialog.font
            );

            pauseUntil(() => handlerComplete);
            context.currentStep++;
        }

        context.finish();
        sprites.destroyAllSpritesOfKind(SpriteKind.DialogSprite);
        skipRenderable.destroy();
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

    export function createSkipRenderable(context?: DialogContext) {
        let skipRenderable: scene.Renderable;
        const SKIP_HOLD_TIME = 1500;
        let skipTimer = SKIP_HOLD_TIME;

        let cancelled = false;
        const isCancelled = () => cancelled;

        skipRenderable = scene.createRenderable(1000, (_, camera) => {
            const buttonPressed = controller.A.isPressed() || controller.B.isPressed() || browserEvents.MouseLeft.isPressed();

            if (buttonPressed) {
                const text = "Hold to skip";
                const font = fancyText.geometric_sans_6;

                const textWidth = fancyText.getTextWidth(font, text);
                const BAR_WIDTH = 20;
                const BAR_HEIGHT = 8;
                const PADDING = 1;

                const totalWidth = textWidth + (PADDING * 3) + BAR_WIDTH;
                const totalHeight = BAR_HEIGHT + (PADDING * 2);

                const left = screen.width - totalWidth - PADDING - 1;
                const top = PADDING + 1;

                screen.drawRect(
                    left - 1,
                    top - 1,
                    totalWidth + 2,
                    totalHeight + 2,
                    15
                )
                screen.fillRect(
                    left,
                    top,
                    totalWidth,
                    totalHeight,
                    1
                )

                fancyText.draw(text, screen, left + PADDING, top, 0, 15, font);
                const filledWidth = Math.floor(BAR_WIDTH * (1 - (skipTimer / SKIP_HOLD_TIME)));

                screen.fillRect(
                    left + textWidth + (PADDING * 2),
                    top + PADDING,
                    BAR_WIDTH,
                    BAR_HEIGHT,
                    4
                )

                screen.fillRect(
                    left + textWidth + (PADDING * 2),
                    top + PADDING,
                    filledWidth,
                    BAR_HEIGHT,
                    15
                )

                skipTimer -= game.eventContext().deltaTimeMillis;

                if (skipTimer <= 0) {
                    skipRenderable.destroy();
                    if (context) {
                        context.finish();
                    }
                    cancelled = true;
                }
            }
            else {
                skipTimer = SKIP_HOLD_TIME;
            }
        });

        return {
            skipRenderable,
            isCancelled
        }
    }
}