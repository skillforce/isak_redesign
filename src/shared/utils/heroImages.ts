import heroDesktop from "../../assets/metal/hero-desktop.avif";
import heroMobile from "../../assets/metal/hero-mobile.avif";
import { avifSrcset, webpFallback, type ImageStep } from "./responsiveImage";

export const HERO_MOBILE_MEDIA = "(max-width: 767px)";
export const HERO_DESKTOP_MEDIA = "(min-width: 768px)";
export const HERO_MOBILE_SIZES = "100vw";
// The image column is ~49% of the viewport and stops growing at ~712px.
export const HERO_DESKTOP_SIZES = "min(49vw, 712px)";

// [width, quality]: lowest quality with SSIM >= 0.93 vs the original PNG.
// Mobile covers 360–430px screens at DPR 1.75–3; desktop covers 380–712px at DPR 1–2.
const MOBILE_STEPS: ImageStep[] = [
  [480, 60],
  [640, 56],
  [720, 54],
  [780, 52],
  [860, 50],
  [1024, 49],
];
const DESKTOP_STEPS: ImageStep[] = [
  [400, 58],
  [560, 54],
  [720, 50],
  [1024, 45],
];

export const heroImages = {
  width: heroDesktop.width,
  height: heroDesktop.height,
  mobileAvif: await avifSrcset(heroMobile, MOBILE_STEPS),
  mobileWebp: await webpFallback(heroMobile, [720, 58]),
  desktopAvif: await avifSrcset(heroDesktop, DESKTOP_STEPS),
  desktopWebp: await webpFallback(heroDesktop, [1024, 39]),
};
