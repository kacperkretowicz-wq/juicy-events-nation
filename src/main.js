import { initHeader, initSplitHeadlines, initSplitResize, whenFontsReady } from "./shared.js";
import { initParallax, initSectionReveals, initMarks, syncHeadlineReveals } from "./effects.js";
import { initParallaxMedia } from "./sections/parallax-media.js";
import { bindScrollLayoutSettle } from "./scroll-layout.js";
import { initHeroIntro } from "./sections/hero-intro.js";
import { initAgency } from "./sections/agency.js";
import { initHeroReel } from "./sections/hero-reel.js";
import { initExpertise } from "./sections/expertise.js";
import { initProjects, initProjectCoverDrift } from "./sections/projects.js";
import { initProjectVideo } from "./sections/project-video.js";
import { initProjectSlideshow } from "./sections/project-slideshow.js";
import { initProjectHover } from "./sections/project-hover.js";
import { initWorkVideo } from "./sections/work-video.js";
import { initMarquees } from "./sections/marquee.js";
import { initMission } from "./sections/mission.js";
import { bootSiteClosing } from "./site-closing-boot.js";
import { initMicroFx } from "./sections/micro-fx.js";
import { initFloatCta } from "./sections/float-cta.js";
import { initPaletteLab } from "./palette-lab.js";

initPaletteLab();
initHeader();
initHeroIntro();
initHeroReel();

whenFontsReady().then(() => {
  initSplitHeadlines();
  initSplitResize();
  initMarks();
  initParallax();

  initAgency();
  initWorkVideo();
  initMarquees();
  initExpertise();
  initProjects();
  initProjectCoverDrift();
  initProjectVideo();
  initProjectSlideshow();
  initProjectHover();
  initMission();
  initSectionReveals();
  initMicroFx();
  initFloatCta();

  bootSiteClosing();

  document.documentElement.classList.add("is-loaded");

  initParallaxMedia();
  syncHeadlineReveals({ refresh: false });
  bindScrollLayoutSettle();
});
