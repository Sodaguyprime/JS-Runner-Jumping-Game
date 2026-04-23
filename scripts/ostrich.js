// ─────────────────────────────────────────────────────────────────────────────
// ostrich.js
//
// Defines and exports the Ostrich class.
// The Ostrich is the ostrich the player controls.
//
// Responsibilities:
//   - Track position, velocity, animation state
//   - Respond to jump() and duck() / unduck() calls
//   - Apply gravity and ground collision each frame via update()
//   - Draw the correct sprite frame via draw(ctx)
//   - Expose a collision hitbox via computed getters
// ─────────────────────────────────────────────────────────────────────────────

import { GAME_CONFIG, SHEETS, LoadedImages, GameState } from './assets.js';


// Destructure the constants we use so the code reads cleanly
const {
  OSTRICH_X, OSTRICH_W, OSTRICH_H,
  GROUND_PX, GRAVITY, JUMP_V,
  DUCK_SHRINK, ANIM_RATE,
} = GAME_CONFIG;

export class Ostrich {
  constructor(ctx) {
    this.ctx = ctx
    this.x = OSTRICH_X;
    this.y = GROUND_PX - OSTRICH_H; // top of sprite so feet touch ground

    // ── Physics ─────────────────────────────────────────────────────────────
    // vy (vertical velocity) is negative when moving up, positive when falling.
    // Gravity adds +GRAVITY to vy every frame.
    this.vy = 0;

    // ── Jump state ──────────────────────────────────────────────────────────
    // onGround flips to false on jump and back to true on landing.
    // jumps counts remaining jumps: starts at 2 (double-jump), restored on land.
    this.onGround = true;
    this.jumps = 1;

    // ── Running animation ────────────────────────────────────────────────────
    // animFrame: which column of the sprite sheet is currently displayed.
    // animTick:  counts game-frames; resets and advances animFrame every ANIM_RATE ticks.
    this.animFrame = 0;
    this.animTick  = 0;

    // ── Death animation ──────────────────────────────────────────────────────
    // deathTick:  counts game-frames since death began.
    // deathFrame: which death-sprite column to show (0–3, never loops back).
    this.deathTick  = 0;
    this.deathFrame = 0;
  }

  // ── Computed hitbox properties ─────────────────────────────────────────────
  //
  // The hitbox is smaller than the visible sprite to be forgiving to the player.
  // When ducking the hitbox also gets shorter, making it possible to slide under
  // aerial obstacles.
  //
  // These are getter methods (not stored values) so they always reflect the
  // current isDucking state without needing to be manually updated.

  get hitW() {
    // Ducking: 60% of sprite width.  Standing: 55%.
    return GameState.isDucking ? OSTRICH_W * 0.60 : OSTRICH_W * 0.55;
  }

  get hitH() {
    // Ducking: DUCK_SHRINK (55%) of sprite height.  Standing: 80%.
    return GameState.isDucking ? OSTRICH_H * DUCK_SHRINK : OSTRICH_H * 0.80;
  }

  get hitX() {
    // Centre the hitbox horizontally inside the sprite.
    // (OSTRICH_W - this.hitW) is the total empty space; halving gives one side.
    return this.x + (OSTRICH_W - this.hitW) / 2;
  }

  get hitY() {
    // Align the hitbox to the BOTTOM of the sprite (feet and body region).
    // The head sticks above the hitbox which feels fair.
    return this.y + (OSTRICH_H - this.hitH);
  }

  // ── jump() ────────────────────────────────────────────────────────────────
  //
  // Called by input.js when the player presses Space / ArrowUp / taps screen.
  //
  jump() {
    // Block if in the air with no jump left
    if (!this.onGround && this.jumps <= 0) return;

    if (this.onGround) {
      // First jump — full power
      this.vy    = JUMP_V;    // e.g. -13.5 (moves upward)
      this.jumps = 1;          
    } 

    this.onGround        = false;
    GameState.isDucking  = false;  // cancel duck on jump
    // play jump sound
  }

  // ── duck() / unduck() ─────────────────────────────────────────────────────
  //
  // Duck is only allowed while on the ground.
  // unduck has no guard — it's always safe to stop ducking.
  //
  duck() {
    if (this.onGround) GameState.isDucking = true;
  }

  unduck() {
    GameState.isDucking = false;
  }

  // ── update() ──────────────────────────────────────────────────────────────
  //
  // Called once per frame from game.js before draw().
  // Handles: death-animation ticking, gravity, ground collision, anim cycling.
  //
  update() {
    const { state } = GameState;

    // ── Death state: only advance death animation, skip all physics ──────────
    if (state === 'dead') {
      this.deathTick++;
      // Advance death frame every 8 game-frames (slow, dramatic).
      // Math.min(3, ...) stops at the last frame — death anim plays once only.
      if (this.deathTick % 8 === 0) {
        this.deathFrame = Math.min(3, this.deathFrame + 1);
      }
      return;  // early exit — no physics when dead
    }
    // ── Physics ──────────────────────────────────────────────────────────────
    // Velocity first, then position — correct Euler integration order.
    this.vy += GRAVITY;   // gravity pulls downward every frame
    this.y  += this.vy;   // move by current velocity
    // console.log(this.vy);

    // ── Ground collision ─────────────────────────────────────────────────────
    const groundY = GROUND_PX - OSTRICH_H;  // y when standing on ground = 80.4
    if (this.y >= groundY) {
      this.y        = groundY;  // snap — prevent sinking below ground strip
      this.vy       = 0;        // kill downward velocity on landing
      this.onGround = true;
      this.jumps    = 1;        // restore double-jump on every landing
    }

    // ── Animation tick ───────────────────────────────────────────────────────
    this.animTick++;
    if (this.animTick >= ANIM_RATE) {
      this.animTick = 0;

      if (this.onGround) {
        // Choose frame count based on whether we're ducking or running
        const totalFrames = GameState.isDucking
          ? SHEETS.down.frames  // 4 duck frames
          : SHEETS.run.frames;  // 4 run frames
        this.animFrame = (this.animFrame + 1) % totalFrames;
      } else {
        // In the air: clamp to jump sheet range (0–1)
        this.animFrame = Math.min(1, this.animFrame);
      }
    }
  }

  // ── draw(ctx) ─────────────────────────────────────────────────────────────
  //
  // Picks the correct image + frame based on current state, then blits it
  // onto the canvas using the 9-argument form of drawImage:
  //   drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh)
  //   sx = sourceX = animFrame × frameWidth  (selects the column in the sheet)
  //   sw, sh = source dimensions of one frame
  //   dx, dy = destination position on canvas
  //   dw, dh = how large to draw it (SCALE applied here)
  //
  draw() {
    let ctx = this.ctx;
    ctx.save();
    ctx.imageSmoothingEnabled = false;  // keep pixel art crisp — no blurring

    const { state, isDucking } = GameState;

    if (state === 'dead') {
      // Death sprite: OstrichDeath.png — frames are 80px wide (not 32!)
      // Position is fixed to ground even if ostrich was mid-air when it died.
      const fw = SHEETS.death.fw;  // 80
      const fh = SHEETS.death.fh;  // 32
      ctx.drawImage(
        LoadedImages.death,
        this.deathFrame * fw, 0, fw, fh,          // source: slice frame
        this.x, GROUND_PX - OSTRICH_H,             // dest: always on ground
        OSTRICH_W, OSTRICH_H                        // dest: scaled size
      );

    } else if (!this.onGround) {
      // In the air: OstrichJump-Sheet.png — 2 frames, each 32px wide
      const fw = SHEETS.jump.fw;
      const fh = SHEETS.jump.fh;
      const fi = Math.min(this.animFrame, SHEETS.jump.frames - 1); // clamp 0–1
      ctx.drawImage(
        LoadedImages.jump,
        fi * fw, 0, fw, fh,
        this.x, this.y, OSTRICH_W, OSTRICH_H
      );

    } else if (isDucking) {
      // Ducking: Ostrich_with_its_head_down.png — 4 frames, each 32px wide
      // duckY pushes the sprite down so feet still touch the ground.
      const fw    = SHEETS.down.fw;
      const fh    = SHEETS.down.fh;
      const fi    = this.animFrame % SHEETS.down.frames;
      const duckH = OSTRICH_H * DUCK_SHRINK;
      const duckY = GROUND_PX - duckH;            // = 170 - 49.3 = 120.7
      ctx.drawImage(
        LoadedImages.down,
        fi * fw, 0, fw, fh,
        this.x, duckY, OSTRICH_W, duckH
      );

    } else {
      // Running: OstrichRun.png — 4 frames, each 32px wide
      const fw = SHEETS.run.fw;
      const fh = SHEETS.run.fh;
      const fi = this.animFrame % SHEETS.run.frames;
      ctx.drawImage(
        LoadedImages.run,
        fi * fw, 0, fw, fh,
        this.x, this.y, OSTRICH_W, OSTRICH_H
      );
    }

    ctx.restore();
  }

  // ── reset() ───────────────────────────────────────────────────────────────
  //
  // Called by startGame() in game.js to fully reset the ostrich for a new run.
  //
  reset() {
    this.x          = OSTRICH_X;
    this.y          = GROUND_PX - OSTRICH_H;
    this.vy         = 0;
    this.onGround   = true;
    this.jumps      = 1;
    this.animFrame  = 0;
    this.animTick   = 0;
  }

}
