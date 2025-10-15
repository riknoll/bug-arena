namespace SpriteKind {
    export const TitleText = SpriteKind.create();
}

namespace hourOfAi {
    export function initMainMenu() {
        initDebug();
        let destroyBg: () => void = createPracticeMenuBackground();

        const line1 = "BUG";
        const line2 = "ARENA";

        const frame = img`
        . 1 1 1 1 1 1 1 .
        1 1 1 1 1 1 1 1 1
        1 1 1 1 1 1 1 1 1
        1 1 1 1 1 1 1 1 1
        1 1 1 1 1 1 1 1 1
        1 1 1 1 1 1 1 1 1
        . 1 1 1 1 1 1 1 .
        . . . . . . . . .
        . . . . . . . . .
        `

        const line1Sprites: fancyText.TextSprite[] = [];
        let line1Width = 0;
        for (let i = 0; i < line1.length; i++) {
            line1Sprites.push(fancyText.create(line1.charAt(i), 0, 3, fancyText.rounded_large));
            line1Sprites[i].setFrame(frame);
            line1Sprites[i].setKind(SpriteKind.TitleText);
            line1Width += line1Sprites[i].width - 3;
        }

        const line2Sprites: fancyText.TextSprite[] = [];
        let line2Width = 0;
        for (let i = 0; i < line2.length; i++) {
            line2Sprites.push(fancyText.create(line2.charAt(i), 0, 2, fancyText.rounded_large));
            line2Sprites[i].setFrame(frame);
            line2Sprites[i].setKind(SpriteKind.TitleText);
            line2Width += line2Sprites[i].width - 3;
        }

        let left = (((screen.width) - line1Width) >> 1)
        for (let i = 0; i < line1.length; i++) {
            line1Sprites[i].left = left;
            line1Sprites[i].top = 5;
            line1Sprites[i].z = 200;
            line1Sprites[i].data["baseY"] = line1Sprites[i].top;
            left += line1Sprites[i].width - 3;
        }

        left = (((screen.width) - line2Width) >> 1)
        for (let i = 0; i < line2.length; i++) {
            line2Sprites[i].left = left;
            line2Sprites[i].top = 28;
            line2Sprites[i].z = 200;
            line2Sprites[i].data["baseY"] = line2Sprites[i].top;
            left += line2Sprites[i].width - 3;
        }

        const practice = new TextButtonSprite("Practice", () => {
            getButtonSprites().forEach(b => b.destroy());
            if (destroyBg) destroyBg()
            initPracticeMenu();
        });
        const towerButton = new TextButtonSprite("Tower", () => {
            getButtonSprites().forEach(b => b.destroy());
            if (destroyBg) destroyBg()

            if (getCurrentTowerLevel() <= 0) {
                clearTowerProgress();
                startGameMode(GameMode.Tower);
            }
            else {
                initTowerOptionsMenu();
            }
        });
        // const help = new TextButtonSprite("Help", () => {});

        const buttons = [practice, towerButton];

        for (let i = 0; i < buttons.length; i++) {
            buttons[i].top = 80 + i * (buttons[i].height + 2);
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
                        if (destroyBg) {
                            destroyBg();
                        }

                        if (button === towerButton) {
                            const bg = tower.createMenuBackground();

                            destroyBg = () => bg.dispose();
                        }
                        else {
                            destroyBg = createPracticeMenuBackground();
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

        const updateHandler = game.currentScene().eventContext.registerFrameHandler(scene.UPDATE_PRIORITY, () => {
            for (const sprite of sprites.allOfKind(SpriteKind.TitleText)) {
                sprite.top = (sprite.data["baseY"] as number) + ((1 + Math.sin((game.runtime() + (sprite.left << 3)) / 200)) / 2) * 7;
            }
        });

        destroyPreviousMenu = () => {
            sprites.destroyAllSpritesOfKind(SpriteKind.TitleText);
            getButtonSprites().forEach(b => b.destroy());
            browserEvents.onMouseMove(() => { });
            browserEvents.MouseLeft.onEvent(browserEvents.MouseButtonEvent.Pressed, () => { });
            game.eventContext().unregisterFrameHandler(updateHandler);
        };

        // initPracticeMenu();
    }

    function overlapsPoint(sprite: Sprite, x: number, y: number): boolean {
        return x >= sprite.left && x < sprite.right && y >= sprite.top && y < sprite.bottom;
    }

    export function initPracticeMenu() {
        destroyPreviousMenu();

        const getClickHandler = (challengerIndex: number) => {
            return () => {
                setPracticeChallenger(challengerIndex);
                initPracticeOptionsMenu();
            };
        };

        let cards: CardButtonSprite[] = [];

        cards.push(
            new CardButtonSprite(
                getClickHandler(-1),
                "No Opponent",
                "Practice without an opponent",
                imgs.shadow_silhouette
            )
        );

        for (let i = 0; i < challengers.length; i++) {
            const button = new ChallengerCardButtonSprite(i, getClickHandler(i));
            cards.push(button);
        }

        initSimpleMenu("Choose Opponent", cards);
    }

    export function initPracticeOptionsMenu() {
        destroyPreviousMenu();

        const cards: CardButtonSprite[] = [];

        cards.push(
            new CardButtonSprite(
                () => {
                    setPracticeTimerSetting(true);
                    startGameMode(GameMode.Practice);
                },
                "Timed Match",
                "Play a timed practice match",
                imgs.stopwatch_icon
            ),
        );

        cards.push(
            new CardButtonSprite(
                () => {
                    setPracticeTimerSetting(false);
                    startGameMode(GameMode.Practice);
                },
                "Infinite",
                "Run your code without a timer",
                imgs.infinity_icon
            ),
        );

        if (isDebugMode()) {
            if (getPracticeChallenger() !== -1) {
                cards.push(new CardButtonSprite(
                    () => {
                        setCurrentTowerLevel(getPracticeChallenger());
                        setTowerState(TowerState.StartIntroCutscene);
                        startGameMode(GameMode.Tower);
                    },
                    "DEBUG: TOWER",
                    "Start the tower here",
                    imgs.shadow_silhouette
                ));
                cards.push(new CardButtonSprite(
                    () => {
                        setCurrentTowerLevel(getPracticeChallenger());
                        setTowerState(TowerState.WinCutscene);
                        destroyPreviousMenu();
                        tower.reset(true);
                    },
                    "DEBUG: WIN",
                    "Play the win cutscene",
                    imgs.shadow_silhouette
                ));
                cards.push(new CardButtonSprite(
                    () => {
                        setCurrentTowerLevel(getPracticeChallenger());
                        setTowerState(TowerState.LoseCutscene);
                        destroyPreviousMenu();
                        tower.reset(true);
                    },
                    "DEBUG: LOSE",
                    "Play the lose cutscene",
                    imgs.shadow_silhouette
                ));
            }
            else {
                cards.push(new CardButtonSprite(
                    () => {
                        settings.clear();
                        startGameMode(GameMode.MainMenu);
                    },
                    "DEBUG: RESET",
                    "Reset all progress",
                    imgs.shadow_silhouette
                ));
            }
        }

        initSimpleMenu("Match Type", cards);
    }

    export function initTowerOptionsMenu() {
        destroyPreviousMenu();

        const cards: CardButtonSprite[] = [];

        cards.push(
            new CardButtonSprite(
                () => {
                    setTowerUsedContinue(true);
                    setTowerState(TowerState.StartIntroCutscene);
                    startGameMode(GameMode.Tower);
                },
                "Continue",
                "Start from your last completed level",
                imgs.continue_icon
            ),
        );

        cards.push(
            new CardButtonSprite(
                () => {
                    clearTowerProgress();
                    startGameMode(GameMode.Tower);
                },
                "New Game",
                "Start fresh from the bottom floor",
                imgs.restart_icon
            ),
        );

        initSimpleMenu("Start Tower", cards);
    }

    let destroyPreviousMenu = () => {};

    export function initSimpleMenu(title: string, cards: CardButtonSprite[]) {
        const TITLE_HEIGHT = 15;
        const VISIBLE_HEIGHT = screen.height - TITLE_HEIGHT;
        const SCROLL_BAR_WIDTH = imgs.scrollbarDown.width;
        const BAR_HEIGHT = VISIBLE_HEIGHT - imgs.scrollbarUp.height - imgs.scrollbarDown.height + 2;

        let scroll = 0;
        let totalHeight = TITLE_HEIGHT + 1;
        let homeButtonHover = false;

        const bgRenderable = scene.createRenderable(-1, () => {
            screen.fill(6);
        })

        const chromeRenderable = scene.createRenderable(10, () => {
            drawScrollBar(screen.width - imgs.scrollbarUp.width, TITLE_HEIGHT, VISIBLE_HEIGHT, totalHeight, scroll);
            screen.fillRect(
                0, 0, screen.width, TITLE_HEIGHT, 12
            )

            screen.fillRect(
                0, TITLE_HEIGHT - 1, screen.width, 1, 13
            )
            fancyText.draw(title, screen, 2, 2, 0, 15, fancyText.bold_sans_7)

            if (homeButtonHover) {
                screen.drawTransparentImage(imgs.homeIconHover, screen.width - imgs.homeIcon.width - 3, 0);
            }
            else {
                screen.drawTransparentImage(imgs.homeIcon, screen.width - imgs.homeIcon.width - 2, 1);
            }
        })

        totalHeight = cards.length * (cards[0].height + 1) + 1;

        const MAX_SCROLL = Math.max(totalHeight - VISIBLE_HEIGHT, 0);
        const HANDLE_HEIGHT = Math.min(BAR_HEIGHT, Math.max(8, (VISIBLE_HEIGHT / totalHeight) * BAR_HEIGHT)) | 0;

        const setScroll = (newScroll: number) => {
            scroll = Math.min(MAX_SCROLL, Math.max(0, newScroll));
            for (let i = 0; i < cards.length; i++) {
                const card = cards[i];
                card.top = i * (card.height + 1) + TITLE_HEIGHT - scroll + 1;
                card.left = 1;
            }
        }

        setScroll(0);

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

        const updateHandler = game.currentScene().eventContext.registerFrameHandler(scene.UPDATE_PRIORITY, () => {
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

        destroyPreviousMenu = () => {
            chromeRenderable.destroy();
            bgRenderable.destroy();
            getButtonSprites().forEach(b => b.destroy());
            browserEvents.onMouseMove(() => { });
            browserEvents.onWheel(() => { });
            browserEvents.MouseLeft.onEvent(browserEvents.MouseButtonEvent.Pressed, () => { });
            browserEvents.MouseLeft.onEvent(browserEvents.MouseButtonEvent.Released, () => { });
            controller.up.onEvent(ControllerButtonEvent.Pressed, () => { });
            controller.down.onEvent(ControllerButtonEvent.Pressed, () => { });
            controller.A.onEvent(ControllerButtonEvent.Pressed, () => { });
            controller.B.onEvent(ControllerButtonEvent.Pressed, () => { });
            game.eventContext().unregisterFrameHandler(updateHandler);
        }
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

        const handleHeight = Math.min(BAR_HEIGHT, Math.max(8, (scrollBarHeight / contentHeight) * BAR_HEIGHT)) | 0;
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

    function createPracticeMenuBackground() {
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

        const numBugs = 10;
        for (let i = 0; i < numBugs; i++) {
            spawnNewBug(Math.percentChance(50));
        }


        const r = scene.createRenderable(0, () => {
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

        return () => r.destroy();
    }

    function initDebug() {
        let sequence = 0;

        const advanceSequence = (expected: number) => {
            return () => {
                if (sequence === expected) {
                    sequence++;
                }
                else {
                    sequence = 0;
                }
            }
        }

        browserEvents.D.onEvent(browserEvents.KeyEvent.Pressed, advanceSequence(0));
        browserEvents.E.onEvent(browserEvents.KeyEvent.Pressed, advanceSequence(1));
        browserEvents.B.onEvent(browserEvents.KeyEvent.Pressed, advanceSequence(2));
        browserEvents.U.onEvent(browserEvents.KeyEvent.Pressed, advanceSequence(3));
        browserEvents.G.onEvent(browserEvents.KeyEvent.Pressed, advanceSequence(4));
        browserEvents.One.onEvent(browserEvents.KeyEvent.Pressed, () => {
            if (sequence === 5) {
                sequence = 0;

                let text: string;
                if (isDebugMode()) {
                    setDebugMode(false);
                    text = "Debug Mode Disabled!"
                }
                else {
                    setDebugMode(true);
                    text = "Debug Mode Enabled!"
                }

                const toast = fancyText.create(text, 0, 1, fancyText.bold_sans_7);
                toast.setFrame(imgs.textFrame);
                toast.x = 80;
                toast.bottom = 110;
                toast.z = 10000;
                toast.lifespan = 2000;
            }
        });
    }
}