import { createCanvas, loadImage } from 'canvas';
import fs from 'fs';
import path from 'path';

async function padIcon(filename, size) {
  const filepath = path.resolve('public', filename);
  const tempPath = path.resolve('public', 'temp_' + filename);
  
  if (fs.existsSync(filepath)) {
    fs.renameSync(filepath, tempPath);
  } else {
    console.log(`File not found: ${filepath}`);
    return;
  }
  
  const img = await loadImage(tempPath);
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Fill background with white
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, size, size);
  
  // Calculate new size (40% of original)
  const newSize = Math.floor(size * 0.4);
  const offset = Math.floor((size - newSize) / 2);
  
  // Draw scaled image centered
  ctx.drawImage(img, offset, offset, newSize, newSize);
  
  // Save new image
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(filepath, buffer);
  fs.unlinkSync(tempPath);
  console.log(`Processed ${filename}`);
}

async function run() {
  await padIcon('pwa-192x192.png', 192);
  await padIcon('pwa-512x512.png', 512);
  console.log('Done!');
}

run().catch(console.error);
