import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { softMotion } from "../shared.js";
import { prepareHeadline, revealLines } from "../effects.js";
import { claimAudio, releaseAudio } from "../audio-bus.js";

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
  const lightTitle = section.querySelector("[data-agency-layer='light'] .agency__title");
  const headerLogo = document.querySelector(".site-header__logo img");

  if (video) {
    ScrollTrigger.create({
      trigger: section,
      start: "top bottom",
      end: "bottom top",
      onEnter: () => video.play().catch(() => {}),
      onEnterBack: () => video.play().catch(() => {}),
      // Gdy dźwięk jest włączony (klik na kadr), wideo/muzyka gra dalej
      // niezależnie od tego, gdzie na stronie jest scroll.
      onLeave: () => {
        if (video.muted) video.pause();
      },
      onLeaveBack: () => {
        if (video.muted) video.pause();
      },
    });
  }

  // Klik na kadr: włącza dźwięk na TYM SAMYM, już widocznym wideo, od początku
  // — bez modala i bez powiększania (hero jest i tak pełnoekranowe, nie ma
  // czego "otwierać"). Drugi klik wycisza z powrotem — ten sam wzorzec co
  // karta „Nasza praca" (work-video.js), oparty o wspólną szynę audio, więc
  // odtworzenie innego wideo na stronie automatycznie wyciszy to.
  if (video && media) {
    const toggleSound = () => {
      if (video.muted) {
        claimAudio(video);
        video.muted = false;
        video.currentTime = 0;
        video.play().catch(() => {});
        media.dataset.cursor = "Wycisz";
        media.setAttribute("aria-label", "Wycisz wideo");
      } else {
        video.muted = true;
        releaseAudio(video);
        media.dataset.cursor = "Odtwórz reel";
        media.setAttribute("aria-label", "Odtwórz wideo z dźwiękiem");
      }
    };

    media.addEventListener("click", toggleSound);
    media.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      toggleSound();
    });

    // Inne wideo przejęło dźwięk (wspólna szyna audio-bus.js) — wróć do ciszy.
    video.addEventListener("jen:audio-released", () => {
      video.muted = true;
      media.dataset.cursor = "Odtwórz reel";
      media.setAttribute("aria-label", "Odtwórz wideo z dźwiękiem");
    });
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

  if (logo) gsap.set(logo, { transformOrigin: "left top" });
  if (headerLogo) gsap.set(headerLogo, { autoAlpha: 0 });

  // Stan aktu odtwarzany przez applyProgress() — trzymany na zewnątrz, żeby
  // measureFly() mogło go natychmiast odtworzyć po przemierzeniu (patrz niżej).
  let flyDelta = { x: 0, y: 0, scale: 1 };
  let lastProgress = 0;

  const applyProgress = (progress) => {
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

    // Wideo realnie kurczy swoją wysokość (nie clip-path!) — dzięki temu border-bottom
    // rysuje ostrą, cienką linię dokładnie na aktualnej krawędzi, bez "kurtyny".
    const wipeT = gsap.utils.clamp(0, 1, (progress - LOGO_END) / (1 - LOGO_END));
    const edge = (1 - wipeT) * 100; // % wysokości wideo wciąż widoczne od góry
    media.style.height = `${edge}%`;
    if (darkLayer) darkLayer.style.clipPath = `inset(${edge}% 0 0 0)`;
  };

  // Zmierz raz dokąd ma "wskoczyć" logo (do rzeczywistej pozycji logo w nagłówku).
  const measureFly = () => {
    if (!logo || !headerLogo) return;
    // BŁĄD, KTÓRY TO NAPRAWIA: `resize` potrafi odpalić się W TRAKCIE lotu —
    // na telefonie robi to non-stop chowanie/pokazywanie paska adresu podczas
    // scrolla. Bez zerowania transformu przed pomiarem, `getBoundingClientRect()`
    // łapało logo w jego AKTUALNEJ, już przesuniętej pozycji zamiast spoczynkowej —
    // każdy kolejny pomiar liczył dystans od coraz to innego, przypadkowego
    // punktu, więc logo dokowało w złym miejscu (albo leciało w dół zamiast
    // w górę, zależnie od tego, w którym momencie lotu złapał je resize).
    gsap.set(logo, { x: 0, y: 0, scale: 1 });
    const from = logo.getBoundingClientRect();
    const to = headerLogo.getBoundingClientRect();
    flyDelta = {
      x: to.left - from.left,
      y: to.top - from.top,
      scale: to.width / from.width,
    };
    // Natychmiast odtwórz stan dla aktualnego postępu scrolla — inaczej logo
    // mignęłoby na jedną klatkę w pozycji spoczynkowej.
    applyProgress(lastProgress);
  };
  measureFly();
  window.addEventListener("resize", measureFly);

  ScrollTrigger.create({
    trigger: act,
    start: "top top",
    end: "bottom bottom",
    scrub: true,
    onUpdate: ({ progress }) => {
      lastProgress = progress;
      applyProgress(progress);
    },
  });
}
