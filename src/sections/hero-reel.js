import gsap from "gsap";
import { softMotion } from "../shared.js";
import { claimAudio, releaseAudio } from "../audio-bus.js";

// Dwa pliki z tego samego filmu:
// - tło: hero-loop.mp4 — fragment od 23,5 s do końca, bez dźwięku, zwykła pętla
//   (bez seekowania przy starcie — pewne także na iPhonie),
// - showreel: hero-film.mp4 — cały film z dźwiękiem, ładowany dopiero po kliknięciu.
// Klik w „Odtwórz showreel”: podmiana na pełny film od 0:00 z dźwiękiem, hasło na środku
// powoli gaśnie. „Zamknij” / koniec filmu: powrót do wyciszonej pętli i hasło wraca.
export function initHeroReel() {
  const media = document.querySelector("[data-agency-media]");
  const video = media?.querySelector("[data-agency-video]");
  const cta = media?.querySelector("[data-agency-reel-cta]");
  const labelIdle = cta?.querySelector(".agency__reel-cta-idle");
  const labelExit = cta?.querySelector(".agency__reel-cta-exit");
  const keyBtn = document.querySelector("[data-agency-reel-key]");
  // Gasimy sam nagłówek, nie kontener [data-agency-intro] — jego opacity trzyma scroll (agency.js).
  const heading = document.querySelector("[data-agency-intro] .agency__intro-title");
  if (!media || !video) return;

  const loopSrc = video.dataset.loopSrc || video.getAttribute("src") || "";
  const filmSrc = video.dataset.filmSrc || "";
  const loopPoster = video.getAttribute("poster") || "";
  let playing = false;

  const inView = () => {
    const rect = media.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
  };

  const fadeHeading = (visible) => {
    if (!heading) return;
    gsap.to(heading, {
      autoAlpha: visible ? 1 : 0,
      duration: softMotion ? 0.01 : visible ? 0.8 : 1.8,
      ease: visible ? "power2.out" : "power1.out",
      overwrite: true,
    });
  };

  const flash = () => {
    if (!cta) return;
    cta.classList.add("is-flash");
    window.setTimeout(() => cta.classList.remove("is-flash"), 260);
  };

  const activate = () => {
    if (!filmSrc) return;
    playing = true;
    cta?.classList.add("is-playing");
    labelIdle?.setAttribute("hidden", "");
    labelExit?.removeAttribute("hidden");
    if (keyBtn) keyBtn.textContent = "Zamknij showreel";
    claimAudio(video);
    // Podmiana źródła i start w geście kliknięcia — przeglądarka pozwala od razu na dźwięk.
    video.loop = false;
    video.removeAttribute("poster");
    video.preload = "auto";
    video.src = filmSrc;
    video.muted = false;
    video.play().catch(() => deactivate());
    fadeHeading(false);
  };

  const deactivate = () => {
    if (!playing) return;
    playing = false;
    cta?.classList.remove("is-playing");
    labelExit?.setAttribute("hidden", "");
    labelIdle?.removeAttribute("hidden");
    if (keyBtn) keyBtn.textContent = "Odtwórz showreel z dźwiękiem";
    video.muted = true;
    releaseAudio(video);
    video.loop = true;
    if (loopPoster) video.setAttribute("poster", loopPoster);
    video.src = loopSrc;
    if (inView()) video.play().catch(() => {});
    fadeHeading(true);
  };

  const toggle = () => {
    flash();
    if (playing) deactivate();
    else activate();
  };

  media.addEventListener("click", toggle);
  keyBtn?.addEventListener("click", toggle);
  video.addEventListener("jen:audio-released", deactivate);
  // Koniec pełnego filmu z dźwiękiem → z powrotem do wyciszonej pętli.
  video.addEventListener("ended", deactivate);

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
