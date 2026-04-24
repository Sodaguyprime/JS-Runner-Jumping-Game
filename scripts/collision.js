// ─────────────────────────────────────────────────────────────────────────────
// collision.js
//
// Exports one function: collides(ostrich, obstacleManager)
//
// Uses AABB (Axis-Aligned Bounding Box) detection — the simplest correct
// rectangle-vs-rectangle test.  Two rectangles overlap if and only if they
// overlap on BOTH the x-axis AND the y-axis simultaneously.
// ─────────────────────────────────────────────────────────────────────────────

import { GAME_CONFIG } from './assets.js';

const { HIT_SHRINK } = GAME_CONFIG;

// ── collides(ostrich, obstacleManager) ──────────────────────────────────────────
//
// Returns true if the ostrich's hitbox overlaps any obstacle's bounding box.
//
// ostrich             — ostrich instance (exposes hitX, hitY, hitW, hitH getters)
// obstacleManager  — ObstacleManager instance (exposes getAll())
//
// HIT_SHRINK shrinks the ostrich hitbox by this many extra pixels on each side,
// providing a small buffer of "forgiveness" — a near-miss looks like a miss.
//
export function collides(ostrich, obstacleManager) {
  // Apply leniency: shrink ostrich hitbox inward by HIT_SHRINK on all sides
  const hx = ostrich.hitX + HIT_SHRINK;
  const hy = ostrich.hitY + HIT_SHRINK;
  const hw = ostrich.hitW - HIT_SHRINK * 2;
  const hh = ostrich.hitH - HIT_SHRINK * 2;

  for (const obs of obstacleManager.getAll()) {
    // AABB overlap test:
    //   Overlap on X: ostrich left < obs right  AND  ostrich right > obs left
    //   Overlap on Y: ostrich top  < obs bottom AND  ostrich bottom > obs top
    const overlapsX = hx < obs.x + obs.w && hx + hw > obs.x;
    const overlapsY = hy < obs.y + obs.h && hy + hh > obs.y;

    if (overlapsX && overlapsY) return true;  // collision!
  }

  return false;  // all clear
}
