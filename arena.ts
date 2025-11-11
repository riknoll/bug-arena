namespace hourOfAi {
    export const BOMB_RADIUS = 5;
    export const EXPLOSION_RADIUS = 60;

    export class Arena {
        combatants: Agent[];
        bombs: Position[];
        background: Image;
        scoreImage: Image;

        left: number;
        right: number;
        top: number;
        bottom: number;

        renderable: scene.Renderable;
        running = false;
        drawTimer = true;

        constructor() {
            this.background = image.create(screen.width - 10, screen.height - 20);
            this.scoreImage = image.create(screen.width - 10, screen.height - 20);
            this.left = 5;
            this.right = this.left + this.background.width;
            this.top = 11;
            this.bottom = this.top + this.background.height;
            this.combatants = [];
            this.bombs = [];
            this.background.fill(0);

            this.renderable = scene.createRenderable(-1, () => {
                screen.fill(12)
                screen.fillRect(this.left, this.top, this.background.width, this.background.height, 6);
                screen.drawTransparentImage(this.background, this.left, this.top);

                const font = fancyText.bold_sans_7;
                if (this.drawTimer) {
                    drawTime(Math.max(timeRemaining, 0), screen.width >> 1, 12, font, 7);
                }
            })
        }

        update(dt: number) {
            advanceTime(dt);
            for (const combatant of this.combatants) {
                combatant.update(dt);
                this.constrainPosition(combatant.bug.position, AGENT_RADIUS);

                if (combatant.fillPattern) {
                    drawCircle(
                        this.background,
                        combatant.bug.position.x - this.left,
                        combatant.bug.position.y - this.top,
                        combatant.fillPattern
                    );
                }
                else {
                    this.background.fillCircle(
                        combatant.bug.position.x - this.left,
                        combatant.bug.position.y - this.top,
                        AGENT_RADIUS,
                        combatant.bug.fillColor
                    );
                }

                this.scoreImage.fillCircle(
                    combatant.bug.position.x - this.left,
                    combatant.bug.position.y - this.top,
                    AGENT_RADIUS,
                    this.combatants.indexOf(combatant) + 1
                );

                for (const bomb of this.bombs) {
                    if (distanceBetween(combatant.bug.position, bomb) < BOMB_RADIUS) {
                        this.background.fillCircle(
                            bomb.x - this.left,
                            bomb.y - this.top,
                            EXPLOSION_RADIUS,
                            combatant.bug.fillColor
                        );

                        this.bombs.removeElement(bomb);
                        break;
                    }
                }
            }
        }

        constrainPosition(pos: Position, radius = 0) {
            pos.x = Math.max(this.left + radius, Math.min(this.right - radius, pos.x));
            pos.y = Math.max(this.top + radius, Math.min(this.bottom - radius, pos.y));
        }

        scanForColor(position: Position, angle: number, color: number): Position | undefined {
            return this.scanCore(position, angle, pos => this.scoreImage.getPixel(pos.x, pos.y) === color);
        }

        scanForOpponent(position: Position, angle: number, combatant: Agent): Position | undefined {
            const toFind = this.combatants.find(c => c !== combatant);
            if (!toFind) return undefined;

            return this.scanCore(position, angle, pos => {
                if (distanceBetween(pos, toFind.bug.position) < AGENT_RADIUS + 10) {
                    return true;
                }
                return false;
            });
        }

        scanForWall(position: Position, angle: number): Position | undefined {
            return this.scanCore(position, angle, pos => {
                return pos.x < 0 || pos.x >= this.background.width ||
                       pos.y < 0 || pos.y >= this.background.height
            });
        }

        scanForBomb(position: Position, angle: number): Position | undefined {
            return this.scanCore(position, angle, pos => {
                return this.bombs.some(bomb => distanceBetween(pos, bomb) < BOMB_RADIUS);
            });
        }

        placeCombatants() {
            const player1 = this.combatants[0];
            const player2 = this.combatants[1];

            player1.bug.position.x = this.left + AGENT_RADIUS;
            player1.bug.position.y = this.top + AGENT_RADIUS;
            player1.bug.heading = 0;
            player1.bug.positionLegs(true, true, true)
            player1.bug.positionLegs(false, true, true)

            if (player2) {
                player2.bug.position.x = this.left + this.background.width - AGENT_RADIUS;
                player2.bug.position.y = this.top + this.background.height - AGENT_RADIUS;
                player2.bug.heading = Math.PI;
                player2.bug.positionLegs(true, true, true)
                player2.bug.positionLegs(false, true, true)
            }
        }

        start() {
            for (const combatant of this.combatants) {
                combatant.start();
            }

            if (this.combatants.length === 2 && this.combatants[0].fillPattern) {
                if (colorFillConflictsWith(this.combatants[0].fillPatternKind, this.combatants[1].bug.fillColor)) {
                    this.combatants[1].bug.fillColor = 1;
                }
            }
            this.running = true;
        }

        protected scanCore(position: Position, angle: number, found: (pos: Position) => boolean): Position | undefined {
            const dx = Math.cos(angle);
            const dy = Math.sin(angle);

            const scanner = position.clone();
            scanner.x -= this.left;
            scanner.y -= this.top;

            while (true) {
                scanner.x += dx;
                scanner.y += dy;

                if (found(scanner)) {
                    scanner.x += this.left;
                    scanner.y += this.top;
                    return scanner; // Found the target
                }

                if (scanner.x < 0 || scanner.x >= this.background.width ||
                    scanner.y < 0 || scanner.y >= this.background.height) {
                    return undefined; // Out of bounds
                }
            }
        }

        dispose() {
            for (const combatant of this.combatants) {
                combatant.dispose();
            }
            this.renderable.destroy();
        }

        didPlayer1Win(): boolean {
            let p1Score = 0;
            let p2Score = 0;

            if (this.combatants.length < 2) {
                return true;
            }

            for (let x = 0; x < this.scoreImage.width; x++) {
                for (let y = 0; y < this.scoreImage.height; y++) {
                    const color = this.scoreImage.getPixel(x, y);
                    if (color === 1) {
                        p1Score++;
                    } else if (color === 2) {
                        p2Score++;
                    }
                }
            }

            return p1Score > p2Score;
        }
    }

    function drawTime(seconds: number, x: number, y: number, font: fancyText.BaseFont, charWidth: number) {
        if (seconds > 60) {
            const mins = padNumber(Math.floor(seconds / 60) % 100);
            const secs = padNumber(Math.floor(seconds % 60));
            fancyText.draw(mins.charAt(0), screen, x - charWidth * 2 - 2, y - font.lineHeight >> 1, 0, 1, font);
            fancyText.draw(mins.charAt(1), screen, x - charWidth - 2, y - font.lineHeight >> 1, 0, 1, font);
            fancyText.draw(":", screen, x - 1, y - font.lineHeight >> 1, 0, 1, font);
            fancyText.draw(secs.charAt(0), screen, x + 3, y - font.lineHeight >> 1, 0, 1, font);
            fancyText.draw(secs.charAt(1), screen, x + 3 + charWidth, y - font.lineHeight >> 1, 0, 1, font);
        }
        else {
            const secs = padNumber(Math.floor(seconds));
            const hundreths = padNumber(Math.floor((seconds - Math.floor(seconds)) * 100));
            fancyText.draw(secs.charAt(0), screen, x - charWidth * 2 - 2, y - font.lineHeight >> 1, 0, 1, font);
            fancyText.draw(secs.charAt(1), screen, x - charWidth - 2, y - font.lineHeight >> 1, 0, 1, font);
            fancyText.draw(".", screen, x - 1, y - font.lineHeight >> 1, 0, 1, font);
            fancyText.draw(hundreths.charAt(0), screen, x + 2, y - font.lineHeight >> 1, 0, 1, font);
            fancyText.draw(hundreths.charAt(1), screen, x + 2 + charWidth, y - font.lineHeight >> 1, 0, 1, font);
        }
    }

    function padNumber(num: number) {
        return (num < 10 ? "0" : "") + num;
    }
}