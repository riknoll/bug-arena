# property

Returns the value of a property of your bug. The properties you can get the value of are:

* **x** - the horizontal position of your bug.
* **y** - the vertial position of your bug.
* **angle (degrees)** - the angle your bug is facing in degrees, where 0 is to the right, 90 is down, 180 is left, and 270 is up.
* **angle (radians)** - the angle your bug is facing converted into radians. This can be useful if you want to use the trigonometry functions in the Math category!

```sig
hourOfAi.property(Property.X)
```

## Parameters

* **property**: the property to get the value of.

## Example #example

In this example, we store our bug's `x` and `y` positions inside the `on start` event. Then, we use those values to turn back towards our start position every 30 seconds.

```blocks
let startX = 0;
let startY = 0;

hourOfAi.onStart(function () {
    startX = hourOfAi.property(Property.X);
    startY = hourOfAi.property(Property.Y);
})

hourOfAi.every(500, function () {
    if (Math.percentChance(50)) {
        hourOfAi.turnBy(45);
    }
    else {
        hourOfAi.turnBy(-45);
    }
})

hourOfAi.every(30000, function () {
    hourOfAi.turnTowardsPosition(startX, startY);
})

```

```package
hour-of-ai=github:microsoft/arcade-bug-arena
```