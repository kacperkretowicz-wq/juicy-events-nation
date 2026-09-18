// Karta "Nasza praca": wyciszony podgląd (krótki klip); po kliknięciu — pełny showreel z dźwiękiem.
import { claimAudio, releaseAudio } from "../audio-bus.js";

export function initWorkVideo() {
  const group = document.querySelector("[data-work-video-group]");
  const video = group?.querySelector("[data-work-video]");
  const triggers = [...(group?.querySelectorAll("[data-work-video-trigger]") ?? [])];
  const playBtn = group?.querySelector(".work__play");
  if (!group || !video || !triggers.length) return;

  const previewSrc = video.dataset.workPreview || video.getAttribute("src") || "";
  const showreelSrc = video.dataset.workShowreel || "";
  let mode = "preview";

  const showreelPreload = document.createElement("video");
  if (showreelSrc) {
    showreelPreload.muted = true;
    showreelPreload.playsInline = true;
    showreelPreload.preload = "auto";
    showreelPreload.src = showreelSrc;
    showreelPreload.load();
  }

  const warmShowreel = () => {
    if (!showreelSrc || showreelPreload.readyState >= 2) return;
    showreelPreload.load();
  };
  group.addEventListener("pointerenter", warmShowreel, { once: true });
  window.addEventListener("load", warmShowreel, { once: true });

  const loadPreview = () => {
    if (!previewSrc) return;
    mode = "preview";
    video.loop = true;
    video.muted = true;
    if (video.getAttribute("src") !== previewSrc) {
      video.src = previewSrc;
      video.load();
    }
    video.play().catch(() => {});
    playBtn?.classList.remove("is-exit");
  };

  const loadShowreel = () => {
    if (!showreelSrc) {
      video.currentTime = 0;
      video.loop = false;
      return Promise.resolve();
    }
    mode = "showreel";
    video.loop = false;
    video.src = showreelSrc;
    video.load();
    return new Promise((resolve) => {
      const done = () => {
        video.removeEventListener("canplay", done);
        resolve();
      };
      if (video.readyState >= 3) resolve();
      else video.addEventListener("canplay", done, { once: true });
    });
  };

  loadPreview();

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && mode === "preview") video.play().catch(() => {});
          else if (!group.classList.contains("is-expanded") && mode === "preview") video.pause();
        });
      },
      { threshold: 0.25 }
    );
    observer.observe(group);
  }

  const expand = async () => {
    group.classList.add("is-expanded");
    triggers.forEach((trigger) => trigger.setAttribute("aria-expanded", "true"));
    playBtn?.classList.add("is-exit");
    claimAudio(video);
    video.muted = false;
    await loadShowreel();
    video.currentTime = 0;
    video.play().catch(() => {});
  };

  const collapse = () => {
    group.classList.remove("is-expanded");
    triggers.forEach((trigger) => trigger.setAttribute("aria-expanded", "false"));
    playBtn?.classList.remove("is-exit");
    releaseAudio(video);
    loadPreview();
  };

  video.addEventListener("ended", () => {
    if (mode === "showreel" && group.classList.contains("is-expanded")) collapse();
  });

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
