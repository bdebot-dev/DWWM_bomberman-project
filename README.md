```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

    <div id="playground">
        <div class="players" id="player_red"></div>
        <div class="players" id="player_blue"></div>
    </div>

    <script src="script.js" defer></script>
</body>
</html>

```

```css
#playground {
  width: 520px;
  height: 520px;
  border: 1px solid #ccc;
  position: relative;
}

.players {
  width: 24px;
  height: 24px;
  position: absolute;
  user-select: none;
  pointer-events: none;
  transition: left 0.1s, top 0.1s;
}

#player_red {
  background: red;
  left: 0;
  top: 0;
}

#player_blue {
  background: blue;
  left: 496px; /* Position de départ opposée */
  top: 496px;
}

```

```js
const playground = document.getElementById('playground');
const playerRed = document.getElementById('player_red');
const playerBlue = document.getElementById('player_blue');
const step = 24;

// Limites dynamiques
function getMaxX() {
  return playground.clientWidth - playerRed.clientWidth;
}
function getMaxY() {
  return playground.clientHeight - playerRed.clientHeight;
}

// Positions initiales
let posRed = { x: 0, y: 0 };
let posBlue = { x: getMaxX(), y: getMaxY() };

// Mouvements
const arrows = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
const zqsd = ['z', 'q', 's', 'd'];

document.addEventListener('keydown', function(event) {
  // Joueur rouge (flèches)
  if (arrows.includes(event.key)) {
    event.preventDefault();
    switch(event.key) {
      case 'ArrowLeft':
        posRed.x = Math.max(0, posRed.x - step);
        break;
      case 'ArrowRight':
        posRed.x = Math.min(getMaxX(), posRed.x + step);
        break;
      case 'ArrowUp':
        posRed.y = Math.max(0, posRed.y - step);
        break;
      case 'ArrowDown':
        posRed.y = Math.min(getMaxY(), posRed.y + step);
        break;
    }
    playerRed.style.left = posRed.x + 'px';
    playerRed.style.top = posRed.y + 'px';
  }

  // Joueur bleu (zqsd)
  if (zqsd.includes(event.key.toLowerCase())) {
    event.preventDefault();
    switch(event.key.toLowerCase()) {
      case 'q': // gauche
        posBlue.x = Math.max(0, posBlue.x - step);
        break;
      case 'd': // droite
        posBlue.x = Math.min(getMaxX(), posBlue.x + step);
        break;
      case 'z': // haut
        posBlue.y = Math.max(0, posBlue.y - step);
        break;
      case 's': // bas
        posBlue.y = Math.min(getMaxY(), posBlue.y + step);
        break;
    }
    playerBlue.style.left = posBlue.x + 'px';
    playerBlue.style.top = posBlue.y + 'px';
  }
});

```