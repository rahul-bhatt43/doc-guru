"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloudIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface QueuedFile {
  id: string;
  file: File;
  preview?: string;
  progress: number;
  status: "pending" | "processing" | "done" | "error";
  result?: Blob;
  resultName?: string;
  error?: string;
}

interface FileDropzoneProps {
  files: QueuedFile[];
  onFiles: (files: QueuedFile[]) => void;
  onRemove?: (id: string) => void;
  accept?: Record<string, string[]>;
  multiple?: boolean;
  maxFiles?: number;
  label?: string;
  sublabel?: string;
}

export function FileDropzone({
  files,
  onFiles,
  onRemove,
  accept,
  multiple = true,
  maxFiles = 50,
  label = "Drop files here",
  sublabel = "or click to browse",
}: FileDropzoneProps) {
  const onDrop = useCallback(
    (accepted: File[]) => {
      const next = accepted.map(
        (file): QueuedFile => ({
          id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
          file,
          progress: 0,
          status: "pending",
          preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
        })
      );
      onFiles(multiple ? next : next.slice(0, 1));
    },
    [multiple, onFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple,
    maxFiles,
  });

  return (
    <div className="space-y-3">
      <div
        {...getRootProps()}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 transition-colors",
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-border bg-muted/40 hover:bg-muted/60"
        )}
      >
        <input {...getInputProps()} />
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <UploadCloudIcon className="h-6 w-6 text-primary" />
        </div>
        <div className="text-center">
          <p className="font-medium">{isDragActive ? "Drop them here" : label}</p>
          <p className="text-sm text-muted-foreground">{sublabel}</p>
        </div>
      </div>

      {files.length > 0 && (
        <ul className="divide-y rounded-xl border">
          {files.map((qf) => (
            <li key={qf.id} className="flex items-center justify-between px-4 py-3">
              <div className="flex min-w-0 items-center gap-3">
                {qf.preview ? (
                  <img
                    src={qf.preview}
                    alt={qf.file.name}
                    className="h-10 w-10 rounded-md object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted text-xs font-bold">
                    {qf.file.name.split(".").pop()?.toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{qf.file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(qf.file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              {onRemove && (
                <Button variant="ghost" size="icon-sm" onClick={() => onRemove(qf.id)}>
                  <XIcon className="h-4 w-4" />
                </Button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
