# distance to color

Returns the number of pixels from your bug to a pixel of the specified color in the direction it's facing. If the color cannot be seen in that direction this will return -1 instead.

```sig
hourOfAi.distanceToColor(ColorType.MyColor)
```

The types of colors you can look for are:

* **"my" color** - the color your bug paints when it moves
* **"opponent" color** - the color your opponent's bug paints when it moves
* **"no" color** - a place where no color has been painted by either bug yet

When your bug is looking for things, it can only see what is directly in front of it in the direction it's facing. 


## Parameters

* **type**: the type of color to check for

## Example #example

In this example, we program our bug's AI so that it turns whenever it bumps into pixels it has already painted.

```blocks
hourOfAi.every(50, () => {
    if (hourOfAi.distanceToColor(ColorType.MyColor) < 5) {
        hourOfAi.turnBy(90)
    }
})
```

```package
hour-of-ai=github:riknoll/bug-arena
```