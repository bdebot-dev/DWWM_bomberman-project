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
    let [newX, newY] = [state.posRed.x, state.posRed.y];
    switch (event.key) {
      case 'ArrowLeft':  newX = Math.max(0, state.posRed.x - step); break;
      case 'ArrowRight': newX = Math.min(getMaxX(), state.posRed.x + step); break;
      case 'ArrowUp':    newY = Math.max(0, state.posRed.y - step); break;
      case 'ArrowDown':  newY = Math.min(getMaxY(), state.posRed.y + step); break;
    }
    if (
      !(newX === state.posBlue.x && newY === state.posBlue.y) &&
      !isBombAt(newX, newY) &&
      !isObstacleAt(newX, newY)
    ) {
      state.posRed.x = newX;
      state.posRed.y = newY;
      playerRed.style.left = state.posRed.x + 'px';
      playerRed.style.top = state.posRed.y + 'px';
      checkBonusCollision('Red'); // Vérification après déplacement
    }
    return;
  }

  // Blue player movement (ZQSD)
  const key = event.key.toLowerCase();
  if (zqsd.includes(key)) {
    event.preventDefault();
    let [newX, newY] = [state.posBlue.x, state.posBlue.y];
    switch (key) {
      case 'q': newX = Math.max(0, state.posBlue.x - step); break;
      case 'd': newX = Math.min(getMaxX(), state.posBlue.x + step); break;
      case 'z': newY = Math.max(0, state.posBlue.y - step); break;
      case 's': newY = Math.min(getMaxY(), state.posBlue.y + step); break;
    }
    if (
      !(newX === state.posRed.x && newY === state.posRed.y) &&
      !isBombAt(newX, newY) &&
      !isObstacleAt(newX, newY)
    ) {
      state.posBlue.x = newX;
      state.posBlue.y = newY;
      playerBlue.style.left = state.posBlue.x + 'px';
      playerBlue.style.top = state.posBlue.y + 'px';
      checkBonusCollision('Blue'); // Vérification après déplacement
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

