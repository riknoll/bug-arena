namespace hourOfAi {
    export enum GameMode {
        MainMenu,
        Practice,
        Tower
    }

    export function initMainMenu() {
        // const practice = new TextButtonSprite("Practice", () => {});
        // const towerButton = new TextButtonSprite("Tower", () => {});

        // practice.top = 2;
        // towerButton.top = practice.bottom + 4;

        // const testChallenger1 = new ChallengerCardButtonSprite(0, () => {})

        // testChallenger1.left = 5;
        // testChallenger1.top = towerButton.bottom + 2

        // const testChallenger2 = new ChallengerCardButtonSprite(1, () => {})

        // testChallenger2.left = 5;
        // testChallenger2.top = testChallenger1.bottom + 1;

        let mouseX = 0;
        let mouseY = 0;

        browserEvents.onMouseMove((x, y) => {
            mouseX = x;
            mouseY = y;

            for (const button of getButtonSprites()) {
                button.hover = overlapsPoint(button, x, y);
            }
        });

        browserEvents.MouseLeft.onEvent(browserEvents.MouseButtonEvent.Pressed, () => {
            for (const button of getButtonSprites()) {
                if (overlapsPoint(button, mouseX, mouseY)) {
                    button.onClick();
                }
            }
        });

        initPracticeMenu();
    }

    function overlapsPoint(sprite: Sprite, x: number, y: number): boolean {
        return x >= sprite.left && x < sprite.right && y >= sprite.top && y < sprite.bottom;
    }

    function setGameMode(mode: GameMode) {
    }

    export function initPracticeMenu() {
        const TITLE_HEIGHT = 14;

        const VISIBLE_HEIGHT = screen.height - TITLE_HEIGHT;
        const SCROLL_BAR_WIDTH = imgs.scrollbarDown.width;
        const BAR_HEIGHT = VISIBLE_HEIGHT - imgs.scrollbarUp.height - imgs.scrollbarDown.height + 2;

        let scroll = 0;
        let totalHeight = TITLE_HEIGHT + 1;

        scene.createRenderable(-1, () => {
            screen.fill(6);
        })

        scene.createRenderable(10, () => {
            drawScrollBar(screen.width - imgs.scrollbarUp.width, TITLE_HEIGHT, VISIBLE_HEIGHT, totalHeight, scroll);
            screen.fillRect(
                0, 0, screen.width, TITLE_HEIGHT, 12
            )
            // screen.fillRect(
            //     0, TITLE_HEIGHT - 1, screen.width, 1, 15
            // )
            screen.fillRect(
                0, TITLE_HEIGHT - 1, screen.width, 1, 13
            )
            fancyText.draw("Choose Opponent", screen, 2, 1, 0, 15, fancyText.bold_sans_7)
        })

        let cards: ChallengerCardButtonSprite[] = [];

        for (let i = 0; i < challengers.length; i++) {
            const button = new ChallengerCardButtonSprite(i, () => {});
            button.left = 1;
            button.top = totalHeight;

            totalHeight = button.bottom + 1;
            cards.push(button);
        }
        totalHeight -= TITLE_HEIGHT;

        const MAX_SCROLL = totalHeight - VISIBLE_HEIGHT;
        const HANDLE_HEIGHT = Math.max(8, (VISIBLE_HEIGHT / totalHeight) * BAR_HEIGHT) | 0;

        const setScroll = (newScroll: number) => {
            scroll = Math.min(MAX_SCROLL, Math.max(0, newScroll));
            for (const card of cards) {
                card.top = card.challengerIndex * (card.height + 1) + TITLE_HEIGHT - scroll + 1;
            }
        }


        browserEvents.onWheel((dx, dy, dz) => {
            setScroll(scroll + dy / 3);
        })

        let mouseX = 0;
        let mouseY = 0;

        let draggingScrollBar = false;
        let upPressedTime = 0;
        let downPressedTime = 0;

        browserEvents.MouseLeft.onEvent(browserEvents.MouseButtonEvent.Pressed, (x, y) => {
            draggingScrollBar = false;
            upPressedTime = 0;
            downPressedTime = 0;
            if (x > screen.width - SCROLL_BAR_WIDTH && y > TITLE_HEIGHT) {
                if (y < TITLE_HEIGHT + imgs.scrollbarUp.height) {
                    setScroll(scroll - 4);
                    upPressedTime = game.runtime();
                }
                else if (y > screen.height - imgs.scrollbarDown.height) {
                    setScroll(scroll + 4);
                    downPressedTime = game.runtime();
                }
                else {
                    draggingScrollBar = true;
                }
            }
        });


        browserEvents.MouseLeft.onEvent(browserEvents.MouseButtonEvent.Released, (x, y) => {
            draggingScrollBar = false;
            upPressedTime = 0;
            downPressedTime = 0;
        });

        game.currentScene().eventContext.registerFrameHandler(scene.UPDATE_PRIORITY, () => {
            if (upPressedTime) {
                const elapsed = game.runtime() - upPressedTime;
                if (elapsed > 500) {
                    setScroll(scroll - 1);
                }
            }
            else if (downPressedTime) {
                const elapsed = game.runtime() - downPressedTime;
                if (elapsed > 500) {
                    setScroll(scroll + 1);
                }
            }
        });

        browserEvents.onMouseMove((x, y) => {
            mouseX = x;
            mouseY = y;

            if (draggingScrollBar) {
                const position = y - TITLE_HEIGHT - imgs.scrollbarUp.height - (HANDLE_HEIGHT >> 1);

                const barHeight = VISIBLE_HEIGHT - imgs.scrollbarUp.height - imgs.scrollbarDown.height + 2;
                setScroll((position / barHeight) * totalHeight);
            }
            else {
                for (const button of getButtonSprites()) {
                    button.hover = overlapsPoint(button, x, y);
                }
            }
        });
    }

    export function drawScrollBar(left: number, top: number, scrollBarHeight: number, contentHeight: number, scroll: number) {
        const SCROLL_BAR_WIDTH = imgs.scrollbarDown.width;
        const BAR_HEIGHT = scrollBarHeight - imgs.scrollbarUp.height - imgs.scrollbarDown.height + 2;

        screen.drawImage(
            imgs.scrollbarUp,
            left,
            top
        );
        screen.drawImage(
            imgs.scrollbarDown,
            left,
            top + scrollBarHeight - imgs.scrollbarDown.height
        );

        const handleHeight = Math.max(8, (scrollBarHeight / contentHeight) * BAR_HEIGHT) | 0;
        const handleTop = (top + imgs.scrollbarUp.height - 1 + BAR_HEIGHT * (scroll / contentHeight)) | 0;

        screen.drawRect(
            left,
            top + imgs.scrollbarUp.height,
            SCROLL_BAR_WIDTH,
            BAR_HEIGHT - 1,
            15
        );

        screen.fillRect(
            left + 1,
            top + imgs.scrollbarUp.height,
            SCROLL_BAR_WIDTH - 2,
            BAR_HEIGHT - 2,
            14
        );

        screen.drawRect(
            left,
            handleTop,
            SCROLL_BAR_WIDTH,
            handleHeight,
            15
        );
        screen.fillRect(
            left + 1,
            handleTop + 1,
            SCROLL_BAR_WIDTH - 2,
            handleHeight - 3,
            12
        );
        screen.fillRect(
            left + 1,
            handleTop + handleHeight - 2,
            SCROLL_BAR_WIDTH - 2,
            1,
            13
        );
    }
}