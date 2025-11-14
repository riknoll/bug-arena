enum ColorType {
    //% block="my"
    MyColor,
    //% block="opponent"
    OpponentColor,
    //% block="empty"
    NoColor
}

enum Property {
    //% block="x"
    X,
    //% block="y"
    Y,
    //% block="angle (degrees)"
    Angle,
    //% block="angle (radians)"
    AngleRadians
}

enum ArenaProperty {
    //% block="width"
    Width,
    //% block="height"
    Height
}

enum FillColor {
    //% jres=icons.Red
    Red = 1,
    //% jres=icons.Orange
    Orange,
    //% jres=icons.Yellow
    Yellow,
    //% jres=icons.Green
    Green,
    //% jres=icons.Blue
    Blue,
    //% jres=icons.Purple
    Purple,
    //% jres=icons.Rainbow
    Rainbow,
    //% jres=icons.Wavy
    Wavy,
    //% jres=icons.Tatami
    Tatami,
    //% jres=icons.Sparkles
    Sparkles,
    //% jres=icons.Herringbone
    Herringbone,
    //% jres=icons.Checkerboard
    Checkerboard,
}

enum Color {
    //% jres=colors.Red
    Red = 2,
    //% jres=colors.Orange
    Orange = 3,
    //% jres=colors.LightOrange
    LightOrange = 4,
    //% jres=colors.Yellow
    Yellow = 5,
    //% jres=colors.Green
    Green = 7,
    //% jres=colors.Blue
    Blue = 8,
    //% jres=colors.LightBlue
    LightBlue = 9,
    //% jres=colors.Purple
    Purple = 10,
    //% jres=colors.White
    White = 11,
    //% jres=colors.LightGrey
    LightGrey = 12,
    //% jres=colors.Grey
    Grey = 13,
    //% jres=colors.DarkGrey
    DarkGrey = 14,
    //% jres=colors.Black
    Black = 15
}

enum ColorTarget {
    //% block="body"
    Body = 0,
    //% block="legs"
    Legs = 1,
    //% block="nose"
    Nose = 2,
    //% block="eyes"
    Eyes = 3
}

//% block="Bug AI"
//% color="#e88b00"
//% weight=9999999
//% icon="\uf188"
namespace hourOfAi {
    class AsyncAgent {
        agent: Agent;

        onStartHandlers: (() => void)[] = [];
        everyHandlers: { millis: number, handler: () => void }[] = []
        onBumpWallHandlers: (() => void)[] = [];
        fillColor: FillColor;

        bodyColor: number;
        noseColor: number;
        eyeColor: number;
        legColor: number;

        constructor() {

        }

        property(property: Property): number {
            if (this.agent) {
                return this.agent.property(property);
            }
            return 0;
        }

        arenaProperty(property: ArenaProperty): number {
            if (this.agent) {
                return this.agent.arenaProperty(property);
            }

            return 0;
        }

        onStart(handler: () => void) {
            if (this.agent) {
                this.agent.onStart(handler);
            }
            else {
                this.onStartHandlers.push(handler);
            }
        }

        every(millis: number, handler: () => void) {
            if (this.agent) {
                this.agent.every(millis, handler);
            }
            else {
                this.everyHandlers.push({ millis, handler });
            }
        }

        onBumpWall(handler: () => void) {
            if (this.agent) {
                this.agent.onBumpWall(handler);
            }
            else {
                this.onBumpWallHandlers.push(handler);
            }
        }

        doAfter(millis: number, handler: () => void) {
            if (this.agent) {
                this.agent.doAfter(millis, handler);
            }
        }

        turnBy(degrees: number) {
            if (this.agent) {
                this.agent.turnBy(degrees);
            }
        }

        turnTowards(degrees: number) {
            if (this.agent) {
                this.agent.turnTowards(degrees);
            }
        }

        turnTowardsPosition(x: number, y: number) {
            if (this.agent) {
                this.agent.turnTowardsPosition(x, y);
            }
        }

        distanceToWall(): number {
            if (this.agent) {
                return this.agent.distanceToWall();
            }
            return -1;
        }

        distanceToColor(type: ColorType): number {
            if (this.agent) {
                return this.agent.distanceToColor(type);
            }
            return -1;
        }

        canSeeColor(type: ColorType): boolean {
            if (this.agent) {
                return this.agent.canSeeColor(type);
            }
            return false;
        }

        distanceToOpponent(): number {
            if (this.agent) {
                return this.agent.distanceToOpponent();
            }
            return -1;
        }

        canSeeOpponent(): boolean {
            if (this.agent) {
                return this.agent.canSeeOpponent();
            }
            return false;
        }

        setFillColor(color: FillColor) {
            if (this.agent) {
                this.agent.setFillColor(color);
            }
            else {
                this.fillColor = color;
            }
        }

        setBugColor(target: ColorTarget, color: number) {
            if (this.agent) {
                this.agent.setBugColor(target, color);
            }
            else {
                if (target === ColorTarget.Body) {
                    this.bodyColor = color;
                }
                else if (target === ColorTarget.Eyes) {
                    this.eyeColor = color;
                }
                else if (target === ColorTarget.Legs) {
                    this.legColor = color;
                }
                else {
                    this.noseColor = color;
                }
            }
        }
    }

    /**
     * Returns the value of a property for your bug.
     *
     * @param property The property to get the value of.
     * @returns The value of the specified property.
     */
    //% blockId=hourofai_property
    //% block="bug $property"
    //% group="State"
    //% weight=90
    //% help=github:bug-arena/docs/property
    export function property(property: Property): number {
        initAPI();
        return _agent.property(property);
    }

    /**
     * Returns a value of a property of the arena your bug is in.
     *
     * @param property The property to get the value of.
     * @returns The value of the specified property.
     */
    //% blockId=hourofai_areanProperty
    //% block="arena $property"
    //% group="State"
    //% weight=80
    //% help=github:bug-arena/docs/arenaProperty
    export function arenaProperty(property: ArenaProperty): number {
        initAPI();
        return _agent.arenaProperty(property);
    }

    /**
     * Runs code at the start of the match.
     *
     * @param handler The code to run at the start of the match.
     */
    //% blockId=hourofai_onStart
    //% block="on start"
    //% group="Events"
    //% weight=100
    //% help=github:bug-arena/docs/onStart
    export function onStart(handler: () => void) {
        initAPI();
        _agent.onStart(handler);
    }

    /**
     * Runs code on a regular interval of time in milliseconds.
     *
     * @param millis The number of milliseconds between each time the code runs.
     * @param handler The code to run every interval.
     */
    //% blockId=hourofai_every
    //% block="every $millis ms"
    //% millis.shadow=timePicker
    //% group="Events"
    //% weight=90
    //% help=github:bug-arena/docs/every
    export function every(millis: number, handler: () => void) {
        initAPI();
        _agent.every(millis, handler);
    }

    /**
     * Runs code after a certain number of milliseconds has passed
     *
     * @param millis The number of milliseconds to wait before running the code.
     * @param handler The code to run.
     */
    //% blockId=hourofai_doAfter
    //% block="run after $millis ms"
    //% millis.shadow=timePicker
    //% group="Events"
    //% weight=70
    //% handlerStatement=1
    //% help=github:bug-arena/docs/every
    export function doAfter(millis: number, handler: () => void) {
        initAPI();
        _agent.doAfter(millis, handler);
    }

    /**
     * Runs code when your bug bumps into a wall.
     *
     * @param handler The code to run when your bug bumps into a wall.
     */
    //% blockId=hourofai_onBumpWall
    //% block="on bump wall"
    //% group="Events"
    //% weight=80
    //% help=github:bug-arena/docs/onBumpWall
    export function onBumpWall(handler: () => void) {
        initAPI();
        _agent.onBumpWall(handler);
    }

    /**
     * Turns your bug by a certain number of degrees.
     *
     * @param degrees The number of degrees to turn, positive is clockwise and negative is counter-clockwise.
     */
    //% blockId=hourofai_turnBy
    //% block="turn $degrees °"
    //% degrees.shadow=protractorPicker
    //% degrees.defl=90
    //% group="Turning"
    //% weight=100
    //% help=github:bug-arena/docs/turnBy
    export function turnBy(degrees: number) {
        initAPI();
        _agent.turnBy(degrees);
    }

    /**
     * Turns your bug to face a specific angle in degrees.
     *
     * @param degrees The angle in degrees to face, where 0 is to the right, 90 is down, 180 is left, and 270 is up.
     */
    //% blockId=hourofai_turnTowards
    //% block="face towards $degrees °"
    //% degrees.shadow=protractorPicker
    //% group="Turning"
    //% weight=90
    //% help=github:bug-arena/docs/turnTowards
    export function turnTowards(degrees: number) {
        initAPI();
        _agent.turnTowards(degrees);
    }

    /**
     * Turns your bug to face a specific position in the arena.
     *
     * @param x The x coordinate of the position to face.
     * @param y The y coordinate of the position to face.
     */
    //% blockId=hourofai_turnTowardsPosition
    //% block="face x $x y $y"
    //% x.shadow="positionPicker"
    //% y.shadow="positionPicker"
    //% group="Turning"
    //% weight=80
    //% help=github:bug-arena/docs/turnTowardsPosition
    export function turnTowardsPosition(x: number, y: number) {
        initAPI();
        _agent.turnTowardsPosition(x, y);
    }

    /**
     * Returns the distance in pixels from your bug to the nearest wall in the direction it is currently facing.
     *
     * @returns The distance in pixels from your bug to the nearest wall.
     */
    //% blockId=hourofai_distanceToWall
    //% block="distance to wall"
    //% group="Vision"
    //% weight=100
    //% help=github:bug-arena/docs/distanceToWall
    export function distanceToWall(): number {
        initAPI();
        return _agent.distanceToWall();
    }

    /**
     * Returns the distance in pixels from your bug to the nearest pixel of a certain color in the direction it is currently facing. Returns -1 if no pixel of that color is seen.
     *
     * @param type The type of color to look for.
     * @returns The distance in pixels from your bug to the nearest pixel of the specified color, or -1 if no pixel of that color is seen.
     */
    //% blockId=hourofai_distanceToColor
    //% block="distance to $type color"
    //% group="Vision"
    //% weight=90
    //% blockGap=8
    //% help=github:bug-arena/docs/distanceToColor
    export function distanceToColor(type: ColorType): number {
        initAPI();
        return _agent.distanceToColor(type);
    }

    /**
     * Returns whether your bug can see a certain color in the direction it is currently facing.
     *
     * @param type The type of color to look for.
     * @returns Whether your bug can see the specified color.
     */
    //% blockId=hourofai_canSeeColor
    //% block="can see $type color"
    //% group="Vision"
    //% weight=80
    //% help=github:bug-arena/docs/canSeeColor
    export function canSeeColor(type: ColorType): boolean {
        initAPI();
        return _agent.canSeeColor(type);
    }

    /**
     * Returns the distance in pixels from your bug to the opponent bug, or -1 if the opponent cannot be seen.
     *
     * @returns The distance in pixels from your bug to the opponent bug, or -1 if the opponent cannot be seen.
     */
    //% blockId=hourofai_distanceToOpponent
    //% block="distance to opponent"
    //% group="Vision"
    //% weight=50
    //% blockGap=8
    //% help=github:bug-arena/docs/distanceToOpponent
    export function distanceToOpponent(): number {
        initAPI();
        return _agent.distanceToOpponent();
    }

    /**
     * Returns whether your bug can see the opponent bug.
     *
     * @returns Whether your bug can see the opponent bug.
     */
    //% blockId=hourofai_canSeeOpponent
    //% block="can see opponent"
    //% group="Vision"
    //% weight=40
    //% help=github:bug-arena/docs/canSeeOpponent
    export function canSeeOpponent(): boolean {
        initAPI();
        return _agent.canSeeOpponent();
    }

    //% blockId=hourofai_setFillColor
    //% block="set fill color to $color"
    //% color.fieldEditor="imagedropdown"
    //% color.fieldOptions.columns="5"
    //% color.fieldOptions.width="380"
    //% color.fieldOptions.maxRows=4
    //% group="Customize"
    //% weight=100
    export function setFillColor(color: FillColor) {
        initAPI();
        _agent.setFillColor(color);
    }

    //% blockId=hourofai_setBugColor
    //% block="set bug $target color to $color"
    //% color.fieldEditor="imagedropdown"
    //% color.fieldOptions.columns="5"
    //% color.fieldOptions.width="380"
    //% color.fieldOptions.maxRows=4
    //% group="Customize"
    //% weight=90
    export function setBugColor(target: ColorTarget, color: Color) {
        initAPI();
        _agent.setBugColor(target, color);
    }

    export let bugDesign: BugDesign = {
        colorPalette: [4, 15, 2],
        legLength: 5,
        bodyRadius: 5,
        noseRadius: 2
    }

    export function _setName(name: string) {
    }

    export function _setPalette(palette: number[]) {
        bugDesign.colorPalette = palette;
    }

    export function _setLegLength(length: number) {
        bugDesign.legLength = length;
    }

    export function _setBodyRadius(radius: number) {
        bugDesign.bodyRadius = radius;
    }

    export function _setNoseRadius(radius: number) {
        bugDesign.noseRadius = radius;
    }

    export let _agent: AsyncAgent;

    export function initAPI() {
        if (!_agent) {
            _agent = new AsyncAgent();
        }
    }
}