const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 300;

// Background
let bgX = 0;
const bgImg = new Image();
bgImg.src = '../assets/Backgrounds.png';

// Ground
let groundX = 0;
const groundImg = new Image();
groundImg.src = '../assets/Ground.png';

// Trees
let trees = [];
let treeTimer = 0;
let treeInterval = 150;
const treeImg = new Image();
treeImg.src = '../assets/tree1.png';

function spawnTree() {
  trees.push({ x: canvas.width, y: canvas.height - 60, width: 25, height: 30 });
}

function update() {
  // background
  bgX -= 1;
  if (bgX <= -canvas.width) bgX = 0;

  // ground
  groundX -= 2;
  if (groundX <= -canvas.width) groundX = 0;

  // trees
  treeTimer++;
  if (treeTimer >= treeInterval) {
    spawnTree();
    treeTimer = 0;
    treeInterval = Math.floor(Math.random() * 81) + 120;
  }
  trees.forEach(t => t.x -= 2);
  trees = trees.filter(t => t.x + t.width > 0);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(bgImg, bgX, 0, canvas.width, canvas.height);
  ctx.drawImage(bgImg, bgX + canvas.width, 0, canvas.width, canvas.height);

  ctx.drawImage(groundImg, groundX, canvas.height - 32, canvas.width, 32);
  ctx.drawImage(groundImg, groundX + canvas.width, canvas.height - 32, canvas.width, 32);

  ctx.globalAlpha = 0.6;
  trees.forEach(t => ctx.drawImage(treeImg, t.x, t.y, t.width, t.height));
  ctx.globalAlpha = 1;
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

bgImg.onload = () => loop();