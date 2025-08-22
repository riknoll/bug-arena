namespace tourney {
    export class BracketSprite extends sprites.ExtendableSprite {
        finalMatch: Match;
        matchOrder: Match[];
        matchIndex: number;

        drawnNames: Participant[];

        protected nameOffset = 0;

        constructor(
            width: number,
            height: number,
            public participants: Participant[],
            public playerName: string,
            public previewWidth: number,
            public previewHeight: number
        ) {
            super(img`.`);
            this.setDimensions(width, height);
            this.x = screen.width >> 1;
            this.y = screen.height >> 1;

            this.finalMatch = splitMatches(participants);
            layoutBracket(
                this.finalMatch,
                playerName,
                this.previewWidth,
                this.previewHeight,
                width,
                height
            );

            const allMatches = collectMatches(this.finalMatch);
            this.matchOrder = allMatches.slice();

            this.matchOrder.sort((a, b) => {
                if (a.depth === b.depth) {
                    return allMatches.indexOf(a) - allMatches.indexOf(b)
                }
                else {
                    return a.depth - b.depth
                }
            });
            this.matchIndex = 0;
        }

        draw(left: number, top: number) {
            screen.fill(BRACKET_BACKGROUND)
            drawBracket(
                this.finalMatch,
                this.previewWidth,
                this.previewHeight,
                left,
                top,
                this.matchOrder[this.matchIndex]
            );

            if (this.drawnNames) {
                drawParticipantNames(
                    this.drawnNames,
                    left,
                    top,
                    this.previewWidth,
                    this.previewHeight,
                    (this.nameOffset += 3)
                )
            }

            drawParticipants(
                this.participants,
                this.previewWidth,
                this.previewHeight,
                left,
                top,
            );
        }

        currentMatch() {
            return this.matchOrder[this.matchIndex];
        }

        showParticipantNames() {
            if (this.currentMatch()) {
                this.drawnNames = this.currentMatch().getParticipants();
            }
            else {
                this.drawnNames = undefined;
            }
            this.nameOffset = 0;
        }


        hideParticipantNames() {
            this.drawnNames = undefined;
        }
    }
}