import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
import Lenis from "lenis";
import { initPageTransition, transitionTo, animateLeave, getCurrentColor } from "./page-transition.js";
import { flushScrollFrame, markScrollActivity, onScrollFrame } from "./scroll-frame.js";

gsap.registerPlugin(ScrollTrigger, CustomEase);
CustomEase.create("smoothExpoOut", "M0,0 C0.143,0 0.22,0.534 0.247,0.663 0.277,0.811 0.424,1 1,1");

// Decyzja właściciela strony (2026-08): pełne animacje dla wszystkich, bez względu
// na systemowe „ogranicz animacje". `?reduced` w URL wciąż daje spokojną wersję
// (przydatne do pokazania klientowi). Aby wrócić do respektowania ustawienia:
//   export const softMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
// i przywrócić bloki @media (prefers-reduced-motion) w CSS.
export const softMotion = new URLSearchParams(window.location.search).has("reduced");
export const ease = softMotion ? "power2.out" : "smoothExpoOut";

export const touchCoarse = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
export const narrowViewport = window.matchMedia("(max-width: 980px)").matches;
export const mobileScrollProfile = touchCoarse || narrowViewport;

ScrollTrigger.config({ ignoreMobileResize: true });

const lenisEasing = (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t));

export const lenis = new Lenis(
  softMotion
    ? {
        duration: 0.75,
        lerp: 0.1,
        easing: lenisEasing,
        smoothWheel: true,
        wheelMultiplier: 0.92,
      }
    : mobileScrollProfile
      ? {
          duration: 0.88,
          lerp: 0.14,
          easing: lenisEasing,
          smoothWheel: true,
          wheelMultiplier: 0.92,
        }
      : {
          duration: 1.15,
          lerp: 0.085,
          easing: lenisEasing,
          smoothWheel: true,
          wheelMultiplier: 0.92,
        }
);

document.documentElement.classList.add("lenis", "lenis-smooth");
lenis.on("scroll", () => {
  markScrollActivity();
  ScrollTrigger.update();
  flushScrollFrame();
});
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(mobileScrollProfile && !softMotion ? 800 : 0);

export { onScrollFrame, isScrollActive } from "./scroll-frame.js";

window.__jen = { gsap, ScrollTrigger, lenis };

const yearEl = document.querySelector("[data-year]");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

// Bezpiecznik odsłaniania: treść jest chowana przez CSS pod klasą `.js`
// (koniec FOUC, brak JS = wszystko widoczne). Gdyby system triggerów w ogóle
// nie wystartował (0 triggerów = coś się wysypało) — po chwili odsłoń wszystko.
window.addEventListener("load", () => {
  setTimeout(() => {
    if (ScrollTrigger.getAll().length > 0) return;
    document
      .querySelectorAll("[data-fade], [data-fade-group] > *, [data-project], [data-need-card], [data-team-card]")
      .forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
  }, 3000);
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  if (link.closest(".mega-menu")) return;
  link.addEventListener("click", (event) => {
    const href = link.getAttribute("href");
    if (!href || href === "#") return;
    const target = document.querySelector(href);
    if (!target) return;
    event.preventDefault();
    lenis.scrollTo(target, { offset: -16 });
  });
});

/* ——— Header: przyklejony na stałe + ton nad jasnymi sekcjami ———
   Panel nawigacji (logo + kategorie) jest widoczny cały czas, niezależnie
   od kierunku scrolla. Chowanie przy scrollu w dół zostało usunięte. */

export function initHeader() {
  const header = document.querySelector("[data-site-header]");
  if (!header) return;

  const darkZones = [...document.querySelectorAll("[data-tone='dark']")];

  const updateTone = () => {
    const probe = header.offsetHeight * 0.5;
    const overDark = darkZones.some((zone) => {
      const rect = zone.getBoundingClientRect();
      return rect.top <= probe && rect.bottom >= probe;
    });
    header.classList.toggle("site-header--solid", !overDark);
  };

  updateTone();

  if (softMotion) {
    window.addEventListener("scroll", updateTone, { passive: true });
    return;
  }

  onScrollFrame(updateTone);
}

/* ——— Mega menu ——— */

const menu = document.getElementById("mega-menu");
const showreel = document.getElementById("showreel");

function lockScroll() {
  document.body.style.overflow = "hidden";
  lenis.stop();
}

function unlockScroll() {
  if (menu?.classList.contains("is-open") || showreel?.classList.contains("is-open")) return;
  document.body.style.overflow = "";
  lenis.start();
}

const menuToggles = [...document.querySelectorAll("[data-menu-open]")];
const setToggleState = (open) =>
  menuToggles.forEach((btn) => btn.setAttribute("aria-expanded", String(open)));

function openMenu() {
  if (!menu) return;
  menu.style.display = "";
  menu.classList.add("is-open");
  menu.setAttribute("aria-hidden", "false");
  setToggleState(true);
  lockScroll();
  gsap.fromTo(
    menu.querySelectorAll(".mega-menu__list li"),
    { yPercent: 110, opacity: 0 },
    { yPercent: 0, opacity: 1, duration: 0.6, stagger: 0.05, ease, delay: 0.15 }
  );
}

function closeMenu() {
  if (!menu) return;
  menu.classList.remove("is-open");
  menu.setAttribute("aria-hidden", "true");
  setToggleState(false);
  unlockScroll();
  setTimeout(() => {
    if (!menu.classList.contains("is-open")) {
      gsap.set(menu.querySelectorAll(".mega-menu__list li"), { opacity: 0, yPercent: 110 });
    }
  }, 800);
}

function closeMenuInstant() {
  if (!menu) return;
  menu.classList.remove("is-open");
  menu.setAttribute("aria-hidden", "true");
  menu.style.display = "none";
  setToggleState(false);
  unlockScroll();
  gsap.set(menu.querySelectorAll(".mega-menu__list li"), { opacity: 0, yPercent: 110 });
}

menuToggles.forEach((btn) => btn.addEventListener("click", openMenu));
document.querySelectorAll("button[data-menu-close]").forEach((btn) => btn.addEventListener("click", closeMenu));

/* ——— Showreel ——— */

const reelFigures = [...document.querySelectorAll("[data-showreel-track] figure")];
let reelIndex = 0;
let reelTimer = null;
let reelPlaying = true;

function showReelSlide(index) {
  reelFigures.forEach((figure, i) => {
    const active = i === index;
    figure.classList.toggle("is-active", active);
    const video = figure.querySelector("video");
    if (!video) return;
    if (active && reelPlaying) video.play().catch(() => {});
    else {
      video.pause();
      if (!active) video.currentTime = 0;
    }
  });
  reelIndex = index;
}

function playReel() {
  clearInterval(reelTimer);
  reelPlaying = true;
  const playBtn = document.querySelector("[data-showreel-play]");
  if (playBtn) playBtn.textContent = "Pause";
  reelFigures[reelIndex]?.querySelector("video")?.play().catch(() => {});
  reelTimer = setInterval(() => showReelSlide((reelIndex + 1) % reelFigures.length), 3400);
}

function stopReel() {
  reelPlaying = false;
  clearInterval(reelTimer);
  const playBtn = document.querySelector("[data-showreel-play]");
  if (playBtn) playBtn.textContent = "Play";
  reelFigures.forEach((figure) => figure.querySelector("video")?.pause());
}

function openShowreel() {
  if (!showreel) return;
  showreel.classList.add("is-open");
  showreel.setAttribute("aria-hidden", "false");
  lockScroll();
  showReelSlide(0);
  playReel();
}

function closeShowreel() {
  if (!showreel) return;
  showreel.classList.remove("is-open");
  showreel.setAttribute("aria-hidden", "true");
  stopReel();
  unlockScroll();
}

document.querySelectorAll("[data-showreel-open]").forEach((btn) => btn.addEventListener("click", openShowreel));
document.querySelectorAll("[data-showreel-close]").forEach((btn) => btn.addEventListener("click", closeShowreel));
document.querySelector("[data-showreel-prev]")?.addEventListener("click", () => {
  showReelSlide((reelIndex - 1 + reelFigures.length) % reelFigures.length);
});
document.querySelector("[data-showreel-next]")?.addEventListener("click", () => {
  showReelSlide((reelIndex + 1) % reelFigures.length);
});
document.querySelector("[data-showreel-play]")?.addEventListener("click", () => {
  if (reelPlaying) stopReel();
  else playReel();
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  closeMenu();
  closeShowreel();
});

/* ——— Przejście z siatką kwadratów (menu → sekcja na stronie głównej) ——— */
initPageTransition();

function handleNavigationTransition(link, event) {
  const href = link.getAttribute("href");
  if (!href || href === "#") return;

  if (
    link.target === "_blank" ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    href.startsWith("http://") ||
    href.startsWith("https://")
  ) {
    closeMenu();
    return;
  }

  const currentPath = window.location.pathname.replace(/\/index\.html$/, "/");
  let targetSelector = null;

  if (href.startsWith("#")) {
    targetSelector = href;
  } else if (href.startsWith("/#") && (currentPath === "/" || currentPath === "")) {
    targetSelector = href.replace(/^\//, "");
  }

  if (targetSelector) {
    const target = document.querySelector(targetSelector);
    if (target) {
      event.preventDefault();
      transitionTo(async () => {
        closeMenuInstant();
        lenis.scrollTo(target, { immediate: true, offset: 0 });
        ScrollTrigger.refresh();
        history.pushState(null, "", targetSelector);
      });
      return;
    }
  }

  event.preventDefault();
  animateLeave().then(() => {
    sessionStorage.setItem("jen_page_transition_color", getCurrentColor());
    window.location.href = href;
  });
}

document.querySelectorAll(".mega-menu a").forEach((link) => {
  link.addEventListener("click", (event) => handleNavigationTransition(link, event));
});

document.querySelectorAll(".site-header__cta").forEach((link) => {
  const href = link.getAttribute("href");
  if (href && href.startsWith("/#")) {
    const currentPath = window.location.pathname.replace(/\/index\.html$/, "/");
    if (currentPath !== "/" && currentPath !== "") {
      link.addEventListener("click", (event) => handleNavigationTransition(link, event));
    }
  }
});

/* ——— Nagłówki dzielone na linie (nośnik animacji wjazdu) ——— */

/** Rozbija nagłówek na słowa, mierzy ich pozycje i skleja z powrotem w linie. */
function splitIntoLines(el) {
  if (el.dataset.splitDone === "1") return;
  // Zapamiętaj oryginał PRZED zniszczeniem treści — potrzebny do złożenia
  // nagłówka od nowa po zmianie szerokości okna (patrz initSplitResize).
  if (!el.dataset.splitSource) el.dataset.splitSource = el.innerHTML;

  const words = [...el.childNodes].flatMap((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent.split(/\s+/).filter(Boolean).map((text) => {
        const span = document.createElement("span");
        span.className = "split-word";
        span.textContent = text;
        return span;
      });
    }
    if (node.nodeType === Node.ELEMENT_NODE) {
      const span = document.createElement("span");
      span.className = "split-word";
      span.appendChild(node.cloneNode(true));
      return [span];
    }
    return [];
  });

  if (!words.length) return;

  el.textContent = "";
  el.classList.add("is-split");
  words.forEach((word) => el.append(word, document.createTextNode(" ")));

  const lines = [];
  words.forEach((word) => {
    const top = word.offsetTop;
    const current = lines[lines.length - 1];
    if (current && Math.abs(current.top - top) <= 2) current.words.push(word);
    else lines.push({ top, words: [word] });
  });

  el.textContent = "";
  lines.forEach(({ words: lineWords }) => {
    const line = document.createElement("span");
    line.className = "split-line";
    const inner = document.createElement("span");
    inner.className = "split-line__inner";
    lineWords.forEach((word, i) => {
      if (i) inner.append(document.createTextNode(" "));
      inner.append(word);
    });
    line.appendChild(inner);
    el.appendChild(line);
  });

  el.dataset.splitDone = "1";
}

/** Większe nagłówki z efektem poświaty — auto na stronie, wykluczenia poniżej. */
const HEADLINE_REVEAL_QUERY =
  "main h1, main h2, main .expertise-panel__head h3, .legal__title, [data-headline-reveal]";

export function isHeadlineRevealExcluded(el) {
  if (!el?.textContent?.trim()) return true;
  if (el.closest("[data-no-headline-reveal]")) return true;
  if (el.closest("[data-mission-headline]")) return true;
  if (el.closest("[data-agency-headline]")) return true;
  if (el.closest(".agency__layer--dark")) return true;
  if (el.closest(".hero-intro")) return true;
  if (el.closest("[aria-hidden='true']")) return true;
  if (el.closest(".project-card")) return true;
  if (el.closest(".pass")) return true;
  return false;
}

export function collectHeadlineRevealRoots(scope = document) {
  const seen = new Set();
  const roots = [];
  scope.querySelectorAll(HEADLINE_REVEAL_QUERY).forEach((el) => {
    if (seen.has(el) || isHeadlineRevealExcluded(el)) return;
    seen.add(el);
    roots.push(el);
  });
  scope.querySelectorAll("[data-split]").forEach((el) => {
    if (seen.has(el) || isHeadlineRevealExcluded(el)) return;
    seen.add(el);
    roots.push(el);
  });
  return roots;
}

/** @deprecated tylko dla starych odwołań — używaj collectHeadlineRevealRoots() */
export const HEADLINE_SPLIT_SELECTOR = "[data-headline-reveal], [data-split]";

export function initSplitHeadlines() {
  collectHeadlineRevealRoots().forEach(splitIntoLines);
}

/**
 * Podział na linie liczony jest raz, w szerokości startowej. Bez tego po zwężeniu
 * okna / obrocie telefonu linie z `white-space: nowrap` zostają w starej szerokości
 * i część tekstu wypada poza `overflow: hidden` — jest bezpowrotnie ucięta.
 * Tu składamy nagłówki od nowa po realnej zmianie szerokości (próg 40 px odsiewa
 * chowanie paska adresu na mobile, które zmienia tylko wysokość).
 */
export function initSplitResize() {
  let lastWidth = window.innerWidth;
  let timer = null;

  const resplit = () => {
    const heads = collectHeadlineRevealRoots().filter(
      (el) => el.dataset.splitDone === "1" && el.dataset.splitSource
    );
    if (!heads.length) return;

    heads.forEach((el) => {
      // Wróć do surowego HTML i podziel od nowa w aktualnej szerokości.
      el.innerHTML = el.dataset.splitSource;
      delete el.dataset.splitDone;
      splitIntoLines(el);

      // Świeże linie nie mają transformu — nagłówek jest po prostu widoczny
      // (był już raz odsłonięty, nie powtarzamy wjazdu). clearProps kasuje
      // ewentualny transform z animacji przerwanej w trakcie resize.
      const inners = [...el.querySelectorAll(".split-line__inner")];
      gsap.set(inners, { clearProps: "transform,translate,rotate,scale,clipPath,webkitClipPath" });
      inners.forEach((inner) => inner.classList.add("is-headline-revealed"));

      // Sieć bezpieczeństwa: gdyby pomiar rozminął się z realną szerokością,
      // pozwól linii zawinąć się, zamiast dać jej wypaść poza overflow: hidden.
      inners.forEach((inner) => {
        if (inner.scrollWidth > inner.parentElement.clientWidth + 1) {
          inner.style.whiteSpace = "normal";
        }
      });
    });

    // Wysokości sekcji się zmieniły — przelicz pozycje pinów i triggerów.
    ScrollTrigger.refresh();
  };

  const schedule = (delay) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      lastWidth = window.innerWidth;
      resplit();
    }, delay);
  };

  window.addEventListener("resize", () => {
    if (Math.abs(window.innerWidth - lastWidth) < 40) return;
    schedule(200);
  });

  window.addEventListener("orientationchange", () => schedule(250));
}
