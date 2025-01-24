export const processImage = (file, maxWidth = 800, maxHeight = 800, quality = 0.7) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Create canvas
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;

        // Draw and compress image
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'white'; // Set white background
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to WebP format for better compression
        const compressedImage = canvas.toDataURL('image/webp', quality);

        // Verify size is within localStorage limits (roughly 2MB)
        if (compressedImage.length > 2 * 1024 * 1024) {
          // If still too large, try with more compression
          resolve(canvas.toDataURL('image/webp', 0.5));
        } else {
          resolve(compressedImage);
        }
      };

      img.onerror = (error) => reject(error);
      img.src = e.target.result;
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};
