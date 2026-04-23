import { GAME_CONFIG, SHEETS, LoadedImages, GameState } from './assets.js';


const {
  OSTRICH_X, OSTRICH_W, OSTRICH_H,
  GROUND_PX, GRAVITY, JUMP_V,
  DUCK_SHRINK, ANIM_RATE,
} = GAME_CONFIG;

export class Ostrich {
  constructor() {
    this.x = OSTRICH_X;
    this.y = GROUND_PX - OSTRICH_H; // top of sprite so feet touch ground

    // vy (vertical velocity) is negative when moving up, positive when falling.
    this.vy = 0;

    this.onGround = true;
    this.jumps = 1;

    this.animFrame = 0;
    this.animTick  = 0;
  }

  jump() {
    // Block if in the air with no jumps left
    if (!this.onGround) return;

    if (this.onGround) {
      // First jump — full power
      this.vy    = JUMP_V;    // e.g. -13.5 (moves upward)
      this.jumps = 0;          
    } 

    this.onGround        = false;
    GameState.isDucking  = false;  // cancel duck on jump
    // play jump sound
  }

  duck() {
    if (this.onGround) GameState.isDucking = true;
  }

  unduck() {
    GameState.isDucking = false;
  }

  update() {
    const { state } = GameState;

    // ── Physics ──────────────────────────────────────────────────────────────
    // Velocity first, then position — correct Euler integration order.
    this.vy += GRAVITY;   // gravity pulls downward every frame
    this.y  += this.vy;   // move by current velocity

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

  draw(ctx) {
    ctx.save();
    ctx.imageSmoothingEnabled = false;  // keep pixel art crisp — no blurring

    const { state, isDucking } = GameState;

    if (state === 'dead') {
      // Death sprite: OstrichDeath.png — frames are 80px wide (not 32!)
      // Position is fixed to ground even if hero was mid-air when it died.
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
