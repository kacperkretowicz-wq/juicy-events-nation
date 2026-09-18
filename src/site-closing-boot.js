import { syncHeadlineReveals } from "./effects.js";
import { initSiteClosing } from "./sections/contact.js";
import { initParallaxMedia, rebuildParallaxMedia } from "./sections/parallax-media.js";

/** Kontakt + parallax kadru — ten sam blok na każdej podstronie. */
export function bootSiteClosing() {
  initSiteClosing();
  initParallaxMedia();
  rebuildParallaxMedia();
  syncHeadlineReveals();

  window.addEventListener("load", () => {
    rebuildParallaxMedia();
    syncHeadlineReveals();
  });
  document.addEventListener("jen:intro-done", () => {
    rebuildParallaxMedia();
    syncHeadlineReveals();
  });
}
