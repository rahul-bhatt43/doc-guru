import type { Metadata } from "next";
import { PdfToolClient } from "./tool-client";

export const metadata: Metadata = {
  title: "Images ↔ PDF Converter",
  description:
    "Merge images into a single PDF or extract every page of a PDF as PNG images. 100% browser-based, fast and private.",
  keywords: [
    "images to PDF",
    "PDF to images",
    "merge images PDF",
    "extract PDF pages",
    "PNG to PDF",
    "PDF page extractor",
  ],
  alternates: {
    canonical: "/pdf",
  },
  openGraph: {
    url: "/pdf",
    title: "Images ↔ PDF Converter — Doc Guru",
    description: "Combine images into a PDF or extract PDF pages as images. Free, private, browser-based.",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Doc Guru Images ↔ PDF Converter",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description: "Merge images into a single PDF or extract PDF pages as PNG images in the browser.",
  url: "https://docguru.app/pdf",
};

export default function PdfPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <PdfToolClient />
    </>
  );
}
