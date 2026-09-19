import { initHeader, initSplitHeadlines, initSplitResize } from "./shared.js";
import { initSectionReveals, syncHeadlineReveals } from "./effects.js";
import { initProjects } from "./sections/projects.js";
import { initLightbox } from "./sections/lightbox.js";
import { bootSiteClosing } from "./site-closing-boot.js";
import { bindScrollLayoutSettle } from "./scroll-layout.js";
import { initMicroFx } from "./sections/micro-fx.js";
import { initFloatCta } from "./sections/float-cta.js";

initHeader();
initSplitHeadlines();
initSplitResize();
initSectionReveals();
initProjects();
initLightbox();
initMicroFx();

const video = document.querySelector("[data-realizacje-video]");

if (video && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      });
    },
    { threshold: 0.25 }
  );
  observer.observe(video);
}

initFloatCta();
bootSiteClosing();

document.documentElement.classList.add("is-loaded");
syncHeadlineReveals({ refresh: false });
bindScrollLayoutSettle();
