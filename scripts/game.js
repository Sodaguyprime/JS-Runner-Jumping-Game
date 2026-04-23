import { GAME_CONFIG, GameState } from './assets.js';
import { Background, Ground } from './backgrounds.js';
import { TreeSpawner, RocksSpawner } from './entities.js';
import { Ostrich } from './ostrich.js';
import { ObstacleManager } from './obstacle.js';
import { initInput } from './input.js';

const { CANVAS_W, CANVAS_H, BASE_SPEED, MAX_SPEED, ACCEL, GROUND_PX, OSTRICH_H } = GAME_CONFIG;

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
    this.obstacleManager = new ObstacleManager(this.ctx);

  }

  update() {
    this.bg.update();
    this.ground.update();
    this.treeSpawner.update();
    this.rocks.update();
    this.obstacleManager.update(GameState.speed);
    this.ostrich.update();
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.bg.draw();
    this.ground.draw();
    this.treeSpawner.draw();
    this.rocks.draw();
    this.obstacleManager.draw();
    this.ostrich.draw();
  }

  loop() {
    GameState.animId = requestAnimationFrame(() => this.loop());
    GameState.frame++;

    if (GameState.state === 'running') {
      this.update();
      this.draw();
    }
  }

  start() {

    GameState.score   = 0;
    GameState.speed   = BASE_SPEED;
    GameState.frame   = 0;
    GameState.bgX     = 0;
    GameState.gndX    = 0;
    GameState.isDucking = false;
    GameState.state   = 'running';

    this.ostrich.reset();
    this.obstacleManager.reset();
    cancelAnimationFrame(GameState.animId);
    this.loop();
  }

  init() {
    initInput(this.ostrich, this.start, this.canvas);
    this.start();   
  }
}