import { playground, playerRed } from './dom.js';

export function getMaxX() {
  return playground.clientWidth - playerRed.clientWidth;
}
export function getMaxY() {
  return playground.clientHeight - playerRed.clientHeight;
}
