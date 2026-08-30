import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger, CustomEase);
CustomEase.create("smoothExpoOut", "M0,0 C0.143,0 0.22,0.534 0.247,0.663 0.277,0.811 0.424,1 1,1");

export const softMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const href = link.getAttribute("href");
    if (!href || href === "#") return;
    const target = document.querySelector(href);
    if (!target) return;
    event.preventDefault();
    lenis.scrollTo(target, { offset: -16 });
  });
});

/* ——— Header: chowanie przy scrollu w dół + ton nad jasnymi sekcjami ——— */

export function initHeader() {
  const header = document.querySelector("[data-site-header]");
  if (!header) return;

  const darkZones = [...document.querySelectorAll("[data-tone='dark']")];
  let hidden = false;
  let lastScroll = lenis.scroll;

  const setHidden = (value) => {
    if (hidden === value) return;
    hidden = value;
    header.classList.toggle("site-header--hidden", value);
  };

  const updateTone = () => {
    const probe = header.offsetHeight * 0.5;
    const overDark = darkZones.some((zone) => {
      const rect = zone.getBoundingClientRect();
      return rect.top <= probe && rect.bottom >= probe;
    });
    header.classList.toggle("site-header--solid", !overDark);
  };

  const onScroll = ({ scroll, direction }) => {
    updateTone();

    if (scroll <= 72) {
      setHidden(false);
    } else if (Math.abs(scroll - lastScroll) >= 6) {
      setHidden(direction > 0);
    }
    lastScroll = scroll;
  };

  if (softMotion) {
    updateTone();
    window.addEventListener("scroll", updateTone, { passive: true });
    return;
  }

  lenis.on("scroll", onScroll);
  updateTone();
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

function openMenu() {
  if (!menu) return;
  menu.classList.add("is-open");
  menu.setAttribute("aria-hidden", "false");
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
  unlockScroll();
}

document.querySelectorAll("[data-menu-open]").forEach((btn) => btn.addEventListener("click", openMenu));
document.querySelectorAll("[data-menu-close]").forEach((btn) => btn.addEventListener("click", closeMenu));

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

/* ——— Nagłówki dzielone na linie (nośnik animacji wjazdu) ——— */

/** Rozbija nagłówek na słowa, mierzy ich pozycje i skleja z powrotem w linie. */
function splitIntoLines(el) {
  if (el.dataset.splitDone === "1") return;

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

export function initSplitHeadlines() {
  document.querySelectorAll("[data-split]").forEach(splitIntoLines);
}
