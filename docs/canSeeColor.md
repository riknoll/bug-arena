# can see color

Returns true if your bug can see the specified color type in the direction it is facing and false otherwise.

```sig
hourOfAi.canSeeColor(ColorType.MyColor)
```

The types of colors you can look for are:

* **"my" color** - the color your bug paints when it moves
* **"opponent" color** - the color your opponent's bug paints when it moves
* **"no" color** - a place where no color has been painted by either bug yet

When your bug is looking for things, it can only see what is directly in front of it in the direction it's facing. 


## Parameters

* **type**: the type of color to check for

## Example #example

In this example, we program our bug's AI so that it turns whenever it can't see the opponent's color. When it does see the opponent's color, it stops turning and walks straight forward.

As a result, our bug focuses on painting over the territory that our opponent already painted!

```blocks
hourOfAi.every(50, () => {
    if (!hourOfAi.canSeeColor(ColorType.OpponentColor)) {
        hourOfAi.turnBy(1)
    }
})
```

```package
hour-of-ai=github:microsoft/arcade-bug-arena
```