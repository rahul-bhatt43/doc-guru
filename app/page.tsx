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
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Doc Guru</h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            A browser-based file conversion toolkit. Your files never leave your
            computer — convert images, PDFs, data formats, and more with complete
            privacy.
          </p>
        </div>
        <Separator />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <ToolCard key={tool.href} {...tool} />
          ))}
        </div>
        <div className="rounded-xl border bg-muted/30 p-4 text-center text-sm text-muted-foreground">
          More tools coming soon — SVG optimizer, QR generator, HEIC support, and audio/video conversion.
        </div>
      </div>
    </AppShell>
  );
}
