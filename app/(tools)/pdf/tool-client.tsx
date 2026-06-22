"use client";

import { useState } from "react";
import { FileTextIcon, DownloadIcon, Trash2Icon, ImageIcon, RotateCwIcon } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { FileDropzone, QueuedFile } from "@/components/file-dropzone";
import { ConversionQueue } from "@/components/conversion-queue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { imagesToPdf, pdfToImages } from "@/lib/converters/pdf";
import { downloadBlob, zipBlobs, stripExtension } from "@/lib/file-helpers";

export function PdfToolClient() {
  const [tab, setTab] = useState<"images-to-pdf" | "pdf-to-images">("images-to-pdf");
  const [files, setFiles] = useState<QueuedFile[]>([]);
  const [processing, setProcessing] = useState(false);

  const accept: Record<string, string[]> =
    tab === "images-to-pdf"
      ? { "image/*": [".png", ".jpg", ".jpeg", ".webp"] }
      : { "application/pdf": [".pdf"] };

  const onDrop = (dropped: QueuedFile[]) => {
    setFiles((prev) => [...prev, ...dropped]);
  };

  const onRemove = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const clear = () => {
    files.forEach((f) => f.preview && URL.revokeObjectURL(f.preview));
    setFiles([]);
  };

  const runImagesToPdf = async () => {
    setProcessing(true);
    toast.info("Creating PDF...");
    try {
      const pdf = await imagesToPdf(files.map((f) => f.file));
      const firstName = stripExtension(files[0].file.name);
      downloadBlob(pdf, `${firstName}.pdf`);
      setFiles((prev) => prev.map((f) => ({ ...f, status: "done", progress: 100, result: pdf, resultName: `${firstName}.pdf` })));
      toast.success("PDF created");
    } catch (err) {
      const message = err instanceof Error ? err.message : "PDF creation failed";
      toast.error(message);
      setFiles((prev) => prev.map((f) => ({ ...f, status: "error", error: message })));
    } finally {
      setProcessing(false);
    }
  };

  const runPdfToImages = async () => {
    if (files.length !== 1) {
      toast.error("Please drop a single PDF");
      return;
    }
    setProcessing(true);
    toast.info("Extracting pages...");
    try {
      const pages = await pdfToImages(files[0].file);
      setFiles((prev) =>
        prev.map((f) =>
          f.id === files[0].id
            ? {
                ...f,
                status: "done",
                progress: 100,
                resultName: `${pages.length} page(s).png`,
              }
            : f
        )
      );
      if (pages.length === 1) {
        downloadBlob(pages[0].blob, pages[0].name);
      } else {
        await zipBlobs(
          pages.map((p) => ({ name: p.name, blob: p.blob })),
          `${stripExtension(files[0].file.name)}-pages.zip`
        );
      }
      toast.success("Pages extracted");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Extraction failed";
      toast.error(message);
      setFiles((prev) => prev.map((f) => (f.id === files[0].id ? { ...f, status: "error", error: message } : f)));
    } finally {
      setProcessing(false);
    }
  };

  const run = () => {
    if (tab === "images-to-pdf") runImagesToPdf();
    else runPdfToImages();
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Images ↔ PDF</h1>
          <p className="text-muted-foreground">Combine images into a PDF or extract PDF pages as images.</p>
        </header>

        <Tabs value={tab} onValueChange={(v) => {
          setTab(v as typeof tab);
          clear();
        }}>
          <TabsList className="mb-4">
            <TabsTrigger value="images-to-pdf">Images → PDF</TabsTrigger>
            <TabsTrigger value="pdf-to-images">PDF → Images</TabsTrigger>
          </TabsList>

          <TabsContent value="images-to-pdf">
            <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ImageIcon className="h-5 w-5" /> Source Images
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FileDropzone
                      files={files}
                      onFiles={onDrop}
                      onRemove={onRemove}
                      accept={accept}
                      label="Drop images to merge into a PDF"
                    />
                    {files.length > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{files.length} image(s)</span>
                        <Button variant="ghost" size="sm" onClick={clear} disabled={processing}>
                          <Trash2Icon className="mr-2 h-4 w-4" /> Clear
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
                <ConversionQueue items={files} />
              </div>

              <Card className="h-fit">
                <CardHeader>
                  <CardTitle>Action</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Pages are added in the order you drop the images. Reorder by
                    removing and re-adding.
                  </p>
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={run}
                    disabled={processing || files.length === 0}
                  >
                    {processing ? (
                      <>
                        <RotateCwIcon className="mr-2 h-4 w-4 animate-spin" />
                        Building...
                      </>
                    ) : (
                      <>
                        <FileTextIcon className="mr-2 h-4 w-4" />
                        Create PDF
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="pdf-to-images">
            <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileTextIcon className="h-5 w-5" /> PDF File
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FileDropzone
                      files={files}
                      onFiles={(dropped) => {
                        clear();
                        setFiles(dropped.slice(0, 1));
                      }}
                      onRemove={onRemove}
                      accept={accept}
                      multiple={false}
                      label="Drop a PDF to extract pages"
                    />
                  </CardContent>
                </Card>
                <ConversionQueue items={files} />
              </div>

              <Card className="h-fit">
                <CardHeader>
                  <CardTitle>Action</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5">
                    <Label>Output</Label>
                    <p className="text-sm text-muted-foreground">Each page becomes a PNG at 2× resolution.</p>
                  </div>
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={run}
                    disabled={processing || files.length === 0}
                  >
                    {processing ? (
                      <>
                        <RotateCwIcon className="mr-2 h-4 w-4 animate-spin" />
                        Extracting...
                      </>
                    ) : (
                      <>
                        <DownloadIcon className="mr-2 h-4 w-4" />
                        Extract Pages
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
