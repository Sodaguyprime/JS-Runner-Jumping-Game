import { LoadedImages, GAME_CONFIG } from './assets.js';

const { CANVAS_W, CANVAS_H } = GAME_CONFIG;

// ── Background ────────────────────────────────────────────────────────────────

export const bg = {
  x: 0,
};

export function updateBg(speed) {
  // Background drifts slowly for a parallax feel (3% of game speed)
  bg.x -= speed * 0.03;
  if (bg.x <= -CANVAS_W) bg.x = 0;
}

export function drawBg(ctx) {
  ctx.drawImage(LoadedImages.bg, bg.x, 0, CANVAS_W, CANVAS_H);
  ctx.drawImage(LoadedImages.bg, bg.x + CANVAS_W, 0, CANVAS_W, CANVAS_H);
}

// ── Ground ────────────────────────────────────────────────────────────────────

const GROUND_H = 32;

export const ground = {
  x: 0,
  y: CANVAS_H - GROUND_H,
};

export function updateGround(speed) {
  ground.x -= speed;
  if (ground.x <= -CANVAS_W) ground.x = 0;
}

export function drawGround(ctx) {
  ctx.drawImage(LoadedImages.ground, ground.x, ground.y, CANVAS_W, GROUND_H);
  ctx.drawImage(LoadedImages.ground, ground.x + CANVAS_W, ground.y, CANVAS_W, GROUND_H);
}