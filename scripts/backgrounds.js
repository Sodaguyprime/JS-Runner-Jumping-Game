import { LoadedImages, GAME_CONFIG } from "./assets.js";

export class Background {
  constructor(ctx) {
    this.ctx = ctx;
    this.img = new Image();
    this.img.src = '../assets/Backgrounds.png';
    this.x = 0;
    this.speed = 1;
  }

  update() {
    this.x -= this.speed;
    // Reset when the image has scrolled one full width
    if (this.x <= -GAME_CONFIG.CANVAS_W) {
      this.x = 0;
    }
  }

  draw() {
    // Draw it twice side by side so there's no gap when it scrolls
    this.ctx.drawImage(LoadedImages.bg, this.x, 0, GAME_CONFIG.CANVAS_W, GAME_CONFIG.CANVAS_H);
    this.ctx.drawImage(LoadedImages.bg, this.x + GAME_CONFIG.CANVAS_W, 0, GAME_CONFIG.CANVAS_W, GAME_CONFIG.CANVAS_H);
  }
}

//----------------------------------------------------------------Ground-----------------------------------------------------------------//


export class Ground {
  constructor(ctx) {
    this.ctx = ctx;
    this.x = 0;
    this.speed = 2;
    this.height = 32;
    this.y = GAME_CONFIG.CANVAS_H - this.height;
  }

  update() {
    this.x -= this.speed;
    if (this.x <= -GAME_CONFIG.CANVAS_W) this.x = 0;
  }

  draw() {
    this.ctx.drawImage(LoadedImages.ground, this.x, this.y, GAME_CONFIG.CANVAS_W, this.height);
    this.ctx.drawImage(LoadedImages.ground, this.x + GAME_CONFIG.CANVAS_W, this.y, GAME_CONFIG.CANVAS_W, this.height);
  }
}