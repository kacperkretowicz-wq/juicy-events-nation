import { softMotion } from "../shared.js";

// Nad wideo hero natywny kursor jest ukryty (cursor:none w CSS), a w jego miejsce
// "przykleja się" przycisk "Odtwórz showreel" / "Wyłącz odtwarzanie". Dźwięk, gdy
// włączony, gra dalej niezależnie od scrolla po całej stronie — aż do wyłączenia.
export function initHeroReelCursor() {
  const media = document.querySelector("[data-agency-media]");
  const video = media?.querySelector("[data-agency-video]");
  const cta = media?.querySelector("[data-agency-reel-cta]");
  const label = cta?.querySelector("[data-agency-reel-label]");
  if (!media || !video || !cta) return;

  let playing = false;

  const flash = () => {
    cta.classList.add("is-flash");
    window.setTimeout(() => cta.classList.remove("is-flash"), 260);
  };

  const activate = () => {
    playing = true;
    cta.classList.add("is-playing");
    if (label) label.textContent = "Wyłącz odtwarzanie";
    cta.setAttribute("aria-hidden", "false");
    video.muted = false;
    video.currentTime = 0;
    video.play().catch(() => {});
  };

  const deactivate = () => {
    playing = false;
    cta.classList.remove("is-playing");
    if (label) label.textContent = "Odtwórz showreel";
    video.muted = true;
  };

  const toggle = () => {
    flash();
    if (playing) deactivate();
    else activate();
  };

  const isCoarse = window.matchMedia("(hover: none), (pointer: coarse)").matches;

  if (isCoarse) {
    media.addEventListener("click", toggle);
    return;
  }

  media.addEventListener("click", toggle);

  if (softMotion) return;

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

  const start = () => {
    media.classList.add("is-cursor-active");
    if (!raf) raf = requestAnimationFrame(render);
  };

  const stop = () => {
    media.classList.remove("is-cursor-active");
    if (raf) cancelAnimationFrame(raf);
    raf = null;
  };

  media.addEventListener("mouseenter", (event) => {
    const rect = media.getBoundingClientRect();
    targetX = x = event.clientX - rect.left;
    targetY = y = event.clientY - rect.top;
    start();
  });

  media.addEventListener("mousemove", (event) => {
    const rect = media.getBoundingClientRect();
    targetX = event.clientX - rect.left;
    targetY = event.clientY - rect.top;
  });

  media.addEventListener("mouseleave", stop);
}
