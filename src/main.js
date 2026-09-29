import { initHeader, initSplitHeadlines, initSplitResize, whenFontsReady } from "./shared.js";
import { initSectionReveals, syncHeadlineReveals } from "./effects.js";
import { initParallaxMedia } from "./sections/parallax-media.js";
import { bindScrollLayoutSettle } from "./scroll-layout.js";
import { initHeroIntro } from "./sections/hero-intro.js";
import { initAgency } from "./sections/agency.js";
import { initHeroReel } from "./sections/hero-reel.js";
import { initProjects } from "./sections/projects.js";
import { initProjectVideo } from "./sections/project-video.js";
import { initProjectSlideshow } from "./sections/project-slideshow.js";
import { initWorkVideo } from "./sections/work-video.js";
import { bootSiteClosing } from "./site-closing-boot.js";
import { initMicroFx } from "./sections/micro-fx.js";
import { initFloatCta } from "./sections/float-cta.js";

// Po feedbacku 2026-09-28 („za dużo efektów”) strona główna nie ma już: pętli
// logotypów i wordmarku, rotatora słów w misji, podświetlanej listy kompetencji,
// etykiety za kursorem, magnetycznych przycisków ani laboratorium palet.
initHeader();
initHeroIntro();
initHeroReel();

whenFontsReady().then(() => {
  initSplitHeadlines();
  initSplitResize();

  initAgency();
  initWorkVideo();
  initProjects();
  initProjectVideo();
  initProjectSlideshow();
  initSectionReveals();
  initMicroFx();
  initFloatCta();

  bootSiteClosing();

  document.documentElement.classList.add("is-loaded");

  initParallaxMedia();
  syncHeadlineReveals({ refresh: false });
  bindScrollLayoutSettle();
});
