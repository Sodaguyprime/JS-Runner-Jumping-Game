import { ASSET_PATHS, LoadedImages } from './assets.js';

export async function preloadImages() {
  const promises = Object.entries(ASSET_PATHS).map(([key, path]) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        LoadedImages[key] = img;
        resolve();
      };
      img.onerror = () => {
        console.error(`[preloadImages] Failed to load: ${path}`);
        reject(new Error(`Could not load image: ${path}`));
      };
      img.src = path;
    });
  });
  await Promise.all(promises);
}