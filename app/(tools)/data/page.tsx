"use client";

import { useState } from "react";
import { DatabaseIcon, DownloadIcon, CopyIcon, RotateCwIcon } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { FileDropzone, QueuedFile } from "@/components/file-dropzone";
import { FormatSelect } from "@/components/format-select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { convertData, DataFormat, detectFormat } from "@/lib/converters/data";
import { downloadBlob, readFileAsText, stripExtension } from "@/lib/file-helpers";

const formats: DataFormat[] = ["json", "yaml", "csv", "xml"];

export default function DataPage() {
  const [tab, setTab] = useState<"file" | "text">("file");
  const [files, setFiles] = useState<QueuedFile[]>([]);
  const [from, setFrom] = useState<DataFormat>("json");
  const [to, setTo] = useState<DataFormat>("yaml");
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [processing, setProcessing] = useState(false);

  const onDrop = async (dropped: QueuedFile[]) => {
    setFiles(dropped);
    const fmt = detectFormat(dropped[0].file.name);
    if (fmt) setFrom(fmt);
    const text = await readFileAsText(dropped[0].file);
    setInputText(text);
  };

  const onRemove = () => {
    setFiles([]);
    setInputText("");
  };

  const run = async () => {
    setProcessing(true);
    setOutputText("");
    try {
      if (tab === "file") {
        if (files.length === 0) return;
        const text = await readFileAsText(files[0].file);
        const { text: out, mime, ext } = convertData(text, from, to);
        setOutputText(out);
        const name = `${stripExtension(files[0].file.name)}.${ext}`;
        downloadBlob(new Blob([out], { type: mime }), name);
        toast.success(`Converted to ${ext.toUpperCase()}`);
      } else {
        const { text: out } = convertData(inputText, from, to);
        setOutputText(out);
        toast.success("Converted");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Conversion failed";
      toast.error(message);
    } finally {
      setProcessing(false);
    }
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(outputText);
    toast.success("Copied to clipboard");
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Data Converter</h1>
          <p className="text-muted-foreground">Convert JSON, YAML, CSV, and XML back and forth.</p>
        </div>

        <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
          <TabsList className="mb-4">
            <TabsTrigger value="file">From File</TabsTrigger>
            <TabsTrigger value="text">From Text</TabsTrigger>
          </TabsList>

          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DatabaseIcon className="h-5 w-5" /> Input
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <TabsContent value="file" className="mt-0">
                    <FileDropzone
                      files={files}
                      onFiles={onDrop}
                      onRemove={onRemove}
                      accept={{
                        "application/json": [".json"],
                        "text/yaml": [".yaml", ".yml"],
                        "text/csv": [".csv"],
                        "application/xml": [".xml"],
                      }}
                      multiple={false}
                      label="Drop a data file"
                    />
                  </TabsContent>

                  <TabsContent value="text" className="mt-0">
                    <textarea
                      className="min-h-[280px] w-full rounded-md border bg-background p-3 font-mono text-sm outline-none focus:ring-2 focus:ring-ring"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Paste JSON, YAML, CSV, or XML here..."
                    />
                  </TabsContent>

                  {tab === "file" && files[0] && (
                    <p className="text-sm text-muted-foreground">{files[0].file.name}</p>
                  )}
                </CardContent>
              </Card>

              {outputText && (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Output</CardTitle>
                    <Button variant="outline" size="sm" onClick={copyOutput}>
                      <CopyIcon className="mr-2 h-4 w-4" /> Copy
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <pre className="max-h-96 overflow-auto rounded-md bg-muted p-4 font-mono text-sm">{outputText}</pre>
                  </CardContent>
                </Card>
              )}
            </div>

            <Card className="h-fit">
              <CardHeader>
                <CardTitle>Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <FormatSelect
                  label="From"
                  value={from}
                  onChange={(v) => setFrom(v as DataFormat)}
                  options={formats}
                />
                <FormatSelect
                  label="To"
                  value={to}
                  onChange={(v) => setTo(v as DataFormat)}
                  options={formats}
                />
                <Separator />
                <Button
                  className="w-full"
                  size="lg"
                  onClick={run}
                  disabled={
                    processing ||
                    (tab === "file" ? files.length === 0 : inputText.trim().length === 0)
                  }
                >
                  {processing ? (
                    <>
                      <RotateCwIcon className="mr-2 h-4 w-4 animate-spin" />
                      Converting...
                    </>
                  ) : (
                    <>
                      <DownloadIcon className="mr-2 h-4 w-4" />
                      Convert
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </Tabs>
      </div>
    </AppShell>
  );
}
