namespace hourOfAi.tower {
    const PORTRAIT_WIDTH = 32;
    const FRAME_EDGE_WIDTH = 4;
    const PORTRAIT_FRAME_WIDTH = PORTRAIT_WIDTH + (FRAME_EDGE_WIDTH << 1)
    const DIALOG_WIDTH = screen.width - PORTRAIT_FRAME_WIDTH - 3;
    const DIALOG_LEFT = 1;
    const DIALOG_TOP = screen.height - 1 - PORTRAIT_FRAME_WIDTH;
    const PORTRAIT_FRAME_LEFT = screen.width - 1 - PORTRAIT_FRAME_WIDTH;

    const colorRamp = img`
        . 1 2 3 4 5 6 7 8 9 a b c d e f
        . b a 2 3 4 e 6 d 8 e c d e f f
    `
    export const mapBuffers: Buffer[] = [];

    function initColorRamps() {
        if (mapBuffers.length) return;

        const buf = control.createBuffer(16);
        for (let x = 0; x < 16; x++) {
            buf[x] = colorRamp.getPixel(x, 1);
        }
        let prevBuffer = buf;
        mapBuffers.push(buf);

        for (let i = 0; i < 2; i++) {
            const buf = control.createBuffer(16);
            for (let x = 0; x < 16; x++) {
                buf[x] = prevBuffer[prevBuffer[x]];
            }
            mapBuffers.push(buf);
            prevBuffer = buf;
        }
    }

    export function showDialog(context: DialogContext, characterName: string, text: string, portrait: Image, showIntro: boolean, font?: fancyText.BaseFont) {
        initColorRamps();
        let yOffset = showIntro ? PORTRAIT_WIDTH : 0
        let xOffset = showIntro ? DIALOG_WIDTH - (FRAME_EDGE_WIDTH << 1) : 0;
        let cancelledIntro = false;
        let cancelledText = false;

        const buttonHandler = () => {
            if (cancelledIntro) {
                cancelledText = true;
            }
            else {
                cancelledIntro = true;
            }
        }

        controller.A.addEventListener(ControllerButtonEvent.Pressed, buttonHandler);
        controller.B.addEventListener(ControllerButtonEvent.Pressed, buttonHandler);
        browserEvents.MouseLeft.addEventListener(browserEvents.MouseButtonEvent.Pressed, buttonHandler);

        const introRenderable = scene.createRenderable(-2, (_, camera) => {
            fancyText.drawFrame(
                screen,
                imgs.textFrame,
                DIALOG_LEFT + (xOffset >> 1) - camera.drawOffsetX,
                DIALOG_TOP + (yOffset >> 1) - camera.drawOffsetY,
                DIALOG_WIDTH - xOffset,
                PORTRAIT_FRAME_WIDTH - yOffset
            )

            if (xOffset < PORTRAIT_WIDTH) {
                fancyText.drawFrame(
                    screen,
                    imgs.textFrame,
                    PORTRAIT_FRAME_LEFT + (xOffset >> 1) - camera.drawOffsetX,
                    DIALOG_TOP + (yOffset >> 1) - camera.drawOffsetY,
                    PORTRAIT_FRAME_WIDTH - xOffset,
                    PORTRAIT_FRAME_WIDTH - yOffset
                )
            }

            if (yOffset > 0) {
                yOffset = Math.max(yOffset - 7, 0)
            }
            if (xOffset > 0) {
                xOffset = Math.max(xOffset - 7, 0)
            }
        });

        if (showIntro) {
            pauseUntil(() => xOffset === 0 && yOffset === 0 || cancelledIntro);
            xOffset = 0;
            yOffset = 0;
        }

        let name = fancyText.create(characterName, 0, 11, fancyText.geometric_sans_6)
        fancyText.setFrame(name, imgs.textFrame)
        name.left = 3
        name.z = -3

        if (showIntro) {
            name.top = DIALOG_TOP;
            animation.runMovementAnimation(name, "v -15", 180)
        }
        else {
            name.top = DIALOG_TOP - 15
        }

        let characterPortrait = sprites.create(portrait);
        characterPortrait.left = PORTRAIT_FRAME_LEFT + FRAME_EDGE_WIDTH;
        characterPortrait.top = DIALOG_TOP + FRAME_EDGE_WIDTH;

        if (showIntro) {
            const interval = 100;
            let timer = (mapBuffers.length + 1) * interval;

            const fadeRender = scene.createRenderable(20, () => {
                timer -= game.currentScene().eventContext.deltaTimeMillis;

                if (timer > mapBuffers.length * interval) {
                    screen.fillRect(
                        PORTRAIT_FRAME_LEFT + FRAME_EDGE_WIDTH,
                        DIALOG_TOP + FRAME_EDGE_WIDTH,
                        PORTRAIT_WIDTH,
                        PORTRAIT_WIDTH,
                        15
                    )
                }
                else if (timer > 0) {
                    screen.mapRect(
                        PORTRAIT_FRAME_LEFT + FRAME_EDGE_WIDTH,
                        DIALOG_TOP + FRAME_EDGE_WIDTH,
                        PORTRAIT_WIDTH,
                        PORTRAIT_WIDTH,
                        mapBuffers[Math.constrain(Math.idiv(timer, interval), 0, mapBuffers.length - 1)]
                    )
                }
            })

            pauseUntil(() => timer <= 0 || cancelledIntro);
            fadeRender.destroy();
        }

        animation.stopAnimation(animation.AnimationTypes.MovementAnimation, name);
        name.top = DIALOG_TOP - 15;

        let dialog = fancyText.create(text, 117, 11, font || fancyText.geometric_sans_6)
        dialog.setAnimationSound(music.createSoundEffect(WaveShape.Square, 7, 446, 133, 0, 20, SoundExpressionEffect.None, InterpolationCurve.Linear))
        fancyText.setFrame(dialog, imgs.textFrame)
        fancyText.setLineHeight(dialog, 10)
        fancyText.setMinLines(dialog, 3)
        dialog.setTextFlag(fancyText.Flag.ChangeHeightWhileAnimating, false)
        dialog.setMaxLines(3)
        dialog.left = 1
        dialog.top = DIALOG_TOP
        context.isPrinting = true;
        dialog.animateAtSpeed(30)

        pauseUntil(() => dialog.remainingAnimationTime() <= 0 || cancelledIntro);
        context.isPrinting = false;

        dialog.cancelAnimation();
        cancelledIntro = true;

        const pauseEnd = game.runtime() + 4000;
        pauseUntil(() => cancelledText || game.runtime() >= pauseEnd);

        dialog.destroy();
        name.destroy();
        introRenderable.destroy();
        characterPortrait.destroy();

        controller.A.removeEventListener(ControllerButtonEvent.Pressed, buttonHandler);
        controller.B.removeEventListener(ControllerButtonEvent.Pressed, buttonHandler);
        browserEvents.MouseLeft.removeEventListener(browserEvents.MouseButtonEvent.Pressed, buttonHandler);
    }

    export class DialogContext {
        protected _isFinished = false;
        isPrinting = false;
        currentStep = 0;

        constructor() {
        }

        finish() {
            this._isFinished = true;
        }

        pauseUntilFinished() {
            pauseUntil(() => this._isFinished);
        }

        pauseUntilNextStep() {
            const step = this.currentStep;
            pauseUntil(() => this._isFinished || step != this.currentStep);
        }

        isFinished() {
            return this._isFinished;
        }
    }

    export class DialogPart {
        constructor(
            public text: string,
            public onDialogStart?: (context: DialogContext) => void,
            public characterPortrait?: Image,
            public characterName?: string,
            public font?: fancyText.BaseFont,
        ) {}
    }

    export function dialog(
        text: string,
        onDialogStart?: (context: DialogContext) => void,
        characterPortrait?: Image,
        characterName?: string,
        font?: fancyText.BaseFont
    ) {
        return new DialogPart(text, onDialogStart, characterPortrait, characterName, font);
    }
}