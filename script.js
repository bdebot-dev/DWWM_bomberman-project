const playground = document.getElementById('playground');
const playerRed = document.getElementById('player_red');
const playerBlue = document.getElementById('player_blue');
const step = 24;

// Limites dynamiques
function getMaxX() {
  return playground.clientWidth - playerRed.clientWidth;
}
function getMaxY() {
  return playground.clientHeight - playerRed.clientHeight;
}

// Positions initiales
let posRed = { x: 0, y: 0 };
let posBlue = { x: getMaxX(), y: getMaxY() };

// Mouvements
const arrows = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
const zqsd = ['z', 'q', 's', 'd'];

document.addEventListener('keydown', function(event) {
  // Joueur rouge (flèches)
  if (arrows.includes(event.key)) {
    event.preventDefault();
    switch(event.key) {
      case 'ArrowLeft':
        posRed.x = Math.max(0, posRed.x - step);
        break;
      case 'ArrowRight':
        posRed.x = Math.min(getMaxX(), posRed.x + step);
        break;
      case 'ArrowUp':
        posRed.y = Math.max(0, posRed.y - step);
        break;
      case 'ArrowDown':
        posRed.y = Math.min(getMaxY(), posRed.y + step);
        break;
    }
    playerRed.style.left = posRed.x + 'px';
    playerRed.style.top = posRed.y + 'px';
  }

  // Joueur bleu (zqsd)
  if (zqsd.includes(event.key.toLowerCase())) {
    event.preventDefault();
    switch(event.key.toLowerCase()) {
      case 'q': // gauche
        posBlue.x = Math.max(0, posBlue.x - step);
        break;
      case 'd': // droite
        posBlue.x = Math.min(getMaxX(), posBlue.x + step);
        break;
      case 'z': // haut
        posBlue.y = Math.max(0, posBlue.y - step);
        break;
      case 's': // bas
        posBlue.y = Math.min(getMaxY(), posBlue.y + step);
        break;
    }
    playerBlue.style.left = posBlue.x + 'px';
    playerBlue.style.top = posBlue.y + 'px';
  }
});
