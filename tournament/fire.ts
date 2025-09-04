namespace tourney {
    const fireRamp = img`
        . a 2 3 4 1
    `

    export function showIntro(player1: string, player2: string, z: number) {
        const font = fancyText.bold_sans_7;
        const p1font = image.getFontForText(player1) === image.font12 ? fancyText.unicodeArcade : font;
        const p2font = image.getFontForText(player2) === image.font12 ? fancyText.unicodeArcade : font;
        const spacing = 5;

        const leftText = fancyText.create(player1, 0, INTRO_TEXT_COLOR, p1font);
        const vs = fancyText.create("VS", 0, INTRO_TEXT_COLOR, font);
        const rightText = fancyText.create(player2, 0, INTRO_TEXT_COLOR, p2font);
        const totalWidth = vs.width + leftText.width + rightText.width + (spacing << 1);

        const left = (screen.width / 2) - totalWidth / 2;

        leftText.left = left;
        vs.left = leftText.right + spacing;
        rightText.left = vs.right + spacing;

        vs.y = 50;
        leftText.y = vs.y;
        rightText.y = vs.y;

        leftText.setFlag(SpriteFlag.Invisible, true);
        rightText.setFlag(SpriteFlag.Invisible, true);
        vs.setFlag(SpriteFlag.Invisible, true);

        leftText.z = z + 1;
        rightText.z = z + 1;
        vs.z = z + 1;

        pause(200)
        leftText.setFlag(SpriteFlag.Invisible, false);
        scene.cameraShake(2, 100);
        pause(200)
        vs.setFlag(SpriteFlag.Invisible, false);
        scene.cameraShake(2, 100);
        pause(200)
        rightText.setFlag(SpriteFlag.Invisible, false);
        scene.cameraShake(2, 100);
        pause(500)

        const fire = new FireSprite(160, 60);
        fire.top = vs.bottom - 28;
        fire.left = 0;
        fire.z = z + 0.5;

        pause(1000);

        const fight = fancyText.create("Fight!", 0, 2, fancyText.gothic_large)
        fight.z = z;
        const fight2 = scene.createRenderable(z + 0.6, () => {
            for (let x = -2; x < fight.width; x++) {
                for (let y = 0; y < fight.height; y++) {
                    if (screen.getPixel(x + fight.left, y + fight.top) === 2) {
                        screen.setPixel(x + fight.left, y + fight.top, screen.getPixel(x + fight.left, y + fight.top - 30))
                    }
                }
            }
        })

        fight.top = vs.bottom + spacing

        pause(2000);
        leftText.destroy();
        rightText.destroy();
        vs.destroy();
        fire.extinguish();
        fight.destroy();
        fight2.destroy();
    }

    export class FireSprite extends sprites.ExtendableSprite {
        protected fireData: Data;
        protected strength = 56;

        constructor(
            width: number,
            height: number,
            public roundBottom?: boolean
        ) {
            super(img`.`);
            this.fireData = new Data(Math.min(width, 40), Math.min(height, 30), [0, 1, 1, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 5].map(index => fireRamp.getPixel(index, 0)));
            this.setDimensions(width, height);
        }

        draw(left: number, top: number) {
            for (let x = 0; x < this.fireData.width; x++) {
                this.fireData.setPixel(x, this.fireData.height - 1, randint(0, this.strength));
            }
            for (let x = 0; x < this.fireData.width; x++) {
                for (let y = 0; y < this.fireData.height; y++) {
                    this.fireData.setPixel(x, y - 1, (
                        this.fireData.getPixel(x, y) +
                        this.fireData.getPixel(x - 1, y) +
                        this.fireData.getPixel(x + 1, y) +
                        this.fireData.getPixel(x, y - 1) +
                        this.fireData.getPixel(x, y + 1)
                    ) / 5);
                    this.fireData.setPixel(x, y, this.fireData.getPixel(x, y) - randint(0, 8))
                }
            }

            // since the fire data is smaller than the width, we're going to loop
            // the middle portion
            const loopStart = 5;
            const loopLength = this.fireData.width - (loopStart << 1);

            if (this.roundBottom) {
                this.fireData.rendered.setPixel(0, this.fireData.rendered.height - 1, 0);
                this.fireData.rendered.setPixel(this.fireData.rendered.width - 1, this.fireData.rendered.height - 1, 0);
            }

            // left edge of fire
            screen.blit(
                left,
                top,
                loopStart,
                this.fireData.height,
                this.fireData.rendered,
                0,
                0,
                loopStart,
                this.fireData.height,
                true,
                false
            );

            // right edge of fire
            screen.blit(
                left + this.width - loopStart,
                top,
                loopStart,
                this.fireData.height,
                this.fireData.rendered,
                this.fireData.width - loopStart,
                0,
                loopStart,
                this.fireData.height,
                true,
                false
            );


            // repeat the loop, flipping direction each time so that it looks more continuous
            const numLoops = (this.width - (loopStart << 1)) / loopLength;
            for (let i = 0; i < numLoops; i++) {
                const actualLoopLength = Math.min(loopLength, this.width - (loopStart << 1) - (i * loopLength))
                const offsetX = left + loopStart + i * loopLength;
                if (i & 1) {
                    // we don't have an API to blit backwards, so do it column by column
                    for (let x = 0; x < actualLoopLength; x++) {
                        screen.blit(
                            offsetX + x,
                            top,
                            1,
                            this.fireData.height,
                            this.fireData.rendered,
                            this.fireData.width - loopStart - x,
                            0,
                            1,
                            this.fireData.height,
                            true,
                            false
                        );
                    }
                }
                else {
                    screen.blit(
                        offsetX,
                        top,
                        actualLoopLength,
                        this.fireData.height,
                        this.fireData.rendered,
                        loopStart,
                        0,
                        actualLoopLength,
                        this.fireData.height,
                        true,
                        false
                    );
                }
            }
        }

        setStrength(strength: number) {
            this.strength = Math.max(0, strength);
        }

        extinguish() {
            this.strength = 0;
            pause(500);
            this.destroy();
        }
    }

    class Data {
        values: number[];
        rendered: Image;

        constructor(
            public width: number,
            public height: number,
            public palette: number[],
        ) {
            this.values = [];
            this.rendered = image.create(width, height);
            for (let x = 0; x < width; x++) {
                for (let y = 0; y < height; y++) {
                    this.values.push(0)
                }
            }
        }

        getPixel(x: number, y: number) {
            if (x < 0 || x >= this.width || y < 0 || y >= this.height) return 0;

            return this.values[y * this.width + x]
        }

        setPixel(x: number, y: number, value: number) {
            this.values[y * this.width + x] = value;
            this.rendered.setPixel(x, y, this.palette[Math.min(value | 0, this.palette.length - 1)]);
        }
    }
}

// scene.setBackgroundColor(6)
// showIntro("Richard", "The World")