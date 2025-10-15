namespace hourOfAi.tower {
    export function easeInOutCubic(x: number): number {
        return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    }

    export function easeInExpo(x: number): number {
        return x === 0 ? 0 : Math.pow(2, 10 * x - 10);
    }

    export function easeOutCirc(x: number): number {
        return Math.sqrt(1 - Math.pow(x - 1, 2));
    }

    export class Animation {
        startTime = -1;

        protected update: control.FrameCallback;

        constructor(
            public duration: number,
            public easing: (x: number) => number,
            public onUpdate: (progress: number) => void
        ) {
        }

        start() {
            if (this.update) {
                game.eventContext().unregisterFrameHandler(this.update);
            }

            this.startTime = game.runtime();
            this.update = game.eventContext().registerFrameHandler(scene.UPDATE_PRIORITY, () => {
                const progress = Math.min((game.runtime() - this.startTime) / this.duration, 1);

                if (progress == 1) {
                    this.cancel();
                }
                else {
                    this.onUpdate(this.easing(progress));
                }
            });
        }

        isRunning() {
            return !!this.update;
        }

        pauseUntilDone() {
            if (!this.isRunning()) return;
            pauseUntil(() => !this.isRunning());
        }

        cancel() {
            if (this.update) {
                this.onUpdate(1);
                game.eventContext().unregisterFrameHandler(this.update);
                this.update = null;
                this.startTime = -1;
            }
        }
    }

    export function moveSprite(sprite: Sprite, x: number, y: number, speed: number, pauseUntilDone = true, easingFunction?: (x: number) => number) {
        const startX = sprite.x;
        const startY = sprite.y;
        const deltaX = x - startX;
        const deltaY = y - startY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        if (distance === 0) return;

        const duration = (distance / speed) * 1000;

        const animation = new Animation(
            duration,
            t => t,
            progress => {
                if (easingFunction) {
                    progress = easingFunction(progress);
                }
                sprite.x = startX + progress * deltaX;
                sprite.y = startY + progress * deltaY;
            }
        );
        animation.start();
        if (pauseUntilDone) {
            animation.pauseUntilDone();
        }
    }
}