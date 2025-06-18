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
  document.getElementById('gameover_message').textContent = `${loser} lost the game!`;
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

  // Hide game over message and reset game state
  gameoverDiv.style.display = 'none';
  state.gameOver = false;

  // Regenerate obstacles
  generateObstacles();
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
