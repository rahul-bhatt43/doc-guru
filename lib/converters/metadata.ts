"use client";

import exifr from "exifr";
import ColorThief from "color-thief-ts";

export async function getExif(file: File): Promise<Record<string, unknown> | null> {
  try {
    const output = await exifr.parse(file, true);
    return (output as Record<string, unknown>) || null;
  } catch {
    return null;
  }
}

export async function stripImageMetadata(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(bitmap, 0, 0);
  const blob = await new Promise<Blob>((resolve) =>
    canvas.toBlob((b) => resolve(b!), file.type || "image/jpeg", 0.92)
  );
  bitmap.close();
  return blob;
}

export async function extractPalette(file: File, colorCount = 5): Promise<[number, number, number][]> {
  const url = URL.createObjectURL(file);
  try {
    const colorThief = new ColorThief();
    const palette = await colorThief.getPaletteAsync(url, colorCount);
    return palette;
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function rgbToHex([r, g, b]: [number, number, number]) {
  return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
}
