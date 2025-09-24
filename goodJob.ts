namespace hourOfAi {
    export function goodJob() {
        drawGood(33, 20, 3.3)
        drawJob(52, 65, 3.3)
    }

    const gPath = "L -2 0 Q -7 0 -7 5 Q -7 10 -2 10 Q 3 10 3 5 L -1 5"
        const oPath = "Q -5 0 -5 5 Q -5 10 0 10 Q 5 10 5 5 Q 5 0 0 0"
        const dPath = "L 0 10 Q 6 10 6 5 Q 6 0 0 0";
        const jPath = "L 0 6 Q 0 9 -3 9 Q -6 9 -6 6";
        const bPath = "L 0 10 L 3 10 Q 6 10 6 7 Q 6 4 3 4 Q 5 4 5 2 Q 5 0 3 0 L 0 0";



        function traceLetter(path: string, offsetX: number, offsetY: number, scale: number, startAngle: number) {
            const parts = path.split(" ");

            let scaled = "";
            let i = 0;

            for (const part of parts) {
                if (part === "M" || part === "L" || part === "Q") {
                    scaled += part + " ";
                    i = 0;
                }
                else {
                    const num = parseFloat(part);
                    if (i % 2 === 0) {
                        scaled += (num * scale + offsetX) + " ";
                    }
                    else {
                        scaled += (num * scale + offsetY) + " ";
                    }
                    i++;
                }
            }

            // this animation looks best if the bugs all walk off the screen at different
            // angles, so if we happen to be tracing a letter where the path is a loop double
            // the path and cancel it a random amount of time after the first iteration. this
            // ensures the bug doesn't end up at the same exit angle every time
            const doublePath = path !== jPath && path !== gPath;

            if (doublePath) {
                scaled = scaled + " " + scaled;
            }


            const followSprite = sprites.create(img`1`);
            // s.setFlag(SpriteFlag.Invisible, true);
            const angle = Math.atan2(offsetY - 60, offsetX - 80) + randint(-30, 30) / 180 * Math.PI;

            followSprite.x = 80 + Math.cos(angle) * 100;
            followSprite.y = 60 + Math.sin(angle) * 100;

            const bug = new hourOfAi.BugPresident()
            // const followSprite = sprites.create(img`1`);

            // followSprite.x = 92;
            // followSprite.y = 40;
            bug.position.x = followSprite.x;
            bug.position.y = followSprite.y;
            bug.heading = Math.PI;
            bug.positionLegs(true, true, true)
            bug.positionLegs(false, true, true)
            bug.speed = 20;

            let lastX = followSprite.x;
            let lastY = followSprite.y;


            let penDown = false;

            control.runInBackground(() => {
                hourOfAi.tower.moveSprite(followSprite, offsetX, offsetY, 20);
                penDown = true

                bug.targetHeading = startAngle;
                pauseUntil(() => bug.targetHeading === undefined)
                const duration = 4000;
                paths.runMovementAnimation(followSprite, scaled, doublePath ? duration * 2 : duration, false);
                pause(duration);
                penDown = false
                if (doublePath) {
                    pause(randint(100, 800));
                }
                animation.stopAnimation(animation.AnimationTypes.All, followSprite);

                hourOfAi.tower.moveSprite(followSprite, followSprite.x + Math.cos(bug.heading) * 200, followSprite.y + Math.sin(bug.heading) * 200, 20);
            })

            game.onUpdate(() => {
                if (hourOfAi.distanceBetween(followSprite, new hourOfAi.Position(lastX, lastY)) > 2) {
                    bug.heading = Math.atan2(followSprite.y - lastY, followSprite.x - lastX);
                    lastX = followSprite.x;
                    lastY = followSprite.y;
                }

                bug.position.x = followSprite.x;
                bug.position.y = followSprite.y;
                bug.update(1 / 30)
                if (penDown) {
                    scene.backgroundImage().fillCircle(followSprite.x, followSprite.y, 3, 1)
                }
            })

            pause(100)
            return followSprite;
        }

        game.onUpdate(() => {
            hourOfAi.advanceTime(1 / 30)
        })

        function drawGood(x: number, y: number, scale: number) {
            traceLetter(gPath, x, y, scale, -Math.PI);
            traceLetter(oPath, x + 10 * scale, y, scale, -Math.PI);
            traceLetter(oPath, x + 22 * scale, y, scale, -Math.PI);
            traceLetter(dPath, x + 30 * scale, y, scale, Math.PI / 2);
        }

        function drawJob(x: number, y: number, scale: number) {
            traceLetter(jPath, x, y, scale, Math.PI / 2);
            traceLetter(oPath, x + 8 * scale, y, scale, -Math.PI);
            traceLetter(bPath, x + 16 * scale, y, scale, Math.PI / 2);
        }

}