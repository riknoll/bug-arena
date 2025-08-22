namespace hourOfAi {
    export let timeRemaining: number;

    export interface BugDesign {
        legLength: number;
        bodyRadius: number;
        noseRadius: number;
        colorPalette: number[];
    }

    interface IntervalHandler {
        millis: number;
        timer: number;
        handler: () => void;
    }

    export class Project {
        constructor(
            public name: string,
            public bugDesign: BugDesign,
            public script: (agent: Agent) => void
        ) {

        }
    }

    export class Agent {
        bug: hourOfAi.BugPresident;
        protected handlers: IntervalHandler[] = [];
        protected onStartHandler: () => void;

        constructor(public arena: Arena, design: BugDesign) {
            this.bug = new hourOfAi.BugPresident();
            this.bug.bodyRadius = design.bodyRadius;
            this.bug.legLength = design.legLength + design.bodyRadius;
            this.bug.noseRadius = design.noseRadius;
            this.bug.bodyColor = design.colorPalette[0];
            this.bug.eyeColor = design.colorPalette[1];
            this.bug.noseColor = design.colorPalette[2];

            arena.combatants.push(this);
        }

        start() {
            if (this.onStartHandler) this.onStartHandler();
        }


        update(dt: number) {
            this.bug.update(dt);

            if (this.bug.targetHeading === undefined) {
                for (const h of this.handlers) {
                    h.timer -= dt * 1000;
                    if (h.timer <= 0) {
                        h.handler();
                        h.timer += h.millis;
                    }
                }
            }

            this.arena.constrainPosition(this.bug.position, AGENT_RADIUS);
        }

        property(property: Property): number {
            if (property === Property.X) {
                return this.bug.position.x;
            } else if (property === Property.Y) {
                return this.bug.position.y;
            } else if (property === Property.Angle) {
                return angleutil.clampRadians(this.bug.heading) * 180 / Math.PI;
            }
            return 0;
        }

        onStart(handler: () => void) {
            this.onStartHandler = handler;
        }

        every(millis: number, handler: () => void) {
            this.handlers.push({ millis, timer: millis, handler });
        }

        turnBy(degrees: number) {
            this.bug.targetHeading = this.bug.heading + degreesToRadians(degrees);
        }

        turnTowards(degrees: number) {
            this.bug.targetHeading = degreesToRadians(degrees);
        }

        setTurnSpeed(degrees: number) {
        }

        distanceToWall(): number {
            const pos = this.arena.scanForWall(this.bug.position, this.bug.heading);

            // console.log(`(${pos.x | 0} ${pos.y | 0})`)

            return pos ? Math.max(0, distanceBetween(this.bug.position, pos) - AGENT_RADIUS) : -1;
        }

        distanceToColor(type: ColorType): number {
            let color = this.bug.fillColor;
            if (type === ColorType.NoColor) {
                color = 0;
            }
            else if (type === ColorType.OpponentColor) {
                color = this.arena.combatants.find(c => c !== this).bug.fillColor || 0;
            }

            const pos = this.arena.scanForColor(this.bug.position, this.bug.heading, color);
            return pos ? Math.max(0, distanceBetween(this.bug.position, pos) - AGENT_RADIUS) : -1;
        }

        canSeeColor(type: ColorType): boolean {
            return this.distanceToColor(type) !== -1;
        }

        distanceToOpponent(): number {
            const pos = this.arena.scanForOpponent(this.bug.position, this.bug.heading, this);
            return pos ? Math.max(0, distanceBetween(this.bug.position, pos) - AGENT_RADIUS) : -1;
        }

        canSeeOpponent(): boolean {
            return this.distanceToOpponent() !== -1;
        }

        distanceToBomb(): number {
            return 0;
        }

        canSeeBomb(): boolean {
            return false;
        }

        dispose() {
            this.bug.renderable.destroy();
        }
    }

    function degreesToRadians(degrees: number): number {
        return degrees * Math.PI / 180;
    }

    let projects: Project[] = [];
    export function registerProject(
        name: string,
        bugDesign: BugDesign,
        script: (agent: Agent) => void
    ) {
        projects.push(new Project(name, bugDesign, script));
    }

    export class Participant extends tourney.Participant {
        constructor(
            public project: Project
        ) {
            super(project.name, img`2`);
        }

        drawPreview(left: number, top: number): void {
            drawBug(
                left + 8,
                top + 8,
                game.currentScene().camera,
                this.project.bugDesign.bodyRadius,
                this.isLeft ?  0 : Math.PI,
                this.project.bugDesign.colorPalette[0],
                this.project.bugDesign.colorPalette[1],
                15,
                this.project.bugDesign.colorPalette[2],
                this.project.bugDesign.noseRadius,
                this.project.bugDesign.legLength + this.project.bugDesign.bodyRadius
            )
        }
    }

    export function initRunner(
        matchTime: number
    ) {
        let arena: Arena;
        let running = false;
        game.stats = true;

        timeRemaining = matchTime;
        const timeSlice = 1/30;
        let timeMult = 40;

        game.onUpdate(() => {
            if (!running) return;
            for (let i = 0; i < timeMult; i++) {
                if (timeRemaining <= 0) {
                    running = false;
                    return;
                }
                timeRemaining -= timeSlice
                arena.update(timeSlice);
            }
        });


        tourney.onMatchSetup((m, player1, player2) => {
            arena = new Arena();
            const agent1 = new Agent(arena, (player1 as Participant).project.bugDesign);
            (player1 as Participant).project.script(agent1);
            const agent2 = new Agent(arena, (player2 as Participant).project.bugDesign);
            (player2 as Participant).project.script(agent2);
            agent2.bug.fillColor = 2;
            arena.placeCombatants();
        });


        tourney.onMatch(m => {
            currentTime_ = 0
            timeRemaining = matchTime;
            arena.start();
            arena.update(timeSlice);
            running = true;

            pauseUntil(() => timeRemaining <= 0);

            return arena.didPlayer1Win();
        });

        tourney.onMatchCleanup(m => {
            arena.dispose();
        });

        tourney.runTournament(projects.map(p => new Participant(p)), "Richard");
    }
}