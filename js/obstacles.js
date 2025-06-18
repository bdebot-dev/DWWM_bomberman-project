import { GRID_SIZE, step } from './constants.js';
import { playground } from './dom.js';
import { state } from './state.js';

// Generate obstacles with safe zones around players
export function generateObstacles() {
  const cells = [];
  const safeZones = [
    { x: 0, y: 0, radius: 1.5 },
    { x: GRID_SIZE - 1, y: GRID_SIZE - 1, radius: 1.5 }
  ];

  for (let x = 0; x < GRID_SIZE; x++) {
    for (let y = 0; y < GRID_SIZE; y++) {
      const inSafeZone = safeZones.some(zone => 
        Math.abs(x - zone.x) <= zone.radius && 
        Math.abs(y - zone.y) <= zone.radius
      );
      if (!inSafeZone) cells.push({x, y});
    }
  }

  // Shuffle cells
  for (let i = cells.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cells[i], cells[j]] = [cells[j], cells[i]];
  }

  // Place obstacles
  const indestructibleCount = 80;
  const destructibleCount = 160;
  state.destructibleObstacles = [];
  state.obstacleGrid = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(null));
  document.querySelectorAll('.obstacle').forEach(o => o.remove());

  cells.slice(0, indestructibleCount + destructibleCount).forEach((cell, index) => {
    const x = cell.x * step;
    const y = cell.y * step;
    const type = index < indestructibleCount ? 'indestructible' : 'destructible';
    const obstacle = document.createElement('div');
    obstacle.className = `obstacle ${type}`;
    obstacle.style.left = x + 'px';
    obstacle.style.top = y + 'px';
    playground.appendChild(obstacle);

    state.obstacleGrid[cell.y][cell.x] = type;
    if (type === 'destructible') state.destructibleObstacles.push(obstacle);
  });
}

export function isObstacleAt(x, y) {
  const gridX = x / step;
  const gridY = y / step;
  return state.obstacleGrid[gridY]?.[gridX];
}
