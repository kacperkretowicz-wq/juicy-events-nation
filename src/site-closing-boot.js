import { initSiteClosing } from "./sections/contact.js";
import { initParallaxMedia } from "./sections/parallax-media.js";

/** Kontakt + parallax kadru — ten sam blok na każdej podstronie. */
export function bootSiteClosing() {
  initSiteClosing();
  initParallaxMedia();
}
