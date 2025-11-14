# turn towards

Turns the bug to face a specific angle. In bug arena, 0 degress is to the right, 90 degrees is down, 180 degrees is to the left, and 270 degrees is up.

```sig
hourOfAi.turnTowards(180)
```

## Parameters

* **degrees**: the angle to face towards in degrees, where 0 is to the right, 90 is down, 180 is left, and 270 is up.

## Example #example

In this example, we program our bug's AI to face a random direction every 5 seconds.

```blocks
hourOfAi.every(5000, function () {
    hourOfAi.turnTowards(randint(0, 360))
})

```

```package
hour-of-ai=github:riknoll/bug-arena
```