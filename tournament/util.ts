namespace tourney {
    export function setDefeatedRecursive(match: Match | Participant) {
        match.defeated = true;
        if (match instanceof Match) {
            setDefeatedRecursive(match.a);
            setDefeatedRecursive(match.b);
        }
    }

    export function hasResult(value: Match | Participant) {
        return value instanceof Participant || value.result;
    }

    export function isLeafMatch(match: Match) {
        return match.a instanceof Participant && match.b instanceof Participant
    }

    export function countDepth(match: Match): number {
        let a = match.a instanceof Participant ? 0 : countDepth(match.a);
        let b = match.b instanceof Participant ? 0 : countDepth(match.b);

        return 1 + Math.max(a, b);
    }

    export function countParticipants(match: Match): number {
        let a = match.a instanceof Participant ? 1 : countParticipants(match.a);
        let b = match.b instanceof Participant ? 1 : countParticipants(match.b);

        return a + b;
    }

    export function splitMatches(participants: Participant[], flip = false): Match {
        let splitPoint = participants.length >> 1;
        if (participants.length % 2 !== 0) {
            if (flip) {
                splitPoint++;
            }
            flip = !flip;
        }

        const topBracket = participants.slice(0, splitPoint);
        const bottomBracket = participants.slice(splitPoint);

        if (topBracket.length === 1) {
            if (bottomBracket.length === 1) {
                return new Match(topBracket[0], bottomBracket[0])
            }
            return new Match(topBracket[0], splitMatches(bottomBracket, flip))
        }
        else if (bottomBracket.length === 1) {
            return new Match(splitMatches(topBracket, flip), bottomBracket[0]);
        }

        return new Match(
            splitMatches(topBracket, flip),
            splitMatches(bottomBracket, flip),
        );
    }

    export function collectMatches(match: Match, into?: Match[]) {
        if (!into) into = [];

        if (match.a instanceof Match) {
            collectMatches(match.a, into);
        }
        if (match.b instanceof Match) {
            collectMatches(match.b, into);
        }
        into.push(match);
        return into;
    }
}
