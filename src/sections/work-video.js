// Karta "Nasza praca": mały, wyciszony podgląd wideo w viewport; po kliknięciu
// (karty lub podpisu) rozwija się do pełnego rozmiaru, chowa podpis i odtwarza
// showreel z dźwiękiem od początku.
import { claimAudio, releaseAudio } from "../audio-bus.js";

export function initWorkVideo() {
  const group = document.querySelector("[data-work-video-group]");
  const video = group?.querySelector("[data-work-video]");
  const triggers = [...(group?.querySelectorAll("[data-work-video-trigger]") ?? [])];
  if (!group || !video || !triggers.length) return;

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) video.play().catch(() => {});
          else if (!group.classList.contains("is-expanded")) video.pause();
        });
      },
      { threshold: 0.25 }
    );
    observer.observe(group);
  }

  const expand = () => {
    group.classList.add("is-expanded");
    triggers.forEach((trigger) => trigger.setAttribute("aria-expanded", "true"));
    claimAudio(video);
    video.muted = false;
    video.currentTime = 0;
    video.play().catch(() => {});
  };

  const collapse = () => {
    group.classList.remove("is-expanded");
    triggers.forEach((trigger) => trigger.setAttribute("aria-expanded", "false"));
    video.muted = true;
    releaseAudio(video);
  };

  // Inny film przejął dźwięk — zwiń tę sekcję.
  video.addEventListener("jen:audio-released", () => {
    if (group.classList.contains("is-expanded")) collapse();
  });

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      event.stopPropagation();
      if (group.classList.contains("is-expanded")) collapse();
      else expand();
    });
  });

  document.addEventListener("click", (event) => {
    if (!group.classList.contains("is-expanded") || group.contains(event.target)) return;
    collapse();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") collapse();
  });
}
