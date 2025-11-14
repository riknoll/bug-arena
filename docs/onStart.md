# on start

Runs code once at the very start of a match. If you're using variables in your program, it's very important to set the initial values of those variables in this event!

```sig
hourOfAi.onStart(function() {

});
```

## Example #example

In this example, we use a variable called `turnAmount` to control how fast our bug turns. Inside our on start event, we set the initial value of `turnAmount` to 45 degrees. Using a variable like this makes it super easy for us to tweak our bug's AI later!

```blocks
let turnAmount = 0;
hourOfAi.onStart(() => {
    turnAmount = 45;
})
hourOfAi.every(2000, () => {
    if (Math.percentChance(50)) {
        hourOfAi.turnBy(turnAmount);
    }
    else {
        hourOfAi.turnBy(0 - turnAmount);
    }
})
```

```package
hour-of-ai=github:riknoll/bug-arena
```