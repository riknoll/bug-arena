# distance to opponent

Returns the number of pixels from your bug to the opponent's bug. If the opponent's bug cannot be seen in the direction your bug is facing, this returns -1 instead.

```sig
hourOfAi.distanceToOpponent()
```

When your bug is looking for things, it can only see what is directly in front of it in the direction it's facing. 


## Example #example

In this example, we program our bug's AI so that it turns whenever it bumps into the opponent's bug.

```blocks
hourOfAi.every(50, () => {
    if (hourOfAi.distanceToOpponent() < 5) {
        hourOfAi.turnBy(90)
    }
})
```

```package
hour-of-ai=github:microsoft/arcade-bug-arena
```