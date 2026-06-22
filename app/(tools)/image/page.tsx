import type { Metadata } from "next";
import { ImageToolClient } from "./tool-client";

export const metadata: Metadata = {
  title: "Image Converter",
  description:
    "Convert, resize, compress, rotate, and batch-process PNG, JPG, WebP, AVIF, GIF, BMP, and TIFF images entirely in your browser. No uploads, full privacy.",
  keywords: [
    "image converter",
    "PNG to WebP",
    "JPG to WebP",
    "resize image",
    "compress image",
    "batch image converter",
    "browser image tool",
  ],
  alternates: {
    canonical: "/image",
  },
  openGraph: {
    url: "/image",
    title: "Image Converter — Doc Guru",
    description:
      "Batch convert, resize, compress, and transform images in your browser. Supports PNG, JPG, WebP, AVIF, GIF, BMP, TIFF.",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Doc Guru Image Converter",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description:
    "Batch convert, resize, compress, and transform PNG, JPG, WebP, AVIF, GIF, BMP, and TIFF images in the browser.",
  url: "https://docguru.app/image",
};

export default function ImagePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ImageToolClient />
    </>
  );
}
