namespace hourOfAi {
    const GAME_MODE_KEY = "gameMode";
    const PRACTICE_CHALLENGER_KEY = "practiceChallenger";
    const SPEED_SETTING_KEY = "speed";


    export enum GameMode {
        MainMenu,
        Practice,
        Tower,
        Tournament
    }


    export function startGameMode(mode: GameMode) {
        settings.writeNumber(GAME_MODE_KEY, mode);
        game.reset();
    }

    export function setPracticeChallenger(index: number) {
        settings.writeNumber(PRACTICE_CHALLENGER_KEY, index);
    }

    export function getPracticeChallenger(): number {
        return settings.readNumber(PRACTICE_CHALLENGER_KEY);
    }

    export function getCurrentGameMode(): GameMode {
        if (settings.exists(GAME_MODE_KEY)) {
            return settings.readNumber(GAME_MODE_KEY);
        }
        else {
            return GameMode.MainMenu;
        }
    }

    export function getSpeedSetting(): number{
        if (settings.exists(SPEED_SETTING_KEY)) {
            return settings.readNumber(SPEED_SETTING_KEY);
        }
        else {
            return 1;
        }
    }

    export function setSpeedSetting(speed: number){
        settings.writeNumber(SPEED_SETTING_KEY, speed);
    }
}