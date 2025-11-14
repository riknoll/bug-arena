# every

Runs code whenever your bug bumps into a wall in the arena.

```sig
hourOfAi.onBumpWall(function() {

});
```

## Example #example

In this example, we program our bug's AI so that it turns around whenever it bumps into a wall.

```blocks
hourOfAi.onBumpWall(() => {
    hourOfAi.turnBy(180);
})
```

```package
hour-of-ai=github:riknoll/bug-arena
```