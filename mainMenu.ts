namespace hourOfAi {
    export function initMainMenu() {
        let currentBG: scene.Renderable = createPracticeMenuBackground();

        const practice = new TextButtonSprite("Practice", () => {
            getButtonSprites().forEach(b => b.destroy());
            if (currentBG) currentBG.destroy();
            initPracticeMenu();
        });
        const towerButton = new TextButtonSprite("Tower", () => {});
        const help = new TextButtonSprite("Help", () => {});

        const buttons = [practice, towerButton, help];

        for (let i = 0; i < buttons.length; i++) {
            buttons[i].top = 30 + i * (buttons[i].height + 2);
            buttons[i].left = 5;
            buttons[i].z = 30;
        }

        let mouseX = 0;
        let mouseY = 0;
        let currentlyActive: ButtonSprite;

        browserEvents.onMouseMove((x, y) => {
            mouseX = x;
            mouseY = y;

            for (const button of getButtonSprites()) {
                if (overlapsPoint(button, x, y)) {
                    if (button !== currentlyActive) {
                        currentlyActive = button;
                        if (currentBG) {
                            currentBG.destroy();
                        }

                        if (button === towerButton) {
                            currentBG = tower.createMenuBackground();
                        }
                        else {
                            currentBG = createPracticeMenuBackground();
                        }
                    }
                    button.hover = true;
                }
                else {
                    button.hover = false;
                }
            }
        });

        browserEvents.MouseLeft.onEvent(browserEvents.MouseButtonEvent.Pressed, () => {
            for (const button of getButtonSprites()) {
                if (overlapsPoint(button, mouseX, mouseY)) {
                    button.onClick();
                }
            }
        });

        // initPracticeMenu();
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

    function createPracticeMenuBackground(): scene.Renderable {
        let bgState: number[] = [];
        let bgOffset: number[] = [];
        let bgWobble: number[] = [];

        const bgColumns = 12;
        const bgRows = 9;

        for (let i = 0; i < bgColumns * 2 + bgRows * 2; i++) {
            bgState.push(0);
            bgOffset.push(Math.sin(0.3 + Math.PI * i / 2) * 4)
            bgWobble.push(0)
        }

        const getOffset = (index: number) => {
            return bgState[index] + bgOffset[index] + bgWobble[index];
        }


        const activeBugs: hourOfAi.BugPresident[] = [];


        const spawnNewBug = (onScreen: boolean) => {
            const newBug = new hourOfAi.BugPresident();

            if (onScreen) {
                newBug.position = new Position(randint(20, 140), randint(20, 100));
                newBug.heading = randint(0, 360) * Math.PI / 180;
            }
            else {
                if (Math.percentChance(50)) {
                    // Left or right
                    if (Math.percentChance(50)) {
                        newBug.position = new Position(-10, randint(0, 120));
                    }
                    else {
                        newBug.position = new Position(170, randint(0, 120));
                    }
                }
                else {
                    // Top or bottom
                    if (Math.percentChance(50)) {
                        newBug.position = new Position(randint(0, 160), -10);
                    }
                    else {
                        newBug.position = new Position(randint(0, 160), 130);
                    }
                }

                newBug.heading = angleutil.clampRadians(Math.atan2(60 - newBug.position.y, 80 - newBug.position.x));
            }

            newBug.bodyRadius = randint(4, 8);
            newBug.legLength =  Math.round(newBug.bodyRadius * 1.6);

            const colorPalettes = getColorPalettes();
            const palette = colorPalettes[randint(0, colorPalettes.length - 1)];
            newBug.bodyColor = palette[0];
            newBug.eyeColor = palette[1];
            newBug.noseColor = palette[2];

            newBug.positionLegs(true, true, true)
            newBug.positionLegs(false, true, true)
            newBug.renderable.destroy();
            activeBugs.push(newBug);
        }

        const numBugs = 6;
        for (let i = 0; i < numBugs; i++) {
            spawnNewBug(Math.percentChance(50));
        }


        return scene.createRenderable(0, () => {
            screen.fill(6);
            advanceTime(1/30)
            for (const activeBug of activeBugs) {
                activeBug.update(1/30);
                activeBug.draw();

                if (activeBug.position.x < -20 || activeBug.position.x > 180 || activeBug.position.y < -20 || activeBug.position.y > 140) {
                    if (activeBug.data["onScreen"]) {
                        activeBugs.removeElement(activeBug);
                        spawnNewBug(false);
                    }
                }
                else {
                    activeBug.data["onScreen"] = true;
                }

                if (activeBug.data["onScreen"]) {
                    if (Math.percentChance(10)) {
                        activeBug.data["turning"] = true;
                        activeBug.data["targetHeading"] = activeBug.heading + randint(-50, 50) * Math.PI / 180;
                    }
                    else if (activeBug.data["turning"]) {
                        activeBug.heading = angleutil.turnAngleTowards(activeBug.heading, activeBug.data["targetHeading"], 0.05);
                    }
                }
            }

            const allEnemeies = activeBugs;
            const xMult = 15
            const yMult = 15

            for (const sprite of allEnemeies) {
                if (sprite.position.y >= 0 && sprite.position.y < screen.height && sprite.position.x >= 0 && sprite.position.y < screen.width) {
                    if (sprite.position.x < 10) {
                        const row = (sprite.position.y / yMult) | 0;
                        if (angleutil.clampRadians(sprite.heading) > Math.PI / 2 && angleutil.clampRadians(sprite.heading) < 3 * Math.PI / 2) {
                            bgState[row] -= 1;
                        }
                        else {
                            bgState[row] += 1;
                        }
                    }
                    else if (sprite.position.x > 150) {
                        const row = (sprite.position.y / yMult) | 0;
                        if (angleutil.clampRadians(sprite.heading) > Math.PI / 2 && angleutil.clampRadians(sprite.heading) < 3 * Math.PI / 2) {
                            bgState[row + bgRows + bgColumns] += 1;
                        }
                        else {
                            bgState[row + bgRows + bgColumns] -= 1;
                        }
                    }
                    else if (sprite.position.y < 10) {
                        const column = (sprite.position.x / xMult) | 0;
                        if (angleutil.clampRadians(sprite.heading) > Math.PI) {
                            bgState[column + bgRows] -= 1;
                        }
                        else {
                            bgState[column + bgRows] += 1;
                        }

                    }
                    else if (sprite.position.y > 110) {
                        const column = (sprite.position.x / xMult) | 0;
                        if (angleutil.clampRadians(sprite.heading) > Math.PI) {
                            bgState[column + bgRows + bgColumns + bgRows] += 1;
                        }
                        else {
                            bgState[column + bgRows + bgColumns + bgRows] -= 1;
                        }
                    }
                }
            }

            for (let i = 0; i < bgState.length; i++) {
                bgWobble[i] = (Math.sin(game.runtime() / (200 + 300 * Math.abs(bgOffset[i]))) + 1) / 2
                if (bgState[i] < 0) {
                    bgState[i] = Math.min(0, Math.max(bgState[i] + 0.5, -4))
                }
                else {
                    bgState[i] = Math.max(0, Math.min(bgState[i] - 0.5, 4))
                }
            }

            const radius = 10;

            for (let x = 0; x < bgColumns; x += 1) {
                screen.fillCircle(
                    x * xMult, getOffset(bgRows + x), radius, 7
                )
                screen.fillCircle(
                    x * xMult, 120 - getOffset(bgRows + x + bgRows + bgColumns), radius, 7
                )
            }

            for (let y = 0; y < bgRows; y += 1) {
                screen.fillCircle(
                    getOffset(y), y * yMult, radius, 7
                )
                screen.fillCircle(
                    160 - getOffset(y + bgRows + bgColumns), y * yMult, radius, 7
                )
            }
        });
    }
}