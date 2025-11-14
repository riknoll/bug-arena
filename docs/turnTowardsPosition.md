# turn towards position

Turns the bug to face towards a specific XY position.

```sig
hourOfAi.turnTowardsPosition(0, 0)
```

## Parameters

* **x**: the x (horizontal) coordinate of the position to turn towards.
* **y**: the y (vertical) coordinate of the position to turn towards.

## Example #example

In this example, we use the `on start` event to program our bug's AI so that it immediately turns towards the center of the arena. This way, we can start off by attacking our opponent!

```blocks
hourOfAi.onStart(function () {
    hourOfAi.turnTowardsPosition(
        hourOfAi.arenaProperty(ArenaProperty.Width) / 2,
        hourOfAi.arenaProperty(ArenaProperty.Height) / 2
    )
})
```

```package
hour-of-ai=github:riknoll/bug-arena
```