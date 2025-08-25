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
    //% block="angle"
    Angle
}
//% block="Hour of AI"
//% color="#e88b00"
namespace hourOfAi {

    //% block="bug $property"
    //% group="State"
    //% weight=90
    export function property(property: Property): number {
        init();
        return _agent.property(property);
    }

    //% block="opponent $property"
    //% group="State"
    //% weight=80
    export function opponentProperty(property: Property): number {
        init();
        return _agent.opponentProperty(property);
    }

    //% block="on start"
    //% group="Loop"
    //% weight=90
    export function onStart(handler: () => void) {
        init();
        _agent.onStart(handler);
    }

    //% block="every $millis ms"
    //% millis.shadow=timePicker
    //% group="Loop"
    //% weight=100
    export function every(millis: number, handler: () => void) {
        init();
        _agent.every(millis, handler);
    }

    //% block="turn $degrees °"
    //% degrees.shadow=protractorPicker
    //% degrees.defl=90
    //% group="Turning"
    //% weight=100
    export function turnBy(degrees: number) {
        init();
        _agent.turnBy(degrees);
    }

    //% block="face towards $degrees °"
    //% degrees.shadow=protractorPicker
    //% group="Turning"
    //% weight=90
    export function turnTowards(degrees: number) {
        init();
        _agent.turnTowards(degrees);
    }

    // //% block="turn by $degrees ° per second"
    // //% group="Turning"
    // //% degrees.shadow=protractorPicker
    // //% weight=80
    // export function setTurnSpeed(degrees: number) {
    //     init();
    //     _agent.setTurnSpeed(degrees);
    // }

    //% block="distance to wall"
    //% group="Vision"
    //% weight=100
    export function distanceToWall(): number {
        init();
        return _agent.distanceToWall();
    }

    //% block="distance to $type color"
    //% group="Vision"
    //% weight=90
    //% blockGap=8
    export function distanceToColor(type: ColorType): number {
        init();
        return _agent.distanceToColor(type);
    }

    //% block="can see $type color"
    //% group="Vision"
    //% weight=80
    export function canSeeColor(type: ColorType): boolean {
        init();
        return _agent.canSeeColor(type);
    }

    //% block="distance to opponent"
    //% group="Vision"
    //% weight=50
    //% blockGap=8
    export function distanceToOpponent(): number {
        init();
        return _agent.distanceToOpponent();
    }

    //% block="can see opponent"
    //% group="Vision"
    //% weight=40
    export function canSeeOpponent(): boolean {
        init();
        return _agent.canSeeOpponent();
    }

    // //% block="distance to bomb"
    // //% group="Vision"
    // //% weight=70
    // //% blockGap=8
    // export function distanceToBomb(): number {
    //     init();
    //     return agent.distanceToBomb();
    // }

    // //% block="can see bomb"
    // //% group="Vision"
    // //% weight=60
    // export function canSeeBomb(): boolean {
    //     init();
    //     return agent.canSeeBomb();
    // }

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