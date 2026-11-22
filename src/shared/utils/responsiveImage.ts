import { getImage } from "astro:assets";

/** One srcset candidate: output width in px and the encoder quality for it. */
export type ImageStep = readonly [width: number, quality: number];

/**
 * Builds an AVIF srcset where every width has its own quality.
 *
 * Smaller renditions need a higher quality to keep the same fidelity, so a
 * single quality for all widths either wastes bytes on large files or blurs
 * small ones. The per-width qualities live next to each image and are the
 * lowest values that keep SSIM >= 0.93 (<= 7% loss) against the original PNG.
 */
export async function avifSrcset(src: ImageMetadata, steps: readonly ImageStep[]) {
  const candidates = await Promise.all(
    steps.map(async ([width, quality]) => {
      const image = await getImage({ src, width, format: "avif", quality });
      return `${image.src} ${width}w`;
    })
  );
  return candidates.join(", ");
}

/** Single WebP file for the few browsers without AVIF support. */
export async function webpFallback(src: ImageMetadata, [width, quality]: ImageStep) {
  return (await getImage({ src, width, format: "webp", quality })).src;
}

/**
 * Density srcset (1x, 2x, 3x…) for images drawn at a fixed CSS size,
 * e.g. thumbnails that `object-fit: contain` into a fixed-height box.
 */
export async function avifDensitySrcset(src: ImageMetadata, steps: readonly ImageStep[]) {
  const candidates = await Promise.all(
    steps.map(async ([width, quality], i) => {
      const image = await getImage({ src, width, format: "avif", quality });
      return `${image.src} ${i + 1}x`;
    })
  );
  return candidates.join(", ");
}

/**
 * Transparent 1×1 GIF shown until the lazy loader swaps in the real image
 * (see LazyImages.astro). Keeps the <img> from rendering its alt text.
 */
export const LAZY_PLACEHOLDER =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
