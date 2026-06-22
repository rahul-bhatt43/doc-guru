import type { Metadata } from "next";
import { Base64ToolClient } from "./tool-client";

export const metadata: Metadata = {
  title: "Base64 Encoder & Decoder",
  description:
    "Encode any file to Base64 or decode a Base64 string back to a file. Browser-based, instant, and private.",
  keywords: [
    "Base64 encoder",
    "Base64 decoder",
    "file to Base64",
    "Base64 to file",
    "Base64 converter",
    "online Base64 tool",
  ],
  alternates: {
    canonical: "/base64",
  },
  openGraph: {
    url: "/base64",
    title: "Base64 Encoder & Decoder — Doc Guru",
    description: "Encode files to Base64 or decode Base64 back to a file. Free, browser-based, private.",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Doc Guru Base64 Encoder & Decoder",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description: "Encode files to Base64 strings or decode Base64 strings back to files in the browser.",
  url: "https://docguru.app/base64",
};

export default function Base64Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Base64ToolClient />
    </>
  );
}
