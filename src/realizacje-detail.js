import { ScrollTrigger } from "gsap/ScrollTrigger";
import { initHeader, initSplitHeadlines } from "./shared.js";
import { initSectionReveals } from "./effects.js";
import { initProjects } from "./sections/projects.js";

initHeader();
initSplitHeadlines();
initSectionReveals();
initProjects();

// Wideo w nagłówku realizacji: autoplay w viewport (bez dźwięku),
// przycisk włącza dźwięk i odtwarza od początku — jak w agency__reel-cta.
const video = document.querySelector("[data-realizacje-video]");
const soundBtn = document.querySelector("[data-realizacje-sound]");

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

if (video && soundBtn) {
  soundBtn.addEventListener("click", () => {
    const willUnmute = video.muted;
    video.muted = !willUnmute;
    if (willUnmute) video.currentTime = 0;
    video.play().catch(() => {});
    soundBtn.textContent = willUnmute ? "Wycisz" : "Włącz dźwięk";
  });
}

document.documentElement.classList.add("is-loaded");
window.addEventListener("load", () => ScrollTrigger.refresh());
