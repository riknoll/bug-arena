namespace hourOfAi {
    export const BOMB_RADIUS = 5;
    export const EXPLOSION_RADIUS = 60;

    export class Arena {
        combatants: Agent[];
        bombs: Position[];
        background: Image;

        left: number;
        right: number;
        top: number;
        bottom: number;

        renderable: scene.Renderable;

        constructor() {
            this.left = 5;
            this.right = screen.width - 5;
            this.top = 5;
            this.bottom = screen.height - 5;
            this.combatants = [];
            this.bombs = [];
            this.background = image.create(screen.width - 10, screen.height - 10);
            this.background.fill(0);

            this.renderable = scene.createRenderable(-1, () => {
                screen.fill(12)
                screen.fillRect(this.left, this.top, this.background.width, this.background.height, 6);
                screen.drawTransparentImage(this.background, this.left, this.top);
                fancyText.draw(
                    Math.floor(currentTime_) + "",
                    screen,
                    80,
                    8,
                    0,
                    1,
                    fancyText.bold_sans_7
                )
            })
        }

        update(dt: number) {
            advanceTime(dt);
            for (const combatant of this.combatants) {
                combatant.update(dt);
                this.constrainPosition(combatant.bug.position, AGENT_RADIUS);

                this.background.fillCircle(
                    combatant.bug.position.x - this.left,
                    combatant.bug.position.y - this.top,
                    AGENT_RADIUS,
                    combatant.bug.fillColor
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
            return this.scanCore(position, angle, pos => this.background.getPixel(pos.x, pos.y) === color);
        }

        scanForOpponent(position: Position, angle: number, combatant: Agent): Position | undefined {
            const toFind = this.combatants.find(c => c !== combatant);
            if (!toFind) return undefined;

            return this.scanCore(position, angle, pos => {
                if (distanceBetween(pos, toFind.bug.position) < toFind.bug.bodyRadius + 1) {
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

            player1.bug.position.x = 10;
            player1.bug.position.y = 10;
            player1.bug.heading = 0;
            player1.bug.positionLegs(true, true, true)
            player1.bug.positionLegs(false, true, true)


            player2.bug.position.x = screen.width - 10;
            player2.bug.position.y = screen.height - 10;
            player2.bug.heading = Math.PI;
            player2.bug.positionLegs(true, true, true)
            player2.bug.positionLegs(false, true, true)
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

            for (let x = 0; x < this.background.width; x++) {
                for (let y = 0; y < this.background.height; y++) {
                    const color = this.background.getPixel(x, y);
                    if (color === this.combatants[0].bug.fillColor) { // Player 1's color
                        p1Score++;
                    } else if (color === this.combatants[1].bug.fillColor) { // Player 2's color
                        p2Score++;
                    }
                }
            }

            return p1Score > p2Score;
        }
    }
}