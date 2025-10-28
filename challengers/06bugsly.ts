namespace hourOfAi.tower {
    export function createBuglsy() {
        return new Challenger(
            {
                colorPalette: [9, 15, 8],
                legLength: 6,
                bodyRadius: 6,
                noseRadius: 2,
                fillColor: 13
            },
            "Bugsly",
            [
                tower.dialog("That's right! Give'm the ol' one-two!", context => {
                    const bugsly = sprites.create(imgs.tiny_bugsly[0], SpriteKind.DialogSprite);
                    bugsly.z = 1;

                    const bg = scene.createRenderable(-4, () => {
                        if (bugsly.flags & sprites.Flag.Destroyed) {
                            return;
                        }

                        screen.fill(6);
                        screen.drawImage(imgs.gym, 0, 0)
                        screen.fillRect(
                            118,
                            0,
                            2,
                            20,
                            15
                        );
                        screen.fillRect(
                            119,
                            20,
                            4,
                            1,
                            15
                        )
                    });

                    const punchingBag = sprites.create(imgs.punching_bag[0], SpriteKind.DialogSprite);
                    punchingBag.x = 120;
                    punchingBag.top = 20;

                    const cx = punchingBag.right - 10;
                    const cy = punchingBag.y  + 5;

                    bugsly.bottom = cy;
                    bugsly.right = cx;
                    animation.runImageAnimation(bugsly, imgs.tiny_bugsly, 50, true);

                    const speed = 100;

                    control.runInBackground(() => {
                        while (!(punchingBag.flags & sprites.Flag.Destroyed)) {
                            for (let i = 0; i < 3; i++) {
                                tower.moveSprite(
                                    bugsly,
                                    cx + (Math.random() - 0.5) * 10,
                                    cy + (Math.random() - 0.5) * 10,
                                    speed
                                );
                                context.pause(500);
                            }
                            tower.moveSprite(
                                bugsly,
                                cx,
                                cy,
                                speed
                            );
                            context.pause(1000);
                            tower.moveSprite(
                                bugsly,
                                cx - 10,
                                cy,
                                300
                            );

                            animation.runImageAnimation(punchingBag, imgs.punching_bag, 80, false);

                            tower.moveSprite(
                                bugsly,
                                cx,
                                cy,
                                300
                            );
                        }
                        bg.destroy();
                    })
                }),
                tower.dialog("Ohohoh! What's this?"),
                tower.dialog("Oh, I'm just giving my AI some much needed training!"),
                tower.dialog("But maybe you'll make a better sparring partner!"),
                tower.dialog("C'mon young'n, let's see what you've got!")
            ],
            "Spirals from the outside in.",
            [ tower.dialog("That's how the pros do it!") ],
            [ tower.dialog("What....? Well you got me fair and square.") ],
            imgs.bugsly,
            hourOfAi.algorithms.spiral
        );
    }
}