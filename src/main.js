import { ScrollTrigger } from "gsap/ScrollTrigger";
import { initHeader, initSplitHeadlines, initSplitResize } from "./shared.js";
import { initParallax, initSectionReveals, initMarks } from "./effects.js";
import { initParallaxMedia } from "./sections/parallax-media.js";
import { initAgency } from "./sections/agency.js";
import { initExpertise } from "./sections/expertise.js";
import { initProjects } from "./sections/projects.js";
import { initProjectVideo } from "./sections/project-video.js";
import { initProjectSlideshow } from "./sections/project-slideshow.js";
import { initWorkVideo } from "./sections/work-video.js";
import { initBridgeAssemble } from "./sections/bridge-assemble.js";
import { initMethod } from "./sections/method.js";
import { initStandard } from "./sections/standard.js";
import { initContactForm } from "./sections/contact.js";
import { initMicroFx } from "./sections/micro-fx.js";

initHeader();
initSplitHeadlines();
initSplitResize();
initSectionReveals();
initMarks();
initParallax();
initParallaxMedia();

initAgency();
initExpertise();
initProjects();
initProjectVideo();
initProjectSlideshow();
initWorkVideo();
initBridgeAssemble();
initMethod();
initStandard();
initContactForm();
initMicroFx();

document.documentElement.classList.add("is-loaded");

// Wysokości sekcji zależą od kadrów — po ich wczytaniu przeliczamy triggery.
// (Bezpiecznik odsłaniania treści siedzi w shared.js — wspólny dla wszystkich stron.)
window.addEventListener("load", () => ScrollTrigger.refresh());
