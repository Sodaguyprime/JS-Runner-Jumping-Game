import { GAME_CONFIG, SHEETS, LoadedImages, GameState } from './assets.js';

const {
  OSTRICH_X, OSTRICH_W, OSTRICH_H,
  GROUND_PX, GRAVITY, JUMP_V,
  DUCK_SHRINK, ANIM_RATE,
} = GAME_CONFIG;

// ── Ostrich state ──────────────────────────────────────────────────────────────
export const ostrich = {
  x:          OSTRICH_X,
  y:          GROUND_PX - OSTRICH_H,
  vy:         0,
  onGround:   true,
  jumps:      1,
  animFrame:  0,
  animTick:   0,
  deathTick:  0,
  deathFrame: 0,
};

// ── Hitbox (computed on the fly) ───────────────────────────────────────────────
export function getOstrichHitbox() {
  const hitW = GameState.isDucking ? OSTRICH_W * 1.10 : OSTRICH_W * 0.55;
  const hitH = GameState.isDucking ? OSTRICH_H * 0.38 : OSTRICH_H * 0.80;
  const hitX = ostrich.x - 10 + (OSTRICH_W - hitW) / 2;
  const hitY = ostrich.y - 10 + (OSTRICH_H - hitH);
  return { hx: hitX, hy: hitY, hw: hitW, hh: hitH };
}

// ── Actions ────────────────────────────────────────────────────────────────────
export function jumpOstrich() {
  if (!ostrich.onGround && ostrich.jumps <= 0) return;
  if (ostrich.onGround) {
    ostrich.vy = JUMP_V;
    ostrich.jumps = 1;
  }
  ostrich.onGround = false;
  GameState.isDucking = false;
}

export function duckOstrich() {
  if (ostrich.onGround) GameState.isDucking = true;
}

export function unduckOstrich() {
  GameState.isDucking = false;
}

export function resetOstrich() {
  ostrich.x          = OSTRICH_X;
  ostrich.y          = GROUND_PX - OSTRICH_H;
  ostrich.vy         = 0;
  ostrich.onGround   = true;
  ostrich.jumps      = 1;
  ostrich.animFrame  = 0;
  ostrich.animTick   = 0;
  ostrich.deathTick  = 0;
  ostrich.deathFrame = 0;
}

// ── Update (physics + animation) ───────────────────────────────────────────────
export function updateOstrich() {
  if (GameState.state === 'dead') {
    ostrich.deathTick++;
    if (ostrich.deathTick % 8 === 0) {
      ostrich.deathFrame = Math.min(3, ostrich.deathFrame + 1);
    }
    return;
  }

  // Physics
  ostrich.vy += GRAVITY;
  ostrich.y  += ostrich.vy;

  // Ground collision
  const groundY = GROUND_PX - OSTRICH_H;
  if (ostrich.y >= groundY) {
    ostrich.y        = groundY;
    ostrich.vy       = 0;
    ostrich.onGround = true;
    ostrich.jumps    = 1;
  }

  // Animation
  ostrich.animTick++;
  if (ostrich.animTick >= ANIM_RATE) {
    ostrich.animTick = 0;
    if (ostrich.onGround) {
      const totalFrames = GameState.isDucking ? SHEETS.down.frames : SHEETS.run.frames;
      ostrich.animFrame = (ostrich.animFrame + 1) % totalFrames;
    } else {
      ostrich.animFrame = Math.min(1, ostrich.animFrame);
    }
  }
}

// ── Draw ───────────────────────────────────────────────────────────────────────
export function drawOstrich(ctx) {
  ctx.save();
  ctx.imageSmoothingEnabled = false;

  const { state, isDucking } = GameState;

  if (state === 'dead') {
    const { fw, fh } = SHEETS.death;
    ctx.drawImage(
      LoadedImages.death,
      ostrich.deathFrame * fw, 0, fw, fh,
      ostrich.x, GROUND_PX - OSTRICH_H,
      OSTRICH_W, OSTRICH_H
    );

  } else if (!ostrich.onGround) {
    const { fw, fh, frames } = SHEETS.jump;
    const fi = Math.min(ostrich.animFrame, frames - 1);
    ctx.drawImage(
      LoadedImages.jump,
      fi * fw, 0, fw, fh,
      ostrich.x, ostrich.y, OSTRICH_W, OSTRICH_H
    );

  } else if (isDucking) {
    const { fw, fh, frames } = SHEETS.down;
    const fi   = ostrich.animFrame % frames;
    const duckH = OSTRICH_H * DUCK_SHRINK;
    const duckY = GROUND_PX - duckH;
    ctx.drawImage(
      LoadedImages.down,
      fi * fw, 0, fw, fh,
      ostrich.x, duckY, OSTRICH_W, duckH
    );

  } else {
    const { fw, fh, frames } = SHEETS.run;
    const fi = ostrich.animFrame % frames;
    ctx.drawImage(
      LoadedImages.run,
      fi * fw, 0, fw, fh,
      ostrich.x, ostrich.y, OSTRICH_W, OSTRICH_H
    );
  }

  ctx.restore();
}

// ── Debug: draw ostrich hitbox ─────────────────────────────────────────────────
export function drawOstrichHitbox(ctx) {
  const { hx, hy, hw, hh } = getOstrichHitbox();
  ctx.save();

  ctx.strokeStyle = 'blue';
  ctx.lineWidth   = 1;
  ctx.strokeRect(ostrich.x, ostrich.y, OSTRICH_W, OSTRICH_H);

  // Actual hitbox (green)
  ctx.strokeStyle = 'lime';
  ctx.lineWidth   = 1.5;
  ctx.strokeRect(hx, hy, hw, hh);

  ctx.restore();
}