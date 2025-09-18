namespace hourOfAi.tower {
    export function createMenuBackground(): scene.Renderable {
        let backgroundLayers = [
            imgs.cloudLayer0, imgs.cloudLayer1, imgs.cloudLayer2, imgs.cloudLayer3
        ];

        let backgroundOffsets = [0, 0, 0, 0]
        scene.setBackgroundColor(15)
        let frameTimer = randint(30, 90);
        let lightningX = randint(10, 100);

        const colorRamp = img`
            . 1 2 3 4 5 6 7 8 9 a b c d e f
            . 1 2 3 4 1 7 1 9 b 2 1 b c d e
        `
        const buf = control.createBuffer(16);

        for (let i = 0; i < 16; i++) {
            buf[i] = colorRamp.getPixel(i, 1);
        }

        const lightningAnim = imgs.lightningFrames;

        return scene.createRenderable(0, () => {
            frameTimer--;
            screen.fillRect(0, 90, 160, 30, 6)
            const frame = lightningAnim.length - (frameTimer >> 1) - 1

            for (let i = backgroundLayers.length - 1; i >= 0; i--) {
                backgroundOffsets[i] += (i + 1);
                screen.drawTransparentImage(
                    backgroundLayers[i],
                    -(backgroundOffsets[i] % screen.width),
                    0
                )
                screen.drawTransparentImage(
                    backgroundLayers[i],
                    screen.width - (backgroundOffsets[i] % screen.width),
                    0
                )

                if (i === 1) {
                    if (frameTimer < lightningAnim.length << 1) {
                        screen.drawTransparentImage(lightningAnim[frame], lightningX, lightningX % 5)
                    }

                    for (let x = 0; x < 160 + 60; x += 7) {
                        const time = game.runtime() + Math.sin(x * Math.PI / 16) * 400;
                        const iteration = Math.idiv(time, 300);
                        drawPartialLine(x, 0, x - 60, 90 + (1 + Math.sin(iteration)) * 30, (time / 300) % 1, 0.05, 8)
                        // screen.drawLine(x, 0, x - 60, 90, 1)
                    }

                    drawTower(92, 115, 0, 10, 0, 1);

                    for (let x = 7; x < 160 + 60; x += 13) {
                        const time = game.runtime() + Math.sin(x * Math.PI / 16) * 400;
                        const iteration = Math.idiv(time, 300);
                        drawPartialLine(x, 0, x - 60, 90 + (1 + Math.sin(iteration)) * 30, (time / 300) % 1, 0.05, 8)
                        // screen.drawLine(x, 0, x - 60, 90, 1)
                    }
                }
            }


            if (frame === 5 || frame === 8 || frame === 7) {
                screen.mapRect(0, 0, screen.width, screen.height, buf)
            }


            if (frameTimer === 0) {
                if (Math.percentChance(5)) {
                    frameTimer = 20;
                }
                else {
                    frameTimer = randint(90, 300)
                }
                lightningX = randint(10, 100);
            }
        });
    }

    function drawPartialLine(
        startX: number, startY: number, endX: number, endY: number, offset: number, length: number, color: number
    ) {
        screen.drawLine(
            startX + (endX - startX) * offset,
            startY + (endY - startY) * offset,
            startX + (endX - startX) * (offset + length),
            startY + (endY - startY) * (offset + length),
            color
        )
    }
}