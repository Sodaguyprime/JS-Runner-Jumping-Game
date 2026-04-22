export class Background {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.img = new Image();
    this.img.src = '../assets/Backgrounds.png';
    this.x = 0;
    this.speed = 1;
  }

  update() {
    this.x -= this.speed;
    // Reset when the image has scrolled one full width
    if (this.x <= -this.canvas.width) {
      this.x = 0;
    }
  }

  draw() {
    // Draw it twice side by side so there's no gap when it scrolls
    this.ctx.drawImage(this.img, this.x, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(this.img, this.x + this.canvas.width, 0, this.canvas.width, this.canvas.height);
  }
}

//----------------------------------------------------------------Ground-----------------------------------------------------------------//


export class Ground {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.img = new Image();
    this.img.src = 'assets/Ground.png';
    this.x = 0;
    this.speed = 2;
    this.height = 32;
    this.y = canvas.height - this.height;
  }

  update() {
    this.x -= this.speed;
    if (this.x <= -this.canvas.width) this.x = 0;
  }

  draw() {
    this.ctx.drawImage(this.img, this.x, this.y, this.canvas.width, this.height);
    this.ctx.drawImage(this.img, this.x + this.canvas.width, this.y, this.canvas.width, this.height);
  }
}