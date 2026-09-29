// ——— Mikro-efekty: delikatne wejście kadrów galerii (wordmark stopki: marquee.js) ———
// Amplitudy trzymane nisko — mają być wyczuwalne, nie krzykliwe.
// (`softMotion` = tylko opt-in `?reduced` w URL — patrz shared.js.)

import { softMotion } from "../shared.js";

/* Delikatne wejście kadrów — galeria i hero podstron realizacji.
   Karty na stronie głównej mają osobny reveal (projects.js). */
function revealMediaFrame(el) {
  if (el.classList.contains("is-media-revealed")) return;
  el.classList.add("is-media-revealed");
}

export function initMediaReveal() {
  const targets = [
    ...document.querySelectorAll(".gallery-item__media"),
    ...document.querySelectorAll(".realizacje-hero-photo"),
  ];
  if (!targets.length) return;

  targets.forEach((el) => {
    el.classList.add("fx-media-reveal");
    const grid = el.closest(".gallery__grid");
    if (grid) {
      const peers = [...grid.querySelectorAll(".gallery-item__media")];
      const i = peers.indexOf(el);
      // Lekki stagger w rzędzie — bez „kaskady” po całej siatce.
      el.style.setProperty("--reveal-delay", `${(i % 3) * 65}ms`);
    }
  });

  if (softMotion || !("IntersectionObserver" in window)) {
    targets.forEach(revealMediaFrame);
    return;
  }

  const targetOf = new WeakMap();
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        revealMediaFrame(targetOf.get(entry.target) ?? entry.target);
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
  );

  targets.forEach((el) => {
    const probe = el.closest(".gallery-item") ?? el.parentElement ?? el;
    targetOf.set(probe, el);
    io.observe(probe);
  });

  requestAnimationFrame(() => {
    targets.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.94 && rect.bottom > 0) {
        revealMediaFrame(el);
        io.unobserve(el.closest(".gallery-item") ?? el.parentElement ?? el);
      }
    });
  });
}

export function initMicroFx() {
  initMediaReveal();
}
