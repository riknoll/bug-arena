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

    export class ChallengerCardButtonSprite extends ButtonSprite {
        constructor(public challengerIndex: number, onClick: () => void) {
            super(onClick);
            this.setDimensions(149, 42);
        }

        draw(drawLeft: number, drawTop: number): void {
            const challenger = challengers[this.challengerIndex];
            fancyText.drawFrame(
                screen,
                this.hover ? imgs.textFrameHover : imgs.textFrame,
                drawLeft,
                drawTop,
                this.width,
                this.height
            );

            fancyText.draw(
                this.isUnlocked() ? challenger.name : "??????",
                screen,
                drawLeft + 5 + challenger.portrait.width + 2,
                drawTop + 5,
                0,
                11,
                fancyText.bold_sans_7
            );

            fancyText.draw(
                this.isUnlocked() ? challenger.description : "Unlock in Tower Mode",
                screen,
                drawLeft + 5 + challenger.portrait.width + 2,
                drawTop + 16,
                this.width - (5 + challenger.portrait.width + 2) - 5,
                11,
                fancyText.geometric_sans_6
            );

            if (this.isUnlocked()) {
                screen.drawTransparentImage(challenger.portrait, drawLeft + 5, drawTop + 5);
            }
            else {
                drawSilhouette(drawLeft + 5, drawTop + 5, challenger.portrait);
                if (this.hover) {
                    screen.drawTransparentImage(imgs.padlock, drawLeft + 5 + ((challenger.portrait.width - imgs.padlock.width) >> 1), drawTop + 5 + ((challenger.portrait.height - imgs.padlock.height) >> 1));
                }
            }
        }

        isUnlocked(): boolean {
            return this.challengerIndex < 3;
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