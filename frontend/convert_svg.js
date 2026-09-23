import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { createCanvas, Image } from 'canvas';

const svgPath = join(process.cwd(), 'public', 'mosque-icon.svg');
const svg = readFileSync(svgPath, 'utf8');

function convertSvgToPng(size, outName) {
  return new Promise((resolve, reject) => {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    
    // Fill background with theme color to match the original gradient or keep transparent
    // Let's keep it transparent since the SVG defines its own colors, but wait, the SVG uses white paths for the building!
    // The original Login screen has a green gradient background, so the white SVG shows up nicely.
    // If the icon is used as an app icon, a white building on a white/transparent background might be invisible.
    // The original SVG paths: 
    // <path fill='#fff' d='M10,90 .../>
    // <path fill='#047857' d='M15,90 .../>
    // If we use it as app icon, we should probably add a background rect.
    
    // Add a solid green background #047857
    ctx.fillStyle = '#047857';
    ctx.fillRect(0, 0, size, size);

    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, size, size);
      const buffer = canvas.toBuffer('image/png');
      writeFileSync(join(process.cwd(), 'public', outName), buffer);
      console.log('Created ' + outName);
      resolve();
    };
    img.onerror = (err) => {
      reject(err);
    };
    // The Image in node-canvas supports SVG if librsvg is present, or we can use a simpler approach.
    // Let's see if it works.
    img.src = Buffer.from(svg, 'utf8');
  });
}

async function run() {
  try {
    await convertSvgToPng(192, 'pwa-192x192.png');
    await convertSvgToPng(512, 'pwa-512x512.png');
    console.log('Done');
  } catch(e) {
    console.error('Error:', e);
  }
}

run();
