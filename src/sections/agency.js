import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { softMotion } from "../shared.js";
import { prepareHeadline, revealLines } from "../effects.js";

// Faza A→B (0 → LOGO_END progresu aktu): logo ucieka do nagłówka strony,
// intro po prawej gaśnie, a "Po co Ci agencja" wjeżdża w jego miejsce.
// Rozciągnięte na więcej scrolla + eased, żeby lot był wolniejszy i finezyjny.
const LOGO_END = 0.48;
const flyEase = gsap.parseEase("power2.inOut");
const fadeEase = gsap.parseEase("power1.out");

export function initAgency() {
  const section = document.querySelector("[data-agency]");
  if (!section) return;

  const act = section.querySelector("[data-agency-act]");
  const media = section.querySelector("[data-agency-media]");
  const mediaInner = section.querySelector("[data-agency-media-inner]");
  const video = section.querySelector("[data-agency-video]");
  const logo = section.querySelector("[data-agency-logo]");
  const intro = section.querySelector("[data-agency-intro]");
  const headline = section.querySelector("[data-agency-headline]");
  const darkLayer = section.querySelector("[data-agency-layer='dark']");
  const edge = section.querySelector("[data-agency-edge]");
  const lightTitle = section.querySelector("[data-agency-layer='light'] .agency__title");
  const headerLogo = document.querySelector(".site-header__logo img");

  if (video) {
    const syncPlayback = (play) => {
      if (play) video.play().catch(() => {});
      else if (video.muted) video.pause();
    };

    ScrollTrigger.create({
      trigger: section,
      start: "top bottom",
      end: "bottom top",
      onEnter: () => syncPlayback(true),
      onEnterBack: () => syncPlayback(true),
      // Gdy dźwięk jest włączony (klik na "Odtwórz showreel"), wideo/muzyka gra
      // dalej niezależnie od tego, gdzie na stronie jest scroll.
      onLeave: () => syncPlayback(false),
      onLeaveBack: () => syncPlayback(false),
    });

    const playIfVisible = () => {
      const rect = section.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) syncPlayback(true);
    };
    playIfVisible();
    video.addEventListener("loadeddata", playIfVisible, { once: true });
  }

  if (lightTitle) {
    const lines = prepareHeadline(lightTitle);
    ScrollTrigger.create({
      trigger: section,
      start: "top 70%",
      once: true,
      onEnter: () => revealLines(lines),
    });
  }

  if (softMotion || !act) {
    if (logo) logo.style.display = "none";
    if (intro) intro.style.display = "none";
    return;
  }

  gsap.set(headline, { autoAlpha: 0, yPercent: 12 });

  gsap.to(mediaInner, {
    yPercent: 8,
    ease: "none",
    scrollTrigger: { trigger: act, start: "top top", end: "bottom bottom", scrub: true },
  });

  // Zmierz raz dokąd ma "wskoczyć" logo (do rzeczywistej pozycji logo w nagłówku).
  let flyDelta = { x: 0, y: 0, scale: 1 };
  const measureFly = () => {
    if (!logo || !headerLogo) return;
    const from = logo.getBoundingClientRect();
    const to = headerLogo.getBoundingClientRect();
    flyDelta = {
      x: to.left - from.left,
      y: to.top - from.top,
      scale: to.width / from.width,
    };
  };
  measureFly();
  window.addEventListener("resize", measureFly);

  if (logo) gsap.set(logo, { transformOrigin: "left top" });
  if (headerLogo) gsap.set(headerLogo, { autoAlpha: 0 });
  if (media) media.style.clipPath = "inset(0 0 0% 0)";
  if (edge) edge.style.top = "100%";

  ScrollTrigger.create({
    trigger: act,
    start: "top top",
    end: "bottom bottom",
    scrub: true,
    onUpdate: ({ progress }) => {
      const introT = gsap.utils.clamp(0, 1, progress / LOGO_END);
      // Eased tor lotu (power2.inOut) — logo startuje i ląduje delikatnie,
      // bez liniowego, mechanicznego ruchu.
      const flyT = flyEase(introT);
      // Dłuższy, łagodniejszy odcinek dokowania — logo płynnie zanika, dokładnie
      // gdy mija rozmiar/pozycję loga w nagłówku (bez nagłego "przeskoku").
      const dock = fadeEase(gsap.utils.clamp(0, 1, (introT - 0.7) / 0.3));

      if (logo) {
        gsap.set(logo, {
          x: flyDelta.x * flyT,
          y: flyDelta.y * flyT,
          scale: 1 + (flyDelta.scale - 1) * flyT,
          autoAlpha: 1 - dock,
        });
      }
      if (headerLogo) gsap.set(headerLogo, { autoAlpha: dock });
      if (intro) gsap.set(intro, { autoAlpha: 1 - fadeEase(introT) });
      gsap.set(headline, { autoAlpha: introT, yPercent: 12 * (1 - flyT) });

      // Wipe przez clip-path (compositor) + osobna linia — bez zmiany height na każdej klatce.
      const wipeT = gsap.utils.clamp(0, 1, (progress - LOGO_END) / (1 - LOGO_END));
      const visible = (1 - wipeT) * 100; // % wysokości wideo wciąż widoczne od góry
      media.style.clipPath = `inset(0 0 ${100 - visible}% 0)`;
      if (edge) edge.style.top = `${visible}%`;
      if (darkLayer) darkLayer.style.clipPath = `inset(${visible}% 0 0 0)`;
    },
  });
}
