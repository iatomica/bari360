import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const sourceMapJpg = 'c:\\Users\\Luiti\\Desktop\\IAtomica\\repositories\\tour-360\\webmedia\\Mapa bari.jpg';
const targetWebp = 'c:\\Users\\Luiti\\Desktop\\IAtomica\\repositories\\tour-360\\tour-360\\public\\mapa-bari.webp';

async function optimizeMap() {
  console.log('Optimizing map image...');
  const inStats = fs.statSync(sourceMapJpg);
  console.log(`Source map size: ${(inStats.size / 1024).toFixed(1)} KB`);

  // Sharp optimization for equirectangular map: WebP quality 83
  await sharp(sourceMapJpg)
    .webp({ quality: 83, effort: 6 })
    .toFile(targetWebp);

  const outStats = fs.statSync(targetWebp);
  console.log(`Optimized map WebP size: ${(outStats.size / 1024).toFixed(1)} KB`);
  console.log(`Reduction: -${(((inStats.size - outStats.size) / inStats.size) * 100).toFixed(1)}%`);
}

optimizeMap().catch(console.error);
