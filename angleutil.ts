//% color=#0fbc11 icon="" block="Angle Utils" groups='["Math","Sprites","Draw"]'
namespace angleutil {
    const TWO_PI = Math.PI * 2;

    export enum Property {
        //% block=heading
        Heading,
        //% block=speed
        Speed,
        //% block=acceleration
        Acceleration,
        //% block=friction
        Friction,
        //% block="rotation speed"
        RotationSpeed
    }

    export enum DrawStyle {
        //% block=outline
        Outline,
        //% block=fill
        Fill
    }

    class ExtensionState {
        trackedSprites: Sprite[];
        constructor() {
            this.trackedSprites = [];

            game.currentScene().eventContext.registerFrameHandler(scene.PHYSICS_PRIORITY - 1, () => {
                this.update();
            });

            game.currentScene().eventContext.registerFrameHandler(scene.RENDER_SPRITES_PRIORITY - 1, () => {
                for (const sprite of this.trackedSprites) {
                    getSpriteState(sprite).updateZ();
                }
            });
        }

        update() {
            const dt = game.currentScene().eventContext.deltaTime;

            let needsPruning = false;
            for (const sprite of this.trackedSprites) {
                if (sprite.flags & sprites.Flag.Destroyed) {
                    needsPruning = true;
                    getSpriteState(sprite).destroy();
                }
                else {
                    applyPhysics(sprite, dt);
                }
            }

            if (needsPruning) {
                this.trackedSprites = this.trackedSprites.filter(s => !(s.flags & sprites.Flag.Destroyed));
            }
        }
    }

    function _createState() {
        return new ExtensionState();
    }

    function state() {
        return __util.getState(_createState);
    }

    class DirectionSpriteState {
        heading: number;
        speed: number;
        acceleration: number;
        friction: number;
        rotationSpeed: number;
        protected renderable: scene.Renderable;
        protected shapes: DrawnShape[];

        constructor(protected sprite: Sprite) {
            this.heading = 0;
            this.speed = 0;
            this.acceleration = 0;
            this.friction = 0;
            this.rotationSpeed = 0;
            state().trackedSprites.push(sprite);
        }

        destroy() {
            if (this.renderable) {
                this.renderable.destroy();
            }
        }

        addShape(shape: DrawnShape) {
            if (!this.shapes) {
                this.shapes = [shape];
                this.renderable = scene.createRenderable(this.sprite.z + 0.1, (target, camera) => {
                    this.draw(target, camera);
                });
            }
            else {
                this.shapes.push(shape);
            }
        }

        draw(target: Image, camera: scene.Camera) {
            for (const shape of this.shapes) {
                shape.draw(this.sprite, target, camera);
            }
        }

        updateZ() {
            if (this.renderable) {
                this.renderable.z = this.sprite.z + 0.1;
            }
        }

        removeShapes() {
            this.shapes = undefined;
            this.renderable.destroy();
            this.renderable = undefined;
        }
    }

    class DrawnShape {
        constructor(protected color: number, protected length: number, protected sidewaysOffset: number, protected forwardOffset: number, protected angleOffset: number) {
        }

        draw(anchor: Sprite, target: Image, camera: scene.Camera) {
            const cx = anchor.x - camera.drawOffsetX;
            const cy = anchor.y - camera.drawOffsetY;
            const heading = getSpriteState(anchor).heading;

            this.drawCore(
                target,
                cx + Math.cos(heading) * this.forwardOffset + Math.cos(heading + Math.PI / 2) * this.sidewaysOffset,
                cy + Math.sin(heading) * this.forwardOffset + Math.sin(heading + Math.PI / 2) * this.sidewaysOffset,
                heading + this.angleOffset
            );
        }

        protected drawCore(target: Image, x: number, y: number, angle: number) {
            target.drawLine(
                x - Math.cos(angle) * this.length / 2,
                y - Math.sin(angle) * this.length / 2,
                x + Math.cos(angle) * this.length / 2,
                y + Math.sin(angle) * this.length / 2,
                this.color
            );
        }
    }

    class DrawnIsoTriangleOutline extends DrawnShape {
        constructor(color: number, length: number, protected baseWidth: number, sidewaysOffset: number, forwardOffset: number, angleOffset: number) {
            super(color, length, sidewaysOffset, forwardOffset, angleOffset);
        }

        protected drawCore(target: Image, x: number, y: number, angle: number) {
            const xForwardOffset = Math.cos(angle) * this.length / 2;
            const yForwardOffset = Math.sin(angle) * this.length / 2;
            const xSidewaysOffset = Math.cos(angle + Math.PI / 2) * this.baseWidth / 2;
            const ySidewaysOffset = Math.sin(angle + Math.PI / 2) * this.baseWidth / 2;
            this.drawTriangle(
                target,
                x + xForwardOffset,
                y + yForwardOffset,
                x - xForwardOffset + xSidewaysOffset,
                y - yForwardOffset + ySidewaysOffset,
                x - xForwardOffset - xSidewaysOffset,
                y - yForwardOffset - ySidewaysOffset,
            )
        }

        protected drawTriangle(
            target: Image,
            x0: number,
            y0: number,
            x1: number,
            y1: number,
            x2: number,
            y2: number
        ){
            target.drawLine(x0, y0, x1, y1, this.color);
            target.drawLine(x1, y1, x2, y2, this.color);
            target.drawLine(x2, y2, x0, y0, this.color);
        }
    }

    class DrawnIsoTriangleFill extends DrawnIsoTriangleOutline {
        protected drawTriangle(
            target: Image,
            x0: number,
            y0: number,
            x1: number,
            y1: number,
            x2: number,
            y2: number
        ) {
            target.fillTriangle(
                x0, y0,
                x1, y1,
                x2, y2,
                this.color
            );
        }
    }

    class DrawnTriangleOutline extends DrawnShape {
        protected drawCore(target: Image, x: number, y: number, angle: number) {
            // height of triangle = (tan(60 degrees) / 2) * side length
            // (tan(60 degrees) / 2) / 2 = 0.433
            const halfHeight = 0.433 * this.length;

            this.drawTriangle(
                target,
                x + halfHeight * Math.cos(angle),
                y + halfHeight * Math.sin(angle),
                x + halfHeight * Math.cos(angle + 2 * Math.PI / 3),
                y + halfHeight * Math.sin(angle + 2 * Math.PI / 3),
                x + halfHeight * Math.cos(angle + 4 * Math.PI / 3),
                y + halfHeight * Math.sin(angle + 4 * Math.PI / 3),
            )
        }

        protected drawTriangle(
            target: Image,
            x0: number,
            y0: number,
            x1: number,
            y1: number,
            x2: number,
            y2: number
        ) {
            target.drawLine(x0, y0, x1, y1, this.color);
            target.drawLine(x1, y1, x2, y2, this.color);
            target.drawLine(x2, y2, x0, y0, this.color);
        }
    }

    class DrawnTriangleFill extends DrawnShape {
        protected drawTriangle(
            target: Image,
            x0: number,
            y0: number,
            x1: number,
            y1: number,
            x2: number,
            y2: number
        ) {
            target.fillTriangle(
                x0, y0,
                x1, y1,
                x2, y2,
                this.color
            );
        }
    }

    class DrawnRectangleOutline extends DrawnShape {
        constructor(color: number, length: number, protected baseWidth: number, sidewaysOffset: number, forwardOffset: number, angleOffset: number) {
            super(color, length, sidewaysOffset, forwardOffset, angleOffset);
        }

        protected drawCore(target: Image, x: number, y: number, angle: number) {
            const xForwardOffset = Math.cos(angle) * this.length / 2;
            const yForwardOffset = Math.sin(angle) * this.length / 2;
            const xSidewaysOffset = Math.cos(angle + Math.PI / 2) * this.baseWidth / 2;
            const ySidewaysOffset = Math.sin(angle + Math.PI / 2) * this.baseWidth / 2;
            this.drawRectangle(
                target,
                x + xForwardOffset + xSidewaysOffset,
                y + yForwardOffset + ySidewaysOffset,
                x + xForwardOffset - xSidewaysOffset,
                y + yForwardOffset - ySidewaysOffset,
                x - xForwardOffset - xSidewaysOffset,
                y - yForwardOffset - ySidewaysOffset,
                x - xForwardOffset + xSidewaysOffset,
                y - yForwardOffset + ySidewaysOffset,
            )
        }

        protected drawRectangle(
            target: Image,
            x0: number,
            y0: number,
            x1: number,
            y1: number,
            x2: number,
            y2: number,
            x3: number,
            y3: number,
        ) {
            target.drawLine(x0, y0, x1, y1, this.color);
            target.drawLine(x1, y1, x2, y2, this.color);
            target.drawLine(x2, y2, x3, y3, this.color);
            target.drawLine(x3, y3, x0, y0, this.color);
        }
    }

    class DrawnRectangleFill extends DrawnRectangleOutline {
        protected drawRectangle(
            target: Image,
            x0: number,
            y0: number,
            x1: number,
            y1: number,
            x2: number,
            y2: number,
            x3: number,
            y3: number,
        ) {
            target.fillPolygon4(
                x0, y0,
                x1, y1,
                x2, y2,
                x3, y3,
                this.color
            );
        }
    }

    class DrawnCircleOutline extends DrawnShape {
        protected drawCore(target: Image, x: number, y: number, angle: number) {
            target.drawCircle(x, y, this.length / 2, this.color);
        }
    }

    class DrawnCircleFill extends DrawnShape {
        protected drawCore(target: Image, x: number, y: number, angle: number) {
            target.fillCircle(x, y, this.length / 2, this.color);
        }
    }

    function getSpriteState(sprite: Sprite): DirectionSpriteState {
        const KEY = "$dir_sprite_state";

        let spriteState: DirectionSpriteState = sprite.data[KEY];

        if (!spriteState) {
            spriteState = new DirectionSpriteState(sprite);
            sprite.data[KEY] = spriteState;
        }

        return spriteState;
    }

    function applyPhysics(sprite: Sprite, dt: number) {
        const spriteState = getSpriteState(sprite);

        spriteState.speed += spriteState.acceleration * dt;

        if (spriteState.friction) {
            if (spriteState.speed > 0) {
                spriteState.speed = Math.max(spriteState.speed - spriteState.friction * dt, 0);
            }
            else if (spriteState.speed < 0) {
                spriteState.speed = Math.min(spriteState.speed + spriteState.friction * dt, 0);
            }
        }

        if (spriteState.rotationSpeed) {
            spriteState.heading = clampRadians(spriteState.heading + spriteState.rotationSpeed * dt);
        }

        sprite.vx = spriteState.speed * Math.cos(spriteState.heading);
        sprite.vy = spriteState.speed * Math.sin(spriteState.heading);
        sprite.ax = 0;
        sprite.ay = 0;
        sprite.fx = 0;
        sprite.fy = 0;
    }

    //% blockId=angleutils_setProperty
    //% block="$sprite set $property to $value"
    //% sprite.shadow=variables_get
    //% sprite.defl=mySprite
    //% weight=100
    //% blockGap=8
    //% group=Sprites
    export function setProperty(sprite: Sprite, property: Property, value: number) {
        const spriteState = getSpriteState(sprite);

        switch (property) {
            case Property.Heading:
                spriteState.heading = value;
                break;
            case Property.Speed:
                spriteState.speed = value;
                break;
            case Property.Acceleration:
                spriteState.acceleration = value;
                break;
            case Property.Friction:
                spriteState.friction = value;
                break;
            case Property.RotationSpeed:
                spriteState.rotationSpeed = value;
                break;
        }
    }

    //% blockId=angleutils_getProperty
    //% block="$sprite $property"
    //% sprite.shadow=variables_get
    //% sprite.defl=mySprite
    //% weight=90
    //% blockGap=8
    //% group=Sprites
    export function getProperty(sprite: Sprite, property: Property) {
        const spriteState = getSpriteState(sprite);

        switch (property) {
            case Property.Heading:
                return spriteState.heading;
            case Property.Speed:
                return spriteState.speed;
            case Property.Acceleration:
                return spriteState.acceleration;
            case Property.Friction:
                return spriteState.friction;
            case Property.RotationSpeed:
                return spriteState.rotationSpeed;
        }
    }

    //% blockId=angleutils_turnSpriteTowards
    //% block="turn $sprite towards $target by $delta"
    //% sprite.shadow=variables_get
    //% sprite.defl=mySprite
    //% target.shadow=variables_get
    //% target.defl=otherSprite
    //% weight=80
    //% blockGap=8
    //% group=Sprites
    export function turnSpriteTowards(sprite: Sprite, target: Sprite | tiles.Location | hourOfAi.Position, delta: number) {
        const targetAngle = Math.atan2(target.y - sprite.y, target.x - sprite.x);
        const state = getSpriteState(sprite);

        state.heading = turnAngleTowards(state.heading, targetAngle, delta);
    }

    //% blockId=angleutils_drawLineAbove
    //% block="draw line above $sprite length $length color $color||front offset $forwardOffset side offset $sidewaysOffset angle offset $angleOffset"
    //% sprite.shadow=variables_get
    //% sprite.defl=mySprite
    //% color.shadow=colorindexpicker
    //% weight=100
    //% blockGap=8
    //% group=Draw
    export function drawLineAbove(sprite: Sprite, length: number, color: number, forwardOffset?: number, sidewaysOffset?: number, angleOffset?: number) {
        getSpriteState(sprite).addShape(new DrawnShape(
            color,
            length,
            sidewaysOffset || 0,
            forwardOffset || 0,
            angleOffset || 0
        ))
    }

    //% blockId=angleutils_drawIsoscelesTriangleAbove
    //% block="draw isosceles triangle $style above $sprite height $height base width $baseWidth color $color||front offset $forwardOffset side offset $sidewaysOffset angle offset $angleOffset"
    //% sprite.shadow=variables_get
    //% sprite.defl=mySprite
    //% color.shadow=colorindexpicker
    //% weight=80
    //% blockGap=8
    //% group=Draw
    export function drawIsoscelesTriangleAbove(sprite: Sprite, style: DrawStyle, height: number, baseWidth: number, color: number, forwardOffset?: number, sidewaysOffset?: number, angleOffset?: number) {
        let shape: DrawnShape;

        if (style === DrawStyle.Outline) {
            shape = new DrawnIsoTriangleOutline(
                color,
                height,
                baseWidth,
                sidewaysOffset || 0,
                forwardOffset || 0,
                angleOffset || 0
            );
        }
        else {
            shape = new DrawnIsoTriangleFill(
                color,
                height,
                baseWidth,
                sidewaysOffset || 0,
                forwardOffset || 0,
                angleOffset || 0
            );
        }

        getSpriteState(sprite).addShape(shape);
    }

    //% blockId=angleutils_drawTriangleAbove
    //% block="draw triangle $style above $sprite side length $sideLength color $color||front offset $forwardOffset side offset $sidewaysOffset angle offset $angleOffset"
    //% sprite.shadow=variables_get
    //% sprite.defl=mySprite
    //% color.shadow=colorindexpicker
    //% weight=90
    //% blockGap=8
    //% group=Draw
    export function drawTriangleAbove(sprite: Sprite, style: DrawStyle, sideLength: number, color: number, forwardOffset?: number, sidewaysOffset?: number, angleOffset?: number) {
        let shape: DrawnShape;

        if (style === DrawStyle.Outline) {
            shape = new DrawnTriangleOutline(
                color,
                sideLength,
                sidewaysOffset || 0,
                forwardOffset || 0,
                angleOffset || 0
            );
        }
        else {
            shape = new DrawnTriangleFill(
                color,
                sideLength,
                sidewaysOffset || 0,
                forwardOffset || 0,
                angleOffset || 0
            );
        }

        getSpriteState(sprite).addShape(shape);
    }

    //% blockId=angleutils_drawRectangleAbove
    //% block="draw rectangle $style above $sprite width $width height $height color $color||front offset $forwardOffset side offset $sidewaysOffset angle offset $angleOffset"
    //% sprite.shadow=variables_get
    //% sprite.defl=mySprite
    //% color.shadow=colorindexpicker
    //% weight=70
    //% blockGap=8
    //% group=Draw
    export function drawRectangleAbove(sprite: Sprite, style: DrawStyle, width: number, height: number, color: number, forwardOffset?: number, sidewaysOffset?: number, angleOffset?: number) {
        let shape: DrawnShape;

        if (style === DrawStyle.Outline) {
            shape = new DrawnRectangleOutline(
                color,
                height,
                width,
                sidewaysOffset || 0,
                forwardOffset || 0,
                angleOffset || 0
            );
        }
        else {
            shape = new DrawnRectangleFill(
                color,
                height,
                width,
                sidewaysOffset || 0,
                forwardOffset || 0,
                angleOffset || 0
            );
        }

        getSpriteState(sprite).addShape(shape);
    }

    //% blockId=angleutils_drawCircleAbove
    //% block="draw circle $style above $sprite radius $radius color $color||front offset $forwardOffset side offset $sidewaysOffset"
    //% sprite.shadow=variables_get
    //% sprite.defl=mySprite
    //% color.shadow=colorindexpicker
    //% weight=60
    //% group=Draw
    export function drawCircleAbove(sprite: Sprite, style: DrawStyle, radius: number, color: number, forwardOffset?: number, sidewaysOffset?: number) {
        let shape: DrawnShape;

        if (style === DrawStyle.Outline) {
            shape = new DrawnCircleOutline(
                color,
                radius * 2,
                sidewaysOffset || 0,
                forwardOffset || 0,
                0
            );
        }
        else {
            shape = new DrawnCircleFill(
                color,
                radius * 2,
                sidewaysOffset || 0,
                forwardOffset || 0,
                0
            );
        }

        getSpriteState(sprite).addShape(shape);
    }

    //% blockId=angleutils_removeShapes
    //% block="remove shapes from $sprite"
    //% sprite.shadow=variables_get
    //% sprite.defl=mySprite
    //% weight=0
    //% group=Draw
    export function removeShapes(sprite: Sprite) {
        getSpriteState(sprite).removeShapes();
    }

    //% blockId=angleutils_turnAngleTowards
    //% block="turn angle $angleFrom towards angle $angleTo by $delta"
    //% group=Math
    //% blockGap=8
    //% weight=70
    export function turnAngleTowards(angleFrom: number, angleTo: number, delta: number) {
        angleFrom = clampRadians(angleFrom);
        angleTo = clampRadians(angleTo);

        if (Math.abs(angleFrom - angleTo) > Math.PI) {
            if (angleFrom < angleTo) {
                angleFrom += TWO_PI;
            }
            else {
                angleTo += TWO_PI;
            }
        }

        if (angleFrom < angleTo) {
            return clampRadians(Math.min(angleFrom + delta, angleTo));
        }
        else if (angleFrom > angleTo) {
            return clampRadians(Math.max(angleFrom - delta, angleTo));
        }
        return angleTo;
    }

    export function anglesEqual(angle1: number, angle2: number) {
        angle1 = clampRadians(angle1);
        angle2 = clampRadians(angle2);
        return angle1 === angle2;
    }

    //% blockId=angleutils_angleDifference
    //% block="difference from angle $angle1 to angle $angle2"
    //% group=Math
    //% blockGap=8
    //% weight=80
    export function angleDifference(angle1: number, angle2: number) {
        angle1 = clampRadians(angle1);
        angle2 = clampRadians(angle2);

        if (Math.abs(angle1 - angle2) > Math.PI) {
            if (angle1 < angle2) {
                angle1 += TWO_PI;
            }
            else {
                angle2 += TWO_PI;
            }
        }

        return angle1 - angle2;
    }

    //% blockId=angleutils_clampRadians
    //% block="wrap radians $angle between 0-2π"
    //% group=Math
    //% weight=90
    export function clampRadians(angle: number) {
        return ((angle % TWO_PI) + TWO_PI) % TWO_PI;
    }

    //% blockId=angleutils_clampDegrees
    //% block="wrap degrees $angle between 0-360"
    //% group=Math
    //% weight=100
    //% blockGap=8
    export function clampDegrees(angle: number) {
        return ((angle % 360) + 360) % 360;
    }
}
