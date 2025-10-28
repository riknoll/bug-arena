namespace hourOfAi {
    export class Challenger {
        font: fancyText.BaseFont;
        constructor(
            public design: BugDesign,
            public name: string,
            public dialog: tower.DialogPart[],
            public description: string,
            public winText: tower.DialogPart[],
            public loseText: tower.DialogPart[],
            public portrait: Image,
            public algorithm: (agent: Agent) => void,
            font?: fancyText.BaseFont
        ) {
            this.font = font || fancyText.bold_sans_7;
        }
    }

    export let challengers: Challenger[];

    export function initChallengers() {
        if (challengers) return;
        challengers = [
            tower.createWaftsworth(),
            tower.createBumble(),
            tower.createLegsolas(),
            tower.createCrick(),
            tower.createHopper(),
            tower.createBuglsy(),
            tower.createBugslyJr(),
            tower.createShadow(),
            tower.createPresident(),
        ];
    }
}