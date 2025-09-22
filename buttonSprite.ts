namespace SpriteKind {
    export const MenuButton = SpriteKind.create();
}

namespace hourOfAi {
    export const BUTTON_WIDTH = 55;



    export class ButtonSprite extends sprites.ExtendableSprite {
        hover: boolean = false;

        constructor(public onClick: () => void) {
            super(img`.`, SpriteKind.MenuButton);
        }
    }

    export class TextButtonSprite extends ButtonSprite {
        constructor(public label: string, onClick: () => void) {
            super(onClick);

            this.setDimensions(BUTTON_WIDTH, 13);
        }

        draw(drawLeft: number, drawTop: number): void {
            fancyText.drawFrame(
                screen,
                this.hover ? imgs.buttonFrameHover : imgs.buttonFrame,
                drawLeft,
                drawTop,
                this.width,
                this.height
            );

            const textWidth = fancyText.getTextWidth(fancyText.bold_sans_7, this.label);

            fancyText.draw(
                this.label,
                screen,
                drawLeft + ((this.width - textWidth) >> 1),
                drawTop + 1,
                0,
                11,
                fancyText.bold_sans_7
            );
        }
    }

    export class CardButtonSprite extends ButtonSprite {
        constructor(
            onClick: () => void,
            public name: string,
            public description: string,
            public portrait: Image
        ) {
            super(onClick);
            this.setDimensions(149, 42);
        }

        draw(drawLeft: number, drawTop: number): void {
            fancyText.drawFrame(
                screen,
                this.hover ? imgs.textFrameHover : imgs.textFrame,
                drawLeft,
                drawTop,
                this.width,
                this.height
            );

            fancyText.draw(
                this.isUnlocked() ? this.name : "??????",
                screen,
                drawLeft + 5 + this.portrait.width + 2,
                drawTop + 5,
                0,
                11,
                fancyText.bold_sans_7
            );

            fancyText.draw(
                this.isUnlocked() ? this.description : "Unlock in Tower Mode",
                screen,
                drawLeft + 5 + this.portrait.width + 2,
                drawTop + 16,
                this.width - (5 + this.portrait.width + 2) - 5,
                11,
                fancyText.geometric_sans_6
            );

            if (this.isUnlocked()) {
                screen.drawTransparentImage(this.portrait, drawLeft + 5, drawTop + 5);
            }
            else {
                drawSilhouette(drawLeft + 5, drawTop + 5, this.portrait);
                if (this.hover) {
                    screen.drawTransparentImage(imgs.padlock, drawLeft + 5 + ((this.portrait.width - imgs.padlock.width) >> 1), drawTop + 5 + ((this.portrait.height - imgs.padlock.height) >> 1));
                }
            }
        }

        isUnlocked(): boolean {
            return true;
        }
    }

    export class ChallengerCardButtonSprite extends CardButtonSprite {
        constructor(public challengerIndex: number, onClick: () => void) {
            super(onClick, challengers[challengerIndex].name, challengers[challengerIndex].description, challengers[challengerIndex].portrait);
            this.setDimensions(149, 42);
        }

        isUnlocked(): boolean {
            return this.challengerIndex < 99;
        }
    }

    export function getButtonSprites(): ButtonSprite[] {
        return sprites.allOfKind(SpriteKind.MenuButton) as ButtonSprite[];
    }

    function drawSilhouette(drawLeft: number, drawTop: number, img: Image) {
        for (let x = 0; x < img.width; x++) {
            for (let y = 0; y < img.height; y++) {
                if (img.getPixel(x, y) !== 0) {
                    screen.setPixel(drawLeft + x, drawTop + y, 14);
                }
            }
        }
    }
}