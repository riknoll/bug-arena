const fireRamp = img`
    . a 2 3 4 1
`

function showIntro(player1: string, player2: string) {
    const font = fancyText.bold_sans_7;
    const color = 15
    const spacing = 5;

    const leftText = fancyText.create(player1, 0, color, font)
    const vs = fancyText.create("VS", 0, color, font);
    const rightText = fancyText.create(player2, 0, color, font);

    vs.x = screen.width / 2;
    vs.y = 50;



    leftText.y = vs.y;
    leftText.right = vs.left - spacing;
    rightText.y = vs.y;
    rightText.left = vs.right + spacing;
    leftText.setFlag(SpriteFlag.Invisible, true);
    rightText.setFlag(SpriteFlag.Invisible, true);
    vs.setFlag(SpriteFlag.Invisible, true);

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

    const fire = createFire(vs.bottom - 28);

    pause(1000);

    const fight = fancyText.create("Fight!", 0, 2, fancyText.gothic_large)
    fight.z = -1
    const fight2 = scene.createRenderable(-0.4, () => {

        for (let x = 0; x < fight.width; x++) {
            for (let y = 0; y < fight.height; y++) {
                if (screen.getPixel(x + fight.left, y + fight.top) === 2) {
                    screen.setPixel(x + fight.left, y + fight.top, screen.getPixel(x + fight.left, y + fight.top - 30))
                }
            }
        }
    })

    fight.top = vs.bottom + spacing

    pause(2000);
    fight.destroy();
    leftText.destroy();
    rightText.destroy();
    vs.destroy();
    fight2.destroy();
    fire.destroy();
}

class Data {
    values: number[];

    constructor(
        public width: number,
        public height: number
    ) {
        this.values = [];
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
    }
}

function createFire(top: number) {
    const fireData = new Data(50, 30);

    const update = () => {
        for (let x = 0; x < fireData.width; x++) {
            fireData.setPixel(x, fireData.height - 1, randint(0, 56));
        }
        for (let x = 0; x < fireData.width; x++) {
            for (let y = 0; y < fireData.height; y++) {
                fireData.setPixel(x, y - 1, (
                    fireData.getPixel(x, y) +
                    fireData.getPixel(x - 1, y) +
                    fireData.getPixel(x + 1, y) +
                    fireData.getPixel(x, y - 1) +
                    fireData.getPixel(x, y + 1)
                ) / 5);
                fireData.setPixel(x, y, fireData.getPixel(x, y) - randint(0, 8))
            }
        }
    }
    game.stats = true
    const palette = [0, 1, 1, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 5].map(index => fireRamp.getPixel(index, 0));

    const setPixel = (x: number, y: number, fireX: number, fireY: number) => {
        const color = palette[Math.min(fireData.getPixel(fireX, fireY) | 0, palette.length - 1)]
        if (color) {
            screen.setPixel(
                x, y + top, color
            )
        }
    }

    const res = scene.createRenderable(-0.5, () => {
        update();
        const loopStart = 5;
        const loopLength = fireData.width - (loopStart << 1);

        let flip = false;
        for (let x = 0; x < loopStart; x++) {
            for (let y = 0; y < fireData.height; y++) {
                setPixel(x, y, x, y);
                setPixel(screen.width - loopStart + x, y, fireData.width - loopStart + x, y);
            }
        }

        for (let x = loopStart; x < screen.width - loopStart; x++) {
            let xIndex = (x - loopStart) % loopLength;

            const doFlip = xIndex === loopLength - 1;
            if (flip) {
                xIndex = fireData.width - loopStart - xIndex;
            }
            else {
                xIndex += loopStart;
            }

            if (doFlip) {
                flip = !flip;
            }

            for (let y = 0; y < fireData.height; y++) {
                setPixel(x, y, xIndex, y);
            }
        }
    })

    return res;
}