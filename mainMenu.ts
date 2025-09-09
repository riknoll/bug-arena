namespace hourOfAi {
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

    export function initPracticeMenu() {
        const TITLE_HEIGHT = 15;

        const VISIBLE_HEIGHT = screen.height - TITLE_HEIGHT;
        const SCROLL_BAR_WIDTH = imgs.scrollbarDown.width;
        const BAR_HEIGHT = VISIBLE_HEIGHT - imgs.scrollbarUp.height - imgs.scrollbarDown.height + 2;

        let scroll = 0;
        let totalHeight = TITLE_HEIGHT + 1;
        let homeButtonHover = false;

        const getClickHandler = (challengerIndex: number) => {
            return () => {
                setPracticeChallenger(challengerIndex);
                startGameMode(GameMode.Practice);
            };
        };

        scene.createRenderable(-1, () => {
            screen.fill(6);
        })

        scene.createRenderable(10, () => {
            drawScrollBar(screen.width - imgs.scrollbarUp.width, TITLE_HEIGHT, VISIBLE_HEIGHT, totalHeight, scroll);
            screen.fillRect(
                0, 0, screen.width, TITLE_HEIGHT, 12
            )

            screen.fillRect(
                0, TITLE_HEIGHT - 1, screen.width, 1, 13
            )
            fancyText.draw("Choose Opponent", screen, 2, 2, 0, 15, fancyText.bold_sans_7)

            if (homeButtonHover) {
                screen.drawTransparentImage(imgs.homeIconHover, screen.width - imgs.homeIcon.width - 3, 0);
            }
            else {
                screen.drawTransparentImage(imgs.homeIcon, screen.width - imgs.homeIcon.width - 2, 1);
            }
        })

        let cards: ChallengerCardButtonSprite[] = [];

        for (let i = 0; i < challengers.length; i++) {
            const button = new ChallengerCardButtonSprite(i, getClickHandler(i));
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

        let draggingScrollBar = false;
        let upPressedTime = 0;
        let downPressedTime = 0;

        let keyboardNavIndex = -1;
        let isKeyboardNav = false;

        controller.down.onEvent(ControllerButtonEvent.Pressed, () => {
            isKeyboardNav = true;

            keyboardNavIndex = Math.min(keyboardNavIndex + 1, cards.length - 1);

            const card = cards[keyboardNavIndex];
            if (card.top > screen.height - card.height) {
                setScroll(keyboardNavIndex * (card.height + 1) - (VISIBLE_HEIGHT - card.height) + 1);
            }

            for (const button of cards) {
                button.hover = false
            }
            card.hover = true;
            homeButtonHover = false;
        });

        controller.up.onEvent(ControllerButtonEvent.Pressed, () => {
            isKeyboardNav = true;

            keyboardNavIndex = Math.max(keyboardNavIndex - 1, -1);

            for (const button of cards) {
                button.hover = false
            }

            if (keyboardNavIndex === -1) {
                homeButtonHover = true;
            }
            else {
                const card = cards[keyboardNavIndex];
                if (card.top < TITLE_HEIGHT) {
                    setScroll(keyboardNavIndex * (card.height + 1));
                }

                card.hover = true;
            }
        });

        const onEnter = () => {
            if (isKeyboardNav) {
                if (keyboardNavIndex === -1) {
                    startGameMode(GameMode.MainMenu);
                }
                else {
                    const card = cards[keyboardNavIndex];
                    if (card.isUnlocked()) {
                        card.onClick();
                    }
                }
            }
        };

        controller.A.onEvent(ControllerButtonEvent.Pressed, onEnter);
        controller.B.onEvent(ControllerButtonEvent.Pressed, onEnter);

        browserEvents.MouseLeft.onEvent(browserEvents.MouseButtonEvent.Pressed, (x, y) => {
            isKeyboardNav = false;
            draggingScrollBar = false;
            upPressedTime = 0;
            downPressedTime = 0;

            if (y <= TITLE_HEIGHT) {
                if (x > screen.width - imgs.homeIcon.width - 2) {
                    startGameMode(GameMode.MainMenu);
                }
            }
            else if (x > screen.width - SCROLL_BAR_WIDTH) {
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
            else {
                for (const card of cards) {
                    if (card.isUnlocked() && overlapsPoint(card, x, y)) {
                        card.onClick();
                    }
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
            homeButtonHover = false;

            for (const button of getButtonSprites()) {
                button.hover = false
            }

            if (draggingScrollBar) {
                const position = y - TITLE_HEIGHT - imgs.scrollbarUp.height - (HANDLE_HEIGHT >> 1);

                const barHeight = VISIBLE_HEIGHT - imgs.scrollbarUp.height - imgs.scrollbarDown.height + 2;
                setScroll((position / barHeight) * totalHeight);
            }
            else if (y > TITLE_HEIGHT) {
                for (const button of getButtonSprites()) {
                    if (overlapsPoint(button, x, y)) {
                        isKeyboardNav = false;
                        button.hover = true;
                        break;
                    }
                }
            }
            else {
                if (x > screen.width - imgs.homeIcon.width - 2) {
                    homeButtonHover = true;
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