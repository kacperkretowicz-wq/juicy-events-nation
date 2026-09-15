import { softMotion } from "../shared.js";
import { claimAudio, releaseAudio } from "../audio-bus.js";

// Nad wideo hero natywny kursor jest ukryty (cursor:none w CSS), a w jego miejsce
// „przykleja się" pigułka „Odtwórz showreel" / „Wyłącz odtwarzanie". Klik łapany
// jest na całym kadrze. Dźwięk, gdy włączony, gra dalej niezależnie od scrolla —
// aż do wyłączenia.
//
// Wejście na stronę zaczyna film od START_AT, a nie od zera: pierwsze sekundy
// materiału to rozbieg, który nie nadaje się na tło hero. Kliknięcie showreelu
// to świadoma decyzja widza, więc wtedy film leci OD POCZĄTKU, z dźwiękiem.
const START_AT = 31;

export function initHeroReel() {
  const media = document.querySelector("[data-agency-media]");
  const video = media?.querySelector("[data-agency-video]");
  const cta = media?.querySelector("[data-agency-reel-cta]");
  const label = cta?.querySelector("[data-agency-reel-label]");
  const keyBtn = document.querySelector("[data-agency-reel-key]");
  if (!media || !video) return;

  let playing = false;

  // Przewinięcie na START_AT tylko dopóki widz sam nie odpalił showreelu —
  // inaczej metadane doczytane po kliknięciu wyrzuciłyby film z powrotem na 31 s.
  const seekToStart = () => {
    if (playing) return;
    try {
      video.currentTime = START_AT;
    } catch {
      // Seek przed gotowością bufora potrafi rzucić — nic nie tracimy, poster
      // i tak pokazuje klatkę z tego miejsca.
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
    if (label) label.textContent = "Wyłącz odtwarzanie";
    if (keyBtn) keyBtn.textContent = "Wyłącz odtwarzanie";
    claimAudio(video);
    video.muted = false;
    video.currentTime = 0;
    video.play().catch(() => {
      // Przeglądarka odmówiła dźwięku — wracamy do stanu wyciszonego, żeby
      // podpis nie kłamał.
      deactivate();
    });
  };

  const deactivate = () => {
    playing = false;
    cta?.classList.remove("is-playing");
    if (label) label.textContent = "Odtwórz showreel";
    if (keyBtn) keyBtn.textContent = "Odtwórz showreel z dźwiękiem";
    video.muted = true;
    releaseAudio(video);
  };

  const toggle = () => {
    flash();
    if (playing) deactivate();
    else activate();
  };

  media.addEventListener("click", toggle);
  keyBtn?.addEventListener("click", toggle);
  // Inny odtwarzacz przejął dźwięk (audio-bus) — pigułka musi to pokazać.
  video.addEventListener("jen:audio-released", deactivate);

  if (!cta || softMotion) return;
  if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;

  // ——— Śledzenie kursora ———
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
