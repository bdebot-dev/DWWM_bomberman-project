// bonus.js
import { state } from './state.js';

export function checkBonusCollision(player) {
  const playerX = state[`pos${player}`].x;
  const playerY = state[`pos${player}`].y;

  for (let i = state.bonuses.length - 1; i >= 0; i--) {
    const bonus = state.bonuses[i];
    if (bonus.x === playerX && bonus.y === playerY) {
      // Appliquer l'effet du bonus
      if (bonus.element.dataset.type === 'multi-bomb') {
        state.playerStats[player.toLowerCase()].maxBombs = 3;
        state.playerStats[player.toLowerCase()].bonusBombsLeft = 3;
      }

      
      // Retirer le bonus
      bonus.element.remove();
      state.bonuses.splice(i, 1);
    }
  }
}