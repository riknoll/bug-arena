namespace hourOfAi.tower {
    let shadeImage: Image;

    export function createShadow() {
        return new Challenger(
            {
                colorPalette: [15, 11, 2],
                legLength: 5,
                bodyRadius: 5,
                noseRadius: 2,
                fillColor: 13
            },
            "Shadow",
            [
                tower.dialog("Keh heh heh heh!", introCutscene, imgs.shadow_silhouette, "?????"),
                tower.dialog("Well, what do we have here?"),
                tower.dialog("Another fool climbing the tower!"),
                tower.dialog("I suppose you expect to defeat me? Not likely."),
                tower.dialog("Let's see how you fare against true darkness...", endIntroCutscene)
            ],
            "Follows the opponent's color.",
            [
                tower.dialog("Ha! A waste of time!", playerLoseCutscene),
                tower.dialog("You cannot defeat true darkness!")
            ],
            [
                tower.dialog("Curses!", playerWinCutscene),
                tower.dialog("But I'll have the last laugh, I swear it!")
            ],
            imgs.shadow,
            hourOfAi.algorithms.followOpponentColor
        );
    }

    const lightColorRamp = img`
        . 1 2 3 4 5 6 7 8 9 a b c d e f
        . b 3 4 5 1 7 5 9 b 2 b b c d e
    `;

    let lightColorBuffer: Buffer;

    function initLightColorBuffer() {
        if (lightColorBuffer) return;
        const shadeLevels = 4;
        lightColorBuffer = control.createBuffer(16 * (shadeLevels + 1));

        for (let x = 0; x < 16; x++) {
            lightColorBuffer[lightColorBuffer.length - 16 + x] = x;
        }

        for (let i = shadeLevels - 1; i > 0; i--) {
            for (let x = 0; x < 16; x++) {
                const index = x + (i << 4);
                lightColorBuffer[index] = lightColorRamp.getPixel(lightColorBuffer[index + 16], 1);
            }
        }
    }

    let candleHalos: Image[] = [];

    function initCandleHalos() {
        if (candleHalos.length) return;
        for (let i = 0; i < 16; i++) {
            const img = image.create(8 + (i << 2), 4 + (i << 1));
            img.fill(4);
            const rx = (img.width >> 1) - 1;
            const ry = (img.height >> 1) - 1;

            fillEllipse(img, img.width >> 1, img.height >> 1, rx | 0, ry | 0, 3);
            fillEllipse(img, img.width >> 1, img.height >> 1, (rx * 2 / 3) | 0, (ry * 2 / 3) | 0, 2);
            fillEllipse(img, img.width >> 1, img.height >> 1, (rx / 3) | 0, (ry / 3) | 0, 1);
            candleHalos.push(img);
        }
    }

    function fillEllipse(image: Image, cx: number, cy: number, rx: number, ry: number, color: number) {
        midpointEllipse(cx, cy, rx, ry, (x1, y1, x2, y2) => {
            image.fillRect(x1, y1, x2 - x1 + 1, 1, color);
        })
    }

    function midpointEllipse(cx: number, cy: number, rx: number, ry: number, handler: (x: number, y: number, x2: number, y2: number) => void) {
        let x = 0;
        let y = ry;

        let ry2 = ry * ry;
        let rx2 = rx * rx;

        let d1 = ry2 - (rx2 * ry) + (0.25 * rx2);
        let dx = 2 * ry2 * x;
        let dy = 2 * rx2 * y;

        while (dx < dy) {
            handler(cx - x, cy + y, cx + x, cy + y);
            handler(cx - x, cy - y, cx + x, cy - y);

            if (d1 < 0) {
                x++;
                dx += 2 * ry2;
                d1 = d1 + dx + ry2;
            }
            else {
                x++;
                y--;
                dx += 2 * ry2;
                dy -= 2 * rx2;
                d1 = d1 + dx - dy + ry2;
            }
        }

        let d2 = (ry2 * ((x + 0.5) * (x + 0.5))) +
            (rx2 * ((y - 1) * (y - 1))) -
            (rx2 * ry2);

        while (y >= 0) {
            handler(cx - x, cy + y, cx + x, cy + y);
            handler(cx - x, cy - y, cx + x, cy - y);

            if (d2 > 0) {
                y--;
                dy = dy - (2 * rx2);
                d2 = d2 + rx2 - dy;
            }
            else {
                y--;
                x++;
                dx = dx + (2 * ry2);
                dy = dy - (2 * rx2);
                d2 = d2 + dx - dy + rx2;
            }
        }
    }

    function introCutscene(context: DialogContext) {
        initLightColorBuffer();
        initCandleHalos();

        const cx = 80;
        const cy = 40;

        const radius = 40;
        const numCandles = 16;

        let candles: tourney.FireSprite[] = [];

        shadeImage = image.create(screen.width, 80);
        shadeImage.fill(4);


        const bgRenderable = scene.createRenderable(-3, () => {
            screen.fill(15)
            helpers.mapImage(
                screen,
                shadeImage,
                0,
                0,
                lightColorBuffer
            )
        });


        for (let i = 0; i < numCandles; i++) {
            const angle = (i / numCandles) * 2 * Math.PI + 0.2;
            const candle = new tourney.FireSprite(4, 16, true);
            candle.setStrength(12);
            candle.x = cx + Math.cos(angle) * radius,
                candle.bottom = cy + Math.sin(angle) * radius / 2
            candle.z = 0.5 + (candle.bottom / 200);
            candles.push(candle);
            candle.setKind(SpriteKind.DialogSprite);
            candle.data.haloIndex = candleHalos.length + i;

            context.pause(100)
            candle.setStrength(4);
        }

        context.pause(1000);
        const shadow = sprites.create(imgs.small_shadow[0], SpriteKind.DialogSprite);
        shadow.bottom = 0;
        shadow.z = 1;
        animation.runImageAnimation(shadow, imgs.small_shadow, 150, true);

        animation.runMovementAnimation(shadow, `q 0 35 0 35`, 1000);
        for (let i = 0; i < 30; i++) {
            shadeImage.fill(4);
            const halo = candleHalos[Math.min(i >> 1, candleHalos.length - 1)];
            // console.log(halo.height)
            for (const candle of candles) {
                candle.setStrength(i + 4);
                helpers.mergeImage(
                    shadeImage,
                    halo,
                    candle.x - (halo.width >> 1) | 0,
                    candle.bottom - (halo.height >> 1) | 0
                );
            }
            context.pause(10)
        }


        control.runInBackground(() => {
            context.pauseUntilFinished();
            bgRenderable.destroy();
        });
    }

    function endIntroCutscene(context: DialogContext) {
        const dialogSprites = sprites.allOfKind(SpriteKind.DialogSprite);
        const candles = dialogSprites.filter(s => s instanceof tourney.FireSprite) as tourney.FireSprite[];

        let stillGoing = true;
        animation.runMovementAnimation(dialogSprites.filter(s => !(s instanceof tourney.FireSprite))[0], `q 0 -50 0 -50`, 1000);
        while (stillGoing) {
            shadeImage.fill(4);
            stillGoing = false;
            for (const candle of candles) {
                const haloIndex = candle.data.haloIndex;
                candle.data.haloIndex = haloIndex - 1;

                if (haloIndex < 0) {
                    candle.destroy();
                }
                else {
                    const halo = candleHalos[Math.min(haloIndex, candleHalos.length - 1)];
                    helpers.mergeImage(
                        shadeImage,
                        halo,
                        candle.x - (halo.width >> 1) | 0,
                        candle.bottom - (halo.height >> 1) | 0
                    );
                    stillGoing = true;
                    candle.setStrength(haloIndex);
                }
            }
            context.pause(50);
        }
        candleHalos = [];
    }

    function playerLoseCutscene(context: DialogContext) {
        scene.setBackgroundColor(12)
        const shadow = sprites.create(imgs.small_shadow[0], SpriteKind.DialogSprite);
        shadow.bottom = 55;
        shadow.z = 1;
        animation.runImageAnimation(shadow, imgs.small_shadow, 150, true);

        control.runInParallel(() => {
            context.pauseUntilNextStep();
            animation.runMovementAnimation(shadow, `q 0 -55 0 -55`, 1000);
        })
    }

    function playerWinCutscene(context: DialogContext) {
        scene.setBackgroundColor(12)
        const shadow = sprites.create(imgs.small_shadow[0], SpriteKind.DialogSprite);
        shadow.bottom = 55;
        shadow.z = 1;
        animation.runImageAnimation(shadow, imgs.small_shadow, 150, true);

        control.runInParallel(() => {
            context.pauseUntilNextStep();
            animation.runMovementAnimation(shadow, `q 0 -55 0 -55`, 1000);
        })
    }

    function explosion(context: DialogContext) {
        control.runInParallel(() => {
            while (!context.isFinished()) {
                control.runInParallel(() => {
                    if (context.isFinished()) return;
                    const fire = new tourney.FireSprite(6, 24, true);
                    fire.setKind(SpriteKind.DialogSprite);
                    fire.lifespan = 400;
                    const angle = (randint(0, 359) * Math.PI / 180);
                    const radius = randint(8, 24);
                    fire.x = 80 + radius * Math.cos(angle);
                    fire.y = 60 + radius * Math.sin(angle);
                    fire.z = fire.y / 200;
                    for (let i = 0; i < 5; i++) {
                        mirrorFire(fire);
                    }
                    pause(200);
                    fire.extinguish();
                })
                // setTimeout(() => fire.extinguish(), 200)
                pause(100);
            }
        })
    }

    function mirrorFire(fire: tourney.FireSprite) {
        const angle = (randint(0, 359) * Math.PI / 180);
        const radius = randint(8, 24);
        const x = (80 + radius * Math.cos(angle)) - (fire.width >> 1);
        const y = 60 + radius * Math.sin(angle) - (fire.height >> 1);

        let r: scene.Renderable;
        r = scene.createRenderable(y / 200, () => {
            if (fire.flags & sprites.Flag.Destroyed) {
                r.destroy();
                return;
            }
            fire.draw(x, y);
        })
    }

}