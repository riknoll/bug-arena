namespace tourney {
    let setupMatch: (m: Match, player1: Participant, player2: Participant) => void;
    let doMatch: (m: Match) => boolean;
    let cleanupMatch: (m: Match) => void;
    let advance = false;

    export function onMatchSetup(cb: (m: Match, player1: Participant, player2: Participant) => void) {
        setupMatch = cb;
    }

    export function onMatch(cb: (m: Match) => boolean) {
        doMatch = cb;
    }

    export function onMatchCleanup(cb: (m: Match) => void) {
        cleanupMatch = cb;
    }

    export function runTournament(participants: Participant[], playerName: string) {
        participants = participants.slice();
        const shuffled: tourney.Participant[] = [];
        while (participants.length) {
            shuffled.push(participants.removeAt(randint(0, participants.length - 1)));
        }
        participants = shuffled;

        if (playerName) {
            const p = participants.find(p => p.name === playerName);
            participants.removeElement(p);
            participants.unshift(p);
        }
        else {
            playerName = participants[0].name;
        }


        scene.setBackgroundColor(13)
        const bracket = new tourney.BracketSprite(
            screen.width,
            screen.height,
            participants,
            playerName,
            16,
            16
        );
        bracket.z = 1000;
        screenTransitions.setZ(500, 2000);

        const TRANSITION_TIME = 800;

        screenTransitions.setScreenTransitionDirection(false);
        screenTransitions.startTransition(screenTransitions.WavyVertical, TRANSITION_TIME, false, true);

        while (true) {
            pauseUntilAdvance(1000);
            const current = bracket.currentMatch();
            const combatants = current.getParticipants() as tourney.Participant[];
            bracket.showParticipantNames();
            pauseUntilAdvance(2000);
            setupMatch(current, combatants[0], combatants[1]);

            screenTransitions.setScreenTransitionDirection(true);
            screenTransitions.startTransition(screenTransitions.WavyVertical, TRANSITION_TIME, true, true);

            bracket.hideParticipantNames();

            tourney.showIntro(combatants[0].name, combatants[1].name, 100);

            const aWasVictor = doMatch(current);
            bracket.currentMatch().setWinner(aWasVictor);

            const destroyWins = tourney.doWinAnimation(bracket.currentMatch().result);
            bracket.matchIndex++;


            screenTransitions.setScreenTransitionDirection(false);
            screenTransitions.startTransition(screenTransitions.WavyVertical, TRANSITION_TIME, false, true);

            destroyWins();
            cleanupMatch(current);

            if (bracket.matchIndex === bracket.matchOrder.length) {
                break;
            }
        }
    }

    function pauseUntilAdvance(millis: number) {
        let endTime = control.millis() + millis;
        advance = false;
        pauseUntil(() => advance || control.millis() > endTime);
        advance = false;
    }
}