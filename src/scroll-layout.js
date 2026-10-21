import { ScrollTrigger } from "gsap/ScrollTrigger";
import { syncHeadlineReveals } from "./effects.js";
import { rebuildParallaxMedia } from "./sections/parallax-media.js";
import { fontsArrivedLate, lenis, repairSplitHeadlines, resplitHeadlines, scrollToSection, stylesArrivedLate } from "./shared.js";

let settleTimer = null;
let firstSettleDone = false;
let lastHeight = 0;
// Cel przywracania scrolla po odświeżeniu: strona bywa jeszcze krótsza (leniwe obrazy,
// fonty), więc próbujemy ponownie po kolejnych przeliczeniach — do skutku albo do
// pierwszego gestu użytkownika.
let pendingRestoreY = null;
const cancelRestore = () => {
  pendingRestoreY = null;
};
["wheel", "touchstart", "keydown"].forEach((type) =>
  window.addEventListener(type, cancelRestore, { passive: true, once: true })
);

function applyPendingRestore() {
  if (pendingRestoreY == null) return;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  lenis.scrollTo(Math.min(pendingRestoreY, max), { immediate: true, force: true });
  ScrollTrigger.update();
  if (Math.abs(window.scrollY - pendingRestoreY) < 2) pendingRestoreY = null;
}

/**
 * Po pierwszym poprawnym przeliczeniu pinów: przewiń do #sekcji z adresu (wejście
 * z podstrony albo odświeżenie z hashem) albo przywróć pozycję sprzed odświeżenia.
 * Wcześniej robiła to przeglądarka / page-transition, zanim piny istniały.
 */
function restorePosition() {
  const hash = window.location.hash;
  const target = hash && hash.length > 1 ? document.querySelector(hash) : null;
  if (target) {
    scrollToSection(target, { immediate: true });
    return;
  }
  // Pozycję przywracamy tylko po odświeżeniu / wstecz — zwykłe wejście (np. klik
  // w logo) zaczyna od góry.
  const nav = performance.getEntriesByType?.("navigation")?.[0];
  if (nav && nav.type !== "reload" && nav.type !== "back_forward") return;
  let saved = 0;
  try {
    saved = Number(sessionStorage.getItem(`jen_scroll:${location.pathname}`)) || 0;
  } catch {
    saved = 0;
  }
  if (saved > 0) {
    pendingRestoreY = saved;
    applyPendingRestore();
  }
}

/** Przeliczenie pinów / parallax — po intro, nie przy `load` zanim layout się ustabilizuje. */
export function settleScrollLayout() {
  clearTimeout(settleTimer);
  settleTimer = setTimeout(() => {
    repairSplitHeadlines();
    rebuildParallaxMedia();
    syncHeadlineReveals();
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      lastHeight = document.documentElement.scrollHeight;
      if (!firstSettleDone) {
        firstSettleDone = true;
        restorePosition();
      } else {
        applyPendingRestore();
      }
    });
  }, 80);
}

/** Fonty dojechały po podziale nagłówków na linie → podziel jeszcze raz i przelicz. */
function onFontsReady() {
  if (fontsArrivedLate()) resplitHeadlines();
  settleScrollLayout();
}

/**
 * Wysokość strony zmienia się już po zbudowaniu triggerów (leniwe obrazy, metadane
 * wideo, rozwijany kafelek, akordeony) — wtedy piny niżej mają nieaktualne pozycje.
 * Po każdej realnej zmianie wysokości przeliczamy (z opóźnieniem, bez pętli: po
 * refreshu zapamiętujemy nową wysokość).
 */
function watchPageHeight(isReady) {
  if (!("ResizeObserver" in window)) return;
  let timer = null;
  new ResizeObserver(() => {
    if (!isReady()) return;
    const h = document.documentElement.scrollHeight;
    if (Math.abs(h - lastHeight) < 4) return;
    clearTimeout(timer);
    timer = setTimeout(() => {
      ScrollTrigger.refresh();
      lastHeight = document.documentElement.scrollHeight;
      applyPendingRestore();
    }, 250);
  }).observe(document.body);
}

export function bindScrollLayoutSettle() {
  const intro = document.querySelector("[data-hero-intro]");
  let introDone = !intro;

  if (intro) {
    document.addEventListener(
      "jen:intro-done",
      () => {
        introDone = true;
        settleScrollLayout();
      },
      { once: true }
    );
  } else {
    settleScrollLayout();
  }

  // Każde z tych zdarzeń może zmienić wymiary sekcji — przeliczamy po każdym
  // (w trakcie intro czekamy na jego koniec, bo intro samo blokuje scroll).
  document.fonts?.ready?.then(() => {
    if (introDone) onFontsReady();
    else document.addEventListener("jen:intro-done", onFontsReady, { once: true });
  });
  const onLoad = () => {
    if (introDone) settleScrollLayout();
  };
  if (document.readyState === "complete") onLoad();
  else window.addEventListener("load", onLoad, { once: true });

  watchPageHeight(() => introDone && firstSettleDone);

  // Style dojechały po starcie (bardzo wolne łącze / zimny serwer) → nagłówki były
  // dzielone na gołym HTML: podziel od nowa i przelicz piny.
  if (stylesArrivedLate()) {
    const waitStyles = () => {
      if (getComputedStyle(document.documentElement).getPropertyValue("--font-display").trim()) {
        resplitHeadlines();
        settleScrollLayout();
      } else setTimeout(waitStyles, 100);
    };
    waitStyles();
  }
}
