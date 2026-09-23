export const compressImage = (file, options = {}) => {
  const {
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 0.8,
    type = 'image/webp' // webp gives best compression and supports transparency
  } = options;

  return new Promise((resolve, reject) => {
    // We don't need FileReader if we use URL.createObjectURL, which is much faster and uses less memory
    // than reading the whole file as DataURL first.
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(objectUrl); // Clean up memory
      
      let width = img.width;
      let height = img.height;

      // Calculate new dimensions while maintaining aspect ratio
      if (width > maxWidth || height > maxHeight) {
        if (width / height > maxWidth / maxHeight) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      // Create canvas
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      
      // Draw image
      ctx.drawImage(img, 0, 0, width, height);

      // Convert to compressed base64
      // We use webp for excellent compression and alpha transparency support.
      // Fallback to jpeg if webp is not somehow supported (very rare in modern browsers)
      const dataUrl = canvas.toDataURL(type, quality);
      resolve(dataUrl);
    };

    img.onerror = (err) => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to load image for compression'));
    };

    img.src = objectUrl;
  });
};
