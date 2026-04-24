import { ASSET_PATHS, LoadedImages } from './assets.js';

export const preloadImages = async function() {
  const promises = Object.entries(ASSET_PATHS).map(([key, path]) => {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        LoadedImages[key] = img;   // store in the shared container
        
        resolve();
      };

      img.onerror = () => {
        // Log clearly so the developer knows which file is missing
        console.error(`[preloadImages] Failed to load: ${path}`);
        reject(new Error(`Could not load image: ${path}`));
      };

      img.src = path;
    });
  });

  // Wait for every image to finish (or throw if any fail)
  await Promise.all(promises);
}