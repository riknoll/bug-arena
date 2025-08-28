# arena property

Returns the height or width of the arena that your bug is competing in.

```sig
hourOfAi.arenaProperty(ArenaProperty.Width)
```

## Parameters

* **property**: the property to get on the current arena

## Example #example

In bug arena, your bug can either start in the top-left or bottom-right of the arena. This example checks our bug's `X` property inside of the `on start` event to determine what corner our bug started in by seeing if it's less than half the arena's width.

This way we can change our strategy if we need to!

```blocks
let startedInTopLeft = false;

hourOfAi.onStart(function () {
    startedInTopLeft = hourOfAi.property(Property.X) < hourOfAi.arenaProperty(ArenaProperty.Width) / 2;
})

```

```package
hour-of-ai=github:microsoft/arcade-bug-arena
```