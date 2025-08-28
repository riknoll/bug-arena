// const player1 = mrPresident.create();
// const player2 = mrPresident.create();

// player2.bodyColor = 6;
// player2.legColor = 12;
// player2.noseColor = 8;
// player2.fillColor = 9;
// player1.legLength--;

// player1.position.x = 10;
// player1.position.y = 10;
// player1.heading = 0;
// player1.resetLegs();


// player2.position.x = screen.width - 10;
// player2.position.y = screen.height - 10;
// player2.heading = Math.PI;
// player2.resetLegs();


// mrPresident.timeMult = 1
// let flip = true;
// forever(() => {
//     if (player1.distanceToWall() < 10) {
//         if (flip) {
//             player1.turnTowards(player1.heading + Math.PI / 2);
//             pause(200)
//             player1.turnTowards(player1.heading + Math.PI / 2);
//         }
//         else {
//             player1.turnTowards(player1.heading - Math.PI / 2);
//             pause(200)
//             player1.turnTowards(player1.heading - Math.PI / 2);
//         }

//         flip = !flip;
//     }
//     player1.pause(100)
// })


// forever(() => {
//     if (player2.distanceToWall() < 10) {
//         if (Math.percentChance(50)) {
//             player2.turnTowards(player2.heading + Math.PI / 2);
//         }
//         else {
//             player2.turnTowards(player2.heading - Math.PI / 2);
//         }
//     }
//     else if (Math.percentChance(10)) {
//         if (Math.percentChance(50)) {
//             player2.turnTowards(player2.heading + Math.PI / 8);
//         }
//         else {
//             player2.turnTowards(player2.heading - Math.PI / 8);
//         }
//     }
//     player2.pause(10)
// })

// controller.up.onEvent(ControllerButtonEvent.Pressed, () => {
//     mrPresident.timeMult ++;
// })
// controller.down.onEvent(ControllerButtonEvent.Pressed, () => {
//     if (mrPresident.timeMult > 1) {
//         mrPresident.timeMult --;
//     }
// })

// const agents = [player1, player2];

// scene.createRenderable(10, () => {
//     for (const agent of agents) {
//         agent.score = 0;
//     }
//     for (let x = 0; x < screen.width; x += 2) {
//         for (let y = 0; y < screen.height; y += 2) {
//             let current = scene.backgroundImage().getPixel(x, y);
//             for (const agent of agents) {
//                 if (current === agent.fillColor) {
//                     agent.score++;
//                 }
//             }
//         }
//     }
//     const BAR_WIDTH = screen.width - 10;
//     screen.fillRect(
//         4,
//         screen.height - 10,
//         BAR_WIDTH + 2,
//         5,
//         12
//     )
//     const ratio = (agents[0].score / (agents[0].score + agents[1].score)) * BAR_WIDTH | 0;

//     screen.fillRect(
//         5,
//         screen.height - 9,
//         ratio,
//         3,
//         agents[0].fillColor
//     )
//     screen.fillRect(
//         5 + ratio,
//         screen.height - 9,
//         BAR_WIDTH - ratio,
//         3,
//         agents[1].fillColor
//     )
// })

// showDesigner();

// hourOfAi.every(1000, () => {
//     hourOfAi.turnBy(Math.percentChance(50) ? 90 : -90);
// })

// Project: Richard
// URL: https://makecode.com/_UoRFhdDcq94K

//     hourOfAi.registerProject(
//         "Richard",
//         {"legLength":5,"bodyRadius":5,"noseRadius":2,"colorPalette":[4,15,2]},
//         (agent => {
//             agent.every(1000, function () {

//     if (Math.percentChance(50)) {
//         agent.turnBy(45)
//     } else {
//         agent.turnBy(-45)
//     }
// })

//         })
//     );


// // Project: Hassan
// // URL: https://makecode.com/_22XaK8RTfY01

//     hourOfAi.registerProject(
//         "Hassan",
//         {"legLength":5,"bodyRadius":5,"noseRadius":2,"colorPalette":[4,15,2]},
//         (agent => {
//             agent.every(1000, function () {

// })
// agent.every(2000, function () {
//     agent.turnBy(randint(0, 60))
// })

//         })
//     );


// // Project: Your name
// // URL: https://makecode.com/_LVX4WWacUAVK

//     hourOfAi.registerProject(
//         "Your name",
//         {"legLength":5,"bodyRadius":5,"noseRadius":2,"colorPalette":[4,15,2]},
//         (agent => {
//             agent.every(1000, function () {

// })

//         })
//     );


// // Project: joey
// // URL: https://makecode.com/_53DKcmCxFg0s

//     hourOfAi.registerProject(
//         "joey",
//         {"legLength":5,"bodyRadius":5,"noseRadius":2,"colorPalette":[4,15,2]},
//         (agent => {
//             agent.every(1000, function () {

//     if (agent.canSeeColor(hourOfAi.ColorType.OpponentColor)) {
//         agent.turnTowards(0)
//     }
// })

//         })
//     );


// // Project: Eric
// // URL: https://makecode.com/_ajDfzXWYR7kV

//     hourOfAi.registerProject(
//         "Eric",
//         {"legLength":5,"bodyRadius":5,"noseRadius":2,"colorPalette":[4,15,2]},
//         (agent => {
//             agent.every(600, function () {
//     agent.turnBy(15)
// })
// agent.every(1000, function () {

// })
// agent.every(500, function () {
//     agent.turnBy(-10)
// })

//         })
//     );


// hourOfAi.initRunner();

// hourOfAi.every(1000, function () {
//     hourOfAi._setName("Richard")
//     if (Math.percentChance(50)) {
//         hourOfAi.turnBy(45)
//     } else {
//         hourOfAi.turnBy(-45)
//     }
// })

// Project: Susie
// URL: https://makecode.com/_4j5JUpPA6Kig

    hourOfAi.registerProject(
        "Susie",
        {"legLength":5,"bodyRadius":5,"noseRadius":2,"colorPalette":colorPalettes[0]},
        (agent => {
            agent.every(1000, function () {

    if (Math.percentChance(50)) {
        agent.turnBy(45)
    } else {
        agent.turnBy(-45)
    }
})

        })
    );


// Project: Billy
// URL: https://makecode.com/_Yvj7WrU7WEev

    hourOfAi.registerProject(
        "Richard",
        {"legLength":5,"bodyRadius":5,"noseRadius":2,"colorPalette":[4,15,2]},
        hourOfAi.algorithms.spiral
    );


// Project: Joe
// URL: https://makecode.com/_gRYd7sPUsA5m

    hourOfAi.registerProject(
        "Joe",
        {"legLength":5,"bodyRadius":5,"noseRadius":2,"colorPalette":colorPalettes[1]},
        hourOfAi.algorithms.followOpponentColor);


// Project: Erica
// URL: https://makecode.com/_M196fjKbtgHs

    hourOfAi.registerProject(
        "Erica",
        {"legLength":5,"bodyRadius":5,"noseRadius":2,"colorPalette":colorPalettes[2]},
        hourOfAi.algorithms.followOpponent );


// Project: Amy
// URL: https://makecode.com/_g8JT26YRbHUC

    hourOfAi.registerProject(
        "Amy",
        {"legLength":5,"bodyRadius":5,"noseRadius":2,"colorPalette":colorPalettes[3]},
        hourOfAi.algorithms.zigzag
    );


// Project: Cal
// URL: https://makecode.com/_erbTiLPTcKcv

    hourOfAi.registerProject(
        "Cal",
        {"legLength":5,"bodyRadius":5,"noseRadius":2,"colorPalette":colorPalettes[4]},
        hourOfAi.algorithms.diagonals
);


// Project: Vera
// URL: https://makecode.com/_17bAekJ52R7b

    hourOfAi.registerProject(
        "Vera",
        {"legLength":5,"bodyRadius":5,"noseRadius":2,"colorPalette":colorPalettes[5]},
        hourOfAi.algorithms.curveAndBounce
);


// Project: Cody
// URL: https://makecode.com/_ayrCekdTaKWb

    hourOfAi.registerProject(
        "Cody",
        {"legLength":5,"bodyRadius":5,"noseRadius":2,"colorPalette":[4,15,2]},
        hourOfAi.algorithms.squiggles
    );


// Project: Jane
// URL: https://makecode.com/_A0RUKPPhz4T0

    hourOfAi.registerProject(
        "Jane",
        {"legLength":5,"bodyRadius":5,"noseRadius":2,"colorPalette":[4,15,2]},
        hourOfAi.algorithms.randomWalk
    );


hourOfAi.initRunner(300);

