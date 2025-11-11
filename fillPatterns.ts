namespace hourOfAi {
    export function drawCircle(target: Image, x: number, y: number, getColor: (x: number, y: number) => number) {
        x -= 4;
        y -= 4;

        const setPixel = (x: number, y: number) => {
            target.setPixel(x, y, getColor(x | 0, y | 0));
        }

        for (let i = 0; i < 7; i++) {
            setPixel(x + 1 + i, y)
            setPixel(x + 1 + i, y + 8)
            setPixel(x, y + 1 + i)
            setPixel(x + 8, y + 1 + i)
        }

        for (let xx = 0; xx < 7; xx++) {
            for (let yy = 0; yy < 7; yy++) {
                setPixel(x + 1 + xx, y + 1 + yy)
            }
        }
    }

    const rainbow = img`2 3 4 5 7 9 8`

    function getColorRainbow(x: number, y: number) {
        return rainbow.getPixel(((x + y) >> 2) % rainbow.width, 0)
    }

    function createGetColorPattern(pattern: Image, color1: number, color2: number) {
        return (x: number, y: number) => pattern.getPixel(x & 0b111, y & 0b111) ? color1 : color2
    }

    function createGetColorSolid(color: number) {
        return (x: number, y: number) => color
    }

    export function colorFillConflictsWith(kind: FillColor, color: number) {
        switch (kind) {
            case FillColor.Red:
                return color === 2;
            case FillColor.Orange:
                return color === 3;
            case FillColor.Yellow:
                return color === 5;
            case FillColor.Green:
                return color === 7;
            case FillColor.Blue:
                return color === 8;
            case FillColor.Purple:
                return color === 10;
            case FillColor.Tatami:
                return color === 3 || color === 4;
            case FillColor.Wavy:
                return color === 7 || color === 9;
            case FillColor.Sparkles:
                return color === 10 || color === 8;
            case FillColor.Herringbone:
            case FillColor.Checkerboard:
                return color === 11 || color == 14;
            default:
                return false;
        }
    }

    export function getColorFillFunction(kind: FillColor) {
        switch (kind) {
            case FillColor.Red:
                return createGetColorSolid(2);
            case FillColor.Orange:
                return createGetColorSolid(3);
            case FillColor.Yellow:
                return createGetColorSolid(5);
            case FillColor.Green:
                return createGetColorSolid(7);
            case FillColor.Blue:
                return createGetColorSolid(8);
            case FillColor.Purple:
                return createGetColorSolid(10);
            case FillColor.Rainbow:
                return getColorRainbow;
            case FillColor.Wavy:
                return createGetColorPattern(
                    img`
                        1 . . . . . 1 1
                        . . . . . . . .
                        . . . . . . . .
                        . . 1 1 1 . . .
                        . 1 1 1 1 1 . .
                        1 1 1 1 1 1 1 1
                        1 1 1 1 1 1 1 1
                        1 1 . . . 1 1 1
                    `, 9, 7
                );
            case FillColor.Tatami:
                return createGetColorPattern(
                    img`
                        1 1 1 1 . 1 . 1
                        . . . . . 1 . 1
                        1 1 1 1 . 1 . 1
                        . . . . . 1 . 1
                        . 1 . 1 1 1 1 1
                        . 1 . 1 . . . .
                        . 1 . 1 1 1 1 1
                        . 1 . 1 . . . .
                    `, 3, 4
                );
            case FillColor.Sparkles:
                return createGetColorPattern(
                    img`
                        1 1 1 1 1 1 1 1
                        1 . 1 1 1 1 1 1
                        . . . 1 1 1 1 1
                        1 . 1 1 1 1 1 1
                        1 1 1 1 1 1 1 1
                        1 1 1 1 1 . 1 1
                        1 1 1 1 . . . 1
                        1 1 1 1 1 . 1 1
                    `, 10, 8
                );

            case FillColor.Herringbone:
                return createGetColorPattern(
                    img`
                        . . 1 1 . . 1 1
                        . 1 1 . 1 . . 1
                        1 1 . . 1 1 . .
                        1 . . 1 . 1 1 .
                        . . 1 1 . . 1 1
                        . 1 1 . 1 . . 1
                        1 1 . . 1 1 . .
                        1 . . 1 . 1 1 .
                    `, 11, 14
                );
            case FillColor.Checkerboard:
                return createGetColorPattern(
                    img`
                        1 1 . . 1 1 . .
                        1 1 . . 1 1 . .
                        . . 1 1 . . 1 1
                        . . 1 1 . . 1 1
                        1 1 . . 1 1 . .
                        1 1 . . 1 1 . .
                        . . 1 1 . . 1 1
                        . . 1 1 . . 1 1
                    `, 11, 14
                );
        }
    }
}