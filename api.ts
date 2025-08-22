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
        return agent.property(property);
    }

    //% block="every $millis ms"
    //% millis.shadow=timePicker
    //% group="Loop"
    //% weight=100
    export function every(millis: number, handler: () => void) {
        init();
        agent.every(millis, handler);
    }

    //% block="turn $degrees °"
    //% degrees.shadow=protractorPicker
    //% degrees.defl=90
    //% group="Turning"
    //% weight=100
    export function turnBy(degrees: number) {
        init();
        agent.turnBy(degrees);
    }

    //% block="face towards $degrees °"
    //% degrees.shadow=protractorPicker
    //% group="Turning"
    //% weight=90
    export function turnTowards(degrees: number) {
        init();
        agent.turnTowards(degrees);
    }

    //% block="turn by $degrees ° per second"
    //% group="Turning"
    //% degrees.shadow=protractorPicker
    //% weight=80
    export function setTurnSpeed(degrees: number) {
        init();
        agent.setTurnSpeed(degrees);
    }

    //% block="distance to wall"
    //% group="Vision"
    //% weight=100
    export function distanceToWall(): number {
        init();
        return agent.distanceToWall();
    }

    //% block="distance to $type color"
    //% group="Vision"
    //% weight=90
    //% blockGap=8
    export function distanceToColor(type: ColorType): number {
        init();
        return agent.distanceToColor(type);
    }

    //% block="can see $type color"
    //% group="Vision"
    //% weight=80
    export function canSeeColor(type: ColorType): boolean {
        init();
        return agent.canSeeColor(type);
    }

    //% block="distance to opponent"
    //% group="Vision"
    //% weight=50
    //% blockGap=8
    export function distanceToOpponent(): number {
        init();
        return agent.distanceToOpponent();
    }

    //% block="can see opponent"
    //% group="Vision"
    //% weight=40
    export function canSeeOpponent(): boolean {
        init();
        return agent.canSeeOpponent();
    }

    //% block="distance to bomb"
    //% group="Vision"
    //% weight=70
    //% blockGap=8
    export function distanceToBomb(): number {
        init();
        return agent.distanceToBomb();
    }

    //% block="can see bomb"
    //% group="Vision"
    //% weight=60
    export function canSeeBomb(): boolean {
        init();
        return agent.canSeeBomb();
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

    let agent: Agent;

    function init() {
        if (agent) return;

        const arena = new Arena();
        agent = new Agent(arena, bugDesign);

        const opponent = new Agent(arena, {
            colorPalette: [15, 1, 2],
            legLength: 5,
            bodyRadius: 5,
            noseRadius: 2
        });

        // opponent.every(100, () => {
        //     if (Math.percentChance(50)) {
        //         opponent.turnBy(10)
        //     }
        //     else {
        //         opponent.turnBy(-10);
        //     }
        // })

        let flip = true;
        let turning = false;
        opponent.every(1000, () => {
            // console.log(hourOfAi.distanceToWall())
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
            // hourOfAi.turnBy(Math.percentChance(50) ? 90 : -90);
        })

        opponent.bug.fillColor = 2

        arena.placeCombatants();

        game.onUpdate(() => {
            for (let i = 0; i < 2; i++) {
                arena.update(1 / 30);
            }
        })
    }
}