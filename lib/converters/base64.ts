export function fileToBase64(file: File): Promise<{ dataUrl: string; base64: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const base64 = dataUrl.split(",")[1];
      resolve({ dataUrl, base64 });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function base64ToFile(base64: string, filename: string, mime?: string): File {
  const isDataUrl = base64.trim().startsWith("data:");
  let contentType = mime || "application/octet-stream";
  let pureBase64 = base64;

  if (isDataUrl) {
    const match = base64.match(/data:([^;]+);base64,(.*)/);
    if (match) {
      contentType = match[1];
      pureBase64 = match[2];
    }
  }

  const byteString = atob(pureBase64);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  const blob = new Blob([ab], { type: contentType });
  return new File([blob], filename, { type: contentType });
}
