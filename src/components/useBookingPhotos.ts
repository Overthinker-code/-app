import { useRef, useState } from 'react';

export const MAX_BOOKING_PHOTOS = 4;
const MAX_FILE_BYTES = 20 * 1024 * 1024;
const MAX_PHOTO_EDGE = 1024;

async function preparePhoto(file: File): Promise<string> {
  if (!file.size || file.size > MAX_FILE_BYTES ||
      (file.type && !file.type.startsWith('image/')) || file.type === 'image/svg+xml') {
    throw new Error('Unsupported image');
  }

  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    const { naturalWidth: width, naturalHeight: height } = image;
    if (!width || !height || width * height > 50_000_000) throw new Error('Unsupported image dimensions');

    const ratio = Math.min(1, MAX_PHOTO_EDGE / Math.max(width, height));
    const thumbnail = document.createElement('canvas');
    thumbnail.width = Math.max(1, Math.round(width * ratio));
    thumbnail.height = Math.max(1, Math.round(height * ratio));
    const ctx = thumbnail.getContext('2d');
    if (!ctx) throw new Error('Canvas unavailable');

    // Re-encode the pixels so the local order stores neither the original file nor its metadata.
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, thumbnail.width, thumbnail.height);
    ctx.drawImage(image, 0, 0, thumbnail.width, thumbnail.height);
    return thumbnail.toDataURL('image/jpeg', 0.75);
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function useBookingPhotos(onError: (message: string) => void) {
  const [photos, setPhotos] = useState<string[]>([]);
  const [processingPhotos, setProcessingPhotos] = useState(false);
  const processing = useRef(false);

  async function addPhotos(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.currentTarget.files ?? []).slice(0, MAX_BOOKING_PHOTOS - photos.length);
    event.currentTarget.value = '';
    if (processing.current || files.length === 0) return;

    processing.current = true;
    setProcessingPhotos(true);
    const prepared: string[] = [];
    try {
      for (const file of files) {
        try {
          prepared.push(await preparePhoto(file));
        } catch {
          // Keep other valid photos from the same selection.
        }
      }
      setPhotos((current) => [...current, ...prepared].slice(0, MAX_BOOKING_PHOTOS));
      if (prepared.length !== files.length) onError('部分照片无法读取，请选择 20 MB 内的普通照片');
    } finally {
      processing.current = false;
      setProcessingPhotos(false);
    }
  }

  function removePhoto(index: number) {
    setPhotos((current) => current.filter((_, position) => position !== index));
  }

  return { photos, processingPhotos, addPhotos, removePhoto };
}
