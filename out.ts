// Project: Richard
// URL: https://makecode.com/_UoRFhdDcq94K

    hourOfAi.registerProject(
        "Richard",
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
    

// Project: Hassan
// URL: https://makecode.com/_22XaK8RTfY01

    hourOfAi.registerProject(
        "Hassan",
        {"legLength":5,"bodyRadius":5,"noseRadius":2,"colorPalette":[4,15,2]},
        (agent => {
            agent.every(1000, function () {
    
})
agent.every(2000, function () {
    agent.turnBy(randint(0, 60))
})

        })
    );
    

// Project: Your name
// URL: https://makecode.com/_LVX4WWacUAVK

    hourOfAi.registerProject(
        "Your name",
        {"legLength":5,"bodyRadius":5,"noseRadius":2,"colorPalette":[4,15,2]},
        (agent => {
            agent.every(1000, function () {
    
})

        })
    );
    

// Project: joey
// URL: https://makecode.com/_53DKcmCxFg0s

    hourOfAi.registerProject(
        "joey",
        {"legLength":5,"bodyRadius":5,"noseRadius":2,"colorPalette":[4,15,2]},
        (agent => {
            agent.every(1000, function () {
    
    if (agent.canSeeColor(agent.ColorType.OpponentColor)) {
        agent.turnTowards(0)
    }
})

        })
    );
    

// Project: Eric
// URL: https://makecode.com/_ajDfzXWYR7kV

    hourOfAi.registerProject(
        "Eric",
        {"legLength":5,"bodyRadius":5,"noseRadius":2,"colorPalette":[4,15,2]},
        (agent => {
            agent.every(600, function () {
    agent.turnBy(15)
})
agent.every(1000, function () {
    
})
agent.every(500, function () {
    agent.turnBy(-10)
})

        })
    );
    

hourOfAi.initRunner();

