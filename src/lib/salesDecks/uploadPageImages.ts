import type { SupabaseClient } from "@supabase/supabase-js";

import { SUPABASE_SALES_DECKS_BUCKET } from "@/lib/storageConstants";

import { renderPdfToJpegBlobs, type RenderPageImagesProgress } from "./renderPageImages";

/**
 * Rasterize a PDF and upload page JPEGs next to the deck file.
 * Paths: `{ownerId}/{deckId}/pages/{n}.jpg`
 */
export async function prepareDeckPageImages(params: {
  supabase: SupabaseClient;
  ownerId: string;
  deckId: string;
  source: File | ArrayBuffer;
  onProgress?: (progress: RenderPageImagesProgress & { phase: "render" | "upload" }) => void;
}): Promise<{ pageCount: number; pageImageUrls: string[] }> {
  const { supabase, ownerId, deckId, source, onProgress } = params;
  const { pageCount, blobs } = await renderPdfToJpegBlobs(source, {
    maxWidth: 1400,
    quality: 0.72,
    onProgress: (p) => onProgress?.({ ...p, phase: "render" }),
  });

  const pageImageUrls: string[] = [];

  for (let i = 0; i < blobs.length; i += 1) {
    const pageNumber = i + 1;
    const path = `${ownerId}/${deckId}/pages/${pageNumber}.jpg`;
    const { error: uploadError } = await supabase.storage
      .from(SUPABASE_SALES_DECKS_BUCKET)
      .upload(path, blobs[i], {
        contentType: "image/jpeg",
        upsert: true,
        cacheControl: "31536000",
      });
    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabase.storage.from(SUPABASE_SALES_DECKS_BUCKET).getPublicUrl(path);
    pageImageUrls.push(publicUrl);
    onProgress?.({ page: pageNumber, total: pageCount, phase: "upload" });
  }

  const { error: updateError } = await supabase
    .from("sales_decks")
    .update({
      page_count: pageCount,
      page_image_urls: pageImageUrls,
    })
    .eq("id", deckId);

  if (updateError) throw updateError;

  return { pageCount, pageImageUrls };
}
