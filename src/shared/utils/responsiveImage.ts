import { getImage } from "astro:assets";

/** One srcset candidate: output width in px and the encoder quality for it. */
export type ImageStep = readonly [width: number, quality: number];

/**
 * Optional crop baked into every rendition: when the image is always shown
 * through `object-fit: cover` in a box of a fixed aspect ratio, pixels the
 * box always hides need not be downloaded.
 */
export interface ImageCrop {
  /** Width / height of the output. */
  aspect: number;
  /** Which part to keep, as for `object-position` (e.g. "bottom"). */
  position: string;
}

const geometry = (width: number, crop?: ImageCrop) =>
  crop
    ? { width, height: Math.round(width / crop.aspect), fit: "cover" as const, position: crop.position }
    : { width };

/**
 * Builds an AVIF srcset where every width has its own quality.
 *
 * Smaller renditions need a higher quality to keep the same fidelity, so a
 * single quality for all widths either wastes bytes on large files or blurs
 * small ones. The per-width qualities live next to each image and are the
 * lowest values that keep SSIM >= 0.93 (<= 7% loss) against the original PNG.
 */
export async function avifSrcset(
  src: ImageMetadata,
  steps: readonly ImageStep[],
  crop?: ImageCrop
) {
  const candidates = await Promise.all(
    steps.map(async ([width, quality]) => {
      const image = await getImage({ src, ...geometry(width, crop), format: "avif", quality });
      return `${image.src} ${width}w`;
    })
  );
  return candidates.join(", ");
}

/** Single WebP file for the few browsers without AVIF support. */
export async function webpFallback(
  src: ImageMetadata,
  [width, quality]: ImageStep,
  crop?: ImageCrop
) {
  return (await getImage({ src, ...geometry(width, crop), format: "webp", quality })).src;
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
