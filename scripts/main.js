import { Game } from './game.js';
import { preloadImages } from './util.js';

async function bootstrap() {
  try {
    // Wait for every image to load before starting anything
    await preloadImages();
    console.log("images loaded");
    // All images are now in LoadedImages — safe to start the game
    const canvas = document.getElementById('gameCanvas');
    const game = new Game(canvas);
    game.start();

  } catch (err) {
    // If any image fails to load, show a user-friendly error instead of
    // a blank canvas or a cryptic console message.
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
        <p style="margin-top:8px; font-size:.7rem; color:#7b5e3a;">
          ${err.message}
        </p>
      </div>
    `;
  }
}

// Start immediately when the DOM is ready
bootstrap();
