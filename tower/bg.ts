namespace hourOfAi.tower {
    const MAX_ZOOM = 14;
    const blitBG = image.create(screen.width, screen.height);
    let miniSprites: MiniSprite[] = [];

    class MiniSprite {
        protected frame: number = 0;
        protected frameTimer: number = 0;

        done = false;

        constructor(public animation: Image[], public x: number, public y: number, public frameTime: number) {
            this.frameTimer = frameTime;
            miniSprites.push(this);
        }

        update() {
            this.frameTimer -= game.eventContext().deltaTimeMillis;
            while (this.frameTimer <= 0) {
                this.frameTimer += this.frameTime;
                this.frame = (this.frame + 1) % this.animation.length;
            }
        }

        draw(scroll: number) {
            const y = this.y + scroll;

            const image = this.animation[this.frame];
            if (y > 120  || y + image.height < 0) return;

            screen.drawTransparentImage(image, this.x, y);
        }
    }

    class DriftingSprite extends MiniSprite {
        endX: number;
        speed: number;

        constructor(public animation: Image[], public x: number, public startY: number, public frameTime: number, public startSpeed: number) {
            super(animation, x, startY, frameTime);

            this.speed = startSpeed;

            if (this.speed > 0) {
                this.endX = screen.width
            }
            else {
                this.endX = -animation[0].width;
            }
        }

        update(): void {
            this.x += this.speed * game.eventContext().deltaTime;

            if ((this.speed > 0 && this.x > this.endX) || (this.speed < 0 && this.x < this.endX)) {
                if (this.x < 0) {
                    this.x += screen.width + randint(20, 100);
                }
                else {
                    this.x -= screen.width + randint(20, 100) + this.animation[0].width;
                }

                this.y = this.startY + randint(-20, 20);
                this.speed = this.startSpeed + randint(-this.startSpeed / 4, this.startSpeed / 4);
            }
        }
    }

    class HotAirBalloon extends MiniSprite {
        movingUp = false;

        constructor(public animation: Image[], public x: number, public startY: number, public frameTime: number) {
            super(animation, x, startY, frameTime);
        }

        // draw(scroll: number) {
        //     const y = this.y + scroll;

        //     const image = this.animation[this.frame];
        //     if (y > 120  || y + image.height < 0) return;

        //     screen.blit(
        //         this.x,
        //         y,
        //         this.animation[0].width >> 2,
        //         this.animation[0].height >> 2,
        //         this.animation[this.frame],
        //         0,
        //         0,
        //         this.animation[0].width,
        //         this.animation[0].height,
        //         true,
        //         false
        //     )
        // }

        update(): void {
            if (this.movingUp) {
                this.y -= 0.25;

                if (this.y < this.startY) {
                    this.movingUp = false;
                }
            }
            else {
                this.y += 0.01;

                if (this.y > this.startY + 5) {
                    this.movingUp = true;
                }
            }

            this.x -= game.eventContext().deltaTime;

            if (this.x < -this.animation[0].width) {
                this.x = screen.width + randint(5, 10)
            }
        }
    }

    export class TowerScene {
        scroll: number = 0;
        xOffset: number = 92;
        zoom: number = 1;

        renderable: scene.Renderable;
        currentAnimation: Animation;

        visible: boolean = true;

        constructor() {
            this.createRenderable();
        }

        protected createRenderable() {
            // let currentIndex = 0;

            // controller.A.onEvent(ControllerButtonEvent.Pressed, () => {
            //     this.scrollTo(currentIndex);
            //     this.zoomIn();
            //     pause(500);
            //     this.zoomOut();
            //     currentIndex++;
            // });

            const bgColors = [
                15, 10, 2, 3, 4, 9
            ]

            const cloudColors = [
                0,
                0,
                10,
                2,
                3,
                1
            ]

            const bgHeights = [
                200,
                80,
                100,
                120,
                200,
                240
            ]

            const CLOUD_TOP = -30

            let top = CLOUD_TOP;
            for (let bgLayer = bgHeights.length - 1; bgLayer > 0; bgLayer--) {
                if (cloudColors[bgLayer]) {
                    let y = randint(top - bgHeights[bgLayer] + 20, top - 10);
                    let x = randint(0, screen.width + 30);

                    for (let i = 0; i < bgHeights[bgLayer] / 30; i++) {
                        const cloud = imgs.clouds[randint(0, imgs.clouds.length - 1)].clone();
                        cloud.replace(1, cloudColors[bgLayer]);
                        new DriftingSprite([cloud], x, y, 1000, -randint(5, 10));
                        y += randint(10, 30);
                        if (y > top - 10) {
                            y -= bgHeights[bgLayer] - 30
                        }

                        x += randint(20, 60);
                        if (x > screen.width + 30) {
                            x -= screen.width + 30
                        }
                    }
                }

                top -= bgHeights[bgLayer];
            }

            let backgroundLayers = [
                imgs.cloudLayer0, imgs.cloudLayer1, imgs.cloudLayer2, imgs.cloudLayer3
            ];

            const wave = image.create(160, 5);

            const numRipples = 4;
            for (let x = 0; x < wave.width; x++) {
                const v = 1 + (wave.height / 2) * (Math.sin((x / wave.width) * Math.PI * numRipples) + 1);
                wave.fillRect(x, 0, 1, v, 1);
            }

            let backgroundOffsets = [0, 0, 0, 0]
            scene.setBackgroundColor(15)
            let frameTimer = randint(30, 90);
            let lightningX = randint(10, 100);

            const colorRamp = img`
                . 1 2 3 4 5 6 7 8 9 a b c d e f
                . 1 2 3 4 1 7 1 9 b 2 1 b c d e
            `;
            const buf = control.createBuffer(16);

            for (let i = 0; i < 16; i++) {
                buf[i] = colorRamp.getPixel(i, 1);
            }

            const lightningAnim = imgs.lightningFrames;
            const flippedCloud = imgs.cloudLayer0.clone();
            flippedCloud.flipY();

            const balloon = new HotAirBalloon([imgs.hot_air_balloon], 110, -200, 200);

            // let y = randint(-220, CLOUD_TOP);

            // for (let i = 0; i < imgs.clouds.length << 1; i++) {
            //     new DriftingSprite([imgs.clouds[i % imgs.clouds.length]], randint(0, screen.width), y, 1000, -randint(5, 20));
            //     y = (y + randint(20, 60));
            //     if (y > CLOUD_TOP) {
            //         y -= 190
            //     }
            // }

            // y = randint(-400, -230)
            // for (let i = 0; i < imgs.clouds.length << 1; i++) {
            //     const darkerCloud = imgs.clouds[i % imgs.clouds.length].clone();
            //     darkerCloud.replace(1, 3);

            //     new DriftingSprite([darkerCloud], randint(0, screen.width), y, 1000, -randint(5, 20));
            //     y = (y + randint(20, 60));
            //     if (y > -230) {
            //         y -= 170
            //     }
            // }

            this.renderable = scene.createRenderable(0, () => {
                if (!this.visible) return;

                if (controller.A.isPressed()) {
                    this.scroll++
                }

                frameTimer--;
                const scroll = this.scroll | 0;
                screen.fillRect(0, 90 + scroll, 160, 30, 6)

                let top = 0;

                for (let i = bgColors.length - 1; i >= 0; i--) {
                    top -= bgHeights[i];
                    screen.fillRect(0, top + scroll, 160, bgHeights[i], bgColors[i]);
                    wave.replace(1, bgColors[i]);
                    screen.drawTransparentImage(wave, 0, top + scroll + bgHeights[i]);
                    wave.replace(bgColors[i], 1);
                }

                for (const mini of miniSprites) {
                    mini.update();
                    mini.draw(scroll);
                }

                const frame = lightningAnim.length - (frameTimer >> 1) - 1
                if (scroll < 150) {
                    // screen.fillRect(0, -160 + scroll, 160, 120, 9)


                    for (let i = backgroundLayers.length - 1; i >= 0; i--) {
                        backgroundOffsets[i] += (i + 1);
                        const y = Math.max(CLOUD_TOP + scroll, scroll * (i / 2 + 1))

                        this.fillRectCore(0, CLOUD_TOP + scroll, screen.width, y - CLOUD_TOP - scroll, backgroundLayers[i].getPixel(0, 0))

                        this.drawImageCore(
                            backgroundLayers[i],
                            -(backgroundOffsets[i] % screen.width),
                            y
                        )
                        this.drawImageCore(
                            backgroundLayers[i],
                            screen.width - (backgroundOffsets[i] % screen.width),
                            y
                        )

                        if (i === 1) {
                            if (frameTimer < lightningAnim.length << 1) {
                                this.drawImageCore(lightningAnim[frame], lightningX, scroll + (lightningX % 5))
                            }

                            for (let x = 0; x < 160 + 60; x += 7) {
                                const time = game.runtime() + Math.sin(x * Math.PI / 16) * 400;
                                const iteration = Math.idiv(time, 300);
                                drawPartialLine(x, scroll, x - 60, scroll + 90 + (1 + Math.sin(iteration)) * 30, (time / 300) % 1, 0.05, 8)
                                // screen.drawLine(x, 0, x - 60, 90, 1)
                            }

                            this.drawTower();

                            for (let x = 7; x < 160 + 60; x += 13) {
                                const time = game.runtime() + Math.sin(x * Math.PI / 16) * 400;
                                const iteration = Math.idiv(time, 300);
                                drawPartialLine(x, scroll, x - 60, scroll + 90 + (1 + Math.sin(iteration)) * 30, (time / 300) % 1, 0.05, 8)
                                // screen.drawLine(x, 0, x - 60, 90, 1)
                            }
                        }
                    }

                    this.drawImageCore(flippedCloud, -(backgroundOffsets[0] % screen.width), CLOUD_TOP + scroll - flippedCloud.height - 10);
                    this.drawImageCore(flippedCloud, screen.width - (backgroundOffsets[0] % screen.width), CLOUD_TOP + scroll - flippedCloud.height - 10);
                    this.fillRectCore(0, CLOUD_TOP + scroll - 10, screen.width, 10, flippedCloud.getPixel(0, flippedCloud.height - 1))

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
                }
                else {
                    backgroundOffsets[0] ++
                    this.drawTower();
                    this.drawImageCore(flippedCloud, -(backgroundOffsets[0] % screen.width), CLOUD_TOP + scroll - flippedCloud.height - 10);
                    this.drawImageCore(flippedCloud, screen.width - (backgroundOffsets[0] % screen.width), CLOUD_TOP + scroll - flippedCloud.height - 10);
                    this.fillRectCore(0, CLOUD_TOP + scroll - 10, screen.width, 10, flippedCloud.getPixel(0, flippedCloud.height - 1))
                }


                if (this.zoom !== 1) {
                    blitBG.drawImage(screen, 0, 0);

                    screen.blit(
                        (screen.width >> 1) - ((blitBG.width * this.zoom) >> 1),
                        (screen.height >> 1) - ((blitBG.height * this.zoom) >> 1),
                        blitBG.width * this.zoom,
                        blitBG.height * this.zoom,
                        blitBG,
                        0,
                        0,
                        blitBG.width,
                        blitBG.height,
                        false,
                        false
                    )
                }

                miniSprites = miniSprites.filter(s => !s.done);
            });
        }

        protected drawTower() {
            drawTower(this.xOffset, 115, this.scroll, challengers.length * 2, 60, 1);
        }

        zoomIn(instant?: boolean) {
            if (instant) {
                this.zoom = MAX_ZOOM;
                return;
            }
            this.currentAnimation = new Animation(
                500,
                easeInExpo,
                t => this.zoom = 1 + t * (MAX_ZOOM - 1)
            );
            this.currentAnimation.start();
            this.currentAnimation.pauseUntilDone();
            this.zoom = MAX_ZOOM;
        }

        zoomOut(instant?: boolean) {
            if (instant) {
                this.zoom = 1;
                return;
            }

            this.currentAnimation = new Animation(
                500,
                easeOutCirc,
                t => this.zoom = MAX_ZOOM - t * (MAX_ZOOM - 1)
            );
            this.currentAnimation.start();
            this.currentAnimation.pauseUntilDone();
            this.zoom = 1;
        }

        scrollTo(challengerIndex: number, instant?: boolean) {
            const targetScroll = -35 + ((challengerIndex << 1) + 1) * (imgs.tower_section.height - 10);
            const startOffset = this.scroll;

            if (instant) {
                this.scroll = targetScroll;
                return;
            }

            this.currentAnimation = new Animation(
                Math.abs(targetScroll - startOffset) * 10,
                easeOutCirc,
                t => this.scroll = startOffset + (targetScroll - startOffset) * t
            );
            this.currentAnimation.start();
            this.currentAnimation.pauseUntilDone();
            this.scroll = targetScroll;
        }

        dispose() {
            this.renderable.destroy();
            miniSprites = [];
        }

        protected drawImageCore(img: Image, x: number, y: number) {
            if (y > 120) return;

            screen.drawTransparentImage(img, x, y);
        }

        protected fillRectCore(x: number, y: number, w: number, h: number, color: number) {
            if (y > 120) return;

            screen.fillRect(x, y, w, h, color);
        }
    }

    export function createMenuBackground(): TowerScene {
        return new TowerScene();
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