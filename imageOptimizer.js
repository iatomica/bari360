/**
 * Client-Side WebP Image Processor & Optimizer
 * Converts uploaded images (PNG, JPG, JPEG, WEBP, etc.) to optimized WebP format
 * using HTML5 Canvas at an ideal 82% quality compression sweet spot.
 */

/**
 * Formats byte size to human readable string (KB / MB)
 * @param {number} bytes 
 * @returns {string}
 */
export function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Optimizes an Image File to WebP format with Canvas compression
 * @param {File} file 
 * @param {number} quality - Quality compression sweet spot (default 0.82)
 * @param {number} maxDimension - Max width/height dimension constraint (default 4096)
 * @returns {Promise<{ dataUrl: string, originalSize: number, optimizedSize: number, width: number, height: number, ratio: number }>}
 */
export function optimizeImageToWebP(file, quality = 0.82, maxDimension = 4096) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      reject(new Error('El archivo seleccionado no es una imagen válida.'));
      return;
    }

    const originalSize = file.size;
    const reader = new FileReader();

    reader.onerror = () => reject(new Error('Error al leer el archivo de imagen.'));

    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Error al decodificar la imagen.'));

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Downscale proportionally if larger than maxDimension
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        // High quality image smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Clear canvas and draw image
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to WebP DataURL at quality 0.82
        const webpDataUrl = canvas.toDataURL('image/webp', quality);

        // Calculate size in bytes from base64 DataURL length
        const base64Length = webpDataUrl.split(',')[1].length;
        const optimizedSize = Math.round(base64Length * 0.75);

        const savedBytes = originalSize - optimizedSize;
        const ratio = originalSize > 0 ? Math.round((savedBytes / originalSize) * 100) : 0;

        resolve({
          dataUrl: webpDataUrl,
          originalSize,
          optimizedSize,
          width,
          height,
          ratio: Math.max(0, ratio)
        });
      };

      img.src = e.target.result;
    };

    reader.readAsDataURL(file);
  });
}
