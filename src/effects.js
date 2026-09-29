import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { collectHeadlineRevealRoots, ease, softMotion } from "./shared.js";

/** Oznacza linię jako gotową do wjazdu. (Wcześniej owijała ją też warstwą
 *  czerwonego „rozbłysku” — usunięte po feedbacku „za dużo efektów”.) */
function prepareLine(node) {
  if (!node.textContent.trim()) return null;
  node.dataset.glowReady = "1";
  return node;
}

function playHeadlineReveal(lines, root) {
  if (root?.dataset.headlineRevealStarted === "1") return;
  if (root) root.dataset.headlineRevealStarted = "1";
  revealLines(lines);
}

export function revealLines(nodes, delay = 0) {
  const lineStagger = 0.08;
  const riseDur = softMotion ? 0.9 : 1.1;

  nodes.forEach((node, i) => {
    if (node.dataset.glowPlayed === "1") return;
    node.dataset.glowPlayed = "1";

    gsap.to(node, {
      yPercent: 0,
      duration: riseDur,
      ease,
      delay: delay + i * lineStagger,
      onComplete: () => node.classList.add("is-text-glow-done"),
    });
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
  const lines = headlineLines(root).map(prepareLine).filter(Boolean);
  gsap.set(lines, { yPercent: 110 });
  return lines;
}

/** Odsłona nagłówka linia po linii (większe h1/h2 w main — patrz collectHeadlineRevealRoots). */
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
      // Linia w trakcie (albo tuż przed) wjazdu nie jest „zawieszona” — naprawa
      // w tym momencie czyściła transform w połowie animacji i zostawiała linię
      // przesuniętą o kilkadziesiąt px (widoczne na realizacje.html).
      if (gsap.getTweensOf(line).some((tween) => tween.progress() < 1)) return;

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

      gsap.set(line, { x: 0, y: 0, xPercent: 0, yPercent: 0, clearProps: "transform" });
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
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: softMotion ? 0.6 : 0.8, ease, delay: 0.05, clearProps: "transform" }
        ),
    });
  });
}
