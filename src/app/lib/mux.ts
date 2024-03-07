import muxBlurHash from "@mux/blurhash";

export const getBlurHash = async () => {
  const playbackId = "Hf9691bovUrlcAHV2CIqHm1uwUGmZJAg00tUvz2geu8s";
  const { blurHashBase64 } = await muxBlurHash(playbackId);
  return blurHashBase64; // Return the blur hash string
};
