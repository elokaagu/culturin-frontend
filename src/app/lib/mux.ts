import muxBlurHash from "@mux/blurhash";

const getBlurHash = async (): Promise<void> => {
  const playbackId = "Hf9691bovUrlcAHV2CIqHm1uwUGmZJAg00tUvz2geu8s";
  const { blurHashBase64, sourceWidth, sourceHeight } = await muxBlurHash(
    playbackId
  );
};
