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
      // Ne rien faire si le joueur est invincible
      if (state.playerStats[playerKey].invincible) {
        // Optionnel : feedback visuel ou sonore pour montrer l'immunité
        // Par exemple : playerRed.classList.add('immune-flash');
        // setTimeout(() => playerRed.classList.remove('immune-flash'), 200);
      } else {
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
      if (bonus.element.dataset.type === 'speed-boost') {
        state.playerStats[playerKey].speedBoostMoves = 10;
        // console.log(`${player} collected Speed Boost! Moves left: 10`);
      }

      bonus.element.remove();
      state.bonuses.splice(i, 1);
    }
  }

  if (bonus.element.dataset.type === 'ghost') {
    state.playerStats[playerKey].ghostMode = true;
    const playerElem = player === 'Red' ? playerRed : playerBlue;
    playerElem.classList.add('ghost-mode');
    
    setTimeout(() => {
      state.playerStats[playerKey].ghostMode = false;
      playerElem.classList.remove('ghost-mode');
      
      // Vérifier la position après la fin du mode fantôme
      const x = state[`pos${player}`].x;
      const y = state[`pos${player}`].y;
      
      if (isObstacleAt(x, y)) {
        // Trouver la case libre la plus proche
        const safePos = findNearestSafePosition(x, y);
        if (safePos) {
          state[`pos${player}`] = safePos;
          playerElem.style.left = safePos.x + 'px';
          playerElem.style.top = safePos.y + 'px';
        } else {
          // Si aucune case libre, tuer le joueur
          handlePlayerDeath(player);
        }
      }
    }, 10000); // 10 secondes
  }



}
