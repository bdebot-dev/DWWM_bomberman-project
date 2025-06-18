const playground = document.getElementById('playground');
const playerRed = document.getElementById('player_red');
const playerBlue = document.getElementById('player_blue');
const step = 24;

// Bombes
let bombRed = null;
let bombBlue = null;

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

// Contrôles
const arrows = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' ']; // Espace pour bombe rouge
const zqsd = ['z', 'q', 's', 'd', 'a']; // 'a' pour bombe bleue

// Gestion des bombes
function placeBomb(player, color) {
  if ((player === 'red' && bombRed) || (player === 'blue' && bombBlue)) return;

  const bomb = document.createElement('div');
  bomb.className = 'bomb';
  bomb.style.left = (player === 'red' ? posRed.x : posBlue.x) + 'px';
  bomb.style.top = (player === 'red' ? posRed.y : posBlue.y) + 'px';
  playground.appendChild(bomb);

  if (player === 'red') bombRed = bomb;
  else bombBlue = bomb;

setTimeout(() => {
  explodeBomb(bomb, player); // Nouvelle fonction d'explosion
  bomb.remove();
  if (player === 'red') bombRed = null;
  else bombBlue = null;
}, 3000);
}

// Position des bombes
function isBombAt(x, y) {
  // Vérifie s'il y a une bombe rouge à ces coordonnées
  if (bombRed && parseInt(bombRed.style.left) === x && parseInt(bombRed.style.top) === y) return true;
  // Vérifie s'il y a une bombe bleue à ces coordonnées
  if (bombBlue && parseInt(bombBlue.style.left) === x && parseInt(bombBlue.style.top) === y) return true;
  return false;
}



// Écouteur d'événements
document.addEventListener('keydown', function(event) {
  // Bombe rouge (Espace)
  if (event.key === ' ') {
    event.preventDefault();
    placeBomb('red', 'red');
  }

  // Bombe bleue ('a')
  if (event.key.toLowerCase() === 'a') {
    event.preventDefault();
    placeBomb('blue', 'blue');
  }

  // --- Joueur rouge (flèches) ---
  if (arrows.includes(event.key)) {
    event.preventDefault();
    // On calcule la position souhaitée
    let newX = posRed.x;
    let newY = posRed.y;
    switch(event.key) {
      case 'ArrowLeft':
        newX = Math.max(0, posRed.x - step);
        break;
      case 'ArrowRight':
        newX = Math.min(getMaxX(), posRed.x + step);
        break;
      case 'ArrowUp':
        newY = Math.max(0, posRed.y - step);
        break;
      case 'ArrowDown':
        newY = Math.min(getMaxY(), posRed.y + step);
        break;
    }
    // Collision : si la nouvelle position est occupée par le bleu ou une bombe, on bloque
    if (
      !(newX === posBlue.x && newY === posBlue.y) &&
      !isBombAt(newX, newY)
    ) {
      posRed.x = newX;
      posRed.y = newY;
      playerRed.style.left = posRed.x + 'px';
      playerRed.style.top = posRed.y + 'px';
    }
  }

  // --- Joueur bleu (zqsd) ---
  if (zqsd.includes(event.key.toLowerCase())) {
    event.preventDefault();
    let newX = posBlue.x;
    let newY = posBlue.y;
    switch(event.key.toLowerCase()) {
      case 'q': // gauche
        newX = Math.max(0, posBlue.x - step);
        break;
      case 'd': // droite
        newX = Math.min(getMaxX(), posBlue.x + step);
        break;
      case 'z': // haut
        newY = Math.max(0, posBlue.y - step);
        break;
      case 's': // bas
        newY = Math.min(getMaxY(), posBlue.y + step);
        break;
    }
    // Collision : si la nouvelle position est occupée par le rouge ou une bombe, on bloque
    if (
      !(newX === posRed.x && newY === posRed.y) &&
      !isBombAt(newX, newY)
    ) {
      posBlue.x = newX;
      posBlue.y = newY;
      playerBlue.style.left = posBlue.x + 'px';
      playerBlue.style.top = posBlue.y + 'px';
    }
  }
});

function explodeBomb(bombElement, playerColor) {
  const bombX = parseInt(bombElement.style.left);
  const bombY = parseInt(bombElement.style.top);
  
  // Cases affectées par l'explosion
  const explosionCells = [
    { x: bombX, y: bombY }, // Centre
    { x: bombX - step, y: bombY }, // Gauche
    { x: bombX + step, y: bombY }, // Droite
    { x: bombX, y: bombY - step }, // Haut
    { x: bombX, y: bombY + step }  // Bas
  ];

  // Crée les effets visuels et vérifie les collisions
  explosionCells.forEach(cell => {
    if (cell.x >= 0 && cell.x <= getMaxX() && cell.y >= 0 && cell.y <= getMaxY()) {
      // Animation d'explosion
      const explosion = document.createElement('div');
      explosion.className = 'explosion';
      explosion.style.left = cell.x + 'px';
      explosion.style.top = cell.y + 'px';
      playground.appendChild(explosion);
      
      // Supprime l'explosion après l'animation
      setTimeout(() => explosion.remove(), 500);

      // Vérifie les joueurs touchés
      checkPlayerHit(cell.x, cell.y);
    }
  });
}

function checkPlayerHit(x, y) {
  // Vérifie le joueur rouge
  if (posRed.x === x && posRed.y === y) {
    playerRed.style.backgroundColor = 'black'; // Effet visuel
    setTimeout(() => {
      playerRed.style.backgroundColor = 'red';
      posRed.x = 0; // Réinitialise la position
      posRed.y = 0;
      playerRed.style.left = '0px';
      playerRed.style.top = '0px';
    }, 100);
  }

  // Vérifie le joueur bleu
  if (posBlue.x === x && posBlue.y === y) {
    playerBlue.style.backgroundColor = 'black'; // Effet visuel
    setTimeout(() => {
      playerBlue.style.backgroundColor = 'blue';
      posBlue.x = getMaxX(); // Réinitialise la position
      posBlue.y = getMaxY();
      playerBlue.style.left = `${posBlue.x}px`;
      playerBlue.style.top = `${posBlue.y}px`;
    }, 100);
  }
}
