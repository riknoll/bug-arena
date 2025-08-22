const colorPalettes = [
    [4, 15, 2],
    [7, 15, 8],
    [2, 15, 4],
    [9, 15, 8],
    [10, 15, 2],
    [5, 15, 4]
];

class Slider extends sprites.ExtendableSprite {
    label: Sprite;
    min: number;
    max: number;
    value: number;
    onUpdate: (newValue: number) => void;

    setMinMax(min: number, max: number) {
        this.min = min;
        this.max = max;
        this.value = min + (max - min) / 2;
    }


    draw(drawLeft: number, drawTop: number): void {
        if (this.label) {
            this.label.y = this.y;
            this.label.right = this.left - 2;
            this.label.setFlag(SpriteFlag.RelativeToCamera, true);
        }
        screen.fillRect(
            drawLeft,
            drawTop + 2,
            this.width,
            this.height - 4,
            11
        )

        if (this.value !== undefined) {
            const x = ((this.value - this.min) / (this.max - this.min)) * this.width;
            screen.fillRect(
                drawLeft + x,
                drawTop,
                1,
                this.height,
                12
            )
        }
    }

    setLabel(label: string) {
        if (this.label) {
            this.label.destroy();
        }
        this.label = fancyText.create(label, 0, 14, fancyText.bold_sans_7)
        this.label.setFlag(SpriteFlag.RelativeToCamera, true);
        this.label.setPosition(this.left - 2, this.y);
    }

    updateMouse(mouseX: number, mouseY: number): boolean {
        if (mouseX >= this.left && mouseX <= this.right && mouseY >= this.top && mouseY <= this.bottom) {
            const newValue = Math.round(this.min + ((mouseX - this.left) / this.width) * (this.max - this.min));
            if (newValue !== this.value) {
                this.value = newValue;
                if (this.onUpdate) {
                    this.onUpdate(this.value);
                }
                return true;
            }
        }
        return false;
    }
}

class Swatch extends sprites.ExtendableSprite {
    onClick: (palette: number[]) => void;
    constructor(public palette: number[]) {
        super(img`.`);
        this.setFlag(SpriteFlag.RelativeToCamera, true);
        this.setDimensions(10, 10);
    }

    draw(drawLeft: number, drawTop: number): void {
        screen.fillRect(drawLeft, drawTop, 10, 10, this.palette[0]);
    }

    updateMouse(mouseX: number, mouseY: number): boolean {
        if (mouseX >= this.left && mouseX <= this.right && mouseY >= this.top && mouseY <= this.bottom) {
            if (this.onClick) {
                this.onClick(this.palette);
            }
            return true;
        }
        return false;
    }
}

function showDesigner() {
    scene.setBackgroundColor(6);
    const agent = new hourOfAi.BugPresident();

    agent.position.x = 80;
    agent.position.y = 60;
    agent.heading = Math.PI * 3 / 2;
    agent.targetHeading = Math.PI * 3 / 2;

    game.onUpdate(() => {
        agent.update(1 / 30);
        hourOfAi.advanceTime(1 / 30);
        scene.centerCameraAt(agent.position.x + 30, agent.position.y);
    })
    const sliders: Slider[] = [];
    const swatches: Swatch[] = [];

    let lastTop = 10;
    const createSlider = (label: string, min: number, max: number, onUpdate: (newValue: number) => void) => {
        const slider = new Slider(img`1`);
        slider.setDimensions(20, 5);
        slider.setFlag(SpriteFlag.RelativeToCamera, true)
        slider.top = lastTop;
        slider.right = 150;
        slider.setLabel(label);
        slider.setMinMax(min, max);
        slider.onUpdate = onUpdate
        sliders.push(slider);
        lastTop += 15
    }

    controller.left.onEvent(ControllerButtonEvent.Pressed, () => {
        agent.targetHeading = Math.PI
    });

    controller.down.onEvent(ControllerButtonEvent.Pressed, () => {
        agent.targetHeading = Math.PI / 2
    });

    controller.right.onEvent(ControllerButtonEvent.Pressed, () => {
        agent.targetHeading = 0
    });

    controller.up.onEvent(ControllerButtonEvent.Pressed, () => {
        agent.targetHeading = Math.PI * 3 / 2;
    })


    createSlider("Leg Length", 4, 10, (newValue: number) => {
        agent.legLength = agent.bodyRadius + newValue;
    });

    createSlider("Body", 3, 12, (newValue: number) => {
        const oldRadius = agent.bodyRadius;
        agent.bodyRadius = newValue;
        agent.legLength = (agent.legLength - oldRadius) + newValue;
    });

    createSlider("Nose", 1, 5, (newValue: number) => {
        agent.noseRadius = newValue;
    });

    for (let i = 0; i < colorPalettes.length; i++) {
        const swatch = new Swatch(colorPalettes[i]);
        swatch.left = 80 + (i % 5) * 12;
        swatch.top = lastTop + Math.floor(i / 5) * 12;
        swatches.push(swatch);
        swatch.onClick = (palette: number[]) => {
            agent.bodyColor = palette[0];
            agent.eyeColor = palette[1];
            agent.noseColor = palette[2];
        }
    }


    let lastMouseX = 0;
    let lastMouseY = 0;


    const updateSliders = () => {
        for (const s of sliders) {
            s.updateMouse(lastMouseX, lastMouseY);
        }
        for (const s of swatches) {
            s.updateMouse(lastMouseX, lastMouseY);
        }
    }

    browserEvents.onMouseMove((mouseX, mouseY) => {
        lastMouseX = mouseX;
        lastMouseY = mouseY;
        if (browserEvents.MouseLeft.isPressed()) {
            updateSliders();
        }
    });

    browserEvents.MouseLeft.onEvent(browserEvents.MouseButtonEvent.Pressed, () => {
        updateSliders();
    });
}
