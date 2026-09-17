import { ScrollTrigger } from "gsap/ScrollTrigger";
import { initHeader, initSplitHeadlines, initSplitResize } from "./shared.js";
import { initParallax, initSectionReveals, initMarks } from "./effects.js";
import { initParallaxMedia } from "./sections/parallax-media.js";
import { initAgency } from "./sections/agency.js";
import { initHeroReel } from "./sections/hero-reel.js";
import { initExpertise } from "./sections/expertise.js";
import { initProjects } from "./sections/projects.js";
import { initProjectVideo } from "./sections/project-video.js";
import { initProjectSlideshow } from "./sections/project-slideshow.js";
import { initWorkVideo } from "./sections/work-video.js";
import { initMission } from "./sections/mission.js";
import { initContactForm } from "./sections/contact.js";
import { initMicroFx } from "./sections/micro-fx.js";
import { initFloatCta } from "./sections/float-cta.js";

initHeader();
initSplitHeadlines();
initSplitResize();
initSectionReveals();
initMarks();
initParallax();
initParallaxMedia();

initAgency();
initHeroReel();
initExpertise();
initProjects();
initProjectVideo();
initProjectSlideshow();
initWorkVideo();
initMission();
initContactForm();
initMicroFx();
initFloatCta();

document.documentElement.classList.add("is-loaded");

// Wysokości sekcji zależą od kadrów — po ich wczytaniu przeliczamy triggery.
// (Bezpiecznik odsłaniania treści siedzi w shared.js — wspólny dla wszystkich stron.)
window.addEventListener("load", () => ScrollTrigger.refresh());
