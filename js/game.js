import { generateObstacles } from './obstacles.js';
import { updateLives, updatePlayerColors, handlePlayerMove } from './players.js';
import { restartBtn, gameoverDiv } from './dom.js';
import { state } from './state.js';
import { playerRed, playerBlue } from './dom.js';
import { getMaxX, getMaxY } from './utils.js';

function promptPlayerNames() {
  // Valeurs par défaut
  let redName = prompt("Enter Red Player's name:", "Red Player");
  let blueName = prompt("Enter Blue Player's name:", "Blue Player");

  // Fallback si l'utilisateur annule ou laisse vide
  if (!redName || redName.trim() === "") redName = "Red Player";
  if (!blueName || blueName.trim() === "") blueName = "Blue Player";

  // Stocker dans le state pour usage ultérieur
  state.playerNames = {
    red: redName,
    blue: blueName
  };

  // Mettre à jour l'affichage
  document.getElementById('player_red_name').textContent = redName;
  document.getElementById('player_blue_name').textContent = blueName;
}

// Appel juste avant initializeGame()
promptPlayerNames();
initializeGame();


// Display the game over message
export function endGame(loser) {
  state.gameOver = true;
  gameoverDiv.style.display = 'block';
  // Détermine le gagnant
  let winnerKey = (loser === 'Red') ? 'blue' : 'red';
  let winnerName = state.playerNames && state.playerNames[winnerKey] ? state.playerNames[winnerKey] : winnerKey.charAt(0).toUpperCase() + winnerKey.slice(1) + " Player";
  document.getElementById('gameover_message').textContent = `${winnerName} is victorious! 🎉`;
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
  state.playerStats.red.blastRadius = false;
  state.playerStats.blue.blastRadius = false;
  state.playerStats.red.speedBoostMoves = 0;
  state.playerStats.blue.speedBoostMoves = 0;

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