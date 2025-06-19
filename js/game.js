import { generateObstacles } from './obstacles.js';
import { updateLives, updatePlayerColors, handlePlayerMove } from './players.js';
import { restartBtn, gameoverDiv } from './dom.js';
import { state } from './state.js';
import { playerRed, playerBlue } from './dom.js';
import { getMaxX, getMaxY } from './utils.js';

// Display the game over message
export function endGame(loser) {
  state.gameOver = true;
  gameoverDiv.style.display = 'block';
  // Détermine le gagnant
  let winner = (loser === 'Red') ? 'Blue' : 'Red';
  document.getElementById('gameover_message').textContent = `${winner} is victorious! 🎉`;
}

/**
 * Resets the game to its initial state.
 */
function restartGame() {
  // Reset player lives and update UI
  state.livesRed = 3;
  state.livesBlue = 3;
  updateLives();
  updatePlayerColors();

  // Reset player stats
  state.playerStats.red.maxBombs = 1;
  state.playerStats.red.activeBombs = 0;
  state.playerStats.red.bonusBombsLeft = 0;
  state.playerStats.blue.maxBombs = 1;
  state.playerStats.blue.activeBombs = 0;
  state.playerStats.blue.bonusBombsLeft = 0;

  // Reset player positions
  state.posRed = { x: 0, y: 0 };
  state.posBlue = { x: getMaxX(), y: getMaxY() };
  playerRed.style.left = state.posRed.x + 'px';
  playerRed.style.top = state.posRed.y + 'px';
  playerBlue.style.left = state.posBlue.x + 'px';
  playerBlue.style.top = state.posBlue.y + 'px';

  // Remove any remaining bombs
  if (state.bombRed) { state.bombRed.remove(); state.bombRed = null; }
  if (state.bombBlue) { state.bombBlue.remove(); state.bombBlue = null; }

  // Remove all explosion effects
  document.querySelectorAll('.explosion').forEach(e => e.remove());

  // Clear existing bonuses
  state.bonuses = state.bonuses || []; // Sécurité supplémentaire
  state.bonuses.forEach(b => b.element.remove());
  state.bonuses = [];


  // Hide game over message and reset game state
  gameoverDiv.style.display = 'none';
  state.gameOver = false;

  // Regenerate obstacles
  generateObstacles();

    // Réinitialiser les effets d'invincibilité
    state.playerStats.red.invincible = false;
    state.playerStats.blue.invincible = false;
    playerRed.classList.remove('invincible');
    playerBlue.classList.remove('invincible');
}

// Initialization
function initializeGame() {
  generateObstacles();
  updateLives();
  updatePlayerColors();
}

document.addEventListener('keydown', handlePlayerMove);
restartBtn.addEventListener('click', restartGame);
initializeGame();