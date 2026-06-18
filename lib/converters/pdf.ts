"use client";

import { readFileAsArrayBuffer } from "../file-helpers";

export async function imagesToPdf(files: File[]): Promise<Blob> {
  const PDFLib = await import("pdf-lib");
  const pdfDoc = await PDFLib.PDFDocument.create();

  for (const file of files) {
    const arrayBuffer = await readFileAsArrayBuffer(file);
    const bytes = new Uint8Array(arrayBuffer);
    let embedded;
    if (file.type === "image/png") {
      embedded = await pdfDoc.embedPng(bytes);
    } else if (file.type === "image/jpeg" || file.type === "image/jpg") {
      embedded = await pdfDoc.embedJpg(bytes);
    } else {
      const bitmap = await createImageBitmap(file);
      const canvas = document.createElement("canvas");
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(bitmap, 0, 0);
      const pngData = await new Promise<Uint8Array>((resolve) =>
        canvas.toBlob(async (blob) => {
          const buffer = await blob!.arrayBuffer();
          resolve(new Uint8Array(buffer));
        }, "image/png")
      );
      embedded = await pdfDoc.embedPng(pngData);
      bitmap.close();
    }

    const page = pdfDoc.addPage([embedded.width, embedded.height]);
    page.drawImage(embedded, {
      x: 0,
      y: 0,
      width: embedded.width,
      height: embedded.height,
    });
  }

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
}

export async function pdfToImages(file: File): Promise<{ name: string; blob: Blob }[]> {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs";

  const bytes = await readFileAsArrayBuffer(file);
  const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
  const out: { name: string; blob: Blob }[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 2 });
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d")!;
    await page.render({ canvasContext: ctx, viewport, canvas }).promise;

    const blob = await new Promise<Blob>((resolve) =>
      canvas.toBlob((b) => resolve(b!), "image/png")
    );
    out.push({ name: `page-${i}.png`, blob });
    page.cleanup();
  }

  return out;
}
