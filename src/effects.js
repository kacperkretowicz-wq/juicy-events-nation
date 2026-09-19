import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { collectHeadlineRevealRoots, ease, softMotion } from "./shared.js";

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

/** Przygotowanie poświaty bez wjazdu linii (np. nagłówki kompetencji przy scrollu). */
export function ensureHeadlineGlow(node) {
  if (!node) return null;
  return prepareGlow(node);
}

/** Sam sweep czerwonej poświaty — można odtwarzać wielokrotnie. */
export function playGlowSweep(node) {
  if (!node) return;
  ensureHeadlineGlow(node);

  const glowSweepDur = 1.28;
  const glowHoldDur = 0.45;
  const glowFadeDur = 0.95;

  gsap.killTweensOf(node);
  node.classList.remove("is-text-glow-done");

  gsap
    .timeline()
    .set(node, { "--glow-intensity": 1, "--glow-sweep": 0 })
    .to(node, { "--glow-sweep": 1, duration: glowSweepDur, ease: "power2.inOut" })
    .to(
      node,
      { "--glow-intensity": 0, duration: glowFadeDur, ease: "power2.out" },
      glowSweepDur + glowHoldDur
    )
    .add(() => node.classList.add("is-text-glow-done"));
}

function playHeadlineReveal(lines, root) {
  if (root?.dataset.headlineRevealStarted === "1") return;
  if (root) root.dataset.headlineRevealStarted = "1";
  revealLines(lines);
}

export function revealLines(nodes, delay = 0) {
  const lineStagger = 0.12;
  const riseDur = softMotion ? 1.55 : 2.15;
  const glowSweepDelay = 0.14;
  const glowSweepDur = 1.28;
  const glowHoldDur = 0.45;
  const glowFadeDur = 0.95;

  nodes.forEach((node, i) => {
    if (node.dataset.glowPlayed === "1") return;
    node.dataset.glowPlayed = "1";

    const tl = gsap.timeline({ delay: delay + i * lineStagger });
    tl.to(node, { yPercent: 0, duration: riseDur, ease }, 0);

    if (node.classList.contains("text-glow")) {
      tl.set(node, { "--glow-intensity": 1 }, glowSweepDelay)
        .fromTo(
          node,
          { "--glow-sweep": 0 },
          { "--glow-sweep": 1, duration: glowSweepDur, ease: "power2.inOut" },
          glowSweepDelay
        )
        .to(node, { "--glow-intensity": 0, duration: glowFadeDur, ease: "power2.out" }, glowSweepDelay + glowSweepDur + glowHoldDur)
        .add(() => node.classList.add("is-text-glow-done"));
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

/** Odsłona nagłówka + czerwona poświata (większe h1/h2 w main — patrz collectHeadlineRevealRoots). */
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
  const title = document.querySelector(".contact__title");
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

let headlineSyncRaf = null;

/** Po zmianie layoutu (intro, piny) — przelicz triggery i odtwórz to, co już jest w kadrze. */
export function syncHeadlineReveals({ refresh = true } = {}) {
  if (headlineSyncRaf) cancelAnimationFrame(headlineSyncRaf);
  headlineSyncRaf = requestAnimationFrame(() => {
    headlineSyncRaf = null;
    repairHeadlineLines();
    kickVisibleHeadlines();
    if (refresh) ScrollTrigger.refresh();
  });
}

/** Nagłówki już w kadrze po layout shift (miniatury realizacji itd.). */
export function kickVisibleHeadlines(roots = null) {
  const list = roots ?? collectHeadlineRevealRoots();
  const targets = typeof roots === "string" ? [...document.querySelectorAll(roots)] : list;

  targets.forEach((root) => {
    const lines = headlineLines(root).filter((line) => line.dataset.glowReady === "1");
    if (!lines.length || lines.every((line) => line.dataset.glowPlayed === "1")) return;

    const rect = root.getBoundingClientRect();
    const vh = window.innerHeight;
    if (rect.top > vh * 0.94 || rect.bottom < vh * 0.06) return;

    playHeadlineReveal(lines, root);
  });
}

/** Stare bugi: ujemny transform / animacja przerwana po glowPlayed. Nie ruszać yPercent: 110 przed reveal. */
export function repairHeadlineLines() {
  collectHeadlineRevealRoots().forEach((root) => {
    root.querySelectorAll(".split-line__inner").forEach((line) => {
      const x = gsap.getProperty(line, "x");
      const xPercent = gsap.getProperty(line, "xPercent");
      const broken =
        (typeof x === "number" && x < -20) ||
        (typeof xPercent === "number" && xPercent < -5);

      const stuckAfterPlay =
        line.dataset.glowPlayed === "1" &&
        !line.classList.contains("is-text-glow-done") &&
        typeof gsap.getProperty(line, "yPercent") === "number" &&
        gsap.getProperty(line, "yPercent") > 8;

      if (!broken && !stuckAfterPlay) return;

      gsap.set(line, { yPercent: 0, clearProps: "transform" });
      line.classList.add("is-text-glow-done");
      line.dataset.glowPlayed = "1";
    });
  });
}

export function initSectionReveals(scope = document) {
  collectHeadlineRevealRoots(scope).forEach((root) => {
    if (root.closest(".contact")) return;
    bindHeadlineReveal(root);
  });

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

  const mobile = window.matchMedia("(max-width: 980px)").matches;

  scope.querySelectorAll("[data-parallax]").forEach((el) => {
    let strength = parseFloat(el.dataset.parallax) || 0.15;
    if (mobile) strength *= 0.45;

    gsap.fromTo(
      el,
      { yPercent: -strength * 50 },
      {
        yPercent: strength * 50,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      }
    );
  });
}
