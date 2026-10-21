import { initHeader, initSplitHeadlines, initSplitResize, whenFontsReady } from "./shared.js";
import { initSectionReveals, syncHeadlineReveals } from "./effects.js";
import { initProjects } from "./sections/projects.js";
import { initLightbox } from "./sections/lightbox.js";
import { bootSiteClosing } from "./site-closing-boot.js";
import { bindScrollLayoutSettle } from "./scroll-layout.js";
import { initMicroFx } from "./sections/micro-fx.js";
import { initFloatCta } from "./sections/float-cta.js";
import { initMarquees } from "./sections/marquee.js";
import { hydrateCaseMedia } from "./sections/project-media.js";

initHeader();
// Zdjęcia z atrybutów data (case'y, których zdjęcia dopiero dojadą) — przed lightboxem.
hydrateCaseMedia();

whenFontsReady().then(() => {
  initSplitHeadlines();
  initSplitResize();
  initSectionReveals();
  initProjects();
  initLightbox();
  initMicroFx();
  initMarquees();

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

  // ← / → przechodzą do poprzedniej / następnej realizacji — ale nie, gdy otwarty jest
  // lightbox (tam strzałki przewijają zdjęcia) ani gdy fokus jest w polu formularza.
  document.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (document.querySelector(".lightbox.is-open, .mega-menu.is-open")) return;
    if (event.target.closest?.("input, textarea, select, [contenteditable]")) return;
    const link = document.querySelector(event.key === "ArrowLeft" ? "[data-case-prev]" : "[data-case-next]");
    if (link) link.click();
  });

  initFloatCta();
  bootSiteClosing();

  document.documentElement.classList.add("is-loaded");
  syncHeadlineReveals({ refresh: false });
  bindScrollLayoutSettle();
});
