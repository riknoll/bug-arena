
namespace tourney {
    export let layoutY = 0;

    export function layoutBracket(bracket: Match, playerName: string, previewWidth: number, previewHeight: number, width: number, height: number) {
        const allMatches: Match[] = [];
        collectMatches(bracket, allMatches);

        const leftCount = countParticipants(bracket.a as Match);
        const rightCount = countParticipants(bracket.b as Match);

        const rowHeight = Math.idiv(height, Math.max(leftCount, rightCount));

        let startMatch = allMatches.find(m => (m.a as Participant).name === playerName || (m.b as Participant).name === playerName);

        if ((startMatch.b as Participant).name === playerName) {
            let temp = startMatch.a;
            startMatch.a = startMatch.b;
            startMatch.b = temp;
        }

        const bracketWidth = width - (previewWidth << 1);

        const leftLayers = countDepth(bracket.a as Match);
        const rightLayers = countDepth(bracket.b as Match);

        const tournamentLayers = leftLayers + rightLayers + 1;
        const layerWidth = Math.idiv(bracketWidth, tournamentLayers);

        const leftHeight = leftCount * rowHeight;
        const rightHeight = rightCount * rowHeight;

        const diff = Math.abs(rightHeight - leftHeight) >> 1;

        layoutY = (leftHeight > rightHeight) ? 0 : diff;
        layoutY += previewHeight >> 1;
        layoutRecursive(bracket.a, layerWidth, rowHeight, previewWidth >> 1);

        layoutY = (leftHeight > rightHeight) ? diff : 0;
        layoutY += previewHeight >> 1;
        layoutRecursive(bracket.b, -layerWidth, rowHeight, width - (previewWidth >> 1));

        bracket.x = bracket.a.x + ((bracket.b.x - bracket.a.x) >> 1);
        bracket.y = bracket.a.y;
        bracket.b.y = bracket.a.y;
    }

    export function layoutRecursive(
        value: Match | Participant,
        dx: number,
        dy: number,
        startX: number
    ) {
        if (value instanceof Participant) {
            value.y = layoutY;
            layoutY += dy;
            value.x = startX;
            value.isLeft = dx > 0;
        }
        else {
            layoutRecursive(
                value.a,
                dx,
                dy,
                startX
            );
            layoutRecursive(
                value.b,
                dx,
                dy,
                startX
            )

            if (dx > 0) {
                value.x = Math.max(value.a.x, value.b.x) + dx;
            }
            else {
                value.x = Math.min(value.a.x, value.b.x) + dx;
            }
            value.y = (value.a.y + value.b.y) >> 1;
        }
    }
}