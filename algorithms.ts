namespace hourOfAi.algorithms {
    export function spiral(agent: Agent) {
        let left = 0;
        let right = 0;
        let top = 0;
        let bottom = 0;

        let facing = 0;
        let returnToStart = false;
        const bandWidth = 8;

        agent.onStart(() => {
            if (agent.property(Property.Angle) === 0) {
                facing = 0;
            }
            else {
                facing = 2;
            }
        });

        agent.every(100, () => {
            if (returnToStart) return;

            if (facing === 0) {
                if (agent.distanceToWall() < right + 1) {
                    facing = 1;
                    right += bandWidth;
                    agent.turnBy(90);
                }
            }
            else if (facing === 1) {
                if (agent.distanceToWall() < bottom + 1) {
                    facing = 2;
                    bottom += bandWidth;
                    agent.turnBy(90);
                }
            }
            else if (facing === 2) {
                if (agent.distanceToWall() < left + 1) {
                    facing = 3;
                    left += bandWidth;
                    agent.turnBy(90);
                }
            }
            else {
                if (agent.distanceToWall() < top + 1) {
                    facing = 0;
                    top += bandWidth;
                    agent.turnBy(90);
                }
            }

            if (left + right > agent.arenaProperty(ArenaProperty.Width) ||
                top + bottom > agent.arenaProperty(ArenaProperty.Height)
            ) {
                returnToStart = true;
                agent.turnTowardsPosition(0, 0);
            }
        });

        agent.onBumpWall(() => {
            if (returnToStart) {
                returnToStart = false;
                facing = 0;
                left = 0;
                right = 0;
                top = 0;
                bottom = 0;
            }
        });
    }

    export function zigzag(agent: Agent) {
        let flip = true;
        let turning = false;
        agent.every(1000, () => {
            if (turning) {
                if (agent.distanceToWall() < 5) {
                    agent.turnBy(180)
                }
                else {
                    agent.turnBy(flip ? -90 : 90)
                }
                turning = false;
                return;
            }
            if (agent.distanceToWall() < 5) {
                agent.turnBy(flip ? 90 : -90)
                flip = !flip;
                turning = true;
            }
        });
    }

    export function randomWalk(agent: Agent) {
        let pauseInterval = 200;
        let pauseLength = 150;
        let pauseTimer = pauseInterval;

        let isPausing = false;

        agent.every(1000, () => {
            agent.turnBy(Math.randomRange(-90, 90));
        });

        // occasionally pause and stop moving to make things easier
        agent.every(1, () => {
            pauseTimer--;

            if (isPausing) {
                if (pauseTimer <= 0) {
                    isPausing = false;
                    pauseTimer = pauseInterval;
                }
                agent.turnTowards(agent.property(Property.Angle) + (((pauseTimer >> 6) & 1) ? -1 : 1));
            }
            else {
                if (pauseTimer <= 0) {
                    isPausing = true;
                    pauseTimer = pauseLength;
                }
            }
        });
    }

    export function curveAndBounce(agent: Agent) {
        let angleChange = 0
        agent.onStart(function () {
            angleChange = randint(1, 3)
        })
        agent.every(100, function () {
            agent.turnBy(angleChange)
        })
        agent.onBumpWall(function () {
            angleChange = randint(1, 3)
            agent.turnBy(180)
        })
    }

    export function followOpponent(agent: Agent) {
        agent.onStart(function () {
            agent.turnTowardsPosition(agent.arenaProperty(ArenaProperty.Width) / 2, agent.arenaProperty(ArenaProperty.Height) / 2)
        })
        agent.every(0, function () {
            if (!(agent.canSeeOpponent())) {
                agent.turnBy(5)
            }
        })
    }

    export function followOpponentColor(agent: Agent) {
        agent.onStart(() => {
            if (agent.property(Property.X) < 40) {
                agent.turnTowardsPosition(
                    agent.arenaProperty(ArenaProperty.Width),
                    agent.arenaProperty(ArenaProperty.Height)
                )
            }
            else {
                agent.turnTowardsPosition(
                    0, 0
                )
            }
        })

        agent.every(0, () => {
            if (!agent.canSeeColor(ColorType.OpponentColor) && !agent.canSeeOpponent()) {
                agent.turnBy(45)
            }
        })
    }

    export function squiggles(agent: Agent) {
        let turnRate = 1;
        agent.every(100, () => {
            agent.turnBy(turnRate)
        })

        agent.every(5000, () => {
            turnRate = randint(-3, 3)
        })


        agent.onBumpWall(() => {
            agent.turnBy(180)
        })
    }

    export function diagonals(agent: Agent) {
        agent.every(1000, () => {
            agent.turnBy(Math.percentChance(50) ? 45 : -45);
        })

        agent.onBumpWall(() => {
            agent.turnBy(180)
        })
    }

    export function svgPathFollower(path: string) {
        return (agent: Agent) => {
            const executor = new paths.PathExecutor(path);
            let targetPoint: paths.Point = new paths.Point(0, 0);
            let nodeTime = 100;
            let elapsedTime = 0;
            let deltaTime = 1;
            const distanceThreshold = 3;

            agent.onStart(() => {
                targetPoint = new paths.Point(agent.property(Property.X), agent.property(Property.Y));
                executor.updatedPathLength(targetPoint.x, targetPoint.y);
                executor.reset();
            })

            agent.every(100, () => {
                agent.turnTowardsPosition(targetPoint.x, targetPoint.y);
            });

            agent.every(0, () => {
                while (
                    Math.sqrt(
                        (targetPoint.x - agent.property(Property.X)) ** 2 +
                        (targetPoint.y - agent.property(Property.Y)) ** 2
                    ) < distanceThreshold
                ) {
                    elapsedTime += deltaTime;

                    if (executor.run(nodeTime, targetPoint, elapsedTime)) {
                        elapsedTime = 0;
                        executor.reset();
                    }
                }
            })
        }
    }
}