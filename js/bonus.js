import { state } from './state.js';
import { playerRed, playerBlue } from './dom.js';
import { updateLives, updatePlayerColors } from './players.js';
import { endGame } from './game.js';
import { getMaxX, getMaxY } from './utils.js';

export function checkBonusCollision(player) {
  const playerKey = player.toLowerCase();
  const playerX = state[`pos${player}`].x;
  const playerY = state[`pos${player}`].y;

  for (let i = state.bonuses.length - 1; i >= 0; i--) {
    const bonus = state.bonuses[i];
    if (bonus.x === playerX && bonus.y === playerY) {
      if (bonus.element.dataset.type === 'deadly') {
        // Le joueur perd une vie immédiatement
        if (player === 'Red') {
          state.livesRed--;
          updateLives();
          updatePlayerColors();
          playerRed.style.backgroundColor = 'black';
          setTimeout(() => {
            playerRed.style.backgroundColor = '';
            state.posRed.x = 0;
            state.posRed.y = 0;
            playerRed.style.left = '0px';
            playerRed.style.top = '0px';
            updatePlayerColors();
          }, 100);
          if (state.livesRed <= 0) endGame('Red');
        } else if (player === 'Blue') {
          state.livesBlue--;
          updateLives();
          updatePlayerColors();
          playerBlue.style.backgroundColor = 'black';
          setTimeout(() => {
            playerBlue.style.backgroundColor = '';
            state.posBlue.x = getMaxX();
            state.posBlue.y = getMaxY();
            playerBlue.style.left = `${state.posBlue.x}px`;
            playerBlue.style.top = `${state.posBlue.y}px`;
            updatePlayerColors();
          }, 100);
          if (state.livesBlue <= 0) endGame('Blue');
        }
      }
      if (bonus.element.dataset.type === 'multi-bomb') {
        state.playerStats[playerKey].maxBombs = 3;
        state.playerStats[playerKey].bonusBombsLeft = 3;
      }
      if (bonus.element.dataset.type === 'invincibility') {
        state.playerStats[playerKey].invincible = true;
        // Ajoute effet visuel
        const playerElem = player === 'Red' ? playerRed : playerBlue;
        playerElem.classList.add('invincible');
        setTimeout(() => {
          state.playerStats[playerKey].invincible = false;
          playerElem.classList.remove('invincible');
        }, 5000);
      }
      if (bonus.element.dataset.type === 'blast-radius') {
        state.playerStats[playerKey].blastRadius = true;
        // Effet temporaire : 30 secondes (modifiable)
        setTimeout(() => {
          state.playerStats[playerKey].blastRadius = false;
        }, 30000);
      }
      bonus.element.remove();
      state.bonuses.splice(i, 1);
    }
  }
}
