import { ScrollTrigger } from "gsap/ScrollTrigger";
import { initHeader, initSplitHeadlines, initSplitResize } from "./shared.js";
import { initParallax, initSectionReveals, initMarks, syncHeadlineReveals } from "./effects.js";
import { rebuildParallaxMedia } from "./sections/parallax-media.js";
import { initHeroIntro } from "./sections/hero-intro.js";
import { initAgency } from "./sections/agency.js";
import { initHeroReel } from "./sections/hero-reel.js";
import { initExpertise } from "./sections/expertise.js";
import { initProjects } from "./sections/projects.js";
import { initProjectVideo } from "./sections/project-video.js";
import { initProjectSlideshow } from "./sections/project-slideshow.js";
import { initWorkVideo } from "./sections/work-video.js";
import { initMission } from "./sections/mission.js";
import { bootSiteClosing } from "./site-closing-boot.js";
import { initMicroFx } from "./sections/micro-fx.js";
import { initFloatCta } from "./sections/float-cta.js";

initHeader();
initSplitHeadlines();
initSplitResize();
initMarks();
initParallax();

initHeroIntro();
initAgency();
initHeroReel();
initExpertise();
initProjects();
initProjectVideo();
initProjectSlideshow();
initWorkVideo();
initMission();
initSectionReveals();
initMicroFx();
initFloatCta();

bootSiteClosing();

document.documentElement.classList.add("is-loaded");

rebuildParallaxMedia();
syncHeadlineReveals();

window.addEventListener("load", () => {
  rebuildParallaxMedia();
  syncHeadlineReveals();
});
setTimeout(() => {
  rebuildParallaxMedia();
  syncHeadlineReveals();
}, 4500);
document.addEventListener("jen:intro-done", () => {
  rebuildParallaxMedia();
  syncHeadlineReveals();
});
