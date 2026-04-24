// ─────────────────────────────────────────────────────────────────────────────
// obstacle.js
//
// Two exports:
//
//   class Obstacle
//     Represents a single obstacle on screen (rock, tree, or falcon).
//     Holds its own position, size, type metadata, and animation state.
//     Knows how to move itself left and how to draw itself.
//
//   class ObstacleManager
//     Owns the array of active obstacles.
//     Responsible for spawning new ones, updating all of them each frame,
//     culling off-screen ones, and exposing the list for collision checks.
// ─────────────────────────────────────────────────────────────────────────────

import { GAME_CONFIG, LoadedImages, GameState } from './assets.js';

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
  // Ground obstacles — player must jump over them
  { img: 'rock1', w: 23, h: 15, aerial: false },
  { img: 'rock2', w: 32, h: 32, aerial: false },
  { img: 'rock3', w: 23, h: 15, aerial: false },

  // Aerial obstacle — player must duck under it
  {
    img: 'falcon',
    w: 22, h: 22, 
    aerial: true,
    altitudes: [0.55, 0.65, 0.75],
  },
];
 
export class Obstacle { 
  // type     — one entry from OBSTACLE_TYPES
  // x        — starting x position (off the right edge of the canvas)
  // scale    — random visual scale factor (2.0 – 2.6×)
  constructor(type, x, scale) {
    this.type = type;

    // Rendered dimensions after applying the random scale
    this.w = type.w * scale;
    this.h = type.h * scale;

    // Horizontal position: placed just off the right edge of the canvas
    this.x = x;

    // Vertical position
    if (type.aerial) {
      // Pick one altitude at random from the type's list
      const altFraction = type.altitudes[
        Math.floor(Math.random() * type.altitudes.length)
      ];
      this.y = CANVAS_H * altFraction;
    } else {
      // Ground obstacle: bottom of sprite sits exactly on the ground line
      this.y = GROUND_PX - this.h;
    }

    // Falcon wing-flap animation
    this.animFrame = 0;  // which of the 4 falcon frames to draw
    this.animTick  = 0;  // counts game-frames; flips frame every 4 ticks
    this.scored = false; 
  }

  // ── update(speed) ─────────────────────────────────────────────────────────
  //
  // Move left by the current game speed and advance falcon animation.
  // Called by ObstacleManager.update( ) once per frame.
  //
  update(speed) {
    this.x -= speed;   // scroll left

    // Falcon-only: cycle through 4 wing-flap frames
    if (this.type.aerial) {
      this.animTick++;
      if (this.animTick >= 10) {
        this.animTick  = 0;
        this.animFrame = (this.animFrame + 1) % 4;  // cycle 0→1→2→3→0
      }
    }
  }

  // ── draw(ctx) ─────────────────────────────────────────────────────────────
  //
  // Draws the obstacle on the canvas.
  // Falcon uses its animation frame; ground obstacles are single-frame images.
  //
  draw(ctx) {
    ctx.save();
    ctx.imageSmoothingEnabled = false;

    if (this.type.aerial) {
      // Slice the correct falcon frame (each frame is 32px wide in the sheet)
      const fw = 32;
      const fh = 32;
      ctx.drawImage(
        LoadedImages.falcon,
        this.animFrame * fw, 0, fw, fh,   // source: one frame
        this.x, this.y, this.w, this.h   // destination: scaled on canvas
      );
    } else {
      // Ground obstacle: draw the entire image (no slicing needed)
      const { w, h } = this.type;         // original source dimensions
      ctx.drawImage(
        LoadedImages[this.type.img],
        0, 0, w, h,                       // source: full image
        this.x, this.y, this.w, this.h   // destination: scaled on canvas
      );
    }

    ctx.restore();
  }

  // ── isOffScreen() ─────────────────────────────────────────────────────────
  //
  // Returns true when the obstacle has fully scrolled past the left edge.
  // Used by ObstacleManager to remove it from the active list.
  //
  isOffScreen() {
    return this.x + this.w < -20;
  }
}

// ── class ObstacleManager ─────────────────────────────────────────────────────
export class ObstacleManager {
  constructor(ctx) {
    this.ctx = ctx;
    // Active obstacles on screen.  Populated by spawn(), consumed by collides().
    this.obstacles = [];

    // x of the right edge of the last spawned obstacle.
    // New obstacles are placed at lastObstX + nextGap.
    this.lastObstX = CANVAS_W + 100;

    // Pixels until the next obstacle should be spawned.
    // Recalculated after each spawn based on current speed.
    this.nextGap = MIN_GAP + 80;
  }

  // ── reset() ───────────────────────────────────────────────────────────────
  //
  // Clears all obstacles and resets spawn tracking for a new game.
  //
  reset() {
    this.obstacles = [];
    this.lastObstX = CANVAS_W + 50;
    this.nextGap   = MIN_GAP + 80;
  }

  // ── _pickType() ───────────────────────────────────────────────────────────
  //
  // Returns a random OBSTACLE_TYPES entry.
  // 20% chance of a falcon, 80% chance of a ground obstacle.
  //
  _pickType() {
    if (Math.random() < 0.20) {
      return OBSTACLE_TYPES[3]; // index 5 = falcon
    }
    // Randomly pick one of the 5 ground types
    return OBSTACLE_TYPES[Math.floor(Math.random() * 5)];
  }

  // ── _spawn(speed) ─────────────────────────────────────────────────────────
  //
  // Creates one (or two clustered) new Obstacle(s) and pushes them into
  // this.obstacles.  Updates lastObstX and recalculates nextGap.
  //
  _spawn(speed) {
    const type  = this._pickType();
    const scale = 2.0 + Math.random() * 0.6;  // random size 2.0× – 2.6×

    // Ground obstacles have a 25% chance of spawning in a close cluster of 2.
    // Aerial obstacles always appear alone.
    const count = (!type.aerial && Math.random() < 0.25) ? 2 : 1;

    for (let i = 0; i < count; i++) {
      // Each extra item in a cluster is placed 6px past the previous one
      const spawnX = this.lastObstX + this.nextGap + i * (type.w * scale + 6);

      const obs = new Obstacle(type, spawnX, scale);
      this.obstacles.push(obs);

      // Track the right edge of the furthest obstacle
      this.lastObstX = obs.x + obs.w;
    }

    // ── Gap formula ───────────────────────────────────────────────────────
    // At high speed the player has less time to react, so we shrink the gap
    // proportionally.  speedFactor is < 1 at higher speeds, so the raw gap
    // (in pixels) shrinks — but because the game scrolls faster, the player's
    // reaction TIME stays roughly constant.
    //
    //   nextGap = randomGap × (BASE_SPEED / currentSpeed)
    //
    const speedFactor = BASE_SPEED / speed;
    const rawGap      = MIN_GAP + Math.random() * (MAX_GAP - MIN_GAP);
    this.nextGap      = Math.max(MIN_GAP_ABS, rawGap * speedFactor);
  }

  // ── update(speed) ─────────────────────────────────────────────────────────
  //
  // Main per-frame update:
  //   1. Move every obstacle left.
  //   2. Remove obstacles that have scrolled off the left edge.
  //   3. Spawn a new obstacle when the rightmost one has entered the canvas
  //      enough that nextGap has elapsed.
  //
  update(speed) {
    // Move + animate each obstacle
    for (const obs of this.obstacles) {
      obs.update(speed);
    }

    // Remove off-screen obstacles (filter returns a new array)
    this.obstacles = this.obstacles.filter(obs => !obs.isOffScreen());

    // Find the x of the rightmost obstacle's right edge
    const rightMost = this.obstacles.reduce(
      (max, obs) => Math.max(max, obs.x + obs.w),
      -Infinity
    );

    // Spawn when a gap of nextGap px has opened past the right edge
    if (rightMost < CANVAS_W + this.nextGap) {
      this._spawn(speed);
    }
  }

  // ── draw(ctx) ─────────────────────────────────────────────────────────────
  //
  // Draws every active obstacle.  Called by game.js after drawGround().
  //
  draw() {
    for (const obs of this.obstacles) {
      obs.draw(this.ctx);
    }
  }

  // ── getAll() ──────────────────────────────────────────────────────────────
  //
  // Returns the active obstacle array so collision.js can iterate over it.
  //
  getAll() {
    return this.obstacles;
  }
}