import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const sourceDir = 'c:\\Users\\Luiti\\Desktop\\IAtomica\\repositories\\tour-360\\tour-360\\public\\360';
const thumbsDir = 'c:\\Users\\Luiti\\Desktop\\IAtomica\\repositories\\tour-360\\tour-360\\public\\360\\thumbs';

if (!fs.existsSync(thumbsDir)) {
  fs.mkdirSync(thumbsDir, { recursive: true });
}

const files = fs.readdirSync(sourceDir).filter(f => f.endsWith('.webp') && !f.includes('thumb'));

console.log(`Generating lightweight thumbnails for ${files.length} images...`);

async function generateThumbs() {
  for (const file of files) {
    const inputPath = path.join(sourceDir, file);
    const outputPath = path.join(thumbsDir, file);

    const inStats = fs.statSync(inputPath);
    await sharp(inputPath)
      .resize({ width: 320, height: 180, fit: 'cover' })
      .webp({ quality: 75 })
      .toFile(outputPath);

    const outStats = fs.statSync(outputPath);
    console.log(`Thumb created: ${file} (${(inStats.size / 1024 / 1024).toFixed(2)} MB -> ${(outStats.size / 1024).toFixed(1)} KB)`);
  }
  console.log('All thumbnails generated successfully!');
}

generateThumbs().catch(console.error);
