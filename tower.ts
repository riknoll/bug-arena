namespace SpriteKind {
    export const DialogSprite = SpriteKind.create();
}

namespace hourOfAi.tower {
    export function initTower() {
        let challengerIndex = 6;
        let offset = -40;
        let zoom = 1;

        const MAX_ZOOM = 14;

        let currentAnimation: Animation;

        scene.createRenderable(-5, () => {
            drawTower((screen.width >> 1) - (imgs.tower_section.width >> 1), 120, offset, challengers.length, 60, zoom);
        });

        for (const challenger of challengers.slice(challengerIndex)) {
            currentAnimation = new Animation(
                500,
                easeInExpo,
                t => zoom = 1 + t * (MAX_ZOOM - 1)
            );
            currentAnimation.start();
            currentAnimation.pauseUntilDone();
            showIntroScene(challenger);
            currentAnimation = new Animation(
                500,
                easeOutCirc,
                t => zoom = MAX_ZOOM - t * (MAX_ZOOM - 1)
            );
            currentAnimation.start();
            currentAnimation.pauseUntilDone();
            zoom = 1;

            const startOffset = offset;

            currentAnimation = new Animation(
                1000,
                easeInOutCubic,
                t => offset = startOffset + t * (imgs.tower_section.height - 10)
            );
            currentAnimation.start();
            currentAnimation.pauseUntilDone();
        }
    }

    export function showIntroScene(challenger: Challenger) {
        const context = new tower.DialogContext();

        for (let i = 0; i < challenger.dialog.length; i++) {
            const dialog = challenger.dialog[i];
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
}