"use client";

import { CheckCircle2Icon, Loader2Icon, AlertCircleIcon, DownloadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { QueuedFile } from "./file-dropzone";

interface ConversionQueueProps {
  items: QueuedFile[];
  onDownloadOne?: (item: QueuedFile) => void;
  onDownloadAll?: () => void;
}

export function ConversionQueue({ items, onDownloadOne, onDownloadAll }: ConversionQueueProps) {
  const total = items.length;
  const done = items.filter((i) => i.status === "done").length;

  return (
    <div className="space-y-3 rounded-xl border bg-card p-4">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">
          Queue {done}/{total}
        </div>
        {done > 0 && onDownloadAll && (
          <Button size="sm" onClick={onDownloadAll}>
            <DownloadIcon className="mr-2 h-4 w-4" />
            Download all
          </Button>
        )}
      </div>
      {total > 0 && (
        <Progress value={total === 0 ? 0 : (done / total) * 100} className="h-2" />
      )}
      <ul className="divide-y">
        {items.map((item) => (
          <li key={item.id} className="flex items-center justify-between py-3">
            <div className="flex min-w-0 items-center gap-3">
              {item.preview ? (
                <img
                  src={item.preview}
                  alt={item.file.name}
                  className="h-10 w-10 rounded-md object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted text-xs font-bold">
                  {item.file.name.split(".").pop()?.toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{item.file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {item.status === "done" && item.resultName
                    ? item.resultName
                    : item.status === "error"
                    ? item.error || "Failed"
                    : item.status === "processing"
                    ? "Processing..."
                    : "Pending"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {item.status === "processing" && (
                <Loader2Icon className="h-4 w-4 animate-spin text-muted-foreground" />
              )}
              {item.status === "done" && (
                <CheckCircle2Icon className="h-4 w-4 text-green-600" />
              )}
              {item.status === "error" && (
                <AlertCircleIcon className="h-4 w-4 text-destructive" />
              )}
              {item.status === "done" && onDownloadOne && (
                <Button size="icon-xs" variant="ghost" onClick={() => onDownloadOne(item)}>
                  <DownloadIcon className="h-4 w-4" />
                </Button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
