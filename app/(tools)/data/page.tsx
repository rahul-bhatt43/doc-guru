import type { Metadata } from "next";
import { DataToolClient } from "./tool-client";

export const metadata: Metadata = {
  title: "Data Converter",
  description:
    "Convert JSON, YAML, CSV, and XML back and forth in your browser. Paste text or upload a file and download the converted result instantly.",
  keywords: [
    "JSON to YAML",
    "YAML to JSON",
    "CSV to JSON",
    "XML to JSON",
    "data format converter",
    "JSON converter",
    "CSV converter",
  ],
  alternates: {
    canonical: "/data",
  },
  openGraph: {
    url: "/data",
    title: "Data Converter — Doc Guru",
    description: "Convert JSON, YAML, CSV, and XML in your browser. Free, private, no uploads.",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Doc Guru Data Converter",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description: "Convert JSON, YAML, CSV, and XML back and forth in the browser.",
  url: "https://docguru.app/data",
};

export default function DataPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <DataToolClient />
    </>
  );
}
