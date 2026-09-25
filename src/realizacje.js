import { ScrollTrigger } from "gsap/ScrollTrigger";
import { initHeader, initSplitHeadlines, initSplitResize, whenFontsReady } from "./shared.js";
import { initSectionReveals, syncHeadlineReveals } from "./effects.js";
import { initProjects } from "./sections/projects.js";
import { initProjectVideo } from "./sections/project-video.js";
import { initProjectSlideshow } from "./sections/project-slideshow.js";
import { initProjectHover } from "./sections/project-hover.js";
import { initMarquees } from "./sections/marquee.js";
import { initLightbox } from "./sections/lightbox.js";
import { initMicroFx } from "./sections/micro-fx.js";
import { initFloatCta } from "./sections/float-cta.js";
import { bootSiteClosing } from "./site-closing-boot.js";
import { bindScrollLayoutSettle } from "./scroll-layout.js";

initHeader();

whenFontsReady().then(() => {
  initSplitHeadlines();
  initSplitResize();
  initSectionReveals();
  initProjects();
  initProjectVideo();
  initProjectSlideshow();
  initProjectHover();
  initMarquees();
  initLightbox();
  initMicroFx();
  initFloatCta();
  bootSiteClosing();

  document.documentElement.classList.add("is-loaded");
  syncHeadlineReveals({ refresh: false });
  bindScrollLayoutSettle();
});
