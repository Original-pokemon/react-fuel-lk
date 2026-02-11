/**
 * Converts a base64 string to a Blob object
 * @param base64 - The base64 encoded string
 * @param mimeType - The MIME type of the file
 * @returns Blob object
 */
export function base64ToBlob(base64: string, mimeType: string): Blob {
  // Remove data URL prefix if present
  const base64Data = base64.includes(",") ? base64.split(",")[1] : base64;

  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);

  for (let index = 0; index < byteCharacters.length; index++) {
    byteNumbers[index] = byteCharacters.codePointAt(index);
  }

  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
}

/**
 * Downloads a Blob as a file
 * @param blob - The Blob to download
 * @param filename - The name of the file to save
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.style.visibility = "hidden";
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

/**
 * Creates a data URL from base64 string for preview
 * @param base64 - The base64 encoded string
 * @param mimeType - The MIME type of the file
 * @returns Data URL string
 */
export function base64ToDataUrl(base64: string, mimeType: string): string {
  // If already a data URL, return as is
  if (base64.startsWith("data:")) {
    return base64;
  }
  return `data:${mimeType};base64,${base64}`;
}
