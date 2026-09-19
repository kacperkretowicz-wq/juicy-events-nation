import { ScrollTrigger } from "gsap/ScrollTrigger";
import { initHeader, initSplitHeadlines, initSplitResize } from "./shared.js";
import { initSectionReveals, syncHeadlineReveals } from "./effects.js";
import { initProjects } from "./sections/projects.js";
import { initLightbox } from "./sections/lightbox.js";
import { initMicroFx } from "./sections/micro-fx.js";
import { initFloatCta } from "./sections/float-cta.js";
import { bootSiteClosing } from "./site-closing-boot.js";
import { bindScrollLayoutSettle } from "./scroll-layout.js";

initHeader();
initSplitHeadlines();
initSplitResize();
initSectionReveals();
initProjects();
initLightbox();
initMicroFx();
initFloatCta();
bootSiteClosing();

document.documentElement.classList.add("is-loaded");
syncHeadlineReveals({ refresh: false });
bindScrollLayoutSettle();
