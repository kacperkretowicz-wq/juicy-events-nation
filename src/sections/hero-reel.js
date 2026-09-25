import { softMotion } from "../shared.js";
import { claimAudio, releaseAudio } from "../audio-bus.js";

// Tło startuje od właściwego fragmentu filmu. Kliknięcie dyskretnego kursora
// uruchamia pełny showreel z dźwiękiem od początku.
const START_AT = 31;

export function initHeroReel() {
  const media = document.querySelector("[data-agency-media]");
  const video = media?.querySelector("[data-agency-video]");
  const cta = media?.querySelector("[data-agency-reel-cta]");
  const labelIdle = cta?.querySelector(".agency__reel-cta-idle");
  const labelExit = cta?.querySelector(".agency__reel-cta-exit");
  const keyBtn = document.querySelector("[data-agency-reel-key]");
  if (!media || !video) return;

  let playing = false;
  video.loop = false;

  const seekToStart = () => {
    if (playing) return;
    try {
      video.currentTime = Math.min(START_AT, Math.max(0, (video.duration || START_AT + 1) - 1));
    } catch {
      // Przed załadowaniem metadanych przeglądarka może odmówić seeka.
    }
  };

  if (video.readyState >= 1) seekToStart();
  else video.addEventListener("loadedmetadata", seekToStart, { once: true });

  const flash = () => {
    if (!cta) return;
    cta.classList.add("is-flash");
    window.setTimeout(() => cta.classList.remove("is-flash"), 260);
  };

  const activate = () => {
    playing = true;
    cta?.classList.add("is-playing");
    labelIdle?.setAttribute("hidden", "");
    labelExit?.removeAttribute("hidden");
    if (keyBtn) keyBtn.textContent = "Zamknij showreel";
    claimAudio(video);
    video.muted = false;
    video.currentTime = 0;
    video.play().catch(() => deactivate());
  };

  const deactivate = () => {
    playing = false;
    cta?.classList.remove("is-playing");
    labelExit?.setAttribute("hidden", "");
    labelIdle?.removeAttribute("hidden");
    if (keyBtn) keyBtn.textContent = "Odtwórz showreel z dźwiękiem";
    video.muted = true;
    releaseAudio(video);
    seekToStart();
  };

  const toggle = () => {
    flash();
    if (playing) deactivate();
    else activate();
  };

  media.addEventListener("click", toggle);
  keyBtn?.addEventListener("click", toggle);
  video.addEventListener("jen:audio-released", deactivate);
  document.addEventListener("jen:intro-done", seekToStart, { once: true });

  video.addEventListener("ended", () => {
    if (playing) return;
    seekToStart();
    const rect = media.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) video.play().catch(() => {});
  });

  if (!cta || softMotion || window.matchMedia("(hover: none), (pointer: coarse)").matches) return;

  let targetX = 0;
  let targetY = 0;
  let x = 0;
  let y = 0;
  let raf = null;

  const render = () => {
    x += (targetX - x) * 0.22;
    y += (targetY - y) * 0.22;
    cta.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    raf = requestAnimationFrame(render);
  };

  const start = (event) => {
    const rect = media.getBoundingClientRect();
    targetX = x = event.clientX - rect.left;
    targetY = y = event.clientY - rect.top;
    media.classList.add("is-cursor-active");
    if (!raf) raf = requestAnimationFrame(render);
  };

  const stop = () => {
    media.classList.remove("is-cursor-active");
    if (raf) cancelAnimationFrame(raf);
    raf = null;
  };

  media.addEventListener("mouseenter", start);
  media.addEventListener("mousemove", (event) => {
    const rect = media.getBoundingClientRect();
    targetX = event.clientX - rect.left;
    targetY = event.clientY - rect.top;
  });
  media.addEventListener("mouseleave", stop);
}
