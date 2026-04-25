import { preloadImages } from './util.js';
import { initGame } from './game.js';

async function bootstrap() {
  try {
    await preloadImages();
    console.log('Images loaded');
    const canvas = document.getElementById('gameCanvas');
    initGame(canvas);
  } catch (err) {
    console.error('Game failed to start:', err);
    document.body.innerHTML = `
      <div style="
        display:flex; flex-direction:column; align-items:center;
        justify-content:center; height:100vh; font-family:monospace;
        color:#5c3a1a; background:#c2b280; text-align:center; padding:20px;
      ">
        <h2>⚠️ Could not load game assets</h2>
        <p style="margin-top:12px; font-size:.8rem;">
          Make sure the <code>assets/</code> folder is in the same directory
          as <code>index.html</code> and all image files are present.
        </p>
        <p style="margin-top:8px; font-size:.7rem; color:#7b5e3a;">${err.message}</p>
      </div>
    `;
  }
}

bootstrap();