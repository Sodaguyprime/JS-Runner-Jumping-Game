import { GAME_CONFIG } from './assets.js';
import { getOstrichHitbox } from './ostrich.js';
import { getAllObstacles } from './obstacle.js';

const { HIT_SHRINK } = GAME_CONFIG;

// Returns true if the ostrich hitbox overlaps any obstacle (AABB test)
export function collides() {
  const { hx, hy, hw, hh } = getOstrichHitbox();

  // Shrink inward for forgiveness
  const x = hx + HIT_SHRINK;
  const y = hy + HIT_SHRINK;
  const w = hw - HIT_SHRINK * 2;
  const h = hh - HIT_SHRINK * 2;

  for (const obs of getAllObstacles()) {
    const overlapsX = x < obs.x + obs.w && x + w > obs.x;
    const overlapsY = y < obs.y + obs.h && y + h > obs.y;
    if (overlapsX && overlapsY) return true;
  }

  return false;
}