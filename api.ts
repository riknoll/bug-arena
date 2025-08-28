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

//% block="Hour of AI"
//% color="#e88b00"
namespace hourOfAi {
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
    //% help=github:arcade-bug-arena/docs/property
    export function property(property: Property): number {
        init();
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
    //% help=github:arcade-bug-arena/docs/arenaProperty
    export function arenaProperty(property: ArenaProperty): number {
        init();
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
    //% help=github:arcade-bug-arena/docs/onStart
    export function onStart(handler: () => void) {
        init();
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
    //% help=github:arcade-bug-arena/docs/every
    export function every(millis: number, handler: () => void) {
        init();
        _agent.every(millis, handler);
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
    //% help=github:arcade-bug-arena/docs/onBumpWall
    export function onBumpWall(handler: () => void) {
        init();
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
    //% help=github:arcade-bug-arena/docs/turnBy
    export function turnBy(degrees: number) {
        init();
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
    //% help=github:arcade-bug-arena/docs/turnTowards
    export function turnTowards(degrees: number) {
        init();
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
    //% group="Turning"
    //% weight=80
    //% help=github:arcade-bug-arena/docs/turnTowardsPosition
    export function turnTowardsPosition(x: number, y: number) {
        init();
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
    //% help=github:arcade-bug-arena/docs/distanceToWall
    export function distanceToWall(): number {
        init();
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
    //% help=github:arcade-bug-arena/docs/distanceToColor
    export function distanceToColor(type: ColorType): number {
        init();
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
    //% help=github:arcade-bug-arena/docs/canSeeColor
    export function canSeeColor(type: ColorType): boolean {
        init();
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
    //% help=github:arcade-bug-arena/docs/distanceToOpponent
    export function distanceToOpponent(): number {
        init();
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
    //% help=github:arcade-bug-arena/docs/canSeeOpponent
    export function canSeeOpponent(): boolean {
        init();
        return _agent.canSeeOpponent();
    }

    export let bugDesign: BugDesign = {
        colorPalette: [4, 15, 2],
        legLength: 5,
        bodyRadius: 5,
        noseRadius: 2
    }

    //% block="set name to $name"
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

    export let _agent: Agent;

    function init() {
        if (_agent) return;

        initSinglePlayer();
    }
}