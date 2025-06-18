// Select DOM elements
const playground = document.getElementById('playground');
const playerRed = document.getElementById('player_red');
const playerBlue = document.getElementById('player_blue');
const livesRedSpan = document.getElementById('lives_red');
const livesBlueSpan = document.getElementById('lives_blue');
const gameoverDiv = document.getElementById('gameover');
const restartBtn = document.getElementById('restart_btn');

// Constants
const step = 24;
const GRID_SIZE = 20;

// State variables
let livesRed = 3;
let livesBlue = 3;
let gameOver = false;
let bombRed = null;
let bombBlue = null;
let destructibleObstacles = [];
let obstacleGrid = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(null));
let posRed = { x: 0, y: 0 };
let posBlue = { x: getMaxX(), y: getMaxY() };

// Controls
const arrows = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' ']; // Space for red bomb
const zqsd = ['z', 'q', 's', 'd', 'a']; // 'a' for blue bomb

// Generate obstacles with safe zones around players
function generateObstacles() {
  const cells = [];
  const safeZones = [
    { x: 0, y: 0, radius: 1.5 },
    { x: GRID_SIZE - 1, y: GRID_SIZE - 1, radius: 1.5 }
  ];

  // List of available cells outside safe zones
  for (let x = 0; x < GRID_SIZE; x++) {
    for (let y = 0; y < GRID_SIZE; y++) {
      const inSafeZone = safeZones.some(zone => 
        Math.abs(x - zone.x) <= zone.radius && 
        Math.abs(y - zone.y) <= zone.radius
      );
      if (!inSafeZone) cells.push({x, y});
    }
  }

  // Random shuffle
  for (let i = cells.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cells[i], cells[j]] = [cells[j], cells[i]];
  }

  // Place obstacles (80 indestructible, 160 destructible)
  const indestructibleCount = 80;
  const destructibleCount = 160;
  destructibleObstacles = [];
  obstacleGrid = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(null));
  document.querySelectorAll('.obstacle').forEach(o => o.remove());

  cells.slice(0, indestructibleCount + destructibleCount).forEach((cell, index) => {
    const x = cell.x * step;
    const y = cell.y * step;
    const type = index < indestructibleCount ? 'indestructible' : 'destructible';
    const obstacle = document.createElement('div');
    obstacle.className = `obstacle ${type}`;
    obstacle.style.left = x + 'px';
    obstacle.style.top = y + 'px';
    playground.appendChild(obstacle);

    obstacleGrid[cell.y][cell.x] = type;
    if (type === 'destructible') destructibleObstacles.push(obstacle);
  });
}

// Limit utilities
function getMaxX() {
  return playground.clientWidth - playerRed.clientWidth;
}
function getMaxY() {
  return playground.clientHeight - playerRed.clientHeight;
}

// Check if there is a bomb at a position
function isBombAt(x, y) {
  if (bombRed && parseInt(bombRed.style.left) === x && parseInt(bombRed.style.top) === y) return true;
  if (bombBlue && parseInt(bombBlue.style.left) === x && parseInt(bombBlue.style.top) === y) return true;
  return false;
}

// Check if there is an obstacle at a position
function isObstacleAt(x, y) {
  const gridX = x / step;
  const gridY = y / step;
  return obstacleGrid[gridY]?.[gridX];
}

// Update the display of lives
function updateLives() {
  livesRedSpan.textContent = `Red: ${livesRed}`;
  livesBlueSpan.textContent = `Blue: ${livesBlue}`;
}

// Place a bomb for a player
function placeBomb(player) {
  if ((player === 'red' && bombRed) || (player === 'blue' && bombBlue)) return;
  const bomb = document.createElement('div');
  bomb.className = 'bomb';
  const { x, y } = player === 'red' ? posRed : posBlue;
  bomb.style.left = x + 'px';
  bomb.style.top = y + 'px';
  playground.appendChild(bomb);
  if (player === 'red') bombRed = bomb;
  else bombBlue = bomb;

  setTimeout(() => {
    explodeBomb(bomb);
    bomb.remove();
    if (player === 'red') bombRed = null;
    else bombBlue = null;
  }, 3000);
}

// Bomb explosion
function explodeBomb(bombElement) {
  const bombX = parseInt(bombElement.style.left);
  const bombY = parseInt(bombElement.style.top);
  const explosionCells = [
    { x: bombX, y: bombY },
    { x: bombX - step, y: bombY },
    { x: bombX + step, y: bombY },
    { x: bombX, y: bombY - step },
    { x: bombX, y: bombY + step }
  ];

  explosionCells.forEach(cell => {
    if (cell.x >= 0 && cell.x <= getMaxX() && cell.y >= 0 && cell.y <= getMaxY()) {
      // Explosion animation
      const explosion = document.createElement('div');
      explosion.className = 'explosion';
      explosion.style.left = cell.x + 'px';
      explosion.style.top = cell.y + 'px';
      playground.appendChild(explosion);
      setTimeout(() => explosion.remove(), 500);
      // Check if a player is hit
      checkPlayerHit(cell.x, cell.y);
    }
    // Destroy a destructible obstacle
    const gridX = cell.x / step;
    const gridY = cell.y / step;
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

// Manage player damage and lives
function checkPlayerHit(x, y) {
  if (gameOver) return;
  // Red player hit
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
  // Blue player hit
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

// Display the game over message
function endGame(loser) {
  gameOver = true;
  gameoverDiv.style.display = 'block';
  document.getElementById('gameover_message').textContent = `${loser} lost the game!`;
}

// Restart the game
restartBtn.addEventListener('click', function() {
  livesRed = 3;
  livesBlue = 3;
  updateLives();

  posRed = { x: 0, y: 0 };
  posBlue = { x: getMaxX(), y: getMaxY() };
  playerRed.style.left = posRed.x + 'px';
  playerRed.style.top = posRed.y + 'px';
  playerBlue.style.left = posBlue.x + 'px';
  playerBlue.style.top = posBlue.y + 'px';

  playerRed.style.backgroundColor = 'red';
  playerBlue.style.backgroundColor = 'blue';

  if (bombRed) { bombRed.remove(); bombRed = null; }
  if (bombBlue) { bombBlue.remove(); bombBlue = null; }
  document.querySelectorAll('.explosion').forEach(e => e.remove());

  gameoverDiv.style.display = 'none';
  gameOver = false;

  generateObstacles();
});

// Manage player movement and actions
document.addEventListener('keydown', function(event) {
  if (gameOver) return;

  // Red bomb (Space)
  if (event.key === ' ') {
    event.preventDefault();
    placeBomb('red');
  }
  // Blue bomb ('a')
  if (event.key.toLowerCase() === 'a') {
    event.preventDefault();
    placeBomb('blue');
  }

  // Red player (arrows)
  if (arrows.includes(event.key)) {
    event.preventDefault();
    let newX = posRed.x;
    let newY = posRed.y;
    switch(event.key) {
      case 'ArrowLeft': newX = Math.max(0, posRed.x - step); break;
      case 'ArrowRight': newX = Math.min(getMaxX(), posRed.x + step); break;
      case 'ArrowUp': newY = Math.max(0, posRed.y - step); break;
      case 'ArrowDown': newY = Math.min(getMaxY(), posRed.y + step); break;
    }
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

  // Blue player (zqsd)
  if (zqsd.includes(event.key.toLowerCase())) {
    event.preventDefault();
    let newX = posBlue.x;
    let newY = posBlue.y;
    switch(event.key.toLowerCase()) {
      case 'q': newX = Math.max(0, posBlue.x - step); break;
      case 'd': newX = Math.min(getMaxX(), posBlue.x + step); break;
      case 'z': newY = Math.max(0, posBlue.y - step); break;
      case 's': newY = Math.min(getMaxY(), posBlue.y + step); break;
    }
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

// Initialization
generateObstacles();
updateLives();