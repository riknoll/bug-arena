namespace hourOfAi {
    export let timeRemaining: number;
    export let timeMult = 1;
    export const MIN_TIME_MULT = 1;
    export const MAX_TIME_MULT = 50;

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

        let scores: number[] = [0, 0];

        game.onUpdate(() => {
            if (!running) return;
            for (let i = 0; i < timeMult; i++) {
                if (timeRemaining <= 0) {
                    running = false;
                    break;
                }
                timeRemaining -= timeSlice
                arena.update(timeSlice);
            }

           scores = countColors(arena.background, arena.combatants[0].bug.fillColor, arena.combatants[1].bug.fillColor);
            // info.player1.setScore(scores[0]);
            // info.player2.setScore(scores[1]);
        });


        tourney.onMatchSetup((m, player1, player2) => {
            arena = new Arena();
            const agent1 = new Agent(arena, (player1 as Participant).project.bugDesign);
            (player1 as Participant).project.script(agent1);
            const agent2 = new Agent(arena, (player2 as Participant).project.bugDesign);
            (player2 as Participant).project.script(agent2);
            agent2.bug.fillColor = 2;
            arena.placeCombatants();
            scores = [0, 0];
            timeRemaining = matchTime;
        });


        tourney.onMatch(m => {
            currentTime_ = 0
            arena.start();
            arena.update(timeSlice);
            running = true;

            pauseUntil(() => timeRemaining <= 0);

            return scores[0] > scores[1];
        });

        tourney.onMatchCleanup(m => {
            arena.dispose();
        });

        let mouseX = 0;
        let mouseY = 0;

        const font = fancyText.bold_sans_7;

        scene.createRenderable(20, () => {
            if (!arena) return;

            const totalPixels = arena.background.width * arena.background.height;

            const p1 = (scores[0] * 100 / totalPixels) | 0;
            const p2 = (scores[1] * 100 / totalPixels) | 0;

            fancyText.draw(`${p1}%`, screen, 2, 1, 0, 1, font);
            fancyText.draw(`${p2}%`, screen, screen.width - 20, 1, 0, 1, font);

            screen.fillRect(24, 2, 39, 7, 1);
            screen.fillRect(25, 3, 37 * (scores[0] / (scores[0] + scores[1])), 5, arena.combatants[0].bug.fillColor);
            screen.fillRect(screen.width - 64, 2, 39, 7, 1);
            screen.fillRect(screen.width - 63, 3, 37 * (scores[1] / (scores[0] + scores[1])), 5, arena.combatants[1].bug.fillColor);
        })

        initTimeMultControls();

        tourney.runTournament(projects.map(p => new Participant(p)), "Richard");
    }

    let running = false;
    export function initSinglePlayer(
    ) {
        let arena: Arena;
        game.stats = true;

        const timeSlice = 1/30;

        let scores: number[] = [0, 0];

        game.onUpdate(() => {
            if (!running) return;
            for (let i = 0; i < timeMult; i++) {
                timeRemaining += timeSlice
                arena.update(timeSlice);
            }

            scores = countColors(arena.background, arena.combatants[0].bug.fillColor, arena.combatants[1].bug.fillColor);
        });


        arena = new Arena();
        _agent = new Agent(arena, bugDesign);

        const opponent = new Agent(arena, {
            colorPalette: [15, 1, 2],
            legLength: 5,
            bodyRadius: 5,
            noseRadius: 2
        });

        let flip = true;
        let turning = false;
        opponent.every(1000, () => {
            if (turning) {
                if (opponent.distanceToWall() < 10) {
                    opponent.turnBy(180)
                }
                else {
                    opponent.turnBy(flip ? -90 : 90)
                }
                turning = false;
                return;
            }
            if (opponent.distanceToWall() < 10) {
                opponent.turnBy(flip ? 90 : -90)
                flip = !flip;
                turning = true;
            }
        })

        opponent.bug.fillColor = 2

        arena.placeCombatants();
        timeRemaining = 0;

        control.runInBackground(() => {
            running = true;
            arena.start();
            arena.update(timeSlice);
        })

        const font = fancyText.bold_sans_7;

        scene.createRenderable(20, () => {
            if (!arena) return;

            const totalPixels = arena.background.width * arena.background.height;

            const p1 = (scores[0] * 100 / totalPixels) | 0;
            const p2 = (scores[1] * 100 / totalPixels) | 0;

            fancyText.draw(`${p1}%`, screen, 2, 1, 0, 1, font);
            fancyText.draw(`${p2}%`, screen, screen.width - 20, 1, 0, 1, font);

            screen.fillRect(24, 2, 39, 7, 1);
            screen.fillRect(25, 3, 37 * (scores[0] / (scores[0] + scores[1])), 5, arena.combatants[0].bug.fillColor);
            screen.fillRect(screen.width - 64, 2, 39, 7, 1);
            screen.fillRect(screen.width - 63, 3, 37 * (scores[1] / (scores[0] + scores[1])), 5, arena.combatants[1].bug.fillColor);
        })

        initTimeMultControls();
    }

    function initTimeMultControls() {
        let mouseX = 0;
        let mouseY = 0;
        const font = fancyText.bold_sans_7;
        const speedText = "SPEED";
        const TEXT_LEFT = 10;
        const SLIDER_LEFT = TEXT_LEFT + fancyText.getTextWidth(font, speedText) + 2;
        const SLIDER_RIGHT = screen.width - 10;
        scene.createRenderable(20, () => {
            if (!running) return;

            const currentValue = (timeMult - MIN_TIME_MULT) / (MAX_TIME_MULT - MIN_TIME_MULT);
            const sliderX = SLIDER_LEFT + (currentValue * (SLIDER_RIGHT - SLIDER_LEFT) | 0);

            fancyText.draw(speedText, screen, TEXT_LEFT, 111, 0, 1, font);
            screen.fillRect(SLIDER_LEFT, 114, SLIDER_RIGHT - SLIDER_LEFT, 3, 1);
            screen.fillRect(sliderX - 1, 112, 2, 7, 15)
        })

        const updateTimeMult = () => {
            if (!running) return;

            if (mouseY < 100) return;

            const newMult = Math.map(
                Math.constrain(mouseX, SLIDER_LEFT, SLIDER_RIGHT),
                SLIDER_LEFT,
                SLIDER_RIGHT,
                MIN_TIME_MULT,
                MAX_TIME_MULT
            );
            timeMult = newMult | 0;
        };

        for (const event of [ControllerButtonEvent.Pressed, ControllerButtonEvent.Repeated]) {
            controller.right.onEvent(event, () => {
                if (!running) return;
                timeMult = Math.min(MAX_TIME_MULT, timeMult + 2);
            });
            controller.left.onEvent(event, () => {
                if (!running) return;
                timeMult = Math.max(MIN_TIME_MULT, timeMult - 2);
            });
        }


        browserEvents.onMouseMove((x, y) => {
            mouseX = x;
            mouseY = y;

            if (browserEvents.MouseLeft.isPressed()) {
                updateTimeMult();
            }
        });

        browserEvents.MouseLeft.addEventListener(browserEvents.MouseButtonEvent.Pressed, () => {
            updateTimeMult();
        })

    }

    export function countColors(image: Image, color1: number, color2: number) {
        let count1 = 0;
        let count2 = 0;

        for (let x = 0; x < image.width; x++) {
            for (let y = 0; y < image.height; y++) {
                const c = image.getPixel(x, y);
                if (c === color1) count1++;
                else if (c === color2) count2++;
            }
        }

        return [count1, count2];
    }
}