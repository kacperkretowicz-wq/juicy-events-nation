import { ScrollTrigger } from "gsap/ScrollTrigger";
import { syncHeadlineReveals } from "./effects.js";
import { rebuildParallaxMedia } from "./sections/parallax-media.js";

let settleTimer = null;

/** Przeliczenie pinów / parallax — po intro, nie przy `load` zanim layout się ustabilizuje. */
export function settleScrollLayout() {
  clearTimeout(settleTimer);
  settleTimer = setTimeout(() => {
    rebuildParallaxMedia();
    syncHeadlineReveals();
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, 80);
}

export function bindScrollLayoutSettle() {
  const intro = document.querySelector("[data-hero-intro]");

  if (intro) {
    document.addEventListener("jen:intro-done", () => settleScrollLayout(), { once: true });
    document.fonts?.ready?.then(() => {
      if (!document.querySelector("[data-hero-intro]")) settleScrollLayout();
    });
    return;
  }

  window.addEventListener("load", () => settleScrollLayout(), { once: true });
  document.fonts?.ready?.then(() => settleScrollLayout());
}
