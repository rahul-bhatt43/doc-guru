"use client";

import imageCompression from "browser-image-compression";
import PicaConstructor from "pica";

export type ImageFormat = "png" | "jpeg" | "webp" | "avif" | "gif" | "bmp" | "tiff";

const FORMAT_MIMES: Record<ImageFormat, string> = {
  png: "image/png",
  jpeg: "image/jpeg",
  webp: "image/webp",
  avif: "image/avif",
  gif: "image/gif",
  bmp: "image/bmp",
  tiff: "image/tiff",
};

export interface ImageOptions {
  format: ImageFormat;
  quality: number;
  width?: number;
  height?: number;
  keepAspectRatio?: boolean;
  grayscale?: boolean;
  rotate?: 0 | 90 | 180 | 270;
  flipHorizontal?: boolean;
  flipVertical?: boolean;
}

const PicaTyped = PicaConstructor as unknown as new (options?: {
  features?: string[];
}) => {
  resize: (
    source: HTMLCanvasElement,
    dest: HTMLCanvasElement,
    options?: Record<string, unknown>
  ) => Promise<HTMLCanvasElement>;
};

const pica = new PicaTyped({ features: ["js", "wasm"] });

export async function processImageFile(
  file: File,
  options: ImageOptions
): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  let { width, height } = bitmap;

  if (options.width || options.height) {
    const targetWidth = options.width ?? width;
    const targetHeight = options.height ?? height;

    if (options.keepAspectRatio !== false) {
      const srcRatio = width / height;
      const dstRatio = targetWidth / targetHeight;
      if (srcRatio > dstRatio) {
        height = Math.round(targetWidth / srcRatio);
        width = targetWidth;
      } else {
        width = Math.round(targetHeight * srcRatio);
        height = targetHeight;
      }
    } else {
      width = targetWidth;
      height = targetHeight;
    }
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;

  ctx.save();
  ctx.translate(width / 2, height / 2);

  if (options.rotate) {
    ctx.rotate((options.rotate * Math.PI) / 180);
  }
  if (options.flipHorizontal) {
    ctx.scale(-1, 1);
  }
  if (options.flipVertical) {
    ctx.scale(1, -1);
  }

  const srcRatio = bitmap.width / bitmap.height;
  const dstRatio = width / height;
  let drawW: number, drawH: number;
  if (srcRatio > dstRatio) {
    drawH = height;
    drawW = drawH * srcRatio;
  } else {
    drawW = width;
    drawH = drawW / srcRatio;
  }

  ctx.drawImage(bitmap, -drawW / 2, -drawH / 2, drawW, drawH);
  ctx.restore();

  if (options.grayscale) {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      data[i] = gray;
      data[i + 1] = gray;
      data[i + 2] = gray;
    }
    ctx.putImageData(imageData, 0, 0);
  }

  const resizedCanvas = await pica.resize(canvas, canvas, {
    unsharpAmount: 80,
    unsharpRadius: 0.6,
    unsharpThreshold: 2,
  });

  const mime = FORMAT_MIMES[options.format];
  let blob = await new Promise<Blob>((resolve) =>
    resizedCanvas.toBlob((b: Blob | null) => resolve(b!), mime, options.quality / 100)
  );

  if (options.format === "jpeg" || options.format === "webp" || options.format === "avif") {
    blob = await imageCompression(blob as File, {
      maxWidthOrHeight: Math.max(width, height),
      initialQuality: options.quality / 100,
      fileType: mime,
      preserveExif: false,
      useWebWorker: true,
    });
  }

  bitmap.close();
  return blob;
}

export function imageFormatFromMime(mime: string): ImageFormat | null {
  const found = Object.entries(FORMAT_MIMES).find(([, m]) => m === mime);
  return (found?.[0] as ImageFormat) || null;
}
