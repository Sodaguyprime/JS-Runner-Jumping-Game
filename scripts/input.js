import { GameState } from './assets.js';
import { jumpOstrich, duckOstrich, unduckOstrich } from './ostrich.js';

export function initInput(onStartGame, canvas) {
  function handleJump() {
    if (GameState.state === 'idle') {
      onStartGame();
      return;
    }
    if (GameState.state === 'dead') return;
    jumpOstrich();
  }

  function handleDuck() {
    if (GameState.state === 'running') duckOstrich();
  }

  function handleUnduck() {
    unduckOstrich();
  }

  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
      e.preventDefault();
      handleJump();
    }
    if (e.code === 'ArrowDown') {
      e.preventDefault();
      handleDuck();
    }
  });

  document.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowDown') handleUnduck();
  });

  canvas.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    handleJump();
  });
}