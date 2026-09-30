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
  let returnFocus = null;

  video.preload = "auto";
  video.muted = true;
  video.playsInline = true;

  const showreelPreload = document.createElement("video");
  if (showreelSrc) {
    showreelPreload.muted = true;
    showreelPreload.playsInline = true;
    showreelPreload.preload = "auto";
    showreelPreload.src = showreelSrc;
    showreelPreload.load();
  }

  const tryPlayPreview = () => {
    if (mode !== "preview" || group.classList.contains("is-expanded")) return;
    video.play().catch(() => {});
  };

  const onPreviewReady = () => {
    video.removeEventListener("loadeddata", onPreviewReady);
    video.removeEventListener("canplay", onPreviewReady);
    tryPlayPreview();
  };

  video.addEventListener("loadeddata", onPreviewReady);
  video.addEventListener("canplay", onPreviewReady);
  video.addEventListener(
    "playing",
    () => {
      video.removeAttribute("poster");
    },
    { once: true }
  );

  const loadPreview = () => {
    if (!previewSrc) return;
    mode = "preview";
    video.loop = true;
    video.muted = true;
    if (video.getAttribute("src") !== previewSrc) {
      video.src = previewSrc;
      video.load();
    }
    tryPlayPreview();
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
      if (video.readyState >= 2) resolve();
      else video.addEventListener("canplay", done, { once: true });
    });
  };

  loadPreview();
  document.addEventListener("jen:intro-done", tryPlayPreview, { once: true });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && mode === "preview") tryPlayPreview();
          else if (!group.classList.contains("is-expanded") && mode === "preview") video.pause();
        });
      },
      { threshold: 0.08, rootMargin: "120px 0px" }
    );
    observer.observe(group);
  }

  const expand = async () => {
    returnFocus = document.activeElement;
    group.classList.add("is-expanded");
    group.setAttribute("role", "dialog");
    group.setAttribute("aria-modal", "true");
    group.setAttribute("aria-label", "Showreel Juicy Events");
    document.documentElement.classList.add("has-work-showreel");
    window.__jen?.lenis.stop();
    playBtn?.setAttribute("aria-label", "Zamknij showreel");
    playBtn?.focus({ preventScroll: true });
    triggers.forEach((trigger) => trigger.setAttribute("aria-expanded", "true"));
    playBtn?.classList.add("is-exit");
    claimAudio(video);
    video.muted = false;
    await loadShowreel();
    if (!group.classList.contains("is-expanded") || mode !== "showreel") return;
    video.currentTime = 0;
    video.play().catch(() => {});
  };

  const collapse = () => {
    if (!group.classList.contains("is-expanded")) return;
    document.documentElement.classList.remove("has-work-showreel");
    group.removeAttribute("role");
    group.removeAttribute("aria-modal");
    group.removeAttribute("aria-label");
    window.__jen?.lenis.start();
    playBtn?.setAttribute("aria-label", "Odtwórz showreel");
    returnFocus?.focus({ preventScroll: true });
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
    if (event.key === "Tab" && group.classList.contains("is-expanded")) {
      event.preventDefault();
      playBtn?.focus();
    }
  });
}
