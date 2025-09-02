namespace hourOfAi {
    const frame = img`
        . . e e e e e e e e e e e . .
        . e e b b b b b b b b b e e .
        e e b b c c c c c c c b b e e
        e b b c e e e e e e e c b c e
        e b c e f f f f f f f e b c e
        e b c e f f f f f f f e b c e
        e b c e f f f f f f f e b c e
        e b c e f f f f f f f e b c e
        e b c e f f f f f f f e b c e
        e b c e f f f f f f f e b c e
        e b c e f f f f f f f e b c e
        e b b c e e e e e e e b b c e
        e e b b b b b b b b b b c e e
        . e e c c c c c c c c c e e .
        . . e e e e e e e e e e e . .
    `

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
    const mapBuffers: Buffer[] = [];

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

    export function initTower() {
        let challengerIndex = 0;
        let offset = -40;
        let zoom = 1;
        let targetOffset = offset;
        let animationStart = -1;
        let animationDuration = 1000;
        let animationStartOffset = offset;

        controller.A.onEvent(ControllerButtonEvent.Pressed, () => {
            targetOffset += imgs.tower_section.height - 10;
        })

        scene.createRenderable(5, () => {
            if (offset < targetOffset) {
                if (zoom > 1) {
                    zoom /= 1.1;
                    if (zoom < 1) zoom = 1;
                }
                else {
                    if (animationStart < 0) {
                        animationStart = game.runtime();
                        animationStartOffset = offset;
                    }

                    const progress = Math.min((game.runtime() - animationStart) / animationDuration, 1);
                    zoom = 1;
                    if (progress >= 1) {
                        animationStart = -1;
                        offset = targetOffset;
                    }
                    else {
                        offset = animationStartOffset + (targetOffset - animationStartOffset) * easeInOutCubic(progress);
                    }
                }
            }
            else {
                offset = targetOffset;
                if (zoom < 12) {
                    if (zoom === 1) {
                        zoom = 1.04;
                    }
                    zoom = Math.pow(zoom, 1.15)
                }
            }
            drawTower((screen.width >> 1) - (imgs.tower_section.width >> 1), 120, offset, challengers.length, 60, zoom);
        })

        // for (const challenger of challengers) {
        //     showIntroScene(challenger);
        // }
    }

    export function showIntroScene(challenger: Challenger) {
        showDialog(challenger.name, challenger.dialog, challenger.portrait, true);
    }

    export function showDialog(characterName: string, text: string, portrait: Image, showIntro: boolean) {
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

        const introRenderable = scene.createRenderable(-2, () => {
            fancyText.drawFrame(
                screen,
                frame,
                DIALOG_LEFT + (xOffset >> 1),
                DIALOG_TOP + (yOffset >> 1),
                DIALOG_WIDTH - xOffset,
                PORTRAIT_FRAME_WIDTH - yOffset
            )

            if (xOffset < PORTRAIT_WIDTH) {
                fancyText.drawFrame(
                    screen,
                    frame,
                    PORTRAIT_FRAME_LEFT + (xOffset >> 1),
                    DIALOG_TOP + (yOffset >> 1),
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
        fancyText.setFrame(name, frame)
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
                        mapBuffers[Math.idiv(timer, interval)]
                    )
                }
            })

            pauseUntil(() => timer <= 0 || cancelledIntro);
            fadeRender.destroy();
        }

        animation.stopAnimation(animation.AnimationTypes.MovementAnimation, name);
        name.top = DIALOG_TOP - 15;

        let dialog = fancyText.create(text, 117, 11, fancyText.geometric_sans_6)
        fancyText.setFrame(dialog, frame)
        fancyText.setLineHeight(dialog, 10)
        fancyText.setMinLines(dialog, 3)
        dialog.setTextFlag(fancyText.Flag.ChangeHeightWhileAnimating, false)
        dialog.setMaxLines(3)
        dialog.left = 1
        dialog.top = DIALOG_TOP
        dialog.animateAtSpeed(30)

        pauseUntil(() => dialog.remainingAnimationTime() <= 0 || cancelledIntro);
        dialog.cancelAnimation();
        cancelledIntro = true;

        const pauseEnd = game.runtime() + 2000;
        pauseUntil(() => cancelledText || game.runtime() >= pauseEnd);

        dialog.destroy();
        name.destroy();
        introRenderable.destroy();
        characterPortrait.destroy();

        controller.A.removeEventListener(ControllerButtonEvent.Pressed, buttonHandler);
        controller.B.removeEventListener(ControllerButtonEvent.Pressed, buttonHandler);
        browserEvents.MouseLeft.removeEventListener(browserEvents.MouseButtonEvent.Pressed, buttonHandler);
    }

    function drawTower(left: number, bottom: number, offset: number, totalSections: number, anchorY: number, zoom: number) {
        offset |= 0;
        if (zoom === 1) {
            const sectionHeight = imgs.tower_section.height - 10;
            const totalHeight = sectionHeight * totalSections;
            for (let i = 0; i < totalSections; i++) {
                const y = i * sectionHeight;
                const offsetY = bottom - y + offset - imgs.tower_section.height;
                if (offsetY < -imgs.tower_section.height) break;
                if (offsetY > screen.height) continue;
                screen.drawTransparentImage(imgs.tower_section, left, offsetY);
            }

            screen.drawTransparentImage(
                imgs.tower_roof,
                left,
                bottom - totalHeight + offset - imgs.tower_roof.height
            )
        }
        else {
            const imageHeight = imgs.tower_section.height * zoom;
            const imageWidth = imgs.tower_section.width * zoom;
            const adjustedLeft = (left + ((imgs.tower_section.width) >> 1)) - (imageWidth >> 1);
            const sectionHeight = (imgs.tower_section.height - 10) * zoom;
            offset = offset * zoom;

            const totalHeight = sectionHeight * totalSections;

            const anchorOffset = (anchorY * zoom) - anchorY;

            for (let i = 0; i < totalSections; i++) {
                const y = i * sectionHeight;
                const offsetY = bottom - y + offset - imageHeight + anchorOffset;
                if (y !== 0) {
                    if (offsetY < -imageHeight) break;
                    if (offsetY > screen.height) continue;
                }

                screen.blit(
                    adjustedLeft,
                    offsetY,
                    imageWidth,
                    imageHeight,
                    imgs.tower_section,
                    0,
                    0,
                    imgs.tower_section.width,
                    imgs.tower_section.height,
                    true,
                    false
                )
            }

            screen.blit(
                adjustedLeft,
                bottom - totalHeight + offset - ((imgs.tower_roof.height) * zoom) + anchorOffset,
                imgs.tower_roof.width * zoom,
                imgs.tower_roof.height * zoom,
                imgs.tower_roof,
                0,
                0,
                imgs.tower_roof.width,
                imgs.tower_roof.height,
                true,
                false
            )
        }
    }

    function easeInOutCubic(x: number): number {
        return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    }
}