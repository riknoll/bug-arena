namespace hourOfAi {
    export class Project {


        constructor(
            public name: string,
            public bugDesign: BugDesign,
            public script: (agent: Agent) => void
        ) {

        }
    }

    export class Participant {
        constructor(
            public project: Project,
            public y: number
        ) {
        }

        getY() {
            return this.y;
        }

        getRight(maxWidth: number) {
            return 2;
        }
    }

    export class Match {
        result: Participant;
        right: number;
        y: number;

        highlighted: boolean = false;

        constructor(
            public a: Match | Participant,
            public b: Match | Participant,
            maxWidth: number
        ) {
            this.right = Math.max(this.a.getRight(maxWidth), this.b.getRight(maxWidth)) + maxWidth + 6;
            this.y = ((this.a.getY() + this.b.getY()) / 2) | 0;
        }

        getY(): number {
            return this.y;
        }

        getRight(maxWidth: number): number {
            return this.right;
        }

        setWinner(a: boolean) {
            if (a) {
                if (this.a instanceof Participant) {
                    this.result = this.a;
                }
                else  {
                    this.result = this.a.result;
                }
            }
            else {
                if (this.b instanceof Participant) {
                    this.result = this.b;
                }
                else {
                    this.result = this.b.result;
                }
            }
        }

        canBePlayed(): boolean {
            if (this.result) return false;

            const aGood = this.a instanceof Participant || (this.a.result);
            const bGood = this.b instanceof Participant || (this.b.result);

            return !!(aGood && bGood);
        }
    }

    export class Bracket extends sprites.ExtendableSprite {
        bracket: Match;
        maxWidth: number;

        constructor(contestants: Project[]) {
            super(img`.`)

            this.maxWidth = 0;
            for (const project of contestants) {
                this.maxWidth = Math.max(this.maxWidth, fancyText.getTextWidth(fancyText.bold_sans_7, project.name));
            }

            const participants: Participant[] = [];

            const c = contestants.slice(0);
            let top = 0;
            while (c.length) {
                participants.push(new Participant(c.removeAt(randint(0, c.length - 1)), top))
                top += 10;
            }
            this.bracket = splitMatches(participants, this.maxWidth);
        }

        draw(drawLeft: number, drawTop: number) {
            this.drawMatch(drawLeft, drawTop, this.bracket);
        }

        protected drawName(name: string, left: number, top: number, highlighted: boolean) {
            if (!name) {
                screen.fillRect(left - 1, top + 4, this.maxWidth + 4, 2, 1)
                return;
            }
            const textWidth = fancyText.getTextWidth(fancyText.bold_sans_7, name);
            screen.fillRect(
                left - 1,
                top + 4,
                textWidth + 2,
                2,
                0
            )
            fancyText.draw(
                name,
                screen,
                left,
                top,
                0,
                highlighted ? 2 : 12,
                fancyText.bold_sans_7
            )
        }

        protected drawMatch(drawLeft: number, drawTop: number, match: Match) {
            const right = match.getRight(this.maxWidth);
            const aRight = match.a.getRight(this.maxWidth);
            const bRight = match.b.getRight(this.maxWidth);
            const aY = match.a.getY();
            const bY = match.b.getY();

            screen.fillRect(
                drawLeft + aRight,
                drawTop + aY,
                right - aRight,
                2,
                match.highlighted ? 2 : 1
            )
            screen.fillRect(
                drawLeft + bRight,
                drawTop + bY,
                right - bRight,
                2,
                match.highlighted ? 2 : 1
            )
            screen.fillRect(
                drawLeft + right,
                drawTop + aY,
                2,
                bY - aY + 2,
                match.highlighted ? 2 : 1
            )

            // if (match.result) {
            //     this.drawName(
            //         match.result.name,
            //         right - this.maxWidth,
            //         match.getY() - 2
            //     )
            // }

            if (match.a instanceof Participant) {
                this.drawName(
                    match.a.project.name, drawLeft, drawTop + aY - 4,
                    match.highlighted
                )
            }
            else {
                this.drawMatch(drawLeft, drawTop, match.a);
                if (match.a.result) {
                    this.drawName(
                        match.a.result.project.name, drawLeft + right - this.maxWidth - 2, drawTop + aY - 4,
                    match.highlighted
                    )
                }
            }

            if (match.b instanceof Participant) {
                this.drawName(
                    match.b.project.name, drawLeft, drawTop + bY - 4,
                    match.highlighted
                )
            }
            else {
                this.drawMatch(drawLeft, drawTop, match.b);
                if (match.b.result) {
                    this.drawName(
                        match.b.result.project.name, drawLeft + right - this.maxWidth - 2, drawTop + bY - 4,
                    match.highlighted
                    )
                }
            }
        }

        getMatches(): Match[] {
            const result: Match[] = [];

            collectMatches(this.bracket, result);

            return result;
        }
    }

    function splitMatches(participants: Participant[], maxWidth: number, flip = false): Match {
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
                return new Match(topBracket[0], bottomBracket[0], maxWidth)
            }
            return new Match(topBracket[0], splitMatches(bottomBracket, maxWidth, flip), maxWidth)
        }
        else if (bottomBracket.length === 1) {
            return new Match(splitMatches(topBracket, maxWidth, flip), bottomBracket[0], maxWidth);
        }

        return new Match(
            splitMatches(topBracket, maxWidth, flip),
            splitMatches(bottomBracket, maxWidth, flip),
            maxWidth
        );
    }

    function collectMatches(match: Match, into: Match[]) {
        into.push(match);
        if (match.a instanceof Match) {
            collectMatches(match.a, into);
        }
        if (match.b instanceof Match) {
            collectMatches(match.b, into);
        }
    }
}