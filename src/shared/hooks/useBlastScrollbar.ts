// Keep this condition in sync with the CSS in BlastScrollbar.astro. Touch
// devices and forced colours retain the browser's native scrollbar.
const DESKTOP_QUERY =
  "(min-width: 1024px) and (min-height: 480px) and (hover: hover) and (pointer: fine) and (forced-colors: none)";
const HEAD_START = 18;
const MODAL_SELECTOR = ".ac-modal[open]";

/**
 * Drives the desktop sandblaster scrollbar: syncs the head with the page
 * scroll, handles dragging and keyboard input, and toggles the native
 * scrollbar. Returns a cleanup function that removes every listener.
 */
export function useBlastScrollbar(scrollbar: HTMLElement): () => void {
  const rail = scrollbar.querySelector<HTMLElement>("[data-blast-rail]");
  if (!rail) return () => {};

  const desktop = window.matchMedia(DESKTOP_QUERY);
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const page = document.documentElement;
  const controller = new AbortController();
  const { signal } = controller;
  let active = false;
  let scrollRange = 0;
  let railHeight = 0;
  let headTravel = 0;
  let previousY = window.scrollY;
  let cleanedProgress = 0;
  let frame = 0;
  let sprayTimeout = 0;
  let dragPointer: number | null = null;
  let grabOffset = 0;

  const modalOpen = () => document.querySelector(MODAL_SELECTOR) !== null;

  function stopSpray() {
    window.clearTimeout(sprayTimeout);
    scrollbar.classList.remove("is-blasting");
  }

  function spray() {
    if (reducedMotion.matches || modalOpen()) return;
    scrollbar.classList.add("is-blasting");
    window.clearTimeout(sprayTimeout);
    sprayTimeout = window.setTimeout(stopSpray, 160);
  }

  function render() {
    frame = 0;
    if (!active) return;

    const y = Math.max(0, Math.min(scrollRange, window.scrollY));
    const progress = scrollRange > 0 ? y / scrollRange : 0;
    const percent = Math.round(progress * 100);

    if (y > previousY + 0.1) spray();
    else if (y < previousY) stopSpray();
    previousY = y;

    // Keep the tool visible at the top, then let the nozzle reach the
    // viewport's bottom even when the cup has already moved offscreen.
    const position = HEAD_START + progress * headTravel;
    const cleanFront = progress === 0 ? 0 : position / railHeight;
    // The metal stays clean when the visitor scrolls back up.
    cleanedProgress = Math.max(cleanedProgress, cleanFront);
    scrollbar.style.setProperty("--blast-position", `${position}px`);
    scrollbar.style.setProperty("--blast-cleaned", `${cleanedProgress * 100}%`);
    scrollbar.setAttribute("aria-valuenow", String(percent));
    scrollbar.setAttribute("aria-valuetext", `${percent}% страницы`);
  }

  function queueRender() {
    if (active && !frame) frame = requestAnimationFrame(render);
  }

  function endDrag() {
    if (dragPointer !== null && scrollbar.hasPointerCapture(dragPointer)) {
      scrollbar.releasePointerCapture(dragPointer);
    }
    dragPointer = null;
    scrollbar.classList.remove("is-dragging");
  }

  function measure() {
    const canScroll = page.scrollHeight > window.innerHeight + 1;
    active = desktop.matches && canScroll;
    scrollbar.hidden = !active;
    page.classList.toggle("blast-scrollbar-enabled", active);

    if (!active) {
      endDrag();
      stopSpray();
      return;
    }

    scrollRange = Math.max(0, page.scrollHeight - window.innerHeight);
    railHeight = rail!.clientHeight;
    headTravel = Math.max(1, railHeight - HEAD_START);
    render();
  }

  function moveTo(clientY: number) {
    if (!active || headTravel <= 0) return;
    const top = rail!.getBoundingClientRect().top;
    const progress = Math.max(
      0,
      Math.min(1, (clientY - top - grabOffset - HEAD_START) / headTravel)
    );
    window.scrollTo({ top: progress * scrollRange, behavior: "instant" });
  }

  function onPointerDown(event: PointerEvent) {
    if (!active || event.button !== 0 || modalOpen()) return;
    const onHead =
      event.target instanceof Element &&
      event.target.closest("[data-blast-head]");
    const progress = scrollRange > 0 ? window.scrollY / scrollRange : 0;
    const position = HEAD_START + progress * headTravel;
    grabOffset = onHead
      ? event.clientY - rail!.getBoundingClientRect().top - position
      : 0;
    dragPointer = event.pointerId;
    scrollbar.setPointerCapture(event.pointerId);
    scrollbar.classList.add("is-dragging");
    scrollbar.focus({ preventScroll: true });
    event.preventDefault();
    moveTo(event.clientY);
  }

  function onPointerMove(event: PointerEvent) {
    if (event.pointerId === dragPointer) moveTo(event.clientY);
  }

  function onKeyDown(event: KeyboardEvent) {
    if (
      !active ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      modalOpen()
    )
      return;
    let top = window.scrollY;
    switch (event.key) {
      case "ArrowDown":
        top += 80;
        break;
      case "ArrowUp":
        top -= 80;
        break;
      case "PageDown":
        top += window.innerHeight * 0.85;
        break;
      case "PageUp":
        top -= window.innerHeight * 0.85;
        break;
      case "Home":
        top = 0;
        break;
      case "End":
        top = scrollRange;
        break;
      case " ":
        top += window.innerHeight * (event.shiftKey ? -0.85 : 0.85);
        break;
      default:
        return;
    }
    event.preventDefault();
    window.scrollTo({
      top: Math.max(0, Math.min(scrollRange, top)),
      behavior: "instant",
    });
  }

  scrollbar.addEventListener("pointerdown", onPointerDown, { signal });
  scrollbar.addEventListener("pointermove", onPointerMove, { signal });
  scrollbar.addEventListener("pointerup", endDrag, { signal });
  scrollbar.addEventListener("pointercancel", endDrag, { signal });
  scrollbar.addEventListener("lostpointercapture", endDrag, { signal });
  scrollbar.addEventListener("keydown", onKeyDown, { signal });

  window.addEventListener("scroll", queueRender, { passive: true, signal });
  window.addEventListener("resize", measure, { signal });
  window.addEventListener("pageshow", measure, { signal });
  window.addEventListener("load", measure, { once: true, signal });
  desktop.addEventListener("change", measure, { signal });
  reducedMotion.addEventListener("change", stopSpray, { signal });
  const resizeObserver = new ResizeObserver(measure);
  resizeObserver.observe(document.body);
  measure();

  return () => {
    controller.abort();
    resizeObserver.disconnect();
    cancelAnimationFrame(frame);
    endDrag();
    stopSpray();
    page.classList.remove("blast-scrollbar-enabled");
    scrollbar.hidden = true;
  };
}
