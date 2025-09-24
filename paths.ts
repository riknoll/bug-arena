namespace paths {
    export class PathExecutor {
        length: number;

        protected args: number[];
        protected currentCommand: string;
        protected lastControlX: number;
        protected lastControlY: number;

        protected startX: number;
        protected startY: number;

        protected lastX: number;
        protected lastY: number;

        protected strIndex: number;
        protected commandIndex: number;

        protected currentProgress: number;
        protected currentDistance: number;

        protected segmentLengths: number[];
        protected testPoint: Point;

        constructor(protected path: string) {
            this.strIndex = 0;

            this.reset();
        }

        updatedPathLength(startX: number, startY: number) {
            this.reset();
            this.segmentLengths = [];
            this.testPoint = new Point(startX, startY);
            this.startX = startX;
            this.startY = startY;
            this.lastX = startX;
            this.lastY = startY;
            this.length = 0;
            while (this.strIndex < this.path.length) {
                this.readNextCommand();
                if (this.currentCommand) {
                    this.segmentLengths.push(this.estimateCurrentCommandDistance())
                    this.runCurrentCommand(this.testPoint, 1, 1);
                    this.lastX = this.testPoint.x;
                    this.lastY = this.testPoint.y
                    this.length++;
                }
            }

            // console.log(this.segmentLengths)
        }

        protected readNextCommand() {
            if (this.strIndex >= this.path.length) {
                this.currentCommand = undefined;
                return;
            }

            this.currentCommand = this.readNextToken();

            if (!this.currentCommand) return;

            this.args = [];

            const numArgs = PathExecutor.commandToArgCount(this.currentCommand);

            if (numArgs === -1) throw "Unknown path command '" + this.currentCommand + "'";

            for (let i = 0; i < numArgs; i++) {
                this.args.push(parseFloat(this.readNextToken()))
            }

            for (const arg of this.args) {
                if (Number.isNaN(arg)) throw "Invalid argument for path command '" + this.currentCommand + "'";
            }
        }

        reset() {
            this.args = undefined;
            this.currentCommand = undefined;
            this.lastControlX = undefined;
            this.lastControlY = undefined;
            this.startX = undefined;
            this.startY = undefined;
            this.lastX = undefined;
            this.lastY = undefined;
            this.strIndex = 0;
            this.commandIndex = 0;
            this.currentDistance = 0;
            this.testPoint = new Point(this.startX, this.startY);
        }

        protected readNextToken() {
            while (this.path.charCodeAt(this.strIndex) === 32 && this.strIndex < this.path.length) {
                this.strIndex++;
            }

            if (this.strIndex >= this.path.length) return undefined;

            const tokenStart = this.strIndex;

            while (this.path.charCodeAt(this.strIndex) !== 32 && this.strIndex < this.path.length) {
                this.strIndex++;
            }

            return this.path.substr(tokenStart, this.strIndex - tokenStart);
        }

        private static commandToArgCount(command: string): number {
            switch (command) {
                case "M": // moveTo
                case "m":
                    return 2;
                case "L": // lineTo
                case "l":
                    return 2;
                case "H": // horizontalLineTo
                case "h":
                    return 1;
                case "V": // verticalLineTo
                case "v":
                    return 1;
                case "Q": // quadraticCurveTo
                case "q":
                    return 4;
                case "T": // smoothQuadraticCurveTo
                case "t":
                    return 2;
                case "C": // cubicCurveTo
                case "c":
                    return 6;
                case "S": // smoothCubicCurveTo
                case "s":
                    return 4;
                case "A": // arcTo
                case "a":
                    return 7;
                case "Z": // closePath
                case "z":
                    return 0;
                default:
                    return -1;
            }
        }

        public run(interval: number, target: Sprite | Point, runningTime: number): boolean {
            let totalDistance = 0;
            for (const seg of this.segmentLengths) {
                totalDistance += seg;
            }

            const currentDistance = (runningTime / interval) * totalDistance;
            if (this.startX === undefined) {
                this.startX = target.x;
                this.startY = target.y;
                this.lastX = target.x;
                this.lastY = target.y;
                this.commandIndex = 0;
                this.readNextCommand();
                this.currentProgress = 0;
            }

            const toTravel = currentDistance - this.currentDistance;
            this.runCurrentCommand(this.testPoint, this.currentProgress, 1);
            let travelled = 0;
            let lastX = this.testPoint.x;
            let lastY = this.testPoint.y;

            while (runningTime > interval) {
                this.runCurrentCommand(target, 1, 1)
                this.currentProgress = 0;
                this.lastX = target.x;
                this.lastY = target.y;
                this.commandIndex++;
                this.readNextCommand();
                if (!this.currentCommand) return true;
            }

            let didNextCommand = false;
            while (travelled < toTravel) {
                this.currentProgress += 0.001;
                this.runCurrentCommand(this.testPoint, Math.min(this.currentProgress, 1), 1, false);

                travelled += Math.sqrt(((this.testPoint.x - lastX) ** 2) + ((this.testPoint.y - lastY) ** 2));
                lastX = this.testPoint.x;
                lastY = this.testPoint.y;

                if (this.currentProgress >= 1) {
                    didNextCommand = true;
                    this.runCurrentCommand(target, 1, 1)
                    this.currentProgress = 0;
                    this.lastX = target.x;
                    this.lastY = target.y;
                    this.commandIndex ++;
                    this.readNextCommand();
                    if (!this.currentCommand) return true;
                }
            }
            if (didNextCommand) {
                this.currentDistance = currentDistance;
            }
            else {
                this.currentDistance += travelled
            }

            this.runCurrentCommand(target, this.currentProgress, 1);
            return false;
        }

        protected runCurrentCommand(target: Sprite | Point, nodeTime: number, intervalTime: number, update = true) {
            // console.log(`run ${this.currentCommand} ${nodeTime} ${intervalTime}`)
            switch (this.currentCommand) {
                case "M": // M x y
                    if (update) {
                        this.lastControlX = undefined;
                        this.lastControlY = undefined;
                    }
                    moveTo(
                        target,
                        nodeTime,
                        intervalTime,
                        this.args[0],
                        this.args[1]
                    );
                    break;
                case "m": // m dx dy
                    if (update) {
                        this.lastControlX = undefined;
                        this.lastControlY = undefined;
                    }
                    moveTo(
                        target,
                        nodeTime,
                        intervalTime,
                        this.args[0] + this.lastX,
                        this.args[1] + this.lastY
                    );
                    break;
                case "L": // L x y
                    if (update) {
                        this.lastControlX = undefined;
                        this.lastControlY = undefined;
                    }
                    lineTo(
                        target,
                        nodeTime,
                        intervalTime,
                        this.lastX,
                        this.lastY,
                        this.args[0],
                        this.args[1]
                    );
                    break;
                case "l": // l dx dy
                    if (update) {
                        this.lastControlX = undefined;
                        this.lastControlY = undefined;
                    }
                    lineTo(
                        target,
                        nodeTime,
                        intervalTime,
                        this.lastX,
                        this.lastY,
                        this.args[0] + this.lastX,
                        this.args[1] + this.lastY
                    );
                    break;
                case "H": // H x
                    if (update) {
                        this.lastControlX = undefined;
                        this.lastControlY = undefined;
                    }
                    lineTo(
                        target,
                        nodeTime,
                        intervalTime,
                        this.lastX,
                        this.lastY,
                        this.args[0],
                        this.lastY
                    );
                    break;
                case "h": // h dx
                    if (update) {
                        this.lastControlX = undefined;
                        this.lastControlY = undefined;
                    }
                    lineTo(
                        target,
                        nodeTime,
                        intervalTime,
                        this.lastX,
                        this.lastY,
                        this.args[0] + this.lastX,
                        this.lastY
                    );
                    break;
                case "V": // V y
                    if (update) {
                        this.lastControlX = undefined;
                        this.lastControlY = undefined;
                    }
                    lineTo(
                        target,
                        nodeTime,
                        intervalTime,
                        this.lastX,
                        this.lastY,
                        this.lastX,
                        this.args[0]
                    );
                    break;
                case "v": // v dy
                    if (update) {
                        this.lastControlX = undefined;
                        this.lastControlY = undefined;
                    }
                    lineTo(
                        target,
                        nodeTime,
                        intervalTime,
                        this.lastX,
                        this.lastY,
                        this.lastX,
                        this.args[0] + this.lastY
                    );
                    break;
                case "Q": // Q x1 y1 x2 y2
                    if (update) {
                        this.lastControlX = this.args[0];
                        this.lastControlY = this.args[1];
                    }
                    quadraticCurveTo(
                        target,
                        nodeTime,
                        intervalTime,
                        this.lastX,
                        this.lastY,
                        this.args[0],
                        this.args[1],
                        this.args[2],
                        this.args[3]
                    )
                    break;
                case "q": // q dx1 dy1 dx2 dy2
                    if (update) {
                        this.lastControlX = this.args[0] + this.lastX;
                        this.lastControlY = this.args[1] + this.lastY;
                    }
                    quadraticCurveTo(
                        target,
                        nodeTime,
                        intervalTime,
                        this.lastX,
                        this.lastY,
                        this.args[0] + this.lastX,
                        this.args[1] + this.lastY,
                        this.args[2] + this.lastX,
                        this.args[3] + this.lastY
                    );
                    break;
                case "T": // T x2 y2
                    this.ensureControlPoint();
                    quadraticCurveTo(
                        target,
                        nodeTime,
                        intervalTime,
                        this.lastX,
                        this.lastY,
                        this.lastX + this.lastX - this.lastControlX,
                        this.lastY + this.lastY - this.lastControlY,
                        this.args[0],
                        this.args[1],
                    );
                    if (nodeTime === intervalTime && update) {
                        this.lastControlX = this.lastX + this.lastX - this.lastControlX;
                        this.lastControlY = this.lastY + this.lastY - this.lastControlY;
                    }
                    break;
                case "t": // t dx2 dy2
                    this.ensureControlPoint();
                    quadraticCurveTo(
                        target,
                        nodeTime,
                        intervalTime,
                        this.lastX,
                        this.lastY,
                        this.lastX + this.lastX - this.lastControlX,
                        this.lastY + this.lastY - this.lastControlY,
                        this.args[0] + this.lastX,
                        this.args[1] + this.lastY,
                    );
                    if (nodeTime === intervalTime && update) {
                        this.lastControlX = this.lastX + this.lastX - this.lastControlX;
                        this.lastControlY = this.lastY + this.lastY - this.lastControlY;
                    }
                    break;
                case "C": // C x1 y1 x2 y2 x3 y3
                    if (update) {
                        this.lastControlX = this.args[2];
                        this.lastControlY = this.args[3];
                    }
                    cubicCurveTo(
                        target,
                        nodeTime,
                        intervalTime,
                        this.lastX,
                        this.lastY,
                        this.args[0],
                        this.args[1],
                        this.args[2],
                        this.args[3],
                        this.args[4],
                        this.args[5],
                    );
                    break;
                case "c": // c dx1 dy1 dx2 dy2 dx3 dy3
                    if (update) {
                        this.lastControlX = this.args[2];
                        this.lastControlY = this.args[3];
                    }
                    cubicCurveTo(
                        target,
                        nodeTime,
                        intervalTime,
                        this.lastX,
                        this.lastY,
                        this.args[0] + this.lastX,
                        this.args[1] + this.lastY,
                        this.args[2] + this.lastX,
                        this.args[3] + this.lastY,
                        this.args[4] + this.lastX,
                        this.args[5] + this.lastY,
                    );
                    break;
                case "S": // S x2 y2 x3 y3
                    this.ensureControlPoint();
                    cubicCurveTo(
                        target,
                        nodeTime,
                        intervalTime,
                        this.lastX,
                        this.lastY,
                        this.lastX + this.lastX - this.lastControlX,
                        this.lastY + this.lastY - this.lastControlY,
                        this.args[0],
                        this.args[1],
                        this.args[2],
                        this.args[3]
                    );
                    if (nodeTime === intervalTime && update) {
                        this.lastControlX = this.args[0];
                        this.lastControlY = this.args[1];
                    }
                    break;
                case "s": // s dx2 dy2 dx3 dy3
                    this.ensureControlPoint();
                    cubicCurveTo(
                        target,
                        nodeTime,
                        intervalTime,
                        this.lastX,
                        this.lastY,
                        this.lastX + this.lastX - this.lastControlX,
                        this.lastY + this.lastY - this.lastControlY,
                        this.args[0] + this.lastX,
                        this.args[1] + this.lastY,
                        this.args[2] + this.lastX,
                        this.args[3] + this.lastY,
                    );
                    if (nodeTime === intervalTime && update) {
                        this.lastControlX = this.args[0] + this.lastX;
                        this.lastControlY = this.args[1] + this.lastY;
                    }
                    break;
                case "Z": // Z
                case "z": // z
                    if (update) {
                        this.lastControlX = undefined;
                        this.lastControlY = undefined;
                    }
                    lineTo(
                        target,
                        nodeTime,
                        intervalTime,
                        this.lastX,
                        this.lastY,
                        this.startX,
                        this.startY
                    );
                    break;
            }
        }

        protected ensureControlPoint() {
            if (this.lastControlX === undefined) throw "Invalid path command. S/s and T/t must follow either Q/q or C/c"
        }

        protected estimateCurrentCommandDistance() {
            switch (this.currentCommand) {
                case "M":
                case "m":
                    return 0;
            }

            let lastX = this.testPoint.x;
            let lastY = this.testPoint.y;
            let distance = 0;

            const segments = 1000;

            for (let i = 0; i < segments; i++) {
                this.runCurrentCommand(this.testPoint, i, segments);

                distance += Math.sqrt(((this.testPoint.x - lastX) ** 2) + ((this.testPoint.y - lastY) ** 2))
                lastX = this.testPoint.x;
                lastY = this.testPoint.y;
            }

            return distance
        }
    }

    function moveTo(target: Sprite | Point, nodeTime: number, interval: number, x: number, y: number) {
        if (nodeTime >= interval) target.setPosition(x, y);
    }

    function lineTo(target: Sprite | Point, nodeTime: number, interval: number, x0: number, y0: number, x1: number, y1: number) {
        target.setPosition(
            Math.round(((x1 - x0) / interval) * nodeTime) + x0,
            Math.round(((y1 - y0) / interval) * nodeTime) + y0
        );
    }

    function quadraticCurveTo(target: Sprite | Point, nodeTime: number, interval: number, x0: number, y0: number, x1: number, y1: number, x2: number, y2: number) {
        const progress = nodeTime / interval;
        const diff = 1 - progress;
        const a = diff * diff;
        const b = 2 * diff * progress;
        const c = progress * progress;

        target.setPosition(
            Math.round(a * x0 + b * x1 + c * x2),
            Math.round(a * y0 + b * y1 + c * y2)
        );
    }

    function cubicCurveTo(target: Sprite | Point, nodeTime: number, interval: number, x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, x3: number, y3: number) {
        const progress = nodeTime / interval;
        const diff = 1 - progress;
        const a = diff * diff * diff;
        const b = 3 * diff * diff * progress;
        const c = 3 * diff * progress * progress;
        const d = progress * progress * progress;

        target.setPosition(
            Math.round(a * x0 + b * x1 + c * x2 + d * x3),
            Math.round(a * y0 + b * y1 + c * y2 + d * y3)
        );
    }

    export class MovementAnimation extends animation.SpriteAnimation {
        protected startX: number;
        protected startY: number;

        constructor(sprite: Sprite, private path: PathExecutor, private nodeInterval: number, loop?: boolean) {
            super(sprite, loop);
            this.startX = sprite.x;
            this.startY = sprite.y;
            this.elapsedTime = 0;
            this.path.updatedPathLength(this.startX, this.startY)
            this.path.reset();
        }

        public update(): boolean {
            this.elapsedTime += game.eventContext().deltaTimeMillis;

            let result = this.path.run(this.nodeInterval, this.sprite, this.elapsedTime);
            if (result) {
                if (!this.loop) return true;
                this.elapsedTime = 0;
                this.sprite.x = this.startX;
                this.sprite.y = this.startY;
                // console.log(`START (${this.startX} ${this.startY})`)
                this.path.updatedPathLength(this.startX, this.startY)
                this.path.reset();
            }
            return false;
        }
    }

    export function runMovementAnimation(sprite: Sprite, pathString: string, duration?: number, loop?: boolean) {
        const path = new PathExecutor(pathString);
        const anim = new MovementAnimation(sprite, path, duration, !!loop);
        anim.init();
    }
}

/**
 * Custom blocks
 */
//% weight=100 color=#0fbc11 icon=""
namespace paths {
    class PathStep {
        constructor(public op: string, public args: number[]) {}
    }

    export class Point {
        constructor(public x: number, public y: number) {}

        setPosition(x: number, y: number) {
            this.x = x;
            this.y = y;
        }
    }

    export class Path {
        steps: PathStep[];

        constructor() {
            this.steps = [];
        }

        //% blockId=paths_addStep
        //% block="$this add step $step relative $relative"
        //% this.defl=myPath
        //% step.shadow=paths_lineTo
        //% weight=99
        //% inlineInputMode=inline
        addStep(step: PathStep, relative: boolean) {
            this.steps.push(new PathStep(relative ? step.op.toLowerCase() : step.op, step.args.slice()));
        }

        //% blockId=paths_toString
        //% block="$this to string"
        //% this.defl=myPath
        //% weight=90
        //% inlineInputMode=inline
        toString() {
            let result = "";

            for (const step of this.steps) {
                result = result + step.op + " ";
                for (const arg of step.args) {
                    result += arg + " "
                }
            }

            return result.trim();
        }
    }

    //% blockId=paths_createPath
    //% block="create path"
    //% blockSetVariable="myPath"
    //% weight=100
    export function createPath(): Path {
        return new Path();
    }

    //% blockId=paths_point
    //% block="x $x y $y"
    //% weight=4
    export function point(x: number, y: number): Point {
        return new Point(x, y);
    }

    //% blockId=paths_xPoint
    //% block="x $x"
    //% blockHidden
    export function xPoint(x: number): Point {
        return new Point(x, 0);
    }

    //% blockId=paths_yPoint
    //% block="y $y"
    //% blockHidden
    export function yPoint(y: number): Point {
        return new Point(0, y);
    }

    //% blockId=paths_moveTo
    //% block="move to $location"
    //% location.shadow=paths_point
    //% weight=85
    //% inlineInputMode=inline
    //% blockGap=8
    export function moveTo(location: Sprite | tiles.Location | Point) {
        return new PathStep("M", [location.x, location.y]);
    }

    //% blockId=paths_lineTo
    //% block="line to $location"
    //% location.shadow=paths_point
    //% weight=80
    //% inlineInputMode=inline
    export function lineTo(location: Sprite | tiles.Location | Point) {
        return new PathStep("L", [location.x, location.y]);
    }

    //% blockId=paths_horizontalLineTo
    //% block="horizontal line to $x"
    //% x.shadow=paths_xPoint
    //% weight=70
    //% inlineInputMode=inline
    //% blockGap=8
    export function horizontalLineTo(x: Sprite | tiles.Location | Point) {
        return new PathStep("H", [x.x]);
    }

    //% blockId=paths_verticalLineTo
    //% block="vertical line to $y"
    //% y.shadow=paths_yPoint
    //% weight=60
    //% inlineInputMode=inline
    export function verticalLineTo(y: Sprite | tiles.Location | Point) {
        return new PathStep("V", [y.y]);
    }

    //% blockId=paths_quadraticCurveTo
    //% block="quad curve with control $controlPoint to $location"
    //% location.shadow=paths_point
    //% controlPoint.shadow=paths_point
    //% weight=50
    //% inlineInputMode=inline
    //% blockGap=8
    export function quadraticCurveTo(controlPoint: Sprite | tiles.Location | Point, location: Sprite | tiles.Location | Point) {
        return new PathStep("Q", [controlPoint.x, controlPoint.y, location.x, location.y]);
    }

    //% blockId=paths_smoothQuadraticCurveTo
    //% block="smooth quad curve to $location"
    //% location.shadow=paths_point
    //% weight=40
    //% inlineInputMode=inline
    export function smoothQuadraticCurveTo(location: Sprite | tiles.Location | Point) {
        return new PathStep("T", [location.x, location.y]);
    }

    //% blockId=paths_cubicCurveTo
    //% block="cubic curve with control $controlPoint1 and $controlPoint2 to $location"
    //% location.shadow=paths_point
    //% controlPoint1.shadow=paths_point
    //% controlPoint2.shadow=paths_point
    //% weight=30
    //% inlineInputMode=inline
    //% blockGap=8
    export function cubicCurveTo(controlPoint1: Sprite | tiles.Location | Point, controlPoint2: Sprite | tiles.Location | Point, location: Sprite | tiles.Location | Point) {
        return new PathStep("C", [controlPoint1.x, controlPoint1.y, controlPoint2.x, controlPoint2.y, location.x, location.y]);
    }

    //% blockId=paths_smoothCubicCurveTo
    //% block="smooth cubic curve with control $controlPoint to $location"
    //% location.shadow=paths_point
    //% controlPoint.shadow=paths_point
    //% weight=20
    //% inlineInputMode=inline
    export function smoothCubicCurveTo(controlPoint: Sprite | tiles.Location | Point, location: Sprite | tiles.Location | Point) {
        return new PathStep("S", [controlPoint.x, controlPoint.y, location.x, location.y]);
    }

    //% blockId=paths_arcTo
    //% block="arc with rx $rx ry $ry rotation $xRotation large arc $largeArc clockwise $clockwise to $location"
    //% location.shadow=paths_point
    //% weight=5
    //% inlineInputMode=inline
    export function arcTo(rx: number, ry: number, xRotation: number, largeArc: boolean, clockwise: boolean, location: Sprite | tiles.Location | Point) {
        return new PathStep("A", [rx, ry, xRotation, largeArc ? 1 : 0, clockwise ? 1 : 0, location.x, location.y]);
    }

    //% blockId=paths_closePath
    //% block="close path"
    //% weight=10
    //% inlineInputMode=inline
    export function closePath() {
        return new PathStep("Z", []);
    }
}
