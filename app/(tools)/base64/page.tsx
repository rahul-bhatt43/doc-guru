"use client";

import { useState } from "react";
import { CodeIcon, CopyIcon, DownloadIcon, UploadIcon, RotateCwIcon } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { FileDropzone, QueuedFile } from "@/components/file-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fileToBase64, base64ToFile } from "@/lib/converters/base64";
import { downloadBlob, extensionFromMime } from "@/lib/file-helpers";

export default function Base64Page() {
  const [tab, setTab] = useState<"encode" | "decode">("encode");
  const [files, setFiles] = useState<QueuedFile[]>([]);
  const [base64, setBase64] = useState("");
  const [filename, setFilename] = useState("decoded-file");
  const [mime, setMime] = useState("application/octet-stream");
  const [processing, setProcessing] = useState(false);

  const onDrop = async (dropped: QueuedFile[]) => {
    setFiles(dropped);
    if (dropped.length > 0) {
      setProcessing(true);
      try {
        const { base64: b64, dataUrl } = await fileToBase64(dropped[0].file);
        setBase64(b64);
        const detectedMime = dataUrl.match(/data:([^;]+);/)?.[1] || dropped[0].file.type;
        setMime(detectedMime);
        toast.success("Encoded to Base64");
      } catch (err) {
        toast.error("Encoding failed");
      } finally {
        setProcessing(false);
      }
    }
  };

  const onRemove = () => {
    setFiles([]);
    setBase64("");
  };

  const copy = () => {
    navigator.clipboard.writeText(base64);
    toast.success("Copied");
  };

  const decode = () => {
    try {
      const file = base64ToFile(base64, filename, mime);
      downloadBlob(file, file.name);
      toast.success("File decoded");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Invalid Base64";
      toast.error(message);
    }
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Base64 Tool</h1>
          <p className="text-muted-foreground">Encode files to Base64 strings or decode them back.</p>
        </div>

        <Tabs value={tab} onValueChange={(v) => {
          setTab(v as typeof tab);
          setFiles([]);
          setBase64("");
        }}>
          <TabsList className="mb-4">
            <TabsTrigger value="encode">File → Base64</TabsTrigger>
            <TabsTrigger value="decode">Base64 → File</TabsTrigger>
          </TabsList>

          <TabsContent value="encode">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UploadIcon className="h-5 w-5" /> Encode File
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FileDropzone
                  files={files}
                  onFiles={onDrop}
                  onRemove={onRemove}
                  multiple={false}
                  label="Drop any file to encode"
                />
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Base64 Output</Label>
                    <Button variant="outline" size="sm" onClick={copy} disabled={!base64}>
                      <CopyIcon className="mr-2 h-4 w-4" /> Copy
                    </Button>
                  </div>
                  <textarea
                    className="min-h-[240px] w-full rounded-md border bg-muted p-3 font-mono text-xs break-all"
                    value={base64}
                    readOnly
                    placeholder="Base64 output will appear here..."
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="decode">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CodeIcon className="h-5 w-5" /> Decode Base64
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="base64-input">Base64 Input</Label>
                  <textarea
                    id="base64-input"
                    className="min-h-[200px] w-full rounded-md border bg-background p-3 font-mono text-xs break-all"
                    value={base64}
                    onChange={(e) => setBase64(e.target.value)}
                    placeholder="Paste Base64 or data URL here..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="filename">Filename</Label>
                    <Input
                      id="filename"
                      value={filename}
                      onChange={(e) => setFilename(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="mime">MIME type</Label>
                    <Input
                      id="mime"
                      value={mime}
                      onChange={(e) => setMime(e.target.value)}
                    />
                  </div>
                </div>

                <Button className="w-full" size="lg" onClick={decode} disabled={!base64.trim()}>
                  <DownloadIcon className="mr-2 h-4 w-4" /> Download File
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
