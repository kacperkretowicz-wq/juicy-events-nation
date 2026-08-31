import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger, CustomEase);
CustomEase.create("smoothExpoOut", "M0,0 C0.143,0 0.22,0.534 0.247,0.663 0.277,0.811 0.424,1 1,1");

// Decyzja właściciela strony (2026-08): pełne animacje dla wszystkich, bez względu
// na systemowe „ogranicz animacje". `?reduced` w URL wciąż daje spokojną wersję
// (przydatne do pokazania klientowi). Aby wrócić do respektowania ustawienia:
//   export const softMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
// i przywrócić bloki @media (prefers-reduced-motion) w CSS.
export const softMotion = new URLSearchParams(window.location.search).has("reduced");
export const ease = softMotion ? "power2.out" : "smoothExpoOut";

export const lenis = new Lenis({
  duration: softMotion ? 0.75 : 1.15,
  lerp: softMotion ? 0.1 : 0.085,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  wheelMultiplier: 0.92,
});

document.documentElement.classList.add("lenis", "lenis-smooth");
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

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
  link.addEventListener("click", (event) => {
    const href = link.getAttribute("href");
    if (!href || href === "#") return;
    const target = document.querySelector(href);
    if (!target) return;
    event.preventDefault();
    // Zapas na wysokość przyklejonego nagłówka — bez tego kotwica lądowała
    // pod paskiem nawigacji i pierwsza linijka sekcji była zasłonięta.
    const header = document.querySelector("[data-site-header]");
    lenis.scrollTo(target, { offset: -((header?.offsetHeight ?? 0) + 8) });
  });
});

/* ——— Fokus uwięziony w warstwie ———
   Menu i showreel to warstwy modalne. Bez pułapki na Tab fokus ucieka do
   treści pod spodem, którą użytkownik i tak ma zasłoniętą. */
function trapFocus(container, event) {
  const focusable = [
    ...container.querySelectorAll('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'),
  ].filter((el) => el.offsetParent !== null);
  if (!focusable.length) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

/* ——— Header: przyklejony na stałe, z tonem dopasowanym do tła ———
   Panel nawigacji jest widoczny cały czas, niezależnie od kierunku scrolla.

   Trzy stany:
   • przezroczysty  — u samej góry, nad wideo hero (czysty kadr),
   • --floating     — po odjechaniu od góry: scrim + blur, żeby wielkie napisy
                      sekcji nie przejeżdżały przez linki nawigacji,
   • --solid        — nad jasnymi sekcjami: kremowe tło i ciemny tekst. */

export function initHeader() {
  const header = document.querySelector("[data-site-header]");
  if (!header) return;

  const darkZones = [...document.querySelectorAll("[data-tone='dark']")];
  const progress = header.querySelector("[data-header-progress]");
  const navLinks = [...header.querySelectorAll(".site-header__nav a[href^='#']")];
  // Kolejność linków w nawigacji NIE odpowiada kolejności sekcji w dokumencie
  // („Realizacje" są pierwsze w menu, a w treści dopiero po „Kompetencjach").
  // Bez posortowania po pozycji w dokumencie podświetlał się zły link.
  const sections = navLinks
    .map((link) => ({ link, section: document.querySelector(link.getAttribute("href")) }))
    .filter((entry) => entry.section)
    .sort((a, b) =>
      a.section.compareDocumentPosition(b.section) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
    );

  let activeLink = null;

  const update = () => {
    const probe = header.offsetHeight * 0.5;

    const overDark = darkZones.some((zone) => {
      const rect = zone.getBoundingClientRect();
      return rect.top <= probe && rect.bottom >= probe;
    });
    const floating = window.scrollY > 80;
    header.classList.toggle("site-header--solid", !overDark);
    header.classList.toggle("site-header--floating", floating);

    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      progress.style.setProperty("--progress", ratio.toFixed(4));
    }

    // Scroll-spy: aktywna jest ostatnia sekcja, której górna krawędź minęła
    // linię nagłówka. Prosty warunek, ale odporny na sekcje różnej wysokości.
    if (sections.length) {
      // U samej góry nic nie podświetlamy — hero ma zostać czysty.
      let current = null;
      if (floating) {
        sections.forEach(({ link, section }) => {
          if (section.getBoundingClientRect().top <= probe + 24) current = link;
        });
      }
      if (current !== activeLink) {
        activeLink?.removeAttribute("aria-current");
        current?.setAttribute("aria-current", "true");
        activeLink = current;
      }
    }
  };

  update();

  if (softMotion) {
    window.addEventListener("scroll", update, { passive: true });
    return;
  }

  lenis.on("scroll", update);
}

/* ——— Mega menu ——— */

const menu = document.getElementById("mega-menu");
const showreel = document.getElementById("showreel");
const burger = document.querySelector("[data-menu-open]");

let lastFocusBeforeLayer = null;

function lockScroll() {
  document.body.style.overflow = "hidden";
  lenis.stop();
}

function unlockScroll() {
  if (menu?.classList.contains("is-open") || showreel?.classList.contains("is-open")) return;
  document.body.style.overflow = "";
  lenis.start();
}

/** Zamknięta warstwa musi być NIEWIDOCZNA dla klawiatury i czytnika ekranu.
    Samo `opacity: 0` zostawiało w niej fokusowalne linki — Tab wchodził
    w niewidoczne menu i użytkownik tracił orientację. */
function setLayerHidden(layer, hidden) {
  if (!layer) return;
  layer.setAttribute("aria-hidden", String(hidden));
  if (hidden) layer.setAttribute("inert", "");
  else layer.removeAttribute("inert");
}

setLayerHidden(menu, true);
setLayerHidden(showreel, true);

function openMenu() {
  if (!menu) return;
  lastFocusBeforeLayer = document.activeElement;
  menu.classList.add("is-open");
  setLayerHidden(menu, false);
  burger?.setAttribute("aria-expanded", "true");
  burger?.setAttribute("aria-label", "Zamknij menu");
  lockScroll();
  gsap.fromTo(
    menu.querySelectorAll(".mega-menu__list li"),
    { yPercent: 110, opacity: 0 },
    { yPercent: 0, opacity: 1, duration: 0.6, stagger: 0.05, ease, delay: 0.15 }
  );
  menu.querySelector("[data-menu-close]")?.focus();
}

function closeMenu() {
  if (!menu || !menu.classList.contains("is-open")) return;
  menu.classList.remove("is-open");
  setLayerHidden(menu, true);
  burger?.setAttribute("aria-expanded", "false");
  burger?.setAttribute("aria-label", "Otwórz menu");
  unlockScroll();
  lastFocusBeforeLayer?.focus?.();
}

document.querySelectorAll("[data-menu-open]").forEach((btn) => btn.addEventListener("click", openMenu));
document.querySelectorAll("[data-menu-close]").forEach((btn) => btn.addEventListener("click", closeMenu));

/* ——— Showreel ——— */

const reelFigures = [...document.querySelectorAll("[data-showreel-track] figure")];
const reelDotsBox = document.querySelector("[data-showreel-dots]");
const reelTimerBar = document.querySelector("[data-showreel-timer] span");
const SLIDE_MS = 4200;

let reelIndex = 0;
let reelTimer = null;
let reelTween = null;
let reelPlaying = true;
let reelDots = [];

if (reelDotsBox && reelFigures.length) {
  reelFigures.forEach((figure, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Ujęcie ${i + 1}: ${figure.querySelector("figcaption")?.textContent ?? ""}`.trim());
    dot.addEventListener("click", () => {
      showReelSlide(i);
      if (reelPlaying) playReel();
    });
    reelDotsBox.appendChild(dot);
    reelDots.push(dot);
  });
}

function showReelSlide(index) {
  reelFigures.forEach((figure, i) => {
    const active = i === index;
    figure.classList.toggle("is-active", active);
    const video = figure.querySelector("video");
    if (!video) return;
    if (active) {
      // Wideo showreelu ładujemy dopiero, gdy naprawdę ma zagrać —
      // cztery pliki wczytywane z góry zjadały transfer przy wejściu na stronę.
      if (!video.src && video.dataset.src) video.src = video.dataset.src;
      if (reelPlaying) video.play().catch(() => {});
    } else {
      video.pause();
      video.currentTime = 0;
    }
  });
  reelDots.forEach((dot, i) => {
    if (i === index) dot.setAttribute("aria-current", "true");
    else dot.removeAttribute("aria-current");
  });
  reelIndex = index;
}

function playReel() {
  clearTimeout(reelTimer);
  reelTween?.kill();
  reelPlaying = true;

  const playBtn = document.querySelector("[data-showreel-play]");
  if (playBtn) {
    playBtn.textContent = "Pauza";
    playBtn.setAttribute("aria-label", "Zatrzymaj automatyczne przewijanie");
  }

  reelFigures[reelIndex]?.querySelector("video")?.play().catch(() => {});

  if (reelTimerBar) {
    reelTween = gsap.fromTo(
      reelTimerBar,
      { width: "0%" },
      { width: "100%", duration: SLIDE_MS / 1000, ease: "none" }
    );
  }
  reelTimer = setTimeout(() => {
    showReelSlide((reelIndex + 1) % reelFigures.length);
    playReel();
  }, SLIDE_MS);
}

function stopReel() {
  reelPlaying = false;
  clearTimeout(reelTimer);
  reelTween?.kill();
  const playBtn = document.querySelector("[data-showreel-play]");
  if (playBtn) {
    playBtn.textContent = "Odtwórz";
    playBtn.setAttribute("aria-label", "Wznów automatyczne przewijanie");
  }
  reelFigures.forEach((figure) => figure.querySelector("video")?.pause());
}

/** `index` — od którego ujęcia startuje showreel (patrz `data-showreel-index`
    na wyzwalaczu). Domyślnie 0 (główny showreel) dla wyzwalaczy bez
    przypisanego konkretnego klipu, np. karty „Zobacz, jak pracujemy". */
export function openShowreel(index = 0) {
  if (!showreel) return;
  lastFocusBeforeLayer = document.activeElement;
  showreel.classList.add("is-open");
  setLayerHidden(showreel, false);
  lockScroll();
  showReelSlide(index);
  playReel();
  showreel.querySelector("[data-showreel-close]")?.focus();
}

export function closeShowreel() {
  if (!showreel || !showreel.classList.contains("is-open")) return;
  showreel.classList.remove("is-open");
  setLayerHidden(showreel, true);
  stopReel();
  unlockScroll();
  lastFocusBeforeLayer?.focus?.();
}

document.querySelectorAll("[data-showreel-open]").forEach((btn) => {
  // `data-showreel-index` wiąże wyzwalacz z KONKRETNYM ujęciem w showreelu —
  // bez tego zawsze startowało od slajdu 0, więc kliknięcie kadru hero
  // (który gra hero.mp4) otwierało zupełnie inny klip (showreel-main.mp4).
  const openAtOwnClip = () => openShowreel(Number(btn.dataset.showreelIndex) || 0);

  btn.addEventListener("click", openAtOwnClip);
  // Wyzwalaczem bywa też kadr wideo (role="button"), a nie tylko <button>.
  // Element z rolą przycisku nie dostaje kliknięcia z klawiatury automatycznie.
  if (btn.tagName === "BUTTON") return;
  btn.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    openAtOwnClip();
  });
});
document.querySelectorAll("[data-showreel-close]").forEach((btn) => btn.addEventListener("click", closeShowreel));

document.querySelector("[data-showreel-prev]")?.addEventListener("click", () => {
  showReelSlide((reelIndex - 1 + reelFigures.length) % reelFigures.length);
  if (reelPlaying) playReel();
});
document.querySelector("[data-showreel-next]")?.addEventListener("click", () => {
  showReelSlide((reelIndex + 1) % reelFigures.length);
  if (reelPlaying) playReel();
});
document.querySelector("[data-showreel-play]")?.addEventListener("click", () => {
  if (reelPlaying) stopReel();
  else playReel();
});

// Klik w tło zamyka showreel — jak w każdej warstwie modalnej.
showreel?.addEventListener("click", (event) => {
  if (event.target === showreel) closeShowreel();
});

document.addEventListener("keydown", (event) => {
  const menuOpen = menu?.classList.contains("is-open");
  const reelOpen = showreel?.classList.contains("is-open");

  if (event.key === "Escape") {
    closeMenu();
    closeShowreel();
    return;
  }

  if (event.key === "Tab") {
    if (reelOpen) trapFocus(showreel, event);
    else if (menuOpen) trapFocus(menu, event);
    return;
  }

  if (!reelOpen) return;
  if (event.key === "ArrowLeft") document.querySelector("[data-showreel-prev]")?.click();
  else if (event.key === "ArrowRight") document.querySelector("[data-showreel-next]")?.click();
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

  // Sieć bezpieczeństwa od razu przy pierwszym podziale (wcześniej działała
  // dopiero przy zmianie szerokości okna): jeśli linia z `white-space: nowrap`
  // jest szersza niż maska, pozwól jej się zawinąć. Bez tego długie polskie
  // słowa („EKSPERYMENTOWAĆ") wychodziły poza ekran na telefonie i były ucinane.
  el.querySelectorAll(".split-line__inner").forEach((inner) => {
    if (inner.scrollWidth > inner.parentElement.clientWidth + 1) {
      inner.style.whiteSpace = "normal";
    }
  });

  el.dataset.splitDone = "1";
}

export function initSplitHeadlines() {
  document.querySelectorAll("[data-split]").forEach(splitIntoLines);
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
    const heads = [...document.querySelectorAll("[data-split]")].filter(
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
      gsap.set(inners, { clearProps: "transform,translate,rotate,scale" });

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
