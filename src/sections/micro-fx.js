// ——— Mikro-efekty: reveal galerii, hover kart, dryf wordmarku, magnetyczne CTA ———
// Amplitudy trzymane nisko — mają być wyczuwalne, nie krzykliwe.
// (`softMotion` = tylko opt-in `?reduced` w URL — patrz shared.js.)

import { onScrollFrame, softMotion } from "../shared.js";

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

/* Dryf gigantycznego wordmarku w stopce (±60 px). */
export function initWordmarkDrift() {
  const word = document.querySelector(".site-footer__wordmark span");
  if (!word || softMotion) return;

  const update = () => {
    const rect = word.getBoundingClientRect();
    const p = 1 - (rect.top + rect.height) / (window.innerHeight + rect.height);
    const shift = (Math.min(1, Math.max(0, p)) - 0.5) * 36;
    word.style.transform = `translate(${shift}px, 0.06em)`;
  };
  update();
  onScrollFrame(update);
  window.addEventListener("resize", update);
}

/* Magnetyczne główne CTA (±8 px). */
export function initMagneticButtons() {
  if (softMotion || !window.matchMedia("(hover: hover)").matches) return;

  document.querySelectorAll(".btn--bar, .btn--dark").forEach((btn) => {
    let x = 0;
    let y = 0;
    let tx = 0;
    let ty = 0;
    let raf = null;

    const loop = () => {
      x += (tx - x) * 0.2;
      y += (ty - y) * 0.2;
      btn.style.transform = `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px)`;
      if (Math.abs(tx - x) > 0.1 || Math.abs(ty - y) > 0.1) {
        raf = requestAnimationFrame(loop);
      } else {
        raf = null;
        if (tx === 0 && ty === 0) btn.style.transform = "";
      }
    };

    btn.addEventListener("pointermove", (e) => {
      const r = btn.getBoundingClientRect();
      tx = Math.max(-8, Math.min(8, (e.clientX - (r.left + r.width / 2)) * 0.18));
      ty = Math.max(-6, Math.min(6, (e.clientY - (r.top + r.height / 2)) * 0.18));
      if (!raf) raf = requestAnimationFrame(loop);
    });

    btn.addEventListener("pointerleave", () => {
      tx = 0;
      ty = 0;
      if (!raf) raf = requestAnimationFrame(loop);
    });
  });
}

export function initMicroFx() {
  initMediaReveal();
  initWordmarkDrift();
  initMagneticButtons();
}
