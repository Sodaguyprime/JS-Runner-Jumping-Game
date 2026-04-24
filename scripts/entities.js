//---------------------------------Trees------------------------------//

class Tree {
  constructor(canvas, ctx, imgSrc, width, height) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.img = new Image();
    this.img.src = imgSrc;
    this.width = width;
    this.height = height;
    this.x = canvas.width; // start off-screen right
    this.y = canvas.height - height - 32; // sit on top of ground
    this.speed = 1;
    this.active = true;
  }

  update() {
    this.x -= this.speed;
    if (this.x + this.width < 0) this.active = false; // off-screen left
  }

  draw() {
    this.ctx.globalAlpha = 0.6;
    this.ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    this.ctx.globalAlpha = 1.0;
  }
}

export class TreeSpawner {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.trees = [];
    this.spawnTimer = 0;
    this.spawnInterval = Math.floor(Math.random() * 81) + 120; 
    this.treeSources = [
      { src: 'assets/tree1.png', width: 25, height: 30},
      { src: 'assets/tree2.png', width: 25, height: 30},
    ];
  }

  spawnTree() {
    const type = this.treeSources[Math.floor(Math.random() * this.treeSources.length)];
    this.trees.push(new Tree(this.canvas, this.ctx, type.src, type.width, type.height));
  }

  update() {
    this.spawnTimer++;
    if (this.spawnTimer >= this.spawnInterval) {
      this.spawnTree();
      this.spawnTimer = 0;
      this.spawnInterval = Math.floor(Math.random() * 40) + 120;
    }

    for (const tree of this.trees) tree.update();
    this.trees = this.trees.filter(t => t.active);
  }

  draw() {
    for (const tree of this.trees) tree.draw();
  }
}

//------------------------------End of Trees-----------------------------//
