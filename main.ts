function init() {
    hourOfAi.initChallengers();

    controller.menu.onEvent(ControllerButtonEvent.Pressed, function () {
        hourOfAi.startGameMode(hourOfAi.GameMode.MainMenu);
    });


    switch (hourOfAi.getCurrentGameMode()) {
        case hourOfAi.GameMode.MainMenu:
            hourOfAi.initMainMenu();
            break;
        case hourOfAi.GameMode.Practice:
            const challengerIndex = hourOfAi.getPracticeChallenger();
            const timerSetting = hourOfAi.getPracticeTimerSetting();

            hourOfAi.initSingleMatch(timerSetting, false, timerSetting, (challengerIndex === -1) ? undefined : hourOfAi.challengers[challengerIndex]);
            if (timerSetting) {
                game.reset();
            }
            break;
        case hourOfAi.GameMode.Tower:
            if (hourOfAi.shouldInitTower()) {
                hourOfAi.tower.initTower();
            }
            else {
                hourOfAi.initMainMenu();
            }
            break;
        case hourOfAi.GameMode.Tournament:
            hourOfAi.initTournament(300);
            break;
    }
}

setTimeout(init, 1)

// hourOfAi.goodJob();