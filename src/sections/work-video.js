// Karta "Nasza praca": spokojny kadr; film uruchamia się dopiero po kliknięciu.
import { claimAudio, releaseAudio } from "../audio-bus.js";

export function initWorkVideo() {
  const group = document.querySelector("[data-work-video-group]");
  const video = group?.querySelector("[data-work-video]");
  const triggers = [...(group?.querySelectorAll("[data-work-video-trigger]") ?? [])];
  const playBtn = group?.querySelector(".work__play");
  if (!group || !video || !triggers.length) return;

  const showreelSrc = video.dataset.workShowreel || "";
  let mode = "preview";

  video.preload = "none";
  video.muted = true;
  video.playsInline = true;

  video.addEventListener(
    "playing",
    () => {
      video.removeAttribute("poster");
    },
    { once: true }
  );

  const loadPreview = () => {
    mode = "preview";
    video.pause();
    video.loop = false;
    video.muted = true;
    video.poster = "/media/work-reel-poster.jpg";
    video.removeAttribute("src");
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
