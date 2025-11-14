# distance to wall

Returns the number of pixels from your bug to the nearest wall in the direction the bug is facing.

```sig
hourOfAi.distanceToWall()
```

When your bug is looking for things, it can only see what is directly in front of it in the direction it's facing. 


## Example #example

In this example, we program our bug's AI so that it turns whenever it gets close to a wall.

```blocks
hourOfAi.every(50, () => {
    if (hourOfAi.distanceToWall() < 20) {
        hourOfAi.turnBy(90)
    }
})
```

```package
hour-of-ai=github:riknoll/bug-arena
```