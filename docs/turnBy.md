# turn by

Turns the bug by a certain number of degrees. This block does NOT pause and wait for the turn to complete, so calling this more than once will cancel earlier turn operations.

```sig
hourOfAi.turnBy(180)
```

## Parameters

* **degrees**: the number of degrees to turn, positive is clockwise and negative is counter-clockwise.

## Example #example

In this example, we program our bug to keep switching between turning clockwise and counter-clockwise so that it paints squiggles on the arena! In order to keep it from getting stuck, we also have it turn all the way around whenever it bumps into a wall.

```blocks
let clockwise = false
hourOfAi.every(100, function () {
    if (clockwise) {
        hourOfAi.turnBy(5)
    } else {
        hourOfAi.turnBy(-5)
    }
})
hourOfAi.onBumpWall(function () {
    hourOfAi.turnBy(180)
})
hourOfAi.onStart(function () {
    clockwise = true
})
hourOfAi.every(2000, function () {
    clockwise = !(clockwise)
})


```

```package
hour-of-ai=github:microsoft/arcade-bug-arena
```