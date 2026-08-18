import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const sourceDir = 'C:\\Users\\Luiti\\Desktop\\IAtomica\\repositories\\tour-360\\webmedia\\360';
const outputDir = 'c:\\Users\\Luiti\\Desktop\\IAtomica\\repositories\\tour-360\\tour-360\\public\\360';

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const files = fs.readdirSync(sourceDir).filter(f => f.match(/\.(jpe?g|png)$/i));

console.log(`Found ${files.length} images to process...`);

async function processImages() {
  for (const file of files) {
    const inputPath = path.join(sourceDir, file);
    const cleanName = file.toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/\.(jpe?g|png)$/i, '')
      .replace(/\s+/g, '-');
    const outputPath = path.join(outputDir, `${cleanName}.webp`);

    const inStats = fs.statSync(inputPath);
    console.log(`Processing: ${file} (${(inStats.size / 1024 / 1024).toFixed(2)} MB)...`);

    await sharp(inputPath)
      .webp({ quality: 82, effort: 6 })
      .toFile(outputPath);

    const outStats = fs.statSync(outputPath);
    const saved = ((1 - outStats.size / inStats.size) * 100).toFixed(1);
    console.log(` Saved -> ${cleanName}.webp (${(outStats.size / 1024 / 1024).toFixed(2)} MB, -${saved}%)`);
  }
  console.log('All 360 images optimized successfully!');
}

processImages().catch(err => {
  console.error('Error optimizing images:', err);
  process.exit(1);
});
