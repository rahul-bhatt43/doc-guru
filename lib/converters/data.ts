import { load as loadYaml, dump as dumpYaml } from "js-yaml";
import Papa from "papaparse";
import { XMLParser, XMLBuilder } from "fast-xml-parser";

export type DataFormat = "json" | "yaml" | "csv" | "xml";

export function detectFormat(fileName: string): DataFormat | null {
  const ext = fileName.split(".").pop()?.toLowerCase();
  if (ext === "json") return "json";
  if (ext === "yaml" || ext === "yml") return "yaml";
  if (ext === "csv") return "csv";
  if (ext === "xml") return "xml";
  return null;
}

export function convertData(
  text: string,
  from: DataFormat,
  to: DataFormat
): { text: string; mime: string; ext: string } {
  let data: unknown;

  switch (from) {
    case "json":
      data = JSON.parse(text);
      break;
    case "yaml":
      data = loadYaml(text);
      break;
    case "csv": {
      const parsed = Papa.parse(text, { header: true, dynamicTyping: true });
      data = parsed.data;
      break;
    }
    case "xml": {
      const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });
      data = parser.parse(text);
      break;
    }
  }

  let outText = "";
  let mime = "text/plain";
  let ext = "txt";

  switch (to) {
    case "json":
      outText = JSON.stringify(data, null, 2);
      mime = "application/json";
      ext = "json";
      break;
    case "yaml":
      outText = dumpYaml(data);
      mime = "text/yaml";
      ext = "yaml";
      break;
    case "csv": {
      const rows = Array.isArray(data) ? data : data ? [data] : [];
      outText = Papa.unparse(rows);
      mime = "text/csv";
      ext = "csv";
      break;
    }
    case "xml": {
      const builder = new XMLBuilder({ ignoreAttributes: false, attributeNamePrefix: "@_" });
      outText = builder.build(data);
      mime = "application/xml";
      ext = "xml";
      break;
    }
  }

  return { text: outText, mime, ext };
}
