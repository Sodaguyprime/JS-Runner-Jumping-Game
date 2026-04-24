import { GAME_CONFIG, GameState } from './assets.js';
import { Background, Ground } from './backgrounds.js';
import { TreeSpawner } from './entities.js';
import { Ostrich } from './ostrich.js';
import { ObstacleManager } from './obstacle.js';
import { collides }from './collision.js';
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
    this.ostrich = new Ostrich(this.ctx);
    this.obstacleManager = new ObstacleManager(this.ctx);

  }

  update() {
    this.bg.update();
    this.ground.update();
    this.treeSpawner.update();
    this.obstacleManager.update(GameState.speed);
    this.ostrich.update();
     // Score: count obstacles passed
  for (const obs of this.obstacleManager.getAll()) {
    if (!obs.scored && obs.x + obs.w < GAME_CONFIG.OSTRICH_X) {
      obs.scored = true;
      GameState.score++;
      document.getElementById('current-score').textContent = GameState.score;
    }
  }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.bg.draw();
    this.ground.draw();
    this.treeSpawner.draw();
    this.obstacleManager.draw();
    this.ostrich.draw();
  }

  // ── triggerDeath() ────────────────────────────────────────────────────────────
//
// Switches the game to the 'dead' state.
// The death animation plays for ~0.9 seconds before the Game Over overlay
// appears — giving the player time to see what happened.
//
  triggerDeath() {
  GameState.state = 'dead';
  console.log('Score:', GameState.score);

  const best = localStorage.getItem('bestScore') || 0;
  if (GameState.score > best) {
    localStorage.setItem('bestScore', GameState.score);
  }

  document.getElementById('game-over').style.display = 'flex';
   document.getElementById('lose-sound').play();
}

  loop() {
    GameState.animId = requestAnimationFrame(() => this.loop());
    GameState.frame++;

    if (GameState.state === 'running') {
      this.update();
      this.draw();

      if (collides(this.ostrich, this.obstacleManager)) {
        this.triggerDeath();
        return;
      }
    }
  }

  start() {
    document.getElementById('bg-music').play();
    GameState.best = localStorage.getItem('bestScore') || 0;
    document.getElementById('best-score').textContent = GameState.best;
    GameState.score = 0;
    document.getElementById('current-score').textContent = 0;  // ← add this
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
    this.bgMusic = document.getElementById('bg-music');
  this.loseSound = document.getElementById('lose-sound');
    const retryBtn = document.getElementById('retry-btn');
retryBtn.addEventListener('click', () => {
  document.getElementById('game-over').style.display = 'none';
  this.start();
});
  const menu = document.getElementById('menu');
  const playBtn = document.getElementById('play-btn');

  playBtn.addEventListener('click', () => {
    menu.style.display = 'none';
    this.start();
  });

  initInput(this.ostrich, this.start.bind(this), this.canvas);
  const muteBtn = document.getElementById('mute-btn');
let muted = false;

muteBtn.addEventListener('click', () => {
  muted = !muted;
  this.bgMusic.muted = muted;
  document.getElementById('lose-sound').muted = muted;
  muteBtn.textContent = muted ? '🔇' : '🔊';
});
}
}