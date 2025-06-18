import { GRID_SIZE } from './constants.js';
import { getMaxX, getMaxY } from './utils.js';

export const state = {
  livesRed: 3,
  livesBlue: 3,
  gameOver: false,
  bombRed: null,
  bombBlue: null,
  destructibleObstacles: [],
  obstacleGrid: Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(null)),
  posRed: { x: 0, y: 0 },
  posBlue: { x: getMaxX(), y: getMaxY() }
};
