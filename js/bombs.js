import { playground } from './dom.js';
import { step } from './constants.js';
import { state } from './state.js';
import { isObstacleAt } from './obstacles.js';
import { checkPlayerHit } from './players.js';
import { getMaxX, getMaxY } from './utils.js';

export function placeBomb(player) {
  const playerType = player.toLowerCase();
  const stats = state.playerStats[playerType];

  if (stats.activeBombs >= stats.maxBombs) return;

  const bomb = document.createElement('div');
  bomb.dataset.hasBlastRadius = stats.blastRadius; // Stocke l'état du bonus
  bomb.className = 'bomb';
  const { x, y } = player === 'red' ? state.posRed : state.posBlue;
  bomb.style.left = x + 'px';
  bomb.style.top = y + 'px';
  playground.appendChild(bomb);

  

  if (player === 'red') state.bombRed = bomb;
  else state.bombBlue = bomb;

  stats.activeBombs++;

  // Si le joueur a un bonus actif, on le consomme
  if (stats.bonusBombsLeft > 0) {
    stats.bonusBombsLeft--;
    // Quand le bonus est consommé, on repasse à 1 bombe max
    if (stats.bonusBombsLeft === 0) {
      stats.maxBombs = 1;
    }
  }

  setTimeout(() => {
    explodeBomb(bomb); // L’explosion doit être appelée AVANT bomb.remove()
    bomb.remove();
    if (player === 'red') state.bombRed = null;
    else state.bombBlue = null;
    stats.activeBombs--;
  }, 1500);

}

export function explodeBomb(bombElement) {
  const bombX = parseInt(bombElement.style.left);
  const bombY = parseInt(bombElement.style.top);

    // Ajouter la classe shake
  const playground = document.getElementById('playground');
  playground.classList.add('playground-shake');

  // Retirer la classe après l'animation
  setTimeout(() => {
    playground.classList.remove('playground-shake');
  }, 800);


  
  let explosionCells = [];
  const hasBlastRadius = bombElement.dataset.hasBlastRadius === 'true';

  if (hasBlastRadius) {
    // Grille 3x3 (9 cellules)
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        explosionCells.push({ 
          x: bombX + dx * step, 
          y: bombY + dy * step 
        });
      }
    }
  } else {
    // Croix classique (5 cellules)
    explosionCells = [
      { x: bombX, y: bombY },
      { x: bombX - step, y: bombY },
      { x: bombX + step, y: bombY },
      { x: bombX, y: bombY - step },
      { x: bombX, y: bombY + step }
    ];
  }

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

      // Destroy a destructible obstacle
      const gridX = cell.x / step;
      const gridY = cell.y / step;
      if (state.obstacleGrid[gridY]?.[gridX] === 'destructible') {
        const obstacle = state.destructibleObstacles.find(o => 
          parseInt(o.style.left) === cell.x && 
          parseInt(o.style.top) === cell.y
        );
        
        if (obstacle) {
          obstacle.remove();
          state.obstacleGrid[gridY][gridX] = null;

          // 1 chance sur 4 de générer un bonus
          if (Math.random() < 1/4) {
            const bonus = document.createElement('div');
            bonus.className = 'bonus';

            // Répartition des types de bonus (25% chacun)
            const rand = Math.random();
            let bonusType;
            if (rand < 0.2) {
              bonusType = 'deadly';
            } else if (rand < 0.4) {
              bonusType = 'multi-bomb';
            } else if (rand < 0.6) {
              bonusType = 'invincibility';
            } else if (rand < 0.8) {
              bonusType = 'blast-radius';
            } else {
              bonusType = 'speed-boost';
            }

            bonus.classList.add(bonusType);
            bonus.dataset.type = bonusType;

            bonus.style.left = cell.x + 'px';
            bonus.style.top = cell.y + 'px';
            playground.appendChild(bonus);
            state.bonuses.push({ element: bonus, x: cell.x, y: cell.y });
          }

        }
      }
    }
  });
}


export function isBombAt(x, y) {
  if (state.bombRed && parseInt(state.bombRed.style.left) === x && parseInt(state.bombRed.style.top) === y) return true;
  if (state.bombBlue && parseInt(state.bombBlue.style.left) === x && parseInt(state.bombBlue.style.top) === y) return true;
  return false;
}

// console.log(state)