import type { Metadata } from "next";
import { MetadataToolClient } from "./tool-client";

export const metadata: Metadata = {
  title: "Metadata & Palette",
  description:
    "Strip EXIF metadata from photos, inspect image metadata, and extract dominant color palettes. All processing happens in your browser.",
  keywords: [
    "remove EXIF",
    "strip metadata",
    "image metadata viewer",
    "color palette extractor",
    "EXIF remover",
    "privacy photo tool",
  ],
  alternates: {
    canonical: "/metadata",
  },
  openGraph: {
    url: "/metadata",
    title: "Metadata & Palette — Doc Guru",
    description: "Strip EXIF metadata, inspect image data, and extract color palettes. Private and browser-based.",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Doc Guru Metadata & Palette",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description: "Strip EXIF metadata from photos, inspect image metadata, and extract dominant color palettes in the browser.",
  url: "https://docguru.app/metadata",
};

export default function MetadataPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <MetadataToolClient />
    </>
  );
}
