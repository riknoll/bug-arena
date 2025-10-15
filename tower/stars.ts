namespace hourOfAi.tower {
    export class StarFieldSprite extends sprites.ExtendableSprite {
        scroll = 0;
        stars: number[];
        starHeight = 1;

        frameTimer = 0;
        starX = 0;
        starY = 0;
        starX2 = 0;
        starY2 = 0;

        constructor() {
            super(img`.`);

            this.stars = createStarField();
        }

        draw(drawLeft: number, drawTop: number): void {

            let scroll = this.scroll % screen.height;

            if (scroll < 0) {
                scroll = (scroll + screen.height) % screen.height;
            }

            for (const star of this.stars) {
                const x = star >> 16;
                const y = ((star & 0xFFFF) + scroll) % screen.height;
                drawStar(x, y, this.starHeight);
            }

            if (this.frameTimer < 0) {
                this.frameTimer = randint(100, 400);
                this.starX = randint(0, screen.width);
                this.starY = randint(0, screen.height) - scroll;
                this.starX2 = this.starX - randint(20, 30);
                this.starY2 = this.starY + randint(20, 30);
            }
            else if (this.frameTimer < 10) {
                drawPartialLine(
                    this.starX, this.starY + scroll, this.starX2, this.starY2 + scroll, 1 - (this.frameTimer / 10), 0.1, 1
                )
            }
        }
    }

    function createStarField() {
        const stars: number[] = [];

        let x = 0;
        let y = 120;
        let i = 0;

        while (y > 0) {
            x += i * 66
            while (x > 160) {
                x -= 160;
                y--;
            }
            i = (i + 1) % 15;
            stars.push((x << 16) | y)
        }

        return stars;
    }

    export function drawStar(x: number, y: number, height: number) {
        // const i = ((game.runtime() + x * 37 + y * 108) / 500) | 0
        // if (i % 13 !== 0) {
        //     screen.setPixel(x, y, 1)
        // }
        // else {
        //     screen.setPixel(x, y, 5)
        // }
        screen.fillRect(x, y, 1, height, 1);
    }
}