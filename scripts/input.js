import { GameState } from './assets.js';
// import 

export function initInput(ostrich, onStartGame, canvas) {
  // ── Jump handler ───────────────────────────────────────────────────────────
  //
  // Called on Space, ArrowUp, or canvas tap.
  // Behaviour depends on current game state:
  //   'idle'    → start the game
  //   'running' → make the ostrich jump
  //   'dead'    → ignore (retry is handled by the button, not by jumping)
  //
  function handleJump() {
    if (GameState.state === 'idle') {
      onStartGame();
      return;
    }
    if (GameState.state === 'dead') return;
    ostrich.jump();
  }

  // ── Duck handlers ──────────────────────────────────────────────────────────
  function handleDuck() {
    if (GameState.state === 'running') ostrich.duck();
  }

  function handleUnduck() {
    ostrich.unduck();
  }

  // ── Keyboard ───────────────────────────────────────────────────────────────
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
      e.preventDefault();  // prevent the page from scrolling on Space/Up
      handleJump();
    }
    if (e.code === 'ArrowDown') {
      e.preventDefault();  // prevent page scroll on Down
      handleDuck();
    }
  });

  document.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowDown') {
      handleUnduck();
    }
  });

  // ── Touch / pointer (mobile) ──────────────────────────────────────────────
  //
  // Tapping the canvas triggers a jump — same as pressing Space.
  // pointerdown covers mouse, touch, and stylus in one event.
  //
  canvas.addEventListener('pointerdown', (e) => {
    e.preventDefault();  // prevent synthetic mouse events on mobile
    handleJump();
  });
}