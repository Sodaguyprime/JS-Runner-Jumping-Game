export const ASSET_PATHS = {
  bg:     './assets/Backgrounds.png',
  ground: './assets/Ground.png',
  run:    './assets/OstrichRun.png',
  jump:   './assets/OstrichJump-Sheet.png',
  death:  './assets/OstrichDeath.png',
  down:   './assets/Ostrich with its head down.png',
  falcon: './assets/falconAnim.png',
  rock1:  './assets/Rock1.png',
  rock2:  './assets/Rock2.png',
  rock3:  './assets/Rock3.png',
  tree1:  './assets/tree1.png',
  tree2:  './assets/tree2.png',
};

export const LoadedImages = {};

export const SHEETS = {
  run:    { frames: 4, fw: 32, fh: 32 },
  jump:   { frames: 2, fw: 32, fh: 32 },
  death:  { frames: 4, fw: 80, fh: 32 },
  down:   { frames: 4, fw: 32, fh: 32 },
  falcon: { frames: 4, fw: 32, fh: 32 },
};

export const GAME_CONFIG = {
  CANVAS_W:    800,
  CANVAS_H:    300,
  SCALE:       2.5,
  GROUND_PX:   268,
  OSTRICH_X:   80,
  OSTRICH_W:   32 * 2.5,
  OSTRICH_H:   32 * 2.5,
  BG_W:        254,
  BG_H:        144,
  GND_W:       254,
  GND_H:       16,
  GRAVITY:     0.5,
  JUMP_V:      -13.5,
  DUCK_SHRINK: 0.65,

  BASE_SPEED:  2,    
  MAX_SPEED:   9.0,    
  ACCEL:       0.002,

  ANIM_RATE:   9,
  MIN_GAP:     220,
  MAX_GAP:     300,
  MIN_GAP_ABS: 200,
  HIT_SHRINK:  5,
};

export const GameState = {
  state:      'idle',
  frame:      0,
  animId:     null,
  score:      0,
  best:       0,
  speed:      3.5,
  isDucking:  false,
  bgX:        0,
  gndX:       0,
  obstacles:  [],
  lastObstX:  800,
  nextGap:    400,
};