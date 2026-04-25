import { GAME_CONFIG } from './assets.js';

const { CANVAS_W, CANVAS_H } = GAME_CONFIG;

const TREE_SOURCES = [
  { src: 'assets/tree1.png', width: 35, height: 55 },
  { src: 'assets/tree2.png', width: 35, height: 55 },
];

// Preloaded tree images
const treeImages = {};
for (const t of TREE_SOURCES) {
  const img = new Image();
  img.src = t.src;
  treeImages[t.src] = img;
}

// Active tree objects: [{ x, y, width, height, src, active }]
let trees = [];
let spawnTimer = 0;
let spawnInterval = Math.floor(Math.random() * 81) + 120;

function spawnTree() {
  const type = TREE_SOURCES[Math.floor(Math.random() * TREE_SOURCES.length)];
  trees.push({
    x:      CANVAS_W,
    y:      CANVAS_H - type.height - 32,
    width:  type.width,
    height: type.height,
    src:    type.src,
    active: true,
  });
}

export function resetTrees() {
  trees = [];
  spawnTimer = 0;
  spawnInterval = Math.floor(Math.random() * 81) + 120;
}

export function updateTrees(speed) {
  spawnTimer++;
  if (spawnTimer >= spawnInterval) {
    spawnTree();
    spawnTimer = 0;
    spawnInterval = Math.floor(Math.random() * 40) + 120;
  }

  for (const tree of trees) {
    // Trees scroll at 40% of game speed — mid-layer parallax
    tree.x -= speed * 0.4;
    if (tree.x + tree.width < 0) tree.active = false;
  }

  trees = trees.filter(t => t.active);
}

export function drawTrees(ctx) {
  for (const tree of trees) {
    ctx.globalAlpha = 0.6;
    ctx.drawImage(treeImages[tree.src], tree.x, tree.y, tree.width, tree.height);
    ctx.globalAlpha = 1.0;
  }
}