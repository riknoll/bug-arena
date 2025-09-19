namespace SpriteKind {
    export const DialogSprite = SpriteKind.create();
}

namespace hourOfAi.tower {
    const TOWER_INDEX_KEY = "_INDEX";
    const TOWER_STATE_KEY = "_STATE";

    const SOFT_RESET = false;
    export const DEBUG = false;

    enum TowerState {
        NotStarted,
        InProgress,
        InMatch,
        Won,
        Lost
    }

    export function initTower() {
        let challengerIndex = 0;
        let state: TowerState = TowerState.NotStarted;

        if (!DEBUG) {
            if (settings.exists(TOWER_STATE_KEY)) {
                state = settings.readNumber(TOWER_STATE_KEY);
            }
            if (settings.exists(TOWER_INDEX_KEY)) {
                challengerIndex = settings.readNumber(TOWER_INDEX_KEY);
            }
        }

        const bg = new TowerScene();
        bg.xOffset = (screen.width >> 1) - (imgs.tower_section.width >> 1);

        settings.remove(TOWER_STATE_KEY);
        settings.remove(TOWER_INDEX_KEY);

        if (state === TowerState.NotStarted) {
            pause(500);
        }
        bg.scrollTo(challengerIndex, challengerIndex !== 0 || state !== TowerState.NotStarted);


        if (state === TowerState.NotStarted || state === TowerState.InProgress) {
            bg.zoomIn();
        }

        if (state === TowerState.Won) {
            settings.writeNumber(TOWER_INDEX_KEY, challengerIndex + 1);
            settings.writeNumber(TOWER_STATE_KEY, TowerState.InProgress);

            bg.visible = false;
            showWinCutscene(challengers[challengerIndex]);
            bg.visible = true;

            bg.zoomOut();
            bg.scrollTo(challengerIndex + 1);

            reset();
        }
        else if (state === TowerState.Lost) {
            bg.visible = false;
            showLoseCutscene(challengers[challengerIndex]);

            settings.writeNumber(TOWER_STATE_KEY, TowerState.InProgress);
            settings.writeNumber(TOWER_INDEX_KEY, challengerIndex);
            state = TowerState.NotStarted;
            startGameMode(GameMode.MainMenu)
        }
        else {
            const challenger = challengers[challengerIndex];
            bg.visible = false;
            showIntroScene(challenger);

            if (!DEBUG) {
                const player1Won = startMatch(challenger);
                settings.writeNumber(TOWER_STATE_KEY, player1Won ? TowerState.Won : TowerState.Lost);
                settings.writeNumber(TOWER_INDEX_KEY, challengerIndex);
                reset(true);
            }
            else {
                settings.writeNumber(TOWER_STATE_KEY, TowerState.Won);
                settings.writeNumber(TOWER_INDEX_KEY, challengerIndex);
                reset();
            }
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
        return initSingleMatch(challenger);
    }
}