function init() {
    hourOfAi.initChallengers();

    controller.menu.onEvent(ControllerButtonEvent.Pressed, function () {
        settings.clear();
        game.reset();
    });


    switch (hourOfAi.getCurrentGameMode()) {
        case hourOfAi.GameMode.MainMenu:
            hourOfAi.initMainMenu();
            break;
        case hourOfAi.GameMode.Practice:
            hourOfAi.initSingleMatch();
            break;
        case hourOfAi.GameMode.Tower:
            hourOfAi.tower.initTower();
            break;
        case hourOfAi.GameMode.Tournament:
            hourOfAi.initTournament(300);
            break;
    }
}

setTimeout(init, 1)