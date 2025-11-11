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
        fillColor?: number;
    }

    interface IntervalHandler {
        millis: number;
        timer: number;
        handler: () => void;
    }

    class ScheduledHandler {
        constructor(
            public timer: number,
            public handler: () => void
        ) {
        }
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
        fillPatternKind: FillColor;
        fillPattern: (x: number, y: number) => number;

        protected handlers: IntervalHandler[] = [];
        protected onStartHandler: () => void;
        protected onBumpWallHandler: () => void;
        protected scheduled: ScheduledHandler[] = [];

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

                for (const h of this.scheduled) {
                    h.timer -= dt * 1000;

                    if (h.timer <= 0) {
                        h.handler();
                    }
                }

                this.scheduled = this.scheduled.filter(h => h.timer > 0);
            }

            if (this.bug.targetHeading === undefined) {
                // get the dx/dy to make sure we're actually heading towards the wall we're supposedly bumping
                // into. there is a slight dead zone to account for drift from rounding errors
                const angleDegrees = Math.round(angleutil.clampDegrees(this.bug.heading * 180 / Math.PI))
                const angle = angleDegrees * Math.PI / 180;
                let dx = Math.cos(angle)
                if (Math.abs(dx) < 0.005) dx = 0;
                let dy = Math.sin(angle)
                if (Math.abs(dy) < 0.005) dy = 0;


                if (this.bug.position.x - AGENT_RADIUS < this.arena.left && dx < 0 ||
                    this.bug.position.x + AGENT_RADIUS > this.arena.right && dx > 0 ||
                    this.bug.position.y - AGENT_RADIUS < this.arena.top && dy < 0 ||
                    this.bug.position.y + AGENT_RADIUS > this.arena.bottom && dy > 0
                ) {
                    if (this.onBumpWallHandler) this.onBumpWallHandler();
                }
            }

            this.arena.constrainPosition(this.bug.position, AGENT_RADIUS);
        }

        property(property: Property): number {
            if (property === Property.X) {
                return this.bug.position.x;
            }
            else if (property === Property.Y) {
                return this.bug.position.y;
            }
            else if (property === Property.Angle) {
                return angleutil.clampRadians(this.bug.heading) * 180 / Math.PI;
            }
            else if (property === Property.AngleRadians) {
                return angleutil.clampRadians(this.bug.heading);
            }
            return 0;
        }

        opponentProperty(property: Property): number {
            const opponent = this.arena.combatants.find(c => c !== this);
            if (!opponent) return 0;

            return opponent.property(property);
        }

        onStart(handler: () => void) {
            this.onStartHandler = handler;
        }

        onBumpWall(handler: () => void) {
            this.onBumpWallHandler = handler;
        }

        every(millis: number, handler: () => void) {
            this.handlers.push({ millis, timer: millis, handler });
        }

        doAfter(millis: number, handler: () => void) {
            this.scheduled.push(new ScheduledHandler(millis, handler));
        }

        turnBy(degrees: number) {
            this.bug.targetHeading = this.bug.heading + degreesToRadians(degrees);
        }

        turnTowards(degrees: number) {
            this.bug.targetHeading = degreesToRadians(degrees);
        }

        turnTowardsPosition(x: number, y: number) {
            this.turnTowards(Math.atan2(y - this.property(Property.Y), x - this.property(Property.X)) * 180 / Math.PI);
        }

        arenaProperty(property: ArenaProperty): number {
            if (property === ArenaProperty.Width) {
                return this.arena.background.width
            }
            else if (property === ArenaProperty.Height) {
                return this.arena.background.height
            }
            return 0;
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
                if (this.arena.combatants.length < 2) return Infinity;

                color = this.arena.combatants.indexOf(this) ? 1 : 2;
            }

            const edge = this.bug.position.project(this.bug.heading, AGENT_RADIUS + 1);
            const pos = this.arena.scanForColor(edge, this.bug.heading, color);
            return pos ? Math.max(0, distanceBetween(edge, pos) - 1) : Infinity;
        }

        canSeeColor(type: ColorType): boolean {
            return this.distanceToColor(type) !== Infinity;
        }

        distanceToOpponent(): number {
            const pos = this.arena.scanForOpponent(this.bug.position, this.bug.heading, this);

            if (!pos) {
                return Infinity;
            }
            const opponent = this.arena.combatants.find(c => c !== this);

            return Math.max(distanceBetween(this.bug.position, opponent.bug.position) - AGENT_RADIUS * 2, 0);
        }

        canSeeOpponent(): boolean {
            return this.distanceToOpponent() !== Infinity;
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

        setFillColor(fillColor: FillColor) {
            this.fillPatternKind = fillColor;
            this.fillPattern = getColorFillFunction(fillColor);
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

    let running = false;

    export function initTournament(
        matchTime: number
    ) {
        let arena: Arena;
        running = false;

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

           scores = countColors(arena.scoreImage, 1, 2);
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

    export function initSingleMatch(
        timedMatch: boolean,
        showIntro: boolean,
        showOutro: boolean,
        opponentDef?: Challenger
    ) {
        let arena: Arena;

        const timeSlice = 1/30;

        let scores: number[] = [0, 0];

        game.onUpdate(() => {
            if (!running) return;
            for (let i = 0; i < timeMult; i++) {
                if (timedMatch) {
                    timeRemaining -= timeSlice
                }
                else {
                    timeRemaining += timeSlice
                }
                arena.update(timeSlice);
            }

            if (opponentDef) {
                scores = countColors(arena.scoreImage, 1, 2);
            }
            else {
                scores[0] = countColors(arena.scoreImage, 1, 2)[0];
            }
        });


        arena = new Arena();
        arena.drawTimer = timedMatch;

        initAPI();

        _agent.agent = new Agent(arena, bugDesign);

        for (const handler of _agent.onStartHandlers) {
            _agent.agent.onStart(handler);
        }

        for (const handler of _agent.everyHandlers) {
            _agent.agent.every(handler.millis, handler.handler);
        }

        for (const handler of _agent.onBumpWallHandlers) {
            _agent.agent.onBumpWall(handler);
        }

        if (_agent.fillColor) _agent.agent.setFillColor(_agent.fillColor)

        let opponent: Agent;

        if (opponentDef) {
            opponent = new Agent(
                arena,
                opponentDef.design
            );
            opponentDef.algorithm(opponent);

            opponent.bug.fillColor = opponentDef.design.fillColor || 2
        }


        arena.placeCombatants();
        timeRemaining = timedMatch ? 300 : 0;

        const font = fancyText.bold_sans_7;

        let scoreRenderable: scene.Renderable;

        const totalPixels = arena.background.width * arena.background.height - arena.background.width - arena.background.height - 3;
        if (!opponentDef) {
            scoreRenderable = scene.createRenderable(20, () => {
                if (!arena) return;

                const p1 = (scores[0] * 100 / totalPixels) | 0;

                fancyText.draw(`${p1}%`, screen, 2, 1, 0, 1, font);

                screen.fillRect(26, 2, 130, 7, 1);
                screen.fillRect(27, 3, 128 * (scores[0] / totalPixels), 5, arena.combatants[0].bug.fillColor);
            })
        }
        else {
            scoreRenderable = scene.createRenderable(20, () => {
                if (!arena) return;

                const p1 = (scores[0] * 100 / totalPixels) | 0;
                const p2 = (scores[1] * 100 / totalPixels) | 0;

                fancyText.draw(`${p1}%`, screen, 2, 1, 0, 1, font);
                fancyText.draw(`${p2}%`, screen, screen.width - 20, 1, 0, 1, font);

                screen.fillRect(24, 2, 39, 7, 1);
                screen.fillRect(25, 3, 37 * (scores[0] / (scores[0] + scores[1])), 5, arena.combatants[0].bug.fillColor);
                screen.fillRect(screen.width - 64, 2, 39, 7, 1);
                screen.fillRect(screen.width - 63, 3, 37 * (scores[1] / (scores[0] + scores[1])), 5, arena.combatants[1].bug.fillColor);
            })
        }

        initTimeMultControls();

        if (showIntro && opponentDef) {
            tourney.showIntro("Player", opponentDef.name, 10)
        }

        control.runInBackground(() => {
            running = true;
            arena.start();
            arena.update(timeSlice);
        });

        if (timedMatch) {
            pauseUntil(() => timeRemaining <= 0);
            running = false;

            if (showOutro && opponentDef) {
                const player1Won = scores[0] > scores[1];
                const cleanup = tourney.showWinAnimation(arena.didPlayer1Win() ? "Player" : opponentDef.name);

                pause(500);
                cleanup();
                scoreRenderable.destroy();
                arena.dispose();
                _agent = undefined;

                return player1Won;
            }
        }


        return undefined;
    }

    function initTimeMultControls() {
        let mouseX = 0;
        let mouseY = 0;
        const font = fancyText.bold_sans_7;
        const speedText = "SPEED";
        const TEXT_LEFT = 10;
        const SLIDER_LEFT = TEXT_LEFT + fancyText.getTextWidth(font, speedText) + 2;
        const SLIDER_RIGHT = screen.width - 10;

        timeMult = getSpeedSetting();

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
            setSpeedSetting(timeMult);
        };

        for (const event of [ControllerButtonEvent.Pressed, ControllerButtonEvent.Repeated]) {
            controller.right.onEvent(event, () => {
                if (!running) return;
                timeMult = Math.min(MAX_TIME_MULT, timeMult + 2);
                setSpeedSetting(timeMult);
            });
            controller.left.onEvent(event, () => {
                if (!running) return;
                timeMult = Math.max(MIN_TIME_MULT, timeMult - 2);
                setSpeedSetting(timeMult);
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