import { Background, Ground } from './backgrounds.js';
import { TreeSpawner, RocksSpawner } from './entities.js';
import { Ostrich } from './ostrich.js';


export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    canvas.width = 800;
    canvas.height = 300;

    this.bg = new Background(this.ctx);
    this.ground = new Ground(this.ctx);
    this.treeSpawner = new TreeSpawner(canvas, this.ctx);
    this.rocks = new RocksSpawner(canvas, this.ctx);
    this.ostrich = new Ostrich(this.ctx);
  }

  update() {
    this.bg.update();
    this.ground.update();
    this.treeSpawner.update();
    this.rocks.update();
    this.ostrich.update();
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.bg.draw();
    this.ground.draw();
    this.treeSpawner.draw();
    this.rocks.draw();
    this.ostrich.draw();
  }

  loop() {
    this.update();
    this.draw();
    requestAnimationFrame(() => this.loop());
  }

  start() {
    this.bg.img.onload = () => this.loop();
  }
}