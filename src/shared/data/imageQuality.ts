import posterFirstVideo from "../../assets/video/posterFirstVideo.avif";
import posterSecondVideo from "../../assets/video/posterSecondVideo.avif";
import classicImage from "../../assets/tool/tool.avif";
import ecoImg from "../../assets/tool/eco.avif";
import titanImg from "../../assets/tool/titan.avif";
import optionOneImg from "../../assets/tool/options/var_1.avif";
import optionTwoImg from "../../assets/tool/options/var_2.avif";
import optionThreeImg from "../../assets/tool/options/var_3.avif";
import type { ImageStep } from "../utils/responsiveImage";

/**
 * Encoder settings per image: [width, quality] for each AVIF rendition plus
 * one WebP fallback. Qualities are the lowest that keep SSIM >= 0.93
 * (<= 7% loss) against the source, measured on content pixels only (the
 * opaque product, or text/edges/detail on posters) so flat backgrounds do
 * not hide artifacts. Floor of 30: tiny renditions fool the metric.
 */
interface ImageQuality {
  avif: ImageStep[];
  webp: ImageStep;
}

/** Thumbnails: contain-fit into a 112px-tall box; steps are 1x, 2x, 3x. */
const THUMBS = new Map<ImageMetadata, ImageQuality>([
  [ecoImg, { avif: [[73, 32], [145, 39], [217, 40]], webp: [145, 30] }],
  [classicImage, { avif: [[61, 32], [122, 32], [182, 37]], webp: [122, 30] }],
  [titanImg, { avif: [[71, 30], [141, 30], [212, 37]], webp: [141, 30] }],
  [optionOneImg, { avif: [[89, 30], [177, 30], [265, 30]], webp: [177, 30] }],
  [optionTwoImg, { avif: [[84, 30], [168, 30], [252, 32]], webp: [168, 30] }],
  [optionThreeImg, { avif: [[71, 30], [141, 30], [212, 35]], webp: [141, 30] }],
]);

/** Video posters: 328–569px wide at DPR 1–3. */
const POSTERS = new Map<ImageMetadata, ImageQuality>([
  [posterFirstVideo, { avif: [[400, 35], [560, 34], [760, 32], [1140, 32]], webp: [760, 32] }],
  [posterSecondVideo, { avif: [[400, 34], [560, 32], [760, 32], [1140, 30]], webp: [760, 30] }],
]);

const lookup = (table: Map<ImageMetadata, ImageQuality>, image: ImageMetadata) => {
  const quality = table.get(image);
  if (!quality) throw new Error(`No encoder settings for ${image.src}: add it to imageQuality.ts`);
  return quality;
};

export const thumbQuality = (image: ImageMetadata) => lookup(THUMBS, image);
export const posterQuality = (image: ImageMetadata) => lookup(POSTERS, image);
