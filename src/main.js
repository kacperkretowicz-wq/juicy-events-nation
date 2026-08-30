import { ScrollTrigger } from "gsap/ScrollTrigger";
import { initHeader, initSplitHeadlines } from "./shared.js";
import { initParallax, initSectionReveals } from "./effects.js";
import { initAgency } from "./sections/agency.js";
import { initExpertise } from "./sections/expertise.js";
import { initProjects } from "./sections/projects.js";
import { initProjectVideo } from "./sections/project-video.js";
import { initProjectSlideshow } from "./sections/project-slideshow.js";
import { initWorkVideo } from "./sections/work-video.js";
import { initHeroReelCursor } from "./sections/hero-reel-cursor.js";
import { initMethod } from "./sections/method.js";
import { initStandard } from "./sections/standard.js";
import { initContactForm } from "./sections/contact.js";

initHeader();
initSplitHeadlines();
initSectionReveals();
initParallax();

initAgency();
initHeroReelCursor();
initExpertise();
initProjects();
initProjectVideo();
initProjectSlideshow();
initWorkVideo();
initMethod();
initStandard();
initContactForm();

document.documentElement.classList.add("is-loaded");

// Wysokości sekcji zależą od kadrów — po ich wczytaniu przeliczamy triggery.
window.addEventListener("load", () => ScrollTrigger.refresh());
