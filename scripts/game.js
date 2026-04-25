import { GAME_CONFIG, GameState } from './assets.js';
import { updateBg, drawBg, updateGround, drawGround, bg, ground } from './backgrounds.js';
import { updateTrees, drawTrees, resetTrees } from './entities.js';
import { updateOstrich, drawOstrich, resetOstrich } from './ostrich.js';
import { updateObstacles, drawObstacles, getAllObstacles, resetObstacles } from './obstacle.js';
import { collides } from './collision.js';
import { initInput } from './input.js';

const { CANVAS_W, CANVAS_H, BASE_SPEED, MAX_SPEED, ACCEL, OSTRICH_X } = GAME_CONFIG;

let canvas, ctx;
let jumpSound, bgMusic, loseSound;

// ── Update ─────────────────────────────────────────────────────────────────────
function update() {
  GameState.speed = Math.min(MAX_SPEED, GameState.speed + ACCEL);

  updateBg(GameState.speed);
  updateGround(GameState.speed);
  updateTrees(GameState.speed);
  updateObstacles(GameState.speed);
  updateOstrich();

  // Score: count obstacles the ostrich has passed
  for (const obs of getAllObstacles()) {
    if (!obs.scored && obs.x + obs.w < OSTRICH_X) {
      obs.scored = true;
      if (jumpSound) jumpSound.play();
      GameState.score++;
      document.getElementById('current-score').textContent = GameState.score;
    }
  }
}

// ── Draw ───────────────────────────────────────────────────────────────────────
function draw() {
  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
  drawBg(ctx);
  drawGround(ctx);
  drawTrees(ctx);
  drawObstacles(ctx);
  drawOstrich(ctx);
}

// ── Death ──────────────────────────────────────────────────────────────────────
function triggerDeath() {
  GameState.state = 'dead';
  document.getElementById('game-wrapper').classList.remove('expanded');

  const best = localStorage.getItem('bestScore') || 0;
  if (GameState.score > best) localStorage.setItem('bestScore', GameState.score);

  document.getElementById('game-over').style.display = 'flex';
  if (loseSound) loseSound.play();
}

// ── Game loop ──────────────────────────────────────────────────────────────────
function loop() {
  GameState.animId = requestAnimationFrame(loop);
  GameState.frame++;

  if (GameState.state === 'running') {
    update();
    draw();

    if (collides()) {
      triggerDeath();
    }
  }
}

// ── Start / reset ──────────────────────────────────────────────────────────────
function startGame() {
  if (bgMusic) bgMusic.play();

  GameState.best = localStorage.getItem('bestScore') || 0;
  document.getElementById('best-score').textContent = GameState.best;
  GameState.score     = 0;
  document.getElementById('current-score').textContent = 0;
  GameState.speed     = BASE_SPEED;
  GameState.frame     = 0;
  GameState.bgX       = 0;
  GameState.gndX      = 0;
  GameState.isDucking = false;
  GameState.state     = 'running';

  // Reset scroll positions
  bg.x     = 0;
  ground.x = 0;

  document.getElementById('game-wrapper').classList.add('expanded');

  resetOstrich();
  resetObstacles();
  resetTrees();

  cancelAnimationFrame(GameState.animId);
  loop();
}

// ── Init (called once on page load) ───────────────────────────────────────────
export function initGame(canvasEl) {
  canvas    = canvasEl;
  ctx       = canvas.getContext('2d');
  canvas.width  = CANVAS_W;
  canvas.height = CANVAS_H;

  jumpSound = document.getElementById('jump-sound');
  bgMusic   = document.getElementById('bg-music');
  loseSound = document.getElementById('lose-sound');

  // Retry button
  document.getElementById('retry-btn').addEventListener('click', () => {
    document.getElementById('game-over').style.display = 'none';
    startGame();
  });

  // Play button (main menu)
  document.getElementById('play-btn').addEventListener('click', () => {
    document.getElementById('menu').style.display = 'none';
    startGame();
  });

  // Mute toggle
  let muted = false;
  document.getElementById('mute-btn').addEventListener('click', () => {
    muted = !muted;
    if (bgMusic) bgMusic.muted = muted;
    document.getElementById('lose-sound').muted = muted;
    document.getElementById('mute-btn').textContent = muted ? '🔇' : '🔊';
  });

  initInput(startGame, canvas);
}