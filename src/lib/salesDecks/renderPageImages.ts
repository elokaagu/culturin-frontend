import { pdfjs } from "react-pdf";

if (typeof window !== "undefined") {
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
}

export type RenderPageImagesProgress = {
  page: number;
  total: number;
};

/**
 * Rasterize a PDF to JPEG blobs in the browser for fast public viewing.
 * Runs once at upload / prepare time so viewers never wait on PDF.js.
 */
export async function renderPdfToJpegBlobs(
  source: File | ArrayBuffer,
  options?: {
    maxWidth?: number;
    quality?: number;
    onProgress?: (progress: RenderPageImagesProgress) => void;
  },
): Promise<{ pageCount: number; blobs: Blob[] }> {
  const maxWidth = options?.maxWidth ?? 1400;
  const quality = options?.quality ?? 0.72;
  const data = source instanceof File ? await source.arrayBuffer() : source;
  const pdf = await pdfjs.getDocument({ data, disableAutoFetch: false, disableStream: false }).promise;
  const pageCount = pdf.numPages;
  const blobs: Blob[] = [];

  for (let pageNumber = 1; pageNumber <= pageCount; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const base = page.getViewport({ scale: 1 });
    const scale = Math.min(maxWidth / base.width, 2);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement("canvas");
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);
    const context = canvas.getContext("2d", { alpha: false });
    if (!context) throw new Error("Could not create canvas context");

    await page.render({
      canvas,
      canvasContext: context,
      viewport,
    }).promise;

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (result) => (result ? resolve(result) : reject(new Error("JPEG encode failed"))),
        "image/jpeg",
        quality,
      );
    });
    blobs.push(blob);
    options?.onProgress?.({ page: pageNumber, total: pageCount });
    // Free canvas memory between pages
    canvas.width = 0;
    canvas.height = 0;
  }

  return { pageCount, blobs };
}
