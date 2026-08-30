import { ScrollTrigger } from "gsap/ScrollTrigger";
import { initHeader, initSplitHeadlines } from "./shared.js";
import { initSectionReveals } from "./effects.js";
import { initProjects } from "./sections/projects.js";

initHeader();
initSplitHeadlines();
initSectionReveals();
initProjects();

document.documentElement.classList.add("is-loaded");
window.addEventListener("load", () => ScrollTrigger.refresh());
