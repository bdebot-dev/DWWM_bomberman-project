const playground = document.getElementById('playground');
const playerRed = document.getElementById('player_red');
const playerBlue = document.getElementById('player_blue');
const livesRedSpan = document.getElementById('lives_red');
const livesBlueSpan = document.getElementById('lives_blue');
const gameoverDiv = document.getElementById('gameover');
const obstacleGrid = Array(20).fill().map(() => Array(20).fill(null));
const step = 24;
let destructibleObstacles = [];
let livesRed = 3;
let livesBlue = 3;
let gameOver = false;

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

function generateObstacles() {
  const cells = [];
  
  // Définit les zones interdites autour de chaque joueur (rayon de 3 cases)
  const safeZones = [
    { x: 0, y: 0, radius: 3 }, // Joueur rouge
    { x: 19, y: 19, radius: 3 } // Joueur bleu
  ];

  for (let x = 0; x < 20; x++) {
    for (let y = 0; y < 20; y++) {
      // Vérifie si la case est dans une zone sûre
      const inSafeZone = safeZones.some(zone => {
        return Math.abs(x - zone.x) <= zone.radius && 
               Math.abs(y - zone.y) <= zone.radius;
      });

      if (!inSafeZone) {
        cells.push({x, y});
      }
    }
  }

  for (let x = 0; x < 20; x++) {
    for (let y = 0; y < 20; y++) {
      if ((x === 0 && y === 0) || (x === 19 && y === 19)) continue;
      cells.push({x, y});
    }
  }

  // Mélanger les cellules
  for (let i = cells.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cells[i], cells[j]] = [cells[j], cells[i]];
  }

  // Génération des obstacles (140 au total : 15% + 20%)
  cells.slice(0, 140).forEach((cell, index) => { // 60 + 80 = 140 obstacles
    const x = cell.x * 24;
    const y = cell.y * 24;
    const type = index < 60 ? 'indestructible' : 'destructible'; // 60 premiers = indestructibles
    
    const obstacle = document.createElement('div');
    obstacle.className = `obstacle ${type}`;
    obstacle.style.left = x + 'px';
    obstacle.style.top = y + 'px';
    playground.appendChild(obstacle);
    
    obstacleGrid[cell.y][cell.x] = type;
    if (type === 'destructible') destructibleObstacles.push(obstacle);
  });
}

// Contrôles
const arrows = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' ']; // Espace pour bombe rouge
const zqsd = ['z', 'q', 's', 'd', 'a']; // 'a' pour bombe bleue

generateObstacles();
updateLives();


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

// Position des obstacles
function isObstacleAt(x, y) {
  const gridX = x / 24;
  const gridY = y / 24;
  return obstacleGrid[gridY]?.[gridX];
}

// Écouteur d'événements
document.addEventListener('keydown', function(event) {
  if (gameOver) return;
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
      !isBombAt(newX, newY) &&
      !isObstacleAt(newX, newY)
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
      !isBombAt(newX, newY) &&
      !isObstacleAt(newX, newY)
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

        // Destruction des obstacles destructibles
    const gridX = cell.x / 24;
    const gridY = cell.y / 24;
    if (obstacleGrid[gridY]?.[gridX] === 'destructible') {
      const obstacle = destructibleObstacles.find(o => 
        parseInt(o.style.left) === cell.x && 
        parseInt(o.style.top) === cell.y
      );
      if (obstacle) {
        obstacle.remove();
        obstacleGrid[gridY][gridX] = null;
      }
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



function updateLives() {
  livesRedSpan.textContent = `Red: ${livesRed}`;
  livesBlueSpan.textContent = `Blue: ${livesBlue}`;
}

function checkPlayerHit(x, y) {
  // Si la partie est terminée, on ne fait rien
  if (gameOver) return;

  // Joueur rouge touché
  if (posRed.x === x && posRed.y === y) {
    livesRed--;
    updateLives();
    playerRed.style.backgroundColor = 'black';
    setTimeout(() => {
      playerRed.style.backgroundColor = 'red';
      posRed.x = 0;
      posRed.y = 0;
      playerRed.style.left = '0px';
      playerRed.style.top = '0px';
    }, 100);
    if (livesRed <= 0) endGame('Red');
  }

  // Joueur bleu touché
  if (posBlue.x === x && posBlue.y === y) {
    livesBlue--;
    updateLives();
    playerBlue.style.backgroundColor = 'black';
    setTimeout(() => {
      playerBlue.style.backgroundColor = 'blue';
      posBlue.x = getMaxX();
      posBlue.y = getMaxY();
      playerBlue.style.left = `${posBlue.x}px`;
      playerBlue.style.top = `${posBlue.y}px`;
    }, 100);
    if (livesBlue <= 0) endGame('Blue');
  }
}

function endGame(loser) {
  gameOver = true;
  gameoverDiv.style.display = 'block';
  document.getElementById('gameover_message').textContent = `${loser} lost the game!`;
}

const restartBtn = document.getElementById('restart_btn');

restartBtn.addEventListener('click', function() {
  // Réinitialise les vies
  livesRed = 3;
  livesBlue = 3;
  updateLives();

  // Réinitialise les positions
  posRed = { x: 0, y: 0 };
  posBlue = { x: getMaxX(), y: getMaxY() };
  playerRed.style.left = posRed.x + 'px';
  playerRed.style.top = posRed.y + 'px';
  playerBlue.style.left = posBlue.x + 'px';
  playerBlue.style.top = posBlue.y + 'px';

  // Réinitialise les couleurs
  playerRed.style.backgroundColor = 'red';
  playerBlue.style.backgroundColor = 'blue';

  // Supprime les bombes restantes
  if (bombRed) { bombRed.remove(); bombRed = null; }
  if (bombBlue) { bombBlue.remove(); bombBlue = null; }

  // Supprime les explosions restantes
  document.querySelectorAll('.explosion').forEach(e => e.remove());

  // Cache le message de fin
  gameoverDiv.style.display = 'none';

  // Réactive le jeu
  gameOver = false;
});

