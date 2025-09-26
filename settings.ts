namespace hourOfAi {
    const GAME_MODE_KEY = "gameMode";
    const PRACTICE_CHALLENGER_KEY = "practiceChallenger";
    const PRACTICE_TIMER_SETTING_KEY = "practiceTimer";
    const SPEED_SETTING_KEY = "speed";
    const TOWER_LEVEL_KEY = "towerLevel";
    const TOWER_STATE_KEY = "towerState";
    const TOWER_USED_CONTINUE_KEY = "towerUsedContinue";


    export enum GameMode {
        MainMenu,
        Practice,
        Tower,
        Tournament
    }

    export enum TowerState {
        NotStarted,
        StartIntroCutscene,
        IntroCutscene,
        StartMatch,
        InMatch,
        WinCutscene,
        LoseCutscene
    }

    export function startGameMode(mode: GameMode) {
        settings.writeNumber(GAME_MODE_KEY, mode);
        game.reset();
    }

    export function setPracticeChallenger(index: number) {
        settings.writeNumber(PRACTICE_CHALLENGER_KEY, index);
    }

    export function getPracticeChallenger(): number {
        if (!settings.exists(PRACTICE_CHALLENGER_KEY)) {
            return -1;
        }
        return settings.readNumber(PRACTICE_CHALLENGER_KEY);
    }

    export function setPracticeTimerSetting(enabled: boolean) {
        settings.writeNumber(PRACTICE_TIMER_SETTING_KEY, enabled ? 1 : 0);
    }

    export function getPracticeTimerSetting() {
        return !!(settings.readNumber(PRACTICE_TIMER_SETTING_KEY));
    }

    export function setCurrentTowerLevel(level: number) {
        settings.writeNumber(TOWER_LEVEL_KEY, level);
    }

    export function getCurrentTowerLevel(): number {
        if (!settings.exists(TOWER_LEVEL_KEY)) {
            return -1;
        }
        return settings.readNumber(TOWER_LEVEL_KEY);
    }

    export function clearTowerProgress() {
        settings.remove(TOWER_LEVEL_KEY);
        settings.remove(TOWER_STATE_KEY);
        settings.remove(TOWER_USED_CONTINUE_KEY);
    }

    export function setTowerState(state: TowerState) {
        settings.writeNumber(TOWER_STATE_KEY, state);
    }

    export function getTowerState(): TowerState {
        if (!settings.exists(TOWER_STATE_KEY)) {
            return TowerState.NotStarted;
        }
        return settings.readNumber(TOWER_STATE_KEY);
    }

    export function shouldInitTower(): boolean {
        switch (getTowerState()) {
            case TowerState.NotStarted:
            case TowerState.StartIntroCutscene:
            case TowerState.StartMatch:
                return true;
        }
        return false;
    }

    export function setTowerUsedContinue(used: boolean) {
        settings.writeNumber(TOWER_USED_CONTINUE_KEY, used ? 1 : 0);
    }

    export function getTowerUsedContinue(): boolean {
        if (!settings.exists(TOWER_USED_CONTINUE_KEY)) {
            return false;
        }
        return !!(settings.readNumber(TOWER_USED_CONTINUE_KEY));
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

    export function setIsChallengerUnlocked(challengerIndex: number, unlocked: boolean) {
        settings.writeNumber("unlocked" + challengerIndex, unlocked ? 1 : 0);
    }

    export function isChallengerUnlocked(challengerIndex: number): boolean {
        if (challengerIndex === 0) {
            return true;
        }
        if (!settings.exists("unlocked" + challengerIndex)) {
            return false;
        }
        return !!(settings.readNumber("unlocked" + challengerIndex));
    }

    export function setBeatTower(unlocked: boolean) {
        settings.writeNumber("beatTower", unlocked ? 1 : 0);
    }

    export function hasBeatenTower(): boolean {
        if (!settings.exists("beatTower")) {
            return false;
        }
        return !!(settings.readNumber("beatTower"));
    }
}