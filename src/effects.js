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

export function revealLines(nodes, delay = 0) {
  nodes.forEach((node, i) => {
    if (node.dataset.glowPlayed === "1") return;
    node.dataset.glowPlayed = "1";

    const tl = gsap.timeline({ delay: delay + i * 0.055 });
    tl.to(node, { yPercent: 0, duration: softMotion ? 0.7 : 0.95, ease }, 0);

    if (node.classList.contains("text-glow")) {
      tl.to(node, { "--glow-sweep": 1, "--glow-intensity": 1, duration: 0.55, ease: "power2.inOut" }, 0.06)
        .to(node, {
          "--glow-intensity": 0,
          duration: 0.4,
          ease: "power2.out",
          onComplete: () => node.classList.add("is-text-glow-done"),
        });
    }
  });
}

/** Zbiera animowalne linie nagłówka — po podziale na słowa lub po ręcznych `.line`. */
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

/** Wejścia sekcji: nagłówki wjeżdżają z dołu, treść delikatnie się wynurza. */
export function initSectionReveals(scope = document) {
  scope.querySelectorAll("[data-split]").forEach((root) => {
    if (root.dataset.revealBound === "1") return;
    root.dataset.revealBound = "1";

    const lines = prepareHeadline(root);
    ScrollTrigger.create({
      trigger: root,
      start: "top 88%",
      once: true,
      onEnter: () => revealLines(lines),
    });
  });

  const fadeTargets = [
    ...scope.querySelectorAll("[data-fade]"),
    ...[...scope.querySelectorAll("[data-fade-group]")].flatMap((group) => [...group.children]),
  ];

  fadeTargets.forEach((el) => {
    if (el.dataset.fadeBound === "1") return;
    el.dataset.fadeBound = "1";

    gsap.set(el, { opacity: 0, y: 24 });
    ScrollTrigger.create({
      trigger: el,
      start: "top 92%",
      once: true,
      onEnter: () =>
        gsap.to(el, { opacity: 1, y: 0, duration: softMotion ? 0.6 : 0.85, ease, delay: 0.1 }),
    });
  });
}

/** Delikatny parallax na kadrach oznaczonych `data-parallax`. */
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
