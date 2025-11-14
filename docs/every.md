# every

Runs code on a regular interval of time in milliseconds.

```sig
hourOfAi.every(1000, function() {

});
```

If you want the passed in code to run every frame, you can pass in an interval of 0 ms. Code passed in to this function will not run if your bug is currently turning.

## Parameters

* **interval**: the amount of time in milliseconds to wait in between each run of the passed in code.

## Example #example

In this example, we program our bug's AI so that it turns to face a random direction every 5 seconds.

```blocks
hourOfAi.every(5000, () => {
    hourOfAi.turnTowards(randint(0, 360));
})
```

```package
hour-of-ai=github:riknoll/bug-arena
```