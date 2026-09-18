import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ease, softMotion } from "./shared.js";

/** Owija linię w dwie warstwy: bazową i rozbłysk przesuwany maską. */
function prepareGlow(node) {
  if (node.dataset.glowReady === "1") return node;
  if (!node.textContent.trim()) return null;

  const markup = node.innerHTML;
  node.dataset.glowReady = "1";
  node.classList.add("text-glow");
  node.innerHTML = "";

  const base = document.createElement("span");
  base.className = "text-glow__base";
  base.innerHTML = markup;

  const fire = document.createElement("span");
  fire.className = "text-glow__fire";
  fire.setAttribute("aria-hidden", "true");
  fire.innerHTML = markup;

  node.append(base, fire);
  return node;
}

function playHeadlineReveal(lines, root) {
  if (root?.dataset.headlineRevealStarted === "1") return;
  if (root) root.dataset.headlineRevealStarted = "1";
  revealLines(lines);
}

export function revealLines(nodes, delay = 0) {
  nodes.forEach((node, i) => {
    if (node.dataset.glowPlayed === "1") return;
    node.dataset.glowPlayed = "1";

    const tl = gsap.timeline({ delay: delay + i * 0.055 });
    tl.to(node, { yPercent: 0, duration: softMotion ? 0.7 : 0.95, ease }, 0);

    if (node.classList.contains("text-glow")) {
      tl.to(node, { "--glow-sweep": 1, "--glow-intensity": 1, duration: 0.55, ease: "power2.inOut" }, 0.06).to(
        node,
        {
          "--glow-intensity": 0,
          duration: 0.4,
          ease: "power2.out",
          onComplete: () => node.classList.add("is-text-glow-done"),
        }
      );
    }
  });
}

function headlineLines(root) {
  const split = [...root.querySelectorAll(".split-line__inner")];
  if (split.length) return split;
  const manual = [...root.querySelectorAll(".line > span")];
  if (manual.length) return manual;
  return [root];
}

export function prepareHeadline(root) {
  const lines = headlineLines(root).map(prepareGlow).filter(Boolean);
  gsap.set(lines, { yPercent: 110 });
  return lines;
}

const HEADLINE_REVEAL_SELECTOR = "[data-headline-reveal]";

/** Odsłona nagłówka — tylko elementy z data-headline-reveal (wykluczenia w HTML). */
export function bindHeadlineReveal(root) {
  if (!root || root.dataset.revealBound === "1") return;

  const lines = prepareHeadline(root);
  if (!lines.length) return;

  root.dataset.revealBound = "1";

  const triggerSel = root.dataset.revealTrigger;
  const trigger = triggerSel ? root.closest(triggerSel) || root : root;
  const start = root.dataset.revealStart || "top 88%";

  ScrollTrigger.create({
    trigger,
    start,
    once: true,
    invalidateOnRefresh: true,
    onEnter: () => playHeadlineReveal(lines, root),
  });
}

/** Kontakt: sticky pin — trigger na sekcji, nie na h2. */
export function bindContactHeadlineReveal() {
  const title = document.querySelector(".contact__title[data-headline-reveal]");
  if (!title || title.dataset.contactRevealBound === "1") return;

  const section = title.closest(".contact");
  if (!section) return;

  title.dataset.contactRevealBound = "1";
  title.dataset.revealBound = "1";

  const lines = prepareHeadline(title);
  if (!lines.length) return;

  ScrollTrigger.create({
    trigger: section,
    start: "top 70%",
    once: true,
    invalidateOnRefresh: true,
    onEnter: () => playHeadlineReveal(lines, title),
  });
}

/** Nagłówki już w kadrze po layout shift (miniatury realizacji itd.). */
export function kickVisibleHeadlines(selectors = HEADLINE_REVEAL_SELECTOR) {
  const list = typeof selectors === "string" ? selectors : selectors.join(",");
  document.querySelectorAll(list).forEach((root) => {
    const lines = headlineLines(root).filter((line) => line.dataset.glowReady === "1");
    if (!lines.length || lines.every((line) => line.dataset.glowPlayed === "1")) return;

    const rect = root.getBoundingClientRect();
    const vh = window.innerHeight;
    if (rect.top > vh * 0.94 || rect.bottom < vh * 0.06) return;

    playHeadlineReveal(lines, root);
  });
}

/** Linie zostawione poniżej kadru po przerwanej animacji / starym bugu. */
export function repairHeadlineLines() {
  document.querySelectorAll(`${HEADLINE_REVEAL_SELECTOR} .split-line__inner`).forEach((line) => {
    const yPercent = gsap.getProperty(line, "yPercent");
    if (typeof yPercent === "number" && yPercent > 8) {
      gsap.set(line, { yPercent: 0, clearProps: "transform" });
      line.classList.add("is-text-glow-done");
      line.dataset.glowPlayed = "1";
    }
  });
}

export function initSectionReveals(scope = document) {
  scope.querySelectorAll(HEADLINE_REVEAL_SELECTOR).forEach((root) => {
    if (root.closest(".contact")) return;
    bindHeadlineReveal(root);
  });

  repairHeadlineLines();

  const fadeTargets = [
    ...scope.querySelectorAll("[data-fade]"),
    ...[...scope.querySelectorAll("[data-fade-group]")].flatMap((group) => [...group.children]),
  ];

  fadeTargets.forEach((el) => {
    if (el.dataset.fadeBound === "1") return;
    el.dataset.fadeBound = "1";

    ScrollTrigger.create({
      trigger: el,
      start: "top 92%",
      once: true,
      onEnter: () =>
        gsap.fromTo(
          el,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: softMotion ? 0.6 : 0.85, ease, delay: 0.1, clearProps: "transform" }
        ),
    });
  });
}

export function initMarks(scope = document) {
  scope.querySelectorAll(".mark").forEach((el) => {
    if (el.dataset.markBound === "1") return;
    el.dataset.markBound = "1";
    ScrollTrigger.create({
      trigger: el,
      start: "top 84%",
      once: true,
      onEnter: () => el.classList.add("is-marked"),
    });
  });
}

export function initParallax(scope = document) {
  if (softMotion) return;

  scope.querySelectorAll("[data-parallax]").forEach((el) => {
    const strength = parseFloat(el.dataset.parallax) || 0.15;
    gsap.fromTo(
      el,
      { yPercent: -strength * 50 },
      {
        yPercent: strength * 50,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
      }
    );
  });
}
