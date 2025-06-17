# Bomberman-like JavaScript Game

This project is a simple, browser-based Bomberman-like game built with HTML, CSS, and JavaScript. Two players can move their characters around a grid-based playground:  
- The **red player** is controlled with the arrow keys.  
- The **blue player** is controlled with the ZQSD keys.

The game is designed as a foundation for further development, such as adding bombs, obstacles, scoring, and more advanced gameplay mechanics. The code is cleanly organized with a clear separation between structure (HTML), style (CSS), and logic (JavaScript), making it easy to extend and customize.

## Features:
- Two-player movement on a fixed grid
- Distinct controls for each player
- Responsive and smooth movement animations
- Easily customizable and extendable codebase

> Feel free to fork the project and add your own Bomberman-inspired features!

## Two players game

```js
if (zqsd.includes(event.key.toLowerCase())) {
    // code
}
```

> This line makes the blue player's controls case-insensitive and simply checks if the pressed key is one of the movement keys defined in the `zqsd` array.

### Breakdown

- **`event.key`**: corresponds to the key pressed by the user (for example, "Z", "q", "S", "d", etc.).
- **`.toLowerCase()`**: converts this key to lowercase, so "Z" becomes "z", "Q" becomes "q", etc. This allows the comparison to ignore the case (uppercase/lowercase).
- **`zqsd`**: is an array containing the letters ['z', 'q', 's', 'd'], which are the keys used to control the blue player.
- **`.includes()`**: checks if the value passed as a parameter exists in the array (in this case, it checks if the pressed key—in lowercase—is one of the blue player's control keys).

---

### What the condition does

The condition:
```js
if (zqsd.includes(event.key.toLowerCase())) {
    // code
}
```
- **Tests if the pressed key (in lowercase) is one of the blue player's control keys (Z, Q, S, D, regardless of case).**
- If so, the code inside the if statement will execute (the blue player will move).

---

### Example

- If the user presses "Z", "z", "Q", "q", "S", "s", "D", or "d", the condition will be true.
- If the user presses any other key (e.g., "a", "e", "ArrowLeft", etc.), the condition will be false.