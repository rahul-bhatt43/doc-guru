"use client";

import { useState } from "react";
import { ShieldIcon, DownloadIcon, CopyIcon, Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { FileDropzone, QueuedFile } from "@/components/file-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { getExif, stripImageMetadata, extractPalette, rgbToHex } from "@/lib/converters/metadata";
import { downloadBlob, stripExtension } from "@/lib/file-helpers";

export default function MetadataPage() {
  const [tab, setTab] = useState<"strip" | "exif" | "palette">("strip");
  const [files, setFiles] = useState<QueuedFile[]>([]);
  const [exif, setExif] = useState<Record<string, unknown> | null>(null);
  const [palette, setPalette] = useState<[number, number, number][]>([]);
  const [loading, setLoading] = useState(false);

  const onDrop = async (dropped: QueuedFile[]) => {
    setFiles(dropped);
    setExif(null);
    setPalette([]);
    if (dropped.length > 0) {
      const file = dropped[0].file;
      if (tab === "exif") {
        setLoading(true);
        const data = await getExif(file);
        setExif(data);
        setLoading(false);
      } else if (tab === "palette") {
        setLoading(true);
        try {
          const colors = await extractPalette(file, 6);
          setPalette(colors);
        } catch {
          toast.error("Could not extract palette");
        }
        setLoading(false);
      }
    }
  };

  const onRemove = () => {
    setFiles([]);
    setExif(null);
    setPalette([]);
  };

  const strip = async () => {
    if (files.length === 0) return;
    try {
      const blob = await stripImageMetadata(files[0].file);
      const ext = files[0].file.type.split("/")[1] || "jpg";
      const name = `${stripExtension(files[0].file.name)}-clean.${ext}`;
      downloadBlob(blob, name);
      toast.success("Metadata stripped");
    } catch (err) {
      toast.error("Failed to strip metadata");
    }
  };

  const copyColor = (hex: string) => {
    navigator.clipboard.writeText(hex);
    toast.success(`Copied ${hex}`);
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Metadata & Palette</h1>
          <p className="text-muted-foreground">Inspect, strip, and analyze image metadata and colors.</p>
        </div>

        <Tabs value={tab} onValueChange={(v) => {
          setTab(v as typeof tab);
          setFiles([]);
          setExif(null);
          setPalette([]);
        }}>
          <TabsList className="mb-4">
            <TabsTrigger value="strip">Strip Metadata</TabsTrigger>
            <TabsTrigger value="exif">View EXIF</TabsTrigger>
            <TabsTrigger value="palette">Color Palette</TabsTrigger>
          </TabsList>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldIcon className="h-5 w-5" /> Image
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FileDropzone
                files={files}
                onFiles={onDrop}
                onRemove={onRemove}
                accept={{ "image/*": [".jpg", ".jpeg", ".png", ".webp"] }}
                multiple={false}
                label={`Drop an image to ${tab === "strip" ? "clean" : tab === "exif" ? "inspect" : "analyze"}`}
              />

              <TabsContent value="strip" className="mt-0">
                <Button className="w-full" size="lg" onClick={strip} disabled={files.length === 0}>
                  <DownloadIcon className="mr-2 h-4 w-4" /> Download Clean Image
                </Button>
              </TabsContent>

              <TabsContent value="exif" className="mt-0">
                {loading && (
                  <div className="flex items-center justify-center py-8">
                    <Loader2Icon className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                )}
                {!loading && exif && Object.keys(exif).length > 0 && (
                  <div className="max-h-96 overflow-auto rounded-md border">
                    <table className="w-full text-sm">
                      <tbody className="divide-y">
                        {Object.entries(exif).map(([key, value]) => (
                          <tr key={key} className="odd:bg-muted/30">
                            <td className="px-4 py-2 font-medium">{key}</td>
                            <td className="px-4 py-2 text-muted-foreground">
                              {typeof value === "object" ? JSON.stringify(value) : String(value)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {!loading && exif === null && files.length > 0 && (
                  <p className="text-sm text-muted-foreground">No EXIF metadata found.</p>
                )}
              </TabsContent>

              <TabsContent value="palette" className="mt-0">
                {loading && (
                  <div className="flex items-center justify-center py-8">
                    <Loader2Icon className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                )}
                {!loading && palette.length > 0 && (
                  <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                    {palette.map((color, i) => {
                      const hex = rgbToHex(color);
                      return (
                        <button
                          key={i}
                          onClick={() => copyColor(hex)}
                          className="group flex flex-col items-center gap-2 rounded-lg border p-2 transition-colors hover:bg-muted"
                        >
                          <div
                            className="h-16 w-full rounded-md border shadow-sm"
                            style={{ backgroundColor: hex }}
                          />
                          <div className="flex items-center gap-1 text-xs font-mono">
                            {hex}
                            <CopyIcon className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </TabsContent>
            </CardContent>
          </Card>
        </Tabs>
      </div>
    </AppShell>
  );
}
