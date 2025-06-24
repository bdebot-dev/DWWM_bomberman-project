import { state } from './state.js';
import { arrows, zqsd, step } from './constants.js';
import { playerRed, playerBlue, livesRedSpan, livesBlueSpan } from './dom.js';
import { isBombAt, placeBomb } from './bombs.js';
import { isObstacleAt } from './obstacles.js';
import { getMaxX, getMaxY } from './utils.js';
import { endGame } from './game.js';
import { checkBonusCollision } from './bonus.js';

const INVINCIBILITY_DURATION = 5000; // 5 secondes

export function activateInvincibility(player) {
  // Sélectionne l'élément du joueur
  const playerElement = player === 'Red' ? playerRed : playerBlue;
  // Ajoute la classe CSS pour l'effet visuel
  playerElement.classList.add('invincible');
  // Stocke l'état d'invincibilité dans le state (optionnel mais recommandé pour la logique)
  state.playerStats[player.toLowerCase()].invincible = true;

  setTimeout(() => {
    playerElement.classList.remove('invincible');
    state.playerStats[player.toLowerCase()].invincible = false;
  }, INVINCIBILITY_DURATION);
}

export function handlePlayerMove(event) {
  if (state.gameOver) return;

  // Red bomb (Space)
  if (event.key === ' ') {
    event.preventDefault();
    placeBomb('red');
    return;
  }
  // Blue bomb ('a' or 'A')
  if (event.key.toLowerCase() === 'a') {
    event.preventDefault();
    placeBomb('blue');
    return;
  }

  // Red player movement (Arrow keys)
  if (arrows.includes(event.key)) {
    event.preventDefault();
    
    let stepX = 0;
    let stepY = 0;
    switch (event.key) {
      case 'ArrowLeft':  stepX = -step; break;
      case 'ArrowRight': stepX = step; break;
      case 'ArrowUp':    stepY = -step; break;
      case 'ArrowDown':  stepY = step; break;
    }

    // Déterminer le nombre de déplacements
    const moves = state.playerStats.red.speedBoostMoves > 0 ? 2 : 1;
    let newX = state.posRed.x;
    let newY = state.posRed.y;

    // Tenter jusqu'à 2 déplacements
    for (let i = 0; i < moves; i++) {
      const nextX = newX + stepX;
      const nextY = newY + stepY;
      
      
      if (
        nextX >= 0 && nextX <= getMaxX() &&
        nextY >= 0 && nextY <= getMaxY() &&
        !(nextX === state.posBlue.x && nextY === state.posBlue.y) &&
        (
          state.playerStats.red.ghostMode ||
          (!isBombAt(nextX, nextY) && !isObstacleAt(nextX, nextY))
        )
      ) {
        // Mise à jour intermédiaire de la position
        const prevX = newX;
        const prevY = newY;
        newX = nextX;
        newY = nextY;


        
        // Mettre à jour temporairement la position dans le state
        state.posRed.x = newX;
        state.posRed.y = newY;
        playerRed.style.left = newX + 'px';
        playerRed.style.top = newY + 'px';

        // Vérifier les collisions sur la case intermédiaire
        checkBonusCollision('Red');
      } else {
        // Restaurer la position précédente si le mouvement est bloqué
        state.posRed.x = prevX;
        state.posRed.y = prevY;
        playerRed.style.left = prevX + 'px';
        playerRed.style.top = prevY + 'px';
        break;
      }
    }


    // Mise à jour position
    state.posRed.x = newX;
    state.posRed.y = newY;
    playerRed.style.left = newX + 'px';
    playerRed.style.top = newY + 'px';
    
    // Décrémenter le compteur si bonus actif
    if (state.playerStats.red.speedBoostMoves > 0) {
      state.playerStats.red.speedBoostMoves--;
    }
    
    checkBonusCollision('Red');
    return;
  }



    // Blue player movement (ZQSD)
    const key = event.key.toLowerCase();
    if (zqsd.includes(key)) {
      event.preventDefault();
      
      let stepX = 0;
      let stepY = 0;
      switch (key) {
        case 'q': stepX = -step; break;
        case 'd': stepX = step; break;
        case 'z': stepY = -step; break;
        case 's': stepY = step; break;
      }

      const moves = state.playerStats.blue.speedBoostMoves > 0 ? 2 : 1;
      let currentX = state.posBlue.x;
      let currentY = state.posBlue.y;

      for (let i = 0; i < moves; i++) {
        const nextX = currentX + stepX;
        const nextY = currentY + stepY;
        
        // Vérifier la validité de la position
        if (
          nextX >= 0 && nextX <= getMaxX() &&
          nextY >= 0 && nextY <= getMaxY() &&
          !(nextX === state.posRed.x && nextY === state.posRed.y) &&
          (
            state.playerStats.blue.ghostMode ||
            (!isBombAt(nextX, nextY) && !isObstacleAt(nextX, nextY))
          )
        ) {
          currentX = nextX;
          currentY = nextY;

          // Mise à jour temporaire de la position
          state.posBlue.x = currentX;
          state.posBlue.y = currentY;
          playerBlue.style.left = currentX + 'px';
          playerBlue.style.top = currentY + 'px';

          // Vérifier les collisions à chaque étape
          checkBonusCollision('Blue');

          // Synchroniser après le bonus
          currentX = state.posBlue.x;
          currentY = state.posBlue.y;
        } else {
          break;
        }
      }

      // Décrémenter le compteur si bonus actif
      if (state.playerStats.blue.speedBoostMoves > 0) {
        state.playerStats.blue.speedBoostMoves--;
      }
    }



}

export function updatePlayerColors() {
  // Red player
  playerRed.classList.remove('player-red-base', 'player-red-2', 'player-red-1');
  if (state.livesRed === 2) {
    playerRed.classList.add('player-red-2');
  } else if (state.livesRed === 1) {
    playerRed.classList.add('player-red-1');
  } else {
    playerRed.classList.add('player-red-base');
  }
  // Blue player
  playerBlue.classList.remove('player-blue-base', 'player-blue-2', 'player-blue-1');
  if (state.livesBlue === 2) {
    playerBlue.classList.add('player-blue-2');
  } else if (state.livesBlue === 1) {
    playerBlue.classList.add('player-blue-1');
  } else {
    playerBlue.classList.add('player-blue-base');
  }
}

export function updateLives() {
  livesRedSpan.textContent = `${state.livesRed}`;
  livesBlueSpan.textContent = `${state.livesBlue}`;
}

export function checkPlayerHit(x, y) {
  if (state.gameOver) return;

  // Red player hit
  if (
    state.posRed.x === x &&
    state.posRed.y === y &&
    !state.playerStats.red.invincible
  ) {
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
  }

  // Blue player hit
  if (
    state.posBlue.x === x &&
    state.posBlue.y === y &&
    !state.playerStats.blue.invincible // ← Ajouté !
  ) {
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

