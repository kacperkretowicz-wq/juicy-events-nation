import { syncHeadlineReveals } from "./effects.js";
import { initSiteClosing } from "./sections/contact.js";
import { initParallaxMedia, rebuildParallaxMedia } from "./sections/parallax-media.js";

/** Kontakt + parallax kadru — ten sam blok na każdej podstronie. */
export function bootSiteClosing() {
  initSiteClosing();
  initParallaxMedia();
  syncHeadlineReveals({ refresh: false });

  let layoutFinalized = false;
  const finalizeScrollLayout = () => {
    if (layoutFinalized) return;
    layoutFinalized = true;
    rebuildParallaxMedia();
    syncHeadlineReveals();
  };

  window.addEventListener("load", finalizeScrollLayout);
  document.fonts?.ready?.then(finalizeScrollLayout);
  document.addEventListener("jen:intro-done", finalizeScrollLayout);
}
