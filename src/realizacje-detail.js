import { ScrollTrigger } from "gsap/ScrollTrigger";
import { initHeader, initSplitHeadlines, initSplitResize } from "./shared.js";
import { initSectionReveals } from "./effects.js";
import { initProjects } from "./sections/projects.js";
import { initLightbox } from "./sections/lightbox.js";
import { initParallaxMedia } from "./sections/parallax-media.js";
import { claimAudio, releaseAudio } from "./audio-bus.js";
import { initMicroFx } from "./sections/micro-fx.js";
import { initFloatCta } from "./sections/float-cta.js";

initHeader();
initSplitHeadlines();
initSplitResize();
initSectionReveals();
initProjects();
initLightbox();
initMicroFx();
initParallaxMedia();

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
  const muteUi = () => {
    video.muted = true;
    soundBtn.textContent = "Włącz dźwięk";
  };

  soundBtn.addEventListener("click", () => {
    const willUnmute = video.muted;
    if (willUnmute) {
      claimAudio(video);
      video.muted = false;
      video.currentTime = 0;
      soundBtn.textContent = "Wycisz";
    } else {
      muteUi();
      releaseAudio(video);
    }
    video.play().catch(() => {});
  });

  video.addEventListener("jen:audio-released", muteUi);
}

initFloatCta();

document.documentElement.classList.add("is-loaded");
window.addEventListener("load", () => ScrollTrigger.refresh());
