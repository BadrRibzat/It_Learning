export const MAX_FILE_SIZE = Number(import.meta.env.VITE_APP_MAX_UPLOAD_SIZE) || 5242880; // 5MB default

export const compressImage = async (file: File, maxSize: number = MAX_FILE_SIZE): Promise<File> => {
  if (file.size <= maxSize) return file;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions
        if (width > height) {
          if (width > 1200) {
            height *= 1200 / width;
            width = 1200;
          }
        } else {
          if (height > 1200) {
            width *= 1200 / height;
            height = 1200;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to compress image'));
              return;
            }
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          'image/jpeg',
          0.7
        );
      };
      img.onerror = () => reject(new Error('Failed to load image'));
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
  });
};

export const validateFile = (file: File, allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/gif']) => {
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type');
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File size exceeds limit');
  }

  return true;
};
