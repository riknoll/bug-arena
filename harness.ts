namespace hourOfAi {
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

    export class Agent {
        bug: hourOfAi.BugPresident;
        protected handlers: IntervalHandler[] = [];

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

    export function initRunner() {
        const bracket = new hourOfAi.Bracket(projects);
        bracket.left = 5;
        bracket.top = 4;


        const matches = bracket.getMatches();

        while (true) {
            const nextMatch = matches.find(match => match.canBePlayed());

            if (!nextMatch) {
                break;
            }
            nextMatch.highlighted = true;
            pauseUntil(() => controller.A.isPressed() || controller.B.isPressed());
            nextMatch.highlighted = false;

            const arena = new Arena();
            const player1 = nextMatch.a instanceof Participant ? nextMatch.a : nextMatch.a.result;
            const player2 = nextMatch.b instanceof Participant ? nextMatch.b : nextMatch.b.result

            const agent1 = new Agent(arena, player1.project.bugDesign);
            player1.project.script(agent1);
            const agent2 = new Agent(arena, player2.project.bugDesign);
            player2.project.script(agent2);
            agent2.bug.fillColor = 2;

            bracket.setFlag(SpriteFlag.Invisible, true);

            arena.placeCombatants();

            let timeRemaining = 120;
            const timeSlice = 1/30;
            let timeMult = 20;
            currentTime_ = 0
            arena.update(timeSlice);

            showIntro(player1.project.name, player2.project.name);

            game.onUpdate(() => {
                for (let i = 0; i < timeMult; i++) {
                    if (timeRemaining <= 0) {
                        return;
                    }
                    timeRemaining -= timeSlice
                    arena.update(timeSlice);
                }
            });

            pauseUntil(() => timeRemaining <= 0);

            nextMatch.setWinner(arena.didPlayer1Win());
            arena.dispose();
            bracket.setFlag(SpriteFlag.Invisible, false);
        }
    }
}