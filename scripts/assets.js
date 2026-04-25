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
  run:    { frames: 4, fw: 32, fh: 32 },  // OstrichRun.png   128 × 32
  jump:   { frames: 2, fw: 32, fh: 32 },  // OstrichJump.png   64 × 32
  death:  { frames: 4, fw: 80, fh: 32 },  // OstrichDeath.png 320 × 32
  down:   { frames: 4, fw: 32, fh: 32 },  // OstrichDown.png  128 × 32
  falcon: { frames: 4, fw: 32, fh: 32 },  // falconAnim.png   128 × 32
};

export const GAME_CONFIG = {
  // Canvas
  CANVAS_W:    800,
  CANVAS_H:    300,

  // World geometry
  SCALE:       2.5,    // pixels: upscale 32×32 sprites to ~90×90 on screen
  GROUND_PX:   268,    // y-coordinate of the ground surface (H - 30)
  OSTRICH_X:   80,     // fixed horizontal position of the ostrich

  // Derived sprite dimensions (computed once, stored for convenience)
  OSTRICH_W:   32 * 2.5,   // = 89.6
  OSTRICH_H:   32 * 2.5,   // = 89.6

  // Background tile sizes (original PNG dimensions)
  BG_W: 254,
  BG_H: 144,
  GND_W: 254,
  GND_H: 16,

  // Physics
  GRAVITY:     0.8,    // px/frame² added to vy every frame
  JUMP_V:     -13.5,    // vy on first jump (negative = upward)
  DUCK_SHRINK: 0.65,   // hitbox shrinks to 65% height when ducking

  // Speed
  BASE_SPEED:  4.5,    // starting scroll speed (px/frame)
  MAX_SPEED:   11.0,   // hard cap — game never goes faster
  ACCEL:       0.009, // speed added per frame (very gentle ramp)

  // Animation 
  ANIM_RATE:   9,      // advance one sprite frame every N game-frames
  //   60 fps ÷ 5 = 12 animation frames/sec

  // Obstacle spacing
  MIN_GAP:     220,    // minimum px between obstacle right edge → next left edge
  MAX_GAP:     300,    // maximum px (random in this range, then scaled by speed)
  MIN_GAP_ABS: 200,    // absolute floor — gap never shrinks below this

  // Collision leniency
  HIT_SHRINK:  5,      // ostrich hitbox shrunk by this many px on each side (forgiveness)
};


export const GameState = {
  // Flow
  state:      'idle',  // 'idle' | 'running' | 'dead'
  frame:      0,       // incremented every game-loop tick
  animId:     null,    // return value of requestAnimationFrame (for cancel)

  // Score / speed
  score:      0,
  best:       0,
  speed:      4.5,     // starts at BASE_SPEED

  // Ostrich physics flag (read by ostrich.js and obstacle.js)
  isDucking:  false,

  // Scroll offsets for tiled layers
  bgX:        0,
  gndX:       0,

  // Obstacle tracking
  obstacles:  [],      // array of Obstacle instances
  lastObstX:  700 + 100, // x of the right edge of the last spawned obstacle
  nextGap:    400,     // distance until next obstacle spawns
};


