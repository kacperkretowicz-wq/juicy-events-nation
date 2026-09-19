import { ScrollTrigger } from "gsap/ScrollTrigger";
import { initHeader, initSplitHeadlines, initSplitResize } from "./shared.js";
import { initParallax, initSectionReveals, initMarks, syncHeadlineReveals } from "./effects.js";
import { initParallaxMedia, rebuildParallaxMedia } from "./sections/parallax-media.js";
import { initHeroIntro } from "./sections/hero-intro.js";
import { initAgency } from "./sections/agency.js";
import { initHeroReel } from "./sections/hero-reel.js";
import { initExpertise } from "./sections/expertise.js";
import { initProjects, initProjectCoverDrift } from "./sections/projects.js";
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
initProjectCoverDrift();
initProjectVideo();
initProjectSlideshow();
initWorkVideo();
initMission();
initSectionReveals();
initMicroFx();
initFloatCta();

bootSiteClosing();

document.documentElement.classList.add("is-loaded");

initParallaxMedia();
syncHeadlineReveals({ refresh: false });

let layoutFinalized = false;
const finalizeScrollLayout = () => {
  if (layoutFinalized) return;
  layoutFinalized = true;
  rebuildParallaxMedia();
  syncHeadlineReveals();
};

document.addEventListener("jen:intro-done", finalizeScrollLayout);
window.addEventListener("load", finalizeScrollLayout);
document.fonts?.ready?.then(finalizeScrollLayout);
