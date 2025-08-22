namespace tourney {
    export class Participant {
        x: number;
        y: number;
        defeated: boolean;
        depth = 0;
        isLeft: boolean;

        constructor(
            public name: string,
            public preview: Image,
        ) { }

        drawPreview(left: number, top: number) {
            // screen.fillRect(left, top, this.preview.width, this.preview.height, 11)
            screen.drawTransparentImage(
                this.preview, left, top
            )
        }
    }

    export class Match {
        result: Participant;
        aWasVictor: boolean;
        defeated: boolean;
        next: Match;
        depth: number;

        x: number;
        y: number;

        constructor(
            public a: Match | Participant,
            public b: Match | Participant,
        ) {
            if (a instanceof Match) {
                a.next = this;
            }
            if (b instanceof Match) {
                b.next = this;
            }

            this.depth = Math.max(a.depth, b.depth) + 1;
        }

        setWinner(a: boolean) {
            this.aWasVictor = a;

            if (a) {
                setDefeatedRecursive(this.b)
                if (this.a instanceof Participant) {
                    this.result = this.a;
                }
                else {
                    this.result = this.a.result;
                }
            }
            else {
                setDefeatedRecursive(this.a)
                if (this.b instanceof Participant) {
                    this.result = this.b;
                }
                else {
                    this.result = this.b.result;
                }
            }
        }

        getParticipants(): [Participant, Participant] {
            let a: Participant;

            if (this.a instanceof Match) {
                a = this.a.result;
            }
            else {
                a = this.a;
            }

            let b: Participant;

            if (this.b instanceof Match) {
                b = this.b.result;
            }
            else {
                b = this.b;
            }

            return [a, b];
        }
    }
}
