# Doc Guru

A **browser-based file conversion toolkit** built with [Next.js 16](https://nextjs.org), [React 19](https://react.dev), [Tailwind CSS 4](https://tailwindcss.com), and [shadcn/ui](https://ui.shadcn.com).

All conversions run **entirely in your browser** — your files never leave your computer, so everything is private, fast, and free to host.

## Features

- **Image Converter** — Convert between PNG, JPG, WebP, AVIF, GIF, BMP, and TIFF. Resize, compress, rotate, flip, apply grayscale, and process multiple images at once.
- **Images ↔ PDF** — Merge images into a single PDF or extract PDF pages as PNG images.
- **Data Converter** — Convert JSON, YAML, CSV, and XML back and forth with live validation.
- **Base64 Tool** — Encode any file to Base64 or decode a Base64 / data URL back to a file.
- **Metadata & Palette** — Strip EXIF metadata from images, inspect EXIF tags, and extract dominant color palettes.

## Tech Stack

- Next.js 16.1.6 (App Router, Turbopack)
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn/ui v4
- Browser libraries: `pdf-lib`, `pdfjs-dist`, `pica`, `browser-image-compression`, `js-yaml`, `papaparse`, `fast-xml-parser`, `@zip.js/zip.js`, `exifr`, `color-thief-ts`, `react-dropzone`

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build for Production

```bash
npm run build
```

## Deploy on Vercel

The easiest way to deploy is via the Vercel CLI:

```bash
npx vercel --prod
```

Or push this project to GitHub and import it into [Vercel](https://vercel.com).

No environment variables or backend services are required.

## Project Structure

```
app/
  page.tsx                 # Dashboard with tool cards
  layout.tsx               # App shell, theme provider, sonner toaster
  globals.css              # Tailwind theme tokens
  (tools)/
    image/page.tsx         # Image converter
    pdf/page.tsx           # Images ↔ PDF
    data/page.tsx          # JSON/YAML/CSV/XML converter
    base64/page.tsx        # File ↔ Base64
    metadata/page.tsx      # EXIF stripper, inspector, and palette tool
components/
  ui/                      # shadcn/ui components
  app-shell.tsx            # Responsive sidebar + mobile nav
  theme-toggle.tsx         # Light / dark mode toggle
  file-dropzone.tsx        # Drag-and-drop file input
  conversion-queue.tsx     # Batch progress / download list
  tool-card.tsx            # Dashboard tool card
  format-select.tsx        # Format dropdown
lib/
  converters/              # Browser-only conversion logic
  file-helpers.ts          # Download, ZIP, file readers, MIME helpers
public/
  pdf.worker.mjs           # PDF.js worker for PDF rendering
```

## Notes

- Conversion helpers are designed to run in the browser only. They are imported inside client components (`"use client"`) and dynamically loaded where needed.
- `pdf-lib` and `pdfjs-dist` are dynamically imported at runtime to avoid server-side rendering issues.

## License

MIT
