import { playground, playerRed } from './dom.js';

export function getMaxX() {
  return playground.clientWidth - playerRed.clientWidth;
}
export function getMaxY() {
  return playground.clientHeight - playerRed.clientHeight;
}

export function findNearestSafePosition(x, y) {
  const step = 24; // À adapter selon tes constantes
  const directions = [
    {dx: 0, dy: 0},   // Position actuelle
    {dx: step, dy: 0}, {dx: -step, dy: 0},
    {dx: 0, dy: step}, {dx: 0, dy: -step},
    {dx: step, dy: step}, {dx: -step, dy: -step},
    {dx: step, dy: -step}, {dx: -step, dy: step}
  ];
  
  for (const dir of directions) {
    const newX = x + dir.dx;
    const newY = y + dir.dy;
    
    if (
      newX >= 0 && newX <= getMaxX() &&
      newY >= 0 && newY <= getMaxY() &&
      !isObstacleAt(newX, newY) &&
      !isBombAt(newX, newY)
    ) {
      return {x: newX, y: newY};
    }
  }
  return null; // Aucune position sûre trouvée
}
