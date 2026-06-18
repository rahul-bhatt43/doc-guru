"use client";

import { useState } from "react";
import { DownloadIcon, Trash2Icon, ImageIcon, RotateCwIcon, FlipHorizontalIcon, FlipVerticalIcon } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { FileDropzone, QueuedFile } from "@/components/file-dropzone";
import { ConversionQueue } from "@/components/conversion-queue";
import { FormatSelect } from "@/components/format-select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { processImageFile, ImageFormat, imageFormatFromMime } from "@/lib/converters/image";
import { downloadBlob, zipBlobs, stripExtension } from "@/lib/file-helpers";

const formats: ImageFormat[] = ["png", "jpeg", "webp", "avif", "gif", "bmp", "tiff"];

export default function ImagePage() {
  const [files, setFiles] = useState<QueuedFile[]>([]);
  const [format, setFormat] = useState<ImageFormat>("webp");
  const [quality, setQuality] = useState([85]);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [keepAspectRatio, setKeepAspectRatio] = useState(true);
  const [grayscale, setGrayscale] = useState(false);
  const [rotate, setRotate] = useState<"0" | "90" | "180" | "270">("0");
  const [flipHorizontal, setFlipHorizontal] = useState(false);
  const [flipVertical, setFlipVertical] = useState(false);
  const [processing, setProcessing] = useState(false);

  const onDrop = (dropped: QueuedFile[]) => {
    const merged = [...files, ...dropped];
    setFiles(merged);
    if (dropped.length === 1 && !format) {
      const detected = imageFormatFromMime(dropped[0].file.type);
      if (detected) setFormat(detected);
    }
  };

  const onRemove = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const clear = () => {
    files.forEach((f) => f.preview && URL.revokeObjectURL(f.preview));
    setFiles([]);
  };

  const run = async () => {
    if (files.length === 0) return;
    setProcessing(true);
    toast.info("Starting image conversion...");

    for (let i = 0; i < files.length; i++) {
      const item = files[i];
      setFiles((prev) =>
        prev.map((f) => (f.id === item.id ? { ...f, status: "processing", progress: 0 } : f))
      );
      try {
        const blob = await processImageFile(item.file, {
          format,
          quality: quality[0],
          width: width ? Number(width) : undefined,
          height: height ? Number(height) : undefined,
          keepAspectRatio,
          grayscale,
          rotate: Number(rotate) as 0 | 90 | 180 | 270,
          flipHorizontal,
          flipVertical,
        });
        const baseName = stripExtension(item.file.name);
        const resultName = `${baseName}.${format}`;
        setFiles((prev) =>
          prev.map((f) =>
            f.id === item.id
              ? { ...f, status: "done", progress: 100, result: blob, resultName }
              : f
          )
        );
      } catch (err) {
        const message = err instanceof Error ? err.message : "Conversion failed";
        setFiles((prev) =>
          prev.map((f) => (f.id === item.id ? { ...f, status: "error", error: message } : f))
        );
        toast.error(`Failed: ${item.file.name}`);
      }
    }

    setProcessing(false);
    toast.success("Image conversion complete");
  };

  const downloadOne = (item: QueuedFile) => {
    if (!item.result || !item.resultName) return;
    downloadBlob(item.result, item.resultName);
  };

  const downloadAll = () => {
    const done = files.filter((f) => f.status === "done" && f.result && f.resultName);
    if (done.length === 0) return;
    if (done.length === 1) {
      downloadOne(done[0]);
      return;
    }
    zipBlobs(
      done.map((f) => ({ name: f.resultName!, blob: f.result! })),
      "doc-guru-images.zip"
    );
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Image Converter</h1>
          <p className="text-muted-foreground">
            Convert, resize, compress, and transform images in bulk.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" /> Files
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FileDropzone
                  files={files}
                  onFiles={onDrop}
                  onRemove={onRemove}
                  accept={{
                    "image/*": [".png", ".jpg", ".jpeg", ".webp", ".avif", ".gif", ".bmp", ".tiff"],
                  }}
                  label="Drop images here"
                />
                {files.length > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{files.length} file(s)</span>
                    <Button variant="ghost" size="sm" onClick={clear} disabled={processing}>
                      <Trash2Icon className="mr-2 h-4 w-4" /> Clear
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <ConversionQueue
              items={files}
              onDownloadOne={downloadOne}
              onDownloadAll={downloadAll}
            />
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <FormatSelect
                  label="Output format"
                  value={format}
                  onChange={(v) => setFormat(v as ImageFormat)}
                  options={formats}
                />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Quality</Label>
                    <span className="text-xs tabular-nums text-muted-foreground">{quality[0]}%</span>
                  </div>
                  <Slider value={quality} onValueChange={setQuality} max={100} step={1} />
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="width">Width (px)</Label>
                    <Input
                      id="width"
                      type="number"
                      min={1}
                      placeholder="auto"
                      value={width}
                      onChange={(e) => setWidth(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="height">Height (px)</Label>
                    <Input
                      id="height"
                      type="number"
                      min={1}
                      placeholder="auto"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="keepAspectRatio" className="cursor-pointer">Keep aspect ratio</Label>
                  <Switch
                    id="keepAspectRatio"
                    checked={keepAspectRatio}
                    onCheckedChange={setKeepAspectRatio}
                  />
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="grayscale" className="cursor-pointer">Grayscale</Label>
                    <Switch id="grayscale" checked={grayscale} onCheckedChange={setGrayscale} />
                  </div>

                  <div className="space-y-1.5">
                    <Label>Rotate</Label>
                    <Select value={rotate} onValueChange={(v) => setRotate(v as typeof rotate)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">0°</SelectItem>
                        <SelectItem value="90">90°</SelectItem>
                        <SelectItem value="180">180°</SelectItem>
                        <SelectItem value="270">270°</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant={flipHorizontal ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFlipHorizontal((v) => !v)}
                    >
                      <FlipHorizontalIcon className="mr-2 h-4 w-4" /> Flip H
                    </Button>
                    <Button
                      variant={flipVertical ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFlipVertical((v) => !v)}
                    >
                      <FlipVerticalIcon className="mr-2 h-4 w-4" /> Flip V
                    </Button>
                  </div>
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
                      Converting...
                    </>
                  ) : (
                    <>
                      <DownloadIcon className="mr-2 h-4 w-4" />
                      Convert {files.length > 0 && `(${files.length})`}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
