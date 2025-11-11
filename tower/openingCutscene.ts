namespace hourOfAi.tower {
    export function showOpeningCutscene() {
        let scrollValue = 120;

        const planets = [
            imgs.moon,
            imgs.saturn,
            imgs.mars,
            imgs.uranus,
            imgs.jupiter,
        ];
        const xValues = [40, 140, 30, 128, 100]

        const planetSprites: Sprite[] = [];

        for (const planet of planets) {
            const sprite = sprites.create(planet, SpriteKind.DialogSprite);
            sprite.y = -planets.indexOf(planet) * 280;
            sprite.x = xValues[planets.indexOf(planet)];
            sprite.vy = 15;
            planetSprites.push(sprite);
        }

        const stars = new StarFieldSprite();
        stars.z = -0.1;
        let callback: control.FrameCallback;

        let scrollVelocity = 0.2;
        let accelerating = false;

        callback = game.eventContext().registerFrameHandler(scene.UPDATE_PRIORITY, () => {
            scrollValue += scrollVelocity;
            stars.scroll = scrollValue;

            if (scrollVelocity < 0) {
                stars.starHeight = Math.map(Math.abs(scrollVelocity), 0, 30, 1, 80);
            }

            if (accelerating) {
                for (const planet of planetSprites) {
                    planet.ay = -100;
                }
                scrollVelocity = (Math.max(scrollVelocity - 0.1, -20));

                if (scrollVelocity === -20) {
                    game.eventContext().unregisterFrameHandler(callback);
                    control.runInParallel(() => {
                        for (const planet of planetSprites) {
                            planet.destroy();
                        }
                        stars.destroy();
                        const bg = new TowerScene();
                        bg.xOffset = (screen.width >> 1) - (imgs.tower_section.width >> 1);
                        bg.doIntroAnimation();
                        tower.initTower(bg);
                    })
                }
            }
        })

        const portraits = [
            createPortraitSprite(imgs.stinky, 6, 7),
            createPortraitSprite(imgs.bumble, 3, 4),
            createPortraitSprite(imgs.legsolas, 14, 13),
            createPortraitSprite(imgs.hopper, 14, 6),
            createPortraitSprite(imgs.crick, 10, 2),
            createPortraitSprite(imgs.bugsly, 14, 8),
            createPortraitSprite(imgs.bugslyJr, 8, 9),
            createPortraitSprite(imgs.shadow, 15, 15, 14),
            // createPortraitSprite(imgs.president, 4),
        ]

        for (const p of portraits) {
            p.bottom = 0;
        }

        const { skipRenderable, isCancelled } = createSkipRenderable(undefined);

        showIntroCutsceneText("It is the dawn of the age of artificial intelligence.", isCancelled);
        showIntroCutsceneText("Recognizing AI's incredible potential, the leader of the bug kingdom, Bug President...", isCancelled)
        showIntroCutsceneText("ordered a challenge to train the strongest AI.", isCancelled)
        showIntroCutsceneText("By presidential decree, a great tower was established.", isCancelled);
        showIntroCutsceneText("Each floor would be guarded by one of the kingdom's greatest luminaries.", isCancelled);
        const speed1 = 80;
        const speed2 = 120;

        tower.moveSprite(portraits[0], 80, 60, speed1, false, tower.easeOutCirc);
        showIntroCutsceneText("There was Waftsworth, the odiferous. Demon bug of the wastes.", isCancelled);
        tower.moveSprite(portraits[0], 20, 20, speed2, false);
        tower.moveSprite(portraits[1], 80, 60, speed1, false, tower.easeOutCirc);
        showIntroCutsceneText("The great hive of Apidae. The \"many who are one\".", isCancelled);
        tower.moveSprite(portraits[1], 20, 60, speed2, false, tower.easeOutCirc);
        tower.moveSprite(portraits[2], 80, 60, speed1, false, tower.easeOutCirc);
        showIntroCutsceneText("Legsolas, leader of the kingdom's holy knights.", isCancelled);
        tower.moveSprite(portraits[2], 140, 20, speed2, false, tower.easeOutCirc);
        portraits[3].x = 60;
        portraits[4].x = 100;
        tower.moveSprite(portraits[3], 60, 60, speed1, false, tower.easeOutCirc);
        tower.moveSprite(portraits[4], 100, 60, speed1, false, tower.easeOutCirc);
        showIntroCutsceneText("Hopper and Crick. Twin scions of the earldom of Entomolia.", isCancelled);
        portraits[5].x = 60;
        portraits[6].x = 100;
        tower.moveSprite(portraits[5], 60, 20, speed1, false, tower.easeOutCirc);
        tower.moveSprite(portraits[6], 100, 20, speed1, false, tower.easeOutCirc);
        showIntroCutsceneText("Bugsly, the mighty. And his heir, known only as Junior.", isCancelled);
        portraits[7].x = 140;
        tower.moveSprite(portraits[7], 140, 60, speed1, false, tower.easeOutCirc);
        showIntroCutsceneText("And finally, Shadow, the fallen. Said to be born of darkness itself.", isCancelled);

        tower.moveSprite(portraits[0], -60, portraits[0].y, speed2, false);
        tower.moveSprite(portraits[1], -60, portraits[1].y, speed2, false);
        tower.moveSprite(portraits[2], 220, portraits[2].y, speed2, false);
        tower.moveSprite(portraits[3], portraits[3].x, 180, speed2, false);
        tower.moveSprite(portraits[4], portraits[4].x, 180, speed2, false);
        tower.moveSprite(portraits[5], portraits[5].x, -60, speed2, false);
        tower.moveSprite(portraits[6], portraits[6].x, -60, speed2, false);
        tower.moveSprite(portraits[7], 220, portraits[7].y, speed2, false);
        showIntroCutsceneText("Many have attempted to climb the tower, but none have succeeded.", isCancelled);
        showIntroCutsceneText("Now, prepare yourself! Ascend the tower!", isCancelled);
        showIntroCutsceneText("Create the most powerful AI and revolutionize the Bug Kingdom!", isCancelled);
        for (const portrait of portraits) {
            portrait.destroy();
        }
        accelerating = true;
        skipRenderable.destroy();
    }

    function createPortraitSprite(portrait: Image, fgColor: number, bgColor: number, outline = 15) {
        const sprite = sprites.create(image.create(34, 34), SpriteKind.DialogSprite);
        const color1 = 12;
        const color2 = 13;
        sprite.image.fillRect(0, 0, 1, sprite.image.height, color1);
        sprite.image.fillRect(0, 0, sprite.image.width - 1, 1, color1);
        sprite.image.fillRect(1, sprite.image.height - 1, sprite.image.width, 1, color2);
        sprite.image.fillRect(sprite.image.width - 1, 0, 1, sprite.image.height, color2);
        sprite.image.fillRect(1, 1, sprite.image.width - 2, sprite.image.height - 2, bgColor);

        drawSilhouette(1, 1, portrait, sprite.image, fgColor, outline);
        return sprite;
    }
}