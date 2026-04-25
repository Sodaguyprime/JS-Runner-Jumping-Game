import { GAME_CONFIG, LoadedImages } from './assets.js';

const {
  CANVAS_W,
  CANVAS_H,
  GROUND_PX,
  BASE_SPEED,
  MIN_GAP,
  MAX_GAP,
  MIN_GAP_ABS,
} = GAME_CONFIG;

const OBSTACLE_TYPES = [
  { img: 'rock1', w: 23, h: 15, aerial: false },
  { img: 'rock2', w: 32, h: 32, aerial: false },
  { img: 'rock3', w: 23, h: 15, aerial: false },
  {
    img: 'falcon',
    w: 22, h: 22,
    aerial: true,
    altitudes: [0.55, 0.65, 0.75],
  },
];

// ── Module-level state ────────────────────────────────────────────────────────
let obstacles = [];
let lastObstX = CANVAS_W + 100;
let nextGap   = MIN_GAP + 80;

// ── Public API ────────────────────────────────────────────────────────────────
export function getAllObstacles() {
  return obstacles;
}

export function resetObstacles() {
  obstacles  = [];
  lastObstX  = CANVAS_W + 50;
  nextGap    = MIN_GAP + 80;
}

// ── Internal helpers ──────────────────────────────────────────────────────────
function pickType() {
  if (Math.random() < 0.20) return OBSTACLE_TYPES[3]; // falcon
  return OBSTACLE_TYPES[Math.floor(Math.random() * 3)]; // rocks only (indices 0-2)
}

function makeObstacle(type, x, scale) {
  const w = type.w * scale;
  const h = type.h * scale;

  let y;
  if (type.aerial) {
    const altFraction = type.altitudes[Math.floor(Math.random() * type.altitudes.length)];
    y = CANVAS_H * altFraction;
  } else {
    y = GROUND_PX - h;
  }

  return {
    type,
    w,
    h,
    x,
    y,
    animFrame: 0,
    animTick:  0,
    scored:    false,
  };
}

function spawn(speed) {
  const type  = pickType();
  const scale = 2.0 + Math.random() * 0.6;
  const count = (!type.aerial && Math.random() < 0.25) ? 2 : 1;

  for (let i = 0; i < count; i++) {
    const spawnX = lastObstX + nextGap + i * (type.w * scale + 6);
    const obs = makeObstacle(type, spawnX, scale);
    obstacles.push(obs);
    lastObstX = obs.x + obs.w;
  }

  const speedFactor = BASE_SPEED / speed;
  const rawGap      = MIN_GAP + Math.random() * (MAX_GAP - MIN_GAP);
  nextGap           = Math.max(MIN_GAP_ABS, rawGap * speedFactor);
}

// ── Per-frame update ──────────────────────────────────────────────────────────
export function updateObstacles(speed) {
  // Move + animate
  for (const obs of obstacles) {
    obs.x -= speed;
    if (obs.type.aerial) {
      obs.animTick++;
      if (obs.animTick >= 10) {
        obs.animTick  = 0;
        obs.animFrame = (obs.animFrame + 1) % 4;
      }
    }
  }

  // Cull off-screen
  obstacles = obstacles.filter(obs => obs.x + obs.w >= -20);

  // Spawn when needed
  const rightMost = obstacles.reduce(
    (max, obs) => Math.max(max, obs.x + obs.w),
    -Infinity
  );
  if (rightMost < CANVAS_W + nextGap) {
    spawn(speed);
  }
}

// ── Draw ──────────────────────────────────────────────────────────────────────
export function drawObstacles(ctx) {
  ctx.save();
  ctx.imageSmoothingEnabled = false;

  for (const obs of obstacles) {
    if (obs.type.aerial) {
      const fw = 32, fh = 32;
      ctx.drawImage(
        LoadedImages.falcon,
        obs.animFrame * fw, 0, fw, fh,
        obs.x, obs.y, obs.w, obs.h
      );
    } else {
      const { w, h } = obs.type;
      ctx.drawImage(
        LoadedImages[obs.type.img],
        0, 0, w, h,
        obs.x, obs.y, obs.w, obs.h
      );
    }
  }

  ctx.restore();
}