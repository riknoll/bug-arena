namespace SpriteKind {
    export const DialogSprite = SpriteKind.create();
}

namespace hourOfAi.tower {
    const TOWER_INDEX_KEY = "_INDEX";
    const TOWER_STATE_KEY = "_STATE";

    const SOFT_RESET = true;
    export const DEBUG = true;

    enum TowerState {
        NotStarted,
        InProgress,
        InMatch,
        Won,
        Lost
    }

    export function initTower() {
        const MAX_ZOOM = 14;
        let challengerIndex = 3;
        let state: TowerState = TowerState.NotStarted;

        if (!DEBUG) {
            if (settings.exists(TOWER_STATE_KEY)) {
                state = settings.readNumber(TOWER_STATE_KEY);
            }
            if (settings.exists(TOWER_INDEX_KEY)) {
                challengerIndex = settings.readNumber(TOWER_INDEX_KEY);
            }
        }

        settings.clear();

        let scroll = -40 + challengerIndex * (imgs.tower_section.height - 10);
        let zoom: number

        if (state === TowerState.NotStarted || state === TowerState.InProgress) {
            zoom = 1;
        }
        else {
            zoom = MAX_ZOOM;
        }

        let currentAnimation: Animation;

        scene.createRenderable(-5, () => {
            drawTower((screen.width >> 1) - (imgs.tower_section.width >> 1), 120, scroll, challengers.length, 60, zoom);
        });

        if (state === TowerState.NotStarted || TowerState.InProgress) {
            currentAnimation = new Animation(
                500,
                easeInExpo,
                t => zoom = 1 + t * (MAX_ZOOM - 1)
            );
            currentAnimation.start();
            currentAnimation.pauseUntilDone();
        }

        if (state === TowerState.Won) {
            settings.writeNumber(TOWER_INDEX_KEY, challengerIndex + 1);
            settings.writeNumber(TOWER_STATE_KEY, TowerState.InProgress);

            showWinCutscene(challengers[challengerIndex]);

            currentAnimation = new Animation(
                500,
                easeOutCirc,
                t => zoom = MAX_ZOOM - t * (MAX_ZOOM - 1)
            );
            currentAnimation.start();
            currentAnimation.pauseUntilDone();
            zoom = 1;

            const startOffset = scroll;

            currentAnimation = new Animation(
                1000,
                easeInOutCubic,
                t => scroll = startOffset + t * (imgs.tower_section.height - 10)
            );
            currentAnimation.start();
            currentAnimation.pauseUntilDone();

            reset();
        }
        else if (state === TowerState.Lost) {
            showLoseCutscene(challengers[challengerIndex]);

            settings.writeNumber(TOWER_STATE_KEY, TowerState.InProgress);
            settings.writeNumber(TOWER_INDEX_KEY, challengerIndex);
            state = TowerState.NotStarted;
            reset();
        }
        else {
            const challenger = challengers[challengerIndex];
            showIntroScene(challenger);

            if (!DEBUG) {
                const player1Won = startMatch(challenger) || true;
                settings.writeNumber(TOWER_STATE_KEY, player1Won ? TowerState.Won : TowerState.Lost);
                settings.writeNumber(TOWER_INDEX_KEY, challengerIndex);
                reset();
            }
            else {
                settings.writeNumber(TOWER_STATE_KEY, TowerState.Won);
                settings.writeNumber(TOWER_INDEX_KEY, challengerIndex);
                reset();
            }
        }
    }

    function reset() {
        if (SOFT_RESET) {
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
        return initSinglePlayer(challenger);
    }
}