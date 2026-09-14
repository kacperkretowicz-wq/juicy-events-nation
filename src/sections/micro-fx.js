// ——— Mikro-efekty: reveal galerii, hover kart, dryf wordmarku, magnetyczne CTA ———
// Amplitudy trzymane nisko — mają być wyczuwalne, nie krzykliwe.
// (`softMotion` = tylko opt-in `?reduced` w URL — patrz shared.js.)

import { lenis, softMotion } from "../shared.js";

/* Reveal zdjęć rozjeżdżającą się maską — galeria i hero podstron.
   UWAGA: karty realizacji celowo POZA tym efektem. Mają już własny reveal
   (opacity), a druga, niezależna bramka potrafiła zostawić kartę niewidoczną. */
export function initClipReveal() {
  const targets = [
    ...document.querySelectorAll(".gallery-item__media"),
    ...document.querySelectorAll(".realizacje-hero-photo"),
  ];
  if (!targets.length) return;

  targets.forEach((el) => el.classList.add("fx-clip"));

  if (softMotion || !("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("is-clip-revealed"));
    return;
  }

  // Obserwujemy RODZICA kadru, nie sam kadr: kadr ma clip-path inset(0 100% 0 0),
  // a nowsze Chromium liczy przecięcie już po przycięciu — dla w pełni przyciętego
  // elementu daje 0 i reveal nigdy nie startował (zdjęcia w galerii nie pojawiały się).
  const targetOf = new WeakMap();
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        (targetOf.get(entry.target) ?? entry.target).classList.add("is-clip-revealed");
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.2, rootMargin: "0px 0px -8% 0px" }
  );
  targets.forEach((el) => {
    const probe = el.parentElement ?? el;
    targetOf.set(probe, el);
    io.observe(probe);
  });

  // Kadr widoczny już przy starcie (hero podstrony realizacji) odsłaniamy od razu —
  // wcześniej czekał na pierwszy ruch scrolla i strona otwierała się z pustym kadrem.
  requestAnimationFrame(() => {
    targets.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add("is-clip-revealed");
        io.unobserve(el.parentElement ?? el);
      }
    });
  });
}

/* Hover na kartach realizacji: „→ Zobacz realizację" + przesuw pigułek. */
export function initCardHover() {
  document.querySelectorAll(".project-card").forEach((card) => {
    const link = card.querySelector(".project-card__link");
    const stat = card.querySelector(".project-card__stat");
    if (!link || card.querySelector(".project-card__go")) return;

    const go = document.createElement("span");
    go.className = "project-card__go";
    go.setAttribute("aria-hidden", "true");
    go.textContent = "→ Zobacz realizację";
    (stat || link).insertAdjacentElement("afterend", go);

    card.querySelectorAll(".project-card__meta span").forEach((pill, i) => {
      pill.style.transitionDelay = `${i * 35}ms`;
    });
  });
}

/* Dryf gigantycznego wordmarku w stopce (±60 px). */
export function initWordmarkDrift() {
  const word = document.querySelector(".site-footer__wordmark span");
  if (!word || softMotion) return;

  const update = () => {
    const rect = word.getBoundingClientRect();
    // progres od wejścia dołu ekranu do wyjścia górą
    const p = 1 - (rect.top + rect.height) / (window.innerHeight + rect.height);
    const shift = (Math.min(1, Math.max(0, p)) - 0.5) * 120;
    word.style.transform = `translate(${shift}px, 0.06em)`;
  };
  update();
  lenis.on("scroll", update);
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

// Audyt: hover kart i magnetyczne przyciski wyłączone — zostają reveal kadrów
// i dryf wordmarku (funkcje zostawione w pliku na wypadek powrotu).
export function initMicroFx() {
  initClipReveal();
  initWordmarkDrift();
}
