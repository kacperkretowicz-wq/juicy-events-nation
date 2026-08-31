import { ScrollTrigger } from "gsap/ScrollTrigger";
import { initHeader, initSplitHeadlines, initSplitResize } from "./shared.js";
import { initSectionReveals } from "./effects.js";
import { initProjects } from "./sections/projects.js";
import { initLightbox } from "./sections/lightbox.js";
import { initMicroFx } from "./sections/micro-fx.js";

initHeader();
initSplitHeadlines();
initSplitResize();
initSectionReveals();
initProjects();
initLightbox();
initMicroFx();

document.documentElement.classList.add("is-loaded");
window.addEventListener("load", () => ScrollTrigger.refresh());
