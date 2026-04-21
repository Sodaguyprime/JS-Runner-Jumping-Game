import { Background, Ground } from './backgrounds.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 300;

const bg = new Background(canvas, ctx);
const ground = new Ground(canvas, ctx);

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  bg.update();
  bg.draw();
  ground.update();
  ground.draw();
  requestAnimationFrame(gameLoop);
}

bg.img.onload = () => gameLoop();