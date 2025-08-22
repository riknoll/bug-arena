// Project: Susie
// URL: https://makecode.com/_4j5JUpPA6Kig

    hourOfAi.registerProject(
        "Susie",
        {"legLength":5,"bodyRadius":5,"noseRadius":2,"colorPalette":[4,15,2]},
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
        "Billy",
        {"legLength":5,"bodyRadius":5,"noseRadius":2,"colorPalette":[4,15,2]},
        (agent => {
            agent.every(10, function () {
    
    if (!(agent.canSeeColor(ColorType.OpponentColor))) {
        agent.turnBy(5)
    }
})

        })
    );
    

// Project: Joe
// URL: https://makecode.com/_gRYd7sPUsA5m

    hourOfAi.registerProject(
        "Joe",
        {"legLength":5,"bodyRadius":5,"noseRadius":2,"colorPalette":[4,15,2]},
        (agent => {
            agent.every(100, function () {
    
    if (!(agent.canSeeOpponent())) {
        agent.turnBy(5)
    }
})

        })
    );
    

// Project: Erica
// URL: https://makecode.com/_M196fjKbtgHs

    hourOfAi.registerProject(
        "Erica",
        {"legLength":5,"bodyRadius":5,"noseRadius":2,"colorPalette":[4,15,2]},
        (agent => {
            let turning = false
let flip = false
agent.every(1000, function () {
    
    if (turning) {
        if (agent.distanceToWall() < 10) {
            agent.turnBy(180)
        } else {
            if (flip) {
                agent.turnBy(-90)
            } else {
                agent.turnBy(90)
            }
        }
        turning = false
    } else if (agent.distanceToWall() < 10) {
        if (flip) {
            agent.turnBy(90)
        } else {
            agent.turnBy(-90)
        }
        flip = !(flip)
        turning = true
    }
})

        })
    );
    

// Project: Amy
// URL: https://makecode.com/_g8JT26YRbHUC

    hourOfAi.registerProject(
        "Amy",
        {"legLength":5,"bodyRadius":5,"noseRadius":2,"colorPalette":[4,15,2]},
        (agent => {
            agent.every(100, function () {
    
    if (agent.distanceToWall() < 10) {
        agent.turnTowards(randint(0, 360))
    }
})

        })
    );
    

// Project: Cal
// URL: https://makecode.com/_erbTiLPTcKcv

    hourOfAi.registerProject(
        "Cal",
        {"legLength":5,"bodyRadius":5,"noseRadius":2,"colorPalette":[4,15,2]},
        (agent => {
            agent.every(100, function () {
    
    if (Math.percentChance(50)) {
        agent.turnBy(5)
    } else {
        agent.turnBy(-5)
    }
    if (agent.distanceToWall() < 10) {
        agent.turnBy(randint(150, 230))
    }
})

        })
    );
    

// Project: Vera
// URL: https://makecode.com/_17bAekJ52R7b

    hourOfAi.registerProject(
        "Vera",
        {"legLength":5,"bodyRadius":5,"noseRadius":2,"colorPalette":[4,15,2]},
        (agent => {
            agent.every(100, function () {
    
    agent.turnBy(randint(-10, 10))
    if (agent.distanceToWall() < 5) {
        agent.turnBy(180)
    }
})

        })
    );
    

// Project: Cody
// URL: https://makecode.com/_ayrCekdTaKWb

    hourOfAi.registerProject(
        "Cody",
        {"legLength":5,"bodyRadius":5,"noseRadius":2,"colorPalette":[4,15,2]},
        (agent => {
            let flip = false
let count = 0
agent.every(100, function () {
    
    if (flip) {
        agent.turnBy(2)
    } else {
        agent.turnBy(-2)
    }
    if (agent.distanceToWall() < 5) {
        agent.turnBy(90)
    }
    if (count == 0) {
        flip = !(flip)
        count = 50
    }
    count += -1
})

        })
    );
    

// Project: Jane
// URL: https://makecode.com/_A0RUKPPhz4T0

    hourOfAi.registerProject(
        "Jane",
        {"legLength":5,"bodyRadius":5,"noseRadius":2,"colorPalette":[4,15,2]},
        (agent => {
            let max = 0
let count = 0
agent.every(100, function () {
    
    if (max <= 0) {
        max = 100
    }
    if (agent.distanceToWall() < 5) {
        agent.turnBy(-90)
        max = max - count - 5
        count = max
    }
    if (count == 0) {
        agent.turnBy(-90)
        count = max
        max += -5
    }
    count += -1
})

        })
    );
    

hourOfAi.initRunner();

