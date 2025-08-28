# can see opponent

Returns true if your bug can see its opponent in the arena and false otherwise

```sig
hourOfAi.canSeeOpponent()
```

When your bug is looking for things, it can only see what is directly in front of it in the direction it's facing. 


## Example #example

In this example, we program our bug's AI so that it turns whenever it can't see the opponent. When it does see the opponent, it stops turning and walks straight forward.

As a result, our bug focuses on following the opponent's bug!

```blocks
hourOfAi.every(50, () => {
    if (!hourOfAi.canSeeOpponent()) {
        hourOfAi.turnBy(1)
    }
})
```

```package
hour-of-ai=github:microsoft/arcade-bug-arena
```