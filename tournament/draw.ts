namespace tourney {
    export const BRACKET_COLOR = 1;
    export const VICTORY_COLOR = 7;
    export const VICTORY_COLOR_2 = 6
    export const DEFEATED_COLOR = 10;
    export const LINE_THICKNESS = 3;
    export const NAME_COLOR = 12;
    export const NAME_BACKGROUND = 11;
    export const BRACKET_BACKGROUND = 6;
    export const INTRO_TEXT_COLOR = 15;

    export function drawBracket(bracket: Match, previewWidth: number, previewHeight: number, left: number, top: number, currentMatch: Match) {
        const allMatches: Match[] = [];
        collectMatches(bracket, allMatches);


        const leftMatches = collectMatches(bracket.a as Match).filter(isLeafMatch);
        const rightMatches = collectMatches(bracket.b as Match).filter(isLeafMatch);

        let nextQueue: Match[] = leftMatches;

        while (nextQueue.length) {
            const current = nextQueue.shift();
            if (!current.next) continue;

            if (hasResult(current.a)) {
                screen.fillRect(
                    left + current.a.x + LINE_THICKNESS,
                    top + current.a.y,
                    (current.x - current.a.x) - LINE_THICKNESS,
                    LINE_THICKNESS,
                    current.a.defeated ? DEFEATED_COLOR : VICTORY_COLOR
                );
            }
            else {
                screen.fillRect(
                    left + current.a.x + LINE_THICKNESS,
                    top + current.a.y,
                    (current.x - current.a.x) - LINE_THICKNESS,
                    LINE_THICKNESS,
                    BRACKET_COLOR
                );
            }

            if (hasResult(current.b)) {
                screen.fillRect(
                    left + current.b.x + LINE_THICKNESS,
                    top + current.b.y,
                    (current.x - current.b.x) - LINE_THICKNESS,
                    LINE_THICKNESS,
                    current.b.defeated ? DEFEATED_COLOR : VICTORY_COLOR
                );
            }
            else {
                screen.fillRect(
                    left + current.b.x + LINE_THICKNESS,
                    top + current.b.y,
                    (current.x - current.b.x) - LINE_THICKNESS,
                    LINE_THICKNESS,
                    BRACKET_COLOR
                );
            }

            if (current.result) {
                if (current.aWasVictor) {
                    screen.fillRect(
                        left + current.x,
                        top + current.a.y,
                        LINE_THICKNESS,
                        (current.y - current.a.y) + LINE_THICKNESS,
                        current.defeated ? DEFEATED_COLOR : VICTORY_COLOR
                    );
                    screen.fillRect(
                        left + current.x,
                        top + current.y + LINE_THICKNESS,
                        LINE_THICKNESS,
                        current.b.y - current.y,
                        BRACKET_COLOR
                    );
                }
                else {
                    screen.fillRect(
                        left + current.x,
                        top + current.a.y,
                        LINE_THICKNESS,
                        (current.y - current.a.y) + LINE_THICKNESS,
                        BRACKET_COLOR
                    );
                    screen.fillRect(
                        left + current.x,
                        top + current.y,
                        LINE_THICKNESS,
                        (current.b.y - current.y) + LINE_THICKNESS,
                        current.defeated ? DEFEATED_COLOR : VICTORY_COLOR
                    );
                }
            }
            else {
                screen.fillRect(
                    left + current.x,
                    top + current.a.y,
                    LINE_THICKNESS,
                    (current.y - current.a.y) + LINE_THICKNESS,
                    current === currentMatch ? VICTORY_COLOR : BRACKET_COLOR
                );
                screen.fillRect(
                    left + current.x,
                    top + current.y,
                    LINE_THICKNESS,
                    (current.b.y - current.y) + LINE_THICKNESS,
                    current === currentMatch ? VICTORY_COLOR : BRACKET_COLOR
                );
            }

            if (current.next && nextQueue.indexOf(current) === -1) {
                nextQueue.push(current.next)
            }
        }

        nextQueue = rightMatches;

        while (nextQueue.length) {
            const current = nextQueue.shift();

            if (!current.next) continue;

            if (hasResult(current.a)) {
                screen.fillRect(
                    left + current.x,
                    top + current.a.y,
                    current.a.x - current.x,
                    LINE_THICKNESS,
                    current.a.defeated ? DEFEATED_COLOR : VICTORY_COLOR
                );
            }
            else {
                screen.fillRect(
                    left + current.x,
                    top + current.a.y,
                    current.a.x - current.x,
                    LINE_THICKNESS,
                    BRACKET_COLOR
                );
            }

            if (hasResult(current.b)) {
                screen.fillRect(
                    left + current.x,
                    top + current.b.y,
                    current.b.x - current.x,
                    LINE_THICKNESS,
                    current.b.defeated ? DEFEATED_COLOR : VICTORY_COLOR
                );
            }
            else {
                screen.fillRect(
                    left + current.x,
                    top + current.b.y,
                    current.b.x - current.x,
                    LINE_THICKNESS,
                    BRACKET_COLOR
                );
            }

            if (current.result) {
                if (current.aWasVictor) {
                    screen.fillRect(
                        left + current.x,
                        top + current.a.y,
                        LINE_THICKNESS,
                        (current.y - current.a.y) + LINE_THICKNESS,
                        current.defeated ? DEFEATED_COLOR : VICTORY_COLOR
                    );
                    screen.fillRect(
                        left + current.x,
                        top + current.y + LINE_THICKNESS,
                        LINE_THICKNESS,
                        current.b.y - current.y,
                        BRACKET_COLOR
                    );
                }
                else {
                    screen.fillRect(
                        left + current.x,
                        top + current.a.y,
                        LINE_THICKNESS,
                        (current.y - current.a.y) + LINE_THICKNESS,
                        BRACKET_COLOR
                    );
                    screen.fillRect(
                        left + current.x,
                        top + current.y,
                        LINE_THICKNESS,
                        (current.b.y - current.y) + LINE_THICKNESS,
                        current.defeated ? DEFEATED_COLOR : VICTORY_COLOR
                    );
                }
            }
            else {
                screen.fillRect(
                    left + current.x,
                    top + current.a.y,
                    LINE_THICKNESS,
                    (current.y - current.a.y) + LINE_THICKNESS,
                    current === currentMatch ? VICTORY_COLOR : BRACKET_COLOR
                );
                screen.fillRect(
                    left + current.x,
                    top + current.y,
                    LINE_THICKNESS,
                    (current.b.y - current.y) + LINE_THICKNESS,
                    current === currentMatch ? VICTORY_COLOR : BRACKET_COLOR
                );
            }

            if (current.next && nextQueue.indexOf(current) === -1) {
                nextQueue.push(current.next)
            }
        }

        if (bracket.result) {
            if (bracket.aWasVictor) {
                screen.fillRect(
                    left + bracket.a.x,
                    top + bracket.a.y,
                    (bracket.b.x - bracket.a.x) >> 1,
                    LINE_THICKNESS,
                    VICTORY_COLOR
                );
                screen.fillRect(
                    left + bracket.x,
                    top + bracket.a.y,
                    bracket.b.x - bracket.x,
                    LINE_THICKNESS,
                    BRACKET_COLOR
                );
            }
            else {
                screen.fillRect(
                    left + bracket.a.x,
                    top + bracket.a.y,
                    (bracket.b.x - bracket.a.x) >> 1,
                    LINE_THICKNESS,
                    BRACKET_COLOR
                );
                screen.fillRect(
                    left + bracket.x,
                    top + bracket.a.y,
                    bracket.b.x - bracket.x,
                    LINE_THICKNESS,
                    VICTORY_COLOR
                );
            }
        }
        else {
            screen.fillRect(
                left + bracket.a.x,
                top + bracket.a.y,
                (bracket.b.x - bracket.a.x) >> 1,
                LINE_THICKNESS,
                bracket === currentMatch ? VICTORY_COLOR : BRACKET_COLOR
            );
            screen.fillRect(
                left + bracket.x,
                top + bracket.a.y,
                bracket.b.x - bracket.x,
                LINE_THICKNESS,
                bracket === currentMatch ? VICTORY_COLOR : BRACKET_COLOR
            );
        }

        if (bracket.result) {
            screen.fillRect(
                left + bracket.x,
                top + bracket.y - 8,
                LINE_THICKNESS,
                8 + LINE_THICKNESS,
                VICTORY_COLOR
            )
        }
        else {
            screen.fillRect(
                left + bracket.x,
                top + bracket.y - 8,
                LINE_THICKNESS,
                8 + LINE_THICKNESS,
                BRACKET_COLOR
            )
        }

        let turtle: Turtle;

        if (bracket.result) {
            turtle = new Turtle(bracket.x, bracket.y - 8);
            turtle.moveVertical(8);
        }

        if (currentMatch) {
            drawVictoryPath(currentMatch, left, top, turtle);
        }
        else {
            drawVictoryPath(bracket, left, top, turtle);
        }

        if (bracket.result) {
            bracket.result.drawPreview(
                left + bracket.x - (previewWidth >> 1),
                top + bracket.y - 8 - previewHeight
            );
        }
    }

    export function drawParticipants(participants: Participant[], previewWidth: number, previewHeight: number, left: number, top: number) {
        for (const p of participants) {
            p.drawPreview(
                left + p.x - (previewWidth >> 1),
                top + p.y - (previewHeight >> 1)
            );
        }
    }

    export class Turtle {
        distanceTravelled = Math.idiv(game.runtime(), 50);

        constructor(public x: number, public y: number) {
        }

        moveHorizontal(distance: number) {
            while (distance !== 0) {
                this.distanceTravelled++;

                this.x += Math.sign(distance)

                if (distance < 0) {
                    distance += 1;
                }
                else {
                    distance -= 1;
                }

                this.draw();
            }
        }

        moveVertical(distance: number) {
            while (distance !== 0) {
                this.distanceTravelled++;

                this.y += Math.sign(distance)

                if (distance < 0) {
                    distance += 1;
                }
                else {
                    distance -= 1;
                }

                this.draw();
            }
        }

        protected draw() {
            if (this.distanceTravelled % (LINE_THICKNESS << 1) === 0) {
                screen.fillRect(
                    this.x,
                    this.y,
                    LINE_THICKNESS,
                    LINE_THICKNESS,
                    VICTORY_COLOR_2
                )
            }
            // screen.setPixel(this.x, this.y, 2)
        }

        clone() {
            const res = new Turtle(this.x, this.y)
            res.distanceTravelled = this.distanceTravelled;
            return res;
        }
    }

    export function drawVictoryPath(bracket: Match, left: number, top: number, turtle?: Turtle) {
        if (bracket.defeated) {
            return;
        }

        if (turtle) {
            turtle.moveHorizontal(bracket.x - turtle.x)
            turtle.moveVertical(bracket.y - turtle.y)
            turtle.x = bracket.x;
            turtle.y = bracket.y;
        }

        if (bracket.result) {
            if (!turtle) {
                turtle = new Turtle(bracket.x, bracket.y);
            }

            if (bracket.aWasVictor) {
                turtle.moveVertical(bracket.a.y - bracket.y)
                turtle.moveHorizontal(bracket.a.x - bracket.x)
                if (bracket.a instanceof Match) {
                    drawVictoryPath(bracket.a, left, top, turtle)
                }
            }
            else {
                turtle.moveVertical(bracket.b.y - bracket.y)
                turtle.moveHorizontal(bracket.b.x - bracket.x)

                if (bracket.b instanceof Match) {
                    drawVictoryPath(bracket.b, left, top, turtle)
                }
            }
        }
        else {
            const aFinished = !bracket.a.defeated && ((bracket.a instanceof Participant) || bracket.a.result);
            const bFinished = !bracket.b.defeated && ((bracket.b instanceof Participant) || bracket.b.result);

            if (aFinished) {
                const subTurtle = turtle ? turtle.clone() : new Turtle(bracket.x, bracket.y);
                subTurtle.moveVertical(bracket.a.y - bracket.y)
                subTurtle.moveHorizontal(bracket.a.x - bracket.x)

                if (bracket.a instanceof Match) {
                    drawVictoryPath(bracket.a, left, top, subTurtle)
                }
            }
            else if (bracket.a instanceof Match) {
                drawVictoryPath(bracket.a, left, top)
            }

            if (bFinished) {
                const subTurtle = turtle ? turtle.clone() : new Turtle(bracket.x, bracket.y);
                subTurtle.moveVertical(bracket.b.y - bracket.y)
                subTurtle.moveHorizontal(bracket.b.x - bracket.x)

                if (bracket.b instanceof Match) {
                    drawVictoryPath(bracket.b, left, top, subTurtle)
                }
            }
            else if (bracket.b instanceof Match) {
                drawVictoryPath(bracket.b, left, top)
            }
        }
    }


    export function drawParticipantNames(
        participants: Participant[],
        left: number,
        top: number,
        previewWidth: number,
        previewHeight: number,
        xOffset: number
    ) {
        const PADDING = 2;

        let didMove = false;

        for (const p of participants) {
            const font = image.getFontForText(p.name) === image.font12 ? fancyText.unicodeArcade : fancyText.bold_sans_7;
            const textWidth = fancyText.getTextWidth(font, p.name);
            const offset = Math.max(textWidth - xOffset, 0);
            didMove = didMove || offset !== 0;

            if (p.isLeft) {
                screen.fillRect(
                    left + p.x + (previewWidth >> 1) - PADDING - offset,
                    top + p.y - (font.lineHeight >> 1) - PADDING,
                    textWidth + (PADDING << 1),
                    font.lineHeight + (PADDING << 1),
                    NAME_BACKGROUND
                )
                fancyText.draw(
                    p.name,
                    screen,
                    left + p.x + (previewWidth >> 1) - offset,
                    top + p.y - (font.lineHeight >> 1),
                    0,
                    NAME_COLOR,
                    font
                );
            }
            else {
                screen.fillRect(
                    left + p.x - (previewWidth >> 1) - textWidth - PADDING + offset,
                    top + p.y - (font.lineHeight >> 1) - PADDING,
                    textWidth + (PADDING << 1),
                    font.lineHeight + (PADDING << 1),
                    NAME_BACKGROUND
                )
                fancyText.draw(
                    p.name,
                    screen,
                    left + p.x - (previewWidth >> 1) - textWidth + offset,
                    top + p.y - (font.lineHeight >> 1),
                    0,
                    NAME_COLOR,
                    font
                );
            }
        }

        return didMove;
    }
}