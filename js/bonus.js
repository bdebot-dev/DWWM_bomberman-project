import { state } from './state.js';
import { playerRed, playerBlue } from './dom.js';

export function checkBonusCollision(player) {
  const playerKey = player.toLowerCase();
  const playerX = state[`pos${player}`].x;
  const playerY = state[`pos${player}`].y;

  for (let i = state.bonuses.length - 1; i >= 0; i--) {
    const bonus = state.bonuses[i];
    if (bonus.x === playerX && bonus.y === playerY) {
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
      bonus.element.remove();
      state.bonuses.splice(i, 1);
    }
  }
}
