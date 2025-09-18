namespace SpriteKind {
    export const Leg = SpriteKind.create()
}

//% color="#e88b00"
//% block="BUG PRESIDENT"
namespace hourOfAi {
    const MOVE_SPEED = 10;
    export const AGENT_RADIUS = 5;

    export let currentTime_ = 0;

    export function advanceTime(timeStep: number) {
        currentTime_ += timeStep;
    }

    export function containInArena(position: Position) {
        position.x = Math.constrain(position.x, AGENT_RADIUS, screen.width - AGENT_RADIUS);
        position.y = Math.constrain(position.y, AGENT_RADIUS, screen.height - AGENT_RADIUS);
    }

    export class BugPresident {
        lastStepLeft = false;
        legsReset = false;
        bodyRadius = 5;
        legLength = 10;
        legPositions: Leg[] = [];
        turnRate = 4;
        speed = MOVE_SPEED;
        footSpeed = 100;
        hitboxRadius = 10;
        bodyColor = 4;
        eyeColor = 15;
        legColor = 14;
        noseColor = 2;
        stepDistance = 4;
        fillColor = 3
        score = 0;
        noseRadius = 2;

        data: any;

        userUpdate: () => void;

        renderable: scene.Renderable;

        heading = 0;
        targetHeading: number;

        position: Position;
        lastStepPosition: Position;
        lastStepHeading: number;

        legsInit = false

        constructor() {
            // init();
            this.data = {};

            this.position = new Position(80, 60);

            for (let i = 0; i <= 5; i++) {
                this.legPositions.push(new Leg(new Position(0, 0)));
            }

            this.positionLegs(true, true, true)
            this.positionLegs(false, true, true)


            this.lastStepPosition = this.position.clone();
            this.lastStepHeading = this.heading;


            // all.push(this);

            this.renderable = scene.createRenderable(10, () => {
                this.draw();
            })
        }

        positionLegs(left: boolean, close: boolean, teleport: boolean) {
            if (close) {
                if (left) {
                    moveLeg(
                        teleport,
                        this.legPositions[0],
                        this.position.project(this.heading - (Math.PI / 2 - 0.8), this.legLength - 2),
                        200,
                        this.stepDistance
                    );
                    moveLeg(
                        teleport,
                        this.legPositions[1],
                        this.position.project(this.heading + Math.PI / 2, this.legLength - 2),
                        200,
                        this.stepDistance
                    );
                    moveLeg(
                        teleport,
                        this.legPositions[2],
                        this.position.project(this.heading - (Math.PI / 2 + 0.8), this.legLength - 2),
                        200,
                        this.stepDistance
                    );
                } else {
                    moveLeg(
                        teleport,
                        this.legPositions[3],
                        this.position.project(this.heading + (Math.PI / 2 - 0.8), this.legLength - 2),
                        200,
                        this.stepDistance
                    );
                    moveLeg(
                        teleport,
                        this.legPositions[4],
                        this.position.project(this.heading - Math.PI / 2, this.legLength - 2),
                        200,
                        this.stepDistance
                    );
                    moveLeg(
                        teleport,
                        this.legPositions[5],
                        this.position.project(this.heading + (Math.PI / 2 + 0.8), this.legLength - 2),
                        200,
                        this.stepDistance
                    );
                }
            } else {
                if (left) {
                    moveLeg(
                        teleport,
                        this.legPositions[0],
                        this.position.project(this.heading - Math.PI * 0.2, this.legLength + 2),
                        200,
                        this.stepDistance
                    );
                    moveLeg(
                        teleport,
                        this.legPositions[1],
                        this.position.project(this.heading + Math.PI * 0.3, this.legLength),
                        200,
                        this.stepDistance
                    );
                    moveLeg(
                        teleport,
                        this.legPositions[2],
                        this.position.project(this.heading - Math.PI * 0.4, this.legLength - 4),
                        200,
                        this.stepDistance
                    );
                } else {
                    moveLeg(
                        teleport,
                        this.legPositions[3],
                        this.position.project(this.heading + Math.PI * 0.2, this.legLength + 2),
                        200,
                        this.stepDistance
                    );
                    moveLeg(
                        teleport,
                        this.legPositions[4],
                        this.position.project(this.heading - Math.PI * 0.3, this.legLength),
                        200,
                        this.stepDistance
                    );
                    moveLeg(
                        teleport,
                        this.legPositions[5],
                        this.position.project(this.heading + Math.PI * 0.4, this.legLength - 4),
                        200,
                        this.stepDistance
                    );
                }
            }
        }

        resetLegs() {
            if (!(this.legsReset)) {
                this.legsReset = true
                this.positionLegs(true, true, false)
                this.positionLegs(false, true, false)
            }
        }

        draw() {
            const camera = game.currentScene().camera;

            for (let leg of this.legPositions) {
                fillCircle(
                    leg.position.x - camera.drawOffsetX,
                    leg.position.y - camera.drawOffsetY,
                    2,
                    this.legColor
                )
                screen.drawLine(
                    leg.position.x - camera.drawOffsetX,
                    leg.position.y - camera.drawOffsetY,
                    this.position.x - camera.drawOffsetX,
                    this.position.y - camera.drawOffsetY,
                    this.legColor
                )
            }
            fillCircle(
                this.position.x + Math.round(this.bodyRadius * Math.cos(this.heading)) - camera.drawOffsetX,
                this.position.y + Math.round(this.bodyRadius * Math.sin(this.heading)) - camera.drawOffsetY,
                this.noseRadius,
                this.noseColor
            )
            fillCircle(
                this.position.x - camera.drawOffsetX,
                this.position.y - camera.drawOffsetY,
                this.bodyRadius,
                this.bodyColor
            )
            screen.setPixel(
                (this.position.x + Math.round((this.bodyRadius - 2) * Math.cos(this.heading - 0.5)) - camera.drawOffsetX),
                (this.position.y + Math.round((this.bodyRadius - 2) * Math.sin(this.heading - 0.5)) - camera.drawOffsetY),
                this.eyeColor
            )
            screen.setPixel(
                this.position.x + Math.round((this.bodyRadius - 2) * Math.cos(this.heading + 0.5)) - camera.drawOffsetX,
                this.position.y + Math.round((this.bodyRadius - 2) * Math.sin(this.heading + 0.5)) - camera.drawOffsetY,
                this.eyeColor
            )
        }

        update(timestep: number) {
            let isMoving = this.targetHeading === undefined;
            if (this.targetHeading !== undefined) {
                this.heading = angleutil.clampRadians(angleutil.turnAngleTowards(this.heading, this.targetHeading, this.turnRate * timestep));
                if (Math.abs(angleutil.angleDifference(this.heading, this.targetHeading)) < 0.001) {
                    this.heading = this.targetHeading;
                    this.targetHeading = undefined;
                }
            }


            const dx = Math.cos(this.heading);
            const dy = Math.sin(this.heading);

            if (isMoving) {
                this.position.x += dx * this.speed * timestep;
                this.position.y += dy * this.speed * timestep;
                this.legsReset = false
            }
            else {
                if (Math.abs(angleutil.angleDifference(this.heading, this.lastStepHeading)) > 0.5) {
                    this.lastStepHeading = this.heading
                    this.lastStepLeft = !(this.lastStepLeft)
                    this.positionLegs(this.lastStepLeft, true, false)
                    this.legsReset = false
                }
            }

            const distance = distanceBetween(this.lastStepPosition, this.position);
            if (distance > this.stepDistance) {
                this.lastStepPosition = this.position.clone();
                this.lastStepLeft = !(this.lastStepLeft)
                this.positionLegs(this.lastStepLeft, false, false)
                this.legsReset = false
            }

            for (const leg of this.legPositions) {
                leg.update();
            }
        }

        postUpdate() {
            if (this.legsInit) return;
            this.legsInit = true;

            this.positionLegs(true, true, true)
            this.positionLegs(false, true, true)
        }

        public turnTowards(angle: number) {
            this.targetHeading = angleutil.clampRadians(angle);
            pauseUntil(() => this.targetHeading === undefined);
        }

        public pause(time: number) {
            const startTime = currentTime();
            pauseUntil(() => currentTime() - startTime >= time / 1000);
        }

        public distanceToWall() {
            const dx = Math.cos(this.heading);
            const dy = Math.sin(this.heading);

            let distance = 0;
            while (true) {
                const nextX = this.position.x + dx * distance;
                const nextY = this.position.y + dy * distance;

                if (isWall(nextX, nextY)) {
                    return distance;
                }

                distance += 1;
            }
        }
    }

    export function create() {
        return new BugPresident();
    }


    export function turnTowardsDirection(pres: BugPresident, angle: number) {
        pres.targetHeading = angleutil.clampRadians(angle);
    }

    export function setDirection(pres: BugPresident, angle: number) {
        pres.heading = angleutil.clampRadians(angle);
    }

    export function resetLegs(pres: BugPresident) {
        pres.resetLegs();
    }

    export function drawBug(
        x: number,
        y: number,
        camera: scene.Camera,
        bodyRadius: number,
        heading: number,
        bodyColor: number,
        eyeColor: number,
        legColor: number,
        noseColor: number,
        noseRadius: number,
        legLength: number
    ) {
            const legAngles = [
                -(Math.PI / 2 - 0.8),
                Math.PI / 2,
                -(Math.PI / 2 + 0.8),
                (Math.PI / 2 - 0.8),
                -Math.PI / 2,
                (Math.PI / 2 + 0.8),
            ]


        for (const angle of legAngles) {
            fillCircle(
                x + (legLength - 2) * Math.cos(angle) - camera.drawOffsetX,
                y + (legLength - 2) * Math.sin(angle) - camera.drawOffsetY,
                2,
                legColor
            )
            screen.drawLine(
                 x + (legLength - 2) * Math.cos(angle) - camera.drawOffsetX,
                y + (legLength - 2) * Math.sin(angle) - camera.drawOffsetY,
                x - camera.drawOffsetX,
                y - camera.drawOffsetY,
                legColor
            )
        }
        fillCircle(
            x + Math.round(bodyRadius * Math.cos(heading)) - camera.drawOffsetX,
            y + Math.round(bodyRadius * Math.sin(heading)) - camera.drawOffsetY,
            noseRadius,
            noseColor
        )
        fillCircle(
            x - camera.drawOffsetX,
            y - camera.drawOffsetY,
            bodyRadius,
            bodyColor
        )
        screen.setPixel(
            (x + Math.round((bodyRadius - 2) * Math.cos(heading - 0.5)) - camera.drawOffsetX),
            (y + Math.round((bodyRadius - 2) * Math.sin(heading - 0.5)) - camera.drawOffsetY),
            eyeColor
        )
        screen.setPixel(
            x + Math.round((bodyRadius - 2) * Math.cos(heading + 0.5)) - camera.drawOffsetX,
            y + Math.round((bodyRadius - 2) * Math.sin(heading + 0.5)) - camera.drawOffsetY,
            eyeColor
        )
    }

    function moveLeg(teleport: boolean, leg: Leg, pos: Position, time: number, stepDistance: number) {
        if (teleport) {
            leg.position = pos.clone();
            leg.moveStart = null;
            leg.moveEnd = null;
        }
        else {
            leg.moveTo(pos, time);
        }
    }

    export class Position {
        constructor(public x: number, public y: number) { }

        project(angle: number, distance: number): Position {
            return new Position(
                this.x + distance * Math.cos(angle),
                this.y + distance * Math.sin(angle)
            );
        }

        moveTo(position: Position, time: number) {
            const dx = position.x - this.x;
            const dy = position.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const speed = distance / time;

            this.x += (dx / distance) * speed;
            this.y += (dy / distance) * speed;
        }

        clone(): Position {
            return new Position(this.x, this.y);
        }
    }

    class Leg {
        moveStart: Position;
        moveEnd: Position;
        moveStartTime: number;
        moveDuration: number;

        constructor(
            public position: Position,
        ) {

        }

        moveTo(position: Position, time: number) {
            this.moveStart = this.position.clone();
            this.moveEnd = position.clone();
            this.moveDuration = time;
            this.moveStartTime = currentTime();
        }

        update() {
            if (!this.moveStart || !this.moveEnd) return;

            const elapsed = (currentTime() - this.moveStartTime) * 1000;
            if (elapsed >= this.moveDuration) {
                this.position = this.moveEnd.clone();
                this.moveStart = null;
                this.moveEnd = null;
            }
            else {
                const progress = elapsed / this.moveDuration;
                this.position.x = this.moveStart.x + (this.moveEnd.x - this.moveStart.x) * progress;
                this.position.y = this.moveStart.y + (this.moveEnd.y - this.moveStart.y) * progress;
            }
        }
    }

    function pos(x: number, y: number): Position {
        return new Position(x, y);
    }

    export function distanceBetween(pos1: Position | Sprite, pos2: Position | Sprite): number {
        const dx = pos2.x - pos1.x;
        const dy = pos2.y - pos1.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    function currentTime() {
        return currentTime_;
    }

    function isWall(x: number, y: number): boolean {
        return x < 0 || x >= screen.width || y < 0 || y >= screen.height;
    }
}

function fillCircle(x: number, y: number, radius: number, color: number) {
    screen.fillCircle(x | 0, y | 0, radius | 0, color | 0);
}

function drawRibbon(x: number, y: number, angle: number, size: number, color: number) {
    x |= 0;
    y |= 0;

    screen.fillRect(
        x,
        y,
        (size) | 0,
        (size) | 0,
        color
    )

    x += size / 2;
    y += size / 2;
    x |= 0;
    y |= 0;

    screen.fillTriangle(
        x,
        y,
        x + (size) * Math.cos(angle - Math.PI / 2) + size / 2 * Math.cos(angle - Math.PI / 2 + Math.PI / 3),
        y + (size) * Math.sin(angle - Math.PI / 2) + size / 2 * Math.sin(angle - Math.PI / 2 + Math.PI / 3),
        x + (size) * Math.cos(angle - Math.PI / 2) + size / 2 * Math.cos(angle - Math.PI / 2 - Math.PI / 3),
        y + (size) * Math.sin(angle - Math.PI / 2) + size / 2 * Math.sin(angle - Math.PI / 2 - Math.PI / 3),
        color
    )
    screen.fillTriangle(
        x,
        y,
        x + (size) * Math.cos(angle + Math.PI / 2) + size / 2 * Math.cos(angle + Math.PI / 2 + Math.PI / 3),
        y + (size) * Math.sin(angle + Math.PI / 2) + size / 2 * Math.sin(angle + Math.PI / 2 + Math.PI / 3),
        x + (size) * Math.cos(angle + Math.PI / 2) + size / 2 * Math.cos(angle + Math.PI / 2 - Math.PI / 3),
        y + (size) * Math.sin(angle + Math.PI / 2) + size / 2 * Math.sin(angle + Math.PI / 2 - Math.PI / 3),
        color
    )
}