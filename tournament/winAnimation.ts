namespace tourney {
    export function doWinAnimation(winner: Participant) {
        const font = fancyText.gothic_large;
        const pFont = image.getFontForText(winner.name) === image.font12 ? fancyText.unicodeArcade : font;

        const name = fancyText.create(winner.name, 0, INTRO_TEXT_COLOR, pFont);
        const wins = fancyText.create("Wins!", 0, INTRO_TEXT_COLOR, font);

        const totalHeight = name.height + wins.height;

        name.top = (screen.height >> 1) - (totalHeight >> 1);
        wins.top = name.bottom + 1;

        wins.setFlag(SpriteFlag.Invisible, true);
        scene.cameraShake(2, 100);
        pause(500);
        wins.setFlag(SpriteFlag.Invisible, false);
        scene.cameraShake(2, 100);
        pause(2000);

        return () => {
            name.destroy();
            wins.destroy();
        }
    }
}