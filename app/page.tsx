import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browser-based file conversion toolkit",
  description:
    "Doc Guru is a free, privacy-first file conversion toolkit. Convert images, PDFs, JSON/YAML/CSV/XML, Base64, and image metadata right in your browser.",
  keywords: [
    "file converter",
    "image converter",
    "PDF converter",
    "data converter",
    "Base64 tool",
    "metadata remover",
    "privacy first",
    "browser tools",
  ],
  alternates: {
    canonical: "/",
  },
};

import {
  ImageIcon,
  FileTextIcon,
  DatabaseIcon,
  CodeIcon,
  ShieldIcon,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { ToolCard } from "@/components/tool-card";
import { Separator } from "@/components/ui/separator";

const tools = [
  {
    href: "/image",
    icon: ImageIcon,
    title: "Image Converter",
    description: "Convert, resize, compress, rotate, and batch-process images entirely in your browser.",
    tags: ["PNG", "JPG", "WebP", "AVIF"],
  },
  {
    href: "/pdf",
    icon: FileTextIcon,
    title: "Images ↔ PDF",
    description: "Merge images into a single PDF or extract every page of a PDF as an image.",
    tags: ["PDF", "PNG"],
  },
  {
    href: "/data",
    icon: DatabaseIcon,
    title: "Data Converter",
    description: "Convert JSON, YAML, CSV, and XML back and forth with live validation.",
    tags: ["JSON", "YAML", "CSV", "XML"],
  },
  {
    href: "/base64",
    icon: CodeIcon,
    title: "Base64 Tool",
    description: "Encode any file to Base64 or decode a Base64 string back to a file.",
    tags: ["Encode", "Decode"],
  },
  {
    href: "/metadata",
    icon: ShieldIcon,
    title: "Metadata & Palette",
    description: "Strip EXIF metadata from photos and extract dominant color palettes.",
    tags: ["Privacy", "Colors"],
  },
];

export default function Home() {
  return (
    <AppShell>
      <div className="mx-auto max-w-5xl space-y-8">
        <section className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Doc Guru</p>
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Browser-based file conversion
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
            A private, fast toolkit that runs entirely in your browser. Convert
            images, PDFs, data formats, and more — your files never leave your
            computer.
          </p>
        </section>
        <Separator />
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <ToolCard key={tool.href} {...tool} />
          ))}
        </section>
        <aside className="rounded-xl border border-border/60 bg-muted/40 p-4 text-center text-sm text-muted-foreground">
          More tools coming soon — SVG optimizer, QR generator, HEIC support, and audio/video conversion.
        </aside>
      </div>
    </AppShell>
  );
}
