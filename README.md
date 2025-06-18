# Bomberman-like JavaScript Game

> Feel free to fork the project and add your own Bomberman-inspired features!

This project is a simple, browser-based Bomberman-like game built with HTML, CSS, and JavaScript. Two players can move their characters around a grid-based playground:  
- The **red player** is controlled with the arrow keys.  
- The **blue player** is controlled with the ZQSD keys.

The game is designed as a foundation for further development, such as adding bombs, obstacles, scoring, and more advanced gameplay mechanics. The code is cleanly organized with a clear separation between structure (HTML), style (CSS), and logic (JavaScript), making it easy to extend and customize.

---

## Features:
- Two-player movement on a fixed grid
- Distinct controls for each player
- Responsive and smooth movement animations
- Easily customizable and extendable codebase

---

## HTML Structure

- Main container `#playground` with two players (`#player_red` and `#player_blue`).
- HUD displaying the remaining lives (`#lives_red` and `#lives_blue`).
- Game over message in `#gameover` with a `Restart` button.

---

## CSS

- Styles for the playground, players, bombs, explosions, HUD, game over message, and obstacles (indestructible and destructible).
- Animations for bombs (pulse) and explosions (scale + fade).

---

## JavaScript

### Global Variables

- Player positions (`posRed`, `posBlue`).
- Player lives (`livesRed`, `livesBlue`).
- Bombs (`bombRed`, `bombBlue`).
- Obstacle grid `obstacleGrid` (20x20) and list of destructible obstacles.
- Game over flag (`gameOver`).

### Obstacle Generation

- The `generateObstacles()` function:
  - Excludes a safety zone (radius 1.5 cells) around each player's starting position.
  - Generates 240 obstacles in total: 80 indestructible (gray), 160 destructible (brown).
  - Places obstacles randomly on the grid, outside the safe zones.

### Player Movement

- `keydown` event listener:
  - Prevents movement onto cells occupied by the other player, a bomb, or an obstacle.
  - Controls: arrow keys + space for the red player, ZQSD + A for the blue player.

### Bomb Management

- The `placeBomb(player, color)` function places a bomb at the player's position.
- After 3 seconds, the bomb explodes via `explodeBomb()`.
- The explosion affects the bomb's cell plus 4 adjacent cells.
- The explosion destroys destructible obstacles within its range.
- The explosion checks if a player is hit using `checkPlayerHit()`.

### Life System and Game Over

- `checkPlayerHit(x, y)`:
  - Decreases the life of a player if hit.
  - Resets the player's position.
  - Updates the lives display.
  - If a player's life reaches 0, calls `endGame(loser)`.

- `endGame(loser)`:
  - Displays the defeat message.
  - Sets the game over flag (`gameOver = true`).

- `Restart` button:
  - Resets lives, positions, colors, bombs, and explosions.
  - Hides the game over message.
  - Reactivates the game.
