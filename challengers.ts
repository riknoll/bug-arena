namespace hourOfAi {
    export class Challenger {
        font: fancyText.BaseFont;
        constructor(
            public design: BugDesign,
            public name: string,
            public dialog: string,
            public description: string,
            public winText: string,
            public loseText: string,
            public portrait: Image,
            public algorithm: (agent: Agent) => void,
            font?: fancyText.BaseFont
        ) {
            this.font = font || fancyText.bold_sans_7;
        }
    }

    export const challengers: Challenger[] = [
        new Challenger(
            {
                colorPalette: [4, 15, 2],
                legLength: 5,
                bodyRadius: 5,
                noseRadius: 2
            },
            "Stinky",
            "The only thing stronger than my odor is my code! Wanna battle?",
            "His AI specializes in randomly wandering around the arena.",
            "Bwahaha! Smell ya later!",
            "Awwwww... Fine!",
            imgs.stinky,
            hourOfAi.algorithms.randomWalk
        ),
        new Challenger(
            {
                colorPalette: [4, 15, 2],
                legLength: 5,
                bodyRadius: 5,
                noseRadius: 2
            },
            "Bugsly",
            "Watch and learn young'n! I've been doing this a long time!",
            "His AI spirals around the arena from the outside in.",
            "That's how the pros do it!",
            "What....? Well you got me fair and square.",
            imgs.bugsly,
            hourOfAi.algorithms.spiral
        ),
        new Challenger(
            {
                colorPalette: [4, 15, 2],
                legLength: 5,
                bodyRadius: 5,
                noseRadius: 2
            },
            "Bugsly Jr.",
            "You think my dad was tough? Wait till you see me!",
            "His AI tries to zigzag across the arena and paint every inch!",
            "You'll always remember the Bugsly name!",
            "*sniffle* Waaah! Daddy...!",
            imgs.bugslyJr,
            hourOfAi.algorithms.zigzag
        ),
        new Challenger(
            {
                colorPalette: [4, 15, 2],
                legLength: 5,
                bodyRadius: 5,
                noseRadius: 2
            },
            "Bumble",
            "Bzzzz.... Bzzzz.... Bzzzz...? Huh? Oh! Hello there! Did you need something? What? A battle!?",
            "Her AI bounces around the edges of the arena.",
            "Thanks for the bzzzzz-bzzzzz-battle!",
            "Awwww... Well, at least I can go back to my nap!",
            imgs.bumble,
            hourOfAi.algorithms.curveAndBounce
        ),
        new Challenger(
            {
                colorPalette: [4, 15, 2],
                legLength: 5,
                bodyRadius: 5,
                noseRadius: 2
            },
            "Legs-olas",
            "Hail and well met! I am Legs-olas, defender of the Bug Kingdom! I will best thee in honorable combat!",
            "His AI moves turns randomly and moves in diagonal lines.",
            "Well fought! You show promise, but you have much to learn!",
            "Your sword was true! I shall train harder for our next encounter!",
            imgs.legsolas,
            hourOfAi.algorithms.diagonals
        ),
        new Challenger(
            {
                colorPalette: [4, 15, 2],
                legLength: 5,
                bodyRadius: 5,
                noseRadius: 2
            },
            "Assassin",
            "A challenger? Don't make me laugh. Let's get this over with!",
            "Her AI tries to follow the opponent's bug.",
            "Ha! A waste of time!",
            "Curses! But I'll have the last laugh, I swear it!",
            imgs.shadow,
            hourOfAi.algorithms.followOpponent
        ),
        new Challenger(
            {
                colorPalette: [4, 15, 2],
                legLength: 5,
                bodyRadius: 5,
                noseRadius: 2
            },
            "Crick",
            "Oh? You've caught me just before tea! Let's have a quick battle, shall we?",
            "Their AI tries to paint over the opponent's color.",
            "Jolly good! Better luck next time, eh?",
            "Well, I say! Smashing!",
            imgs.crick,
            hourOfAi.algorithms.followOpponentColor
        ),
        new Challenger(
            {
                colorPalette: [4, 15, 2],
                legLength: 5,
                bodyRadius: 5,
                noseRadius: 2
            },
            "Hopper",
            "You beat that old fool Crick, eh? Well you won't get past me! Let's hop to it!",
            "Their AI makes squiggly lines all over the arena.",
            "Hahaha! Too easy!",
            "Now I'm hopping mad!",
            imgs.hopper,
            hourOfAi.algorithms.squiggles
        ),
        new Challenger(
            {
                colorPalette: [4, 15, 2],
                legLength: 5,
                bodyRadius: 5,
                noseRadius: 2
            },
            "Bug President",
            "You've come a long way, but I'm afraid I can't let my constituents down! Let's see what you've got!",
            "Description",
            "Better luck next time! Now I've got a nation to run!",
            "Well, you won fair and square. I hope I can still count on your vote!",
            imgs.president,
            hourOfAi.algorithms.zigzag
        ),
    ];
}