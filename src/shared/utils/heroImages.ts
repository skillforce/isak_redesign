import { getImage } from "astro:assets";
import heroDesktop from "../../assets/metal/hero-desktop.png";
import heroMobile from "../../assets/metal/hero-mobile.png";

// AVIF q56 and WebP q81 measure the same SSIM against the source (~0.95).
const AVIF_QUALITY = 56;
const WEBP_QUALITY = 81;

export const HERO_MOBILE_MEDIA = "(max-width: 767px)";
export const HERO_DESKTOP_MEDIA = "(min-width: 768px)";
export const HERO_MOBILE_SIZES = "100vw";
// The image column is ~49% of the viewport, capped by the 1440px layout.
export const HERO_DESKTOP_SIZES = "min(49vw, 705px)";

const variant = async (
  src: ImageMetadata,
  widths: number[],
  format: "avif" | "webp",
  quality: number
) => {
  const image = await getImage({ src, widths, format, quality });
  return image.srcSet.attribute;
};

export const heroImages = {
  width: heroDesktop.width,
  height: heroDesktop.height,
  mobileAvif: await variant(heroMobile, [600, 900], "avif", AVIF_QUALITY),
  mobileWebp: await variant(heroMobile, [600, 900], "webp", WEBP_QUALITY),
  desktopAvif: await variant(heroDesktop, [480, 720, 1024], "avif", AVIF_QUALITY),
  desktopWebp: await variant(heroDesktop, [480, 720, 1024], "webp", WEBP_QUALITY),
  fallbackSrc: (
    await getImage({ src: heroDesktop, width: 1024, format: "webp", quality: WEBP_QUALITY })
  ).src,
};
