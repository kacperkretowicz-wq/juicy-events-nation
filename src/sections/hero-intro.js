import gsap from "gsap";
import { lenis } from "../shared.js";

// Intro przy każdym wejściu i odświeżeniu. Choreografia:
//   1. litery J i E stoją obok siebie na środku,
//   2. rozjeżdżają się na boki, a między nimi rośnie pojedyncza linia,
//   3. linia rozwija się w prostokątną ramkę, J dojeżdża do jej lewego górnego,
//      a E do prawego dolnego narożnika,
//   4. w ramce błyskają zdjęcia z realizacji (CUT ms na zdjęcie).

const CUT = 300; // ms na jedno zdjęcie
const CUTS = 6; // liczba cięć

const HOLD = 0.35; // s: „JE" razem, zanim ruszą
const SPREAD = 0.55; // s: rozjazd liter + linia na pełną szerokość
const OPEN = 0.6; // s: linia rozwija się w prostokąt

// Zdjęcia leżą w public/, więc Vite ich nie indeksuje — liczby plików trzymamy
// tutaj (katalogi mają numerację 01..N).
const PROJECTS = [
  ["john-deere", 12],
  ["retro-rush", 7],
  ["active-fashion", 7],
  ["multichem", 6],
  ["rainbow", 5],
  ["volvo", 5],
];

const POOL = PROJECTS.flatMap(([slug, count]) =>
  Array.from(
    { length: count },
    (_, i) => `/media/realizacje/${slug}/${String(i + 1).padStart(2, "0")}.jpg`
  )
);

/** Losowa kolejność zdjęć, inna przy każdym wejściu (Fisher–Yates). */
function pickImages(count) {
  const pool = [...POOL];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, Math.min(count, pool.length));
}

export function initHeroIntro() {
  const intro = document.querySelector("[data-hero-intro]");
  if (!intro) return;

  const stage = intro.querySelector("[data-hero-intro-stage]");
  const frame = intro.querySelector("[data-hero-intro-frame]");
  const img = intro.querySelector("[data-hero-intro-img]");
  const markJ = intro.querySelector("[data-hero-intro-j]");
  const markE = intro.querySelector("[data-hero-intro-e]");
  const video = document.querySelector("[data-agency-video]");

  // Szybki montaż to migotanie ~3 razy na sekundę — komu ruch przeszkadza, temu
  // pokazujemy stronę od razu.
  const noMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (noMotion || !stage || !frame || !img || !markJ || !markE) {
    intro.remove();
    return;
  }

  document.body.style.overflow = "hidden";
  lenis.stop();

  const shots = pickImages(CUTS);
  shots.forEach((src) => {
    const pre = new Image();
    pre.src = src;
  });

  let timer = null;
  let done = false;

  const finish = () => {
    if (done) return;
    done = true;
    clearTimeout(timer);
    intro.classList.add("is-done");
    document.body.style.overflow = "";
    lenis.start();
    // Wejście na stronę ma pokazywać film od jego punktu startowego, a nie od
    // klatki, do której doszedł, grając pod nakładką (obsługa w hero-reel.js).
    video?.dispatchEvent(new CustomEvent("jen:intro-done"));
    intro.addEventListener("transitionend", () => intro.remove(), { once: true });
  };

  // Migotanie startuje razem z rozwijaniem ramki, żeby otwierała się już na
  // „żywym" materiale, a nie na zastygłej klatce.
  let cut = 0;
  const flicker = () => {
    if (cut >= shots.length) {
      finish();
      return;
    }
    img.src = shots[cut];
    cut += 1;
    timer = setTimeout(flicker, CUT);
  };

  const run = () => {
    const w = stage.offsetWidth;
    const h = stage.offsetHeight;
    // Punkt startowy: litery stykają się barkami na środku.
    const together = (markJ.offsetWidth + markE.offsetWidth) / 4;

    gsap.set([markJ, markE], { xPercent: -50, yPercent: -50, y: 0 });
    gsap.set(markJ, { x: -together });
    gsap.set(markE, { x: together });
    // Wysokość startowa (grubość linii) zostaje z CSS — GSAP dopisze ją sobie
    // z computed style przy animacji do pełnego prostokąta.
    gsap.set(frame, { width: 0 });

    gsap
      .timeline({ defaults: { ease: "power3.inOut" } })
      // Faza 2: rozjazd na boki + linia rośnie do pełnej szerokości ramki.
      .addLabel("spread", HOLD)
      .to(markJ, { x: -w / 2, duration: SPREAD }, "spread")
      .to(markE, { x: w / 2, duration: SPREAD }, "spread")
      .to(frame, { width: w, duration: SPREAD }, "spread")
      // Faza 3: linia rozwija się w prostokąt, litery jadą w narożniki.
      .addLabel("open")
      .to(markJ, { y: -h / 2, duration: OPEN }, "open")
      .to(markE, { y: h / 2, duration: OPEN }, "open")
      .to(frame, { height: h, duration: OPEN }, "open")
      .call(flicker, null, "open");
  };

  // Start po pierwszym zdjęciu, żeby ramka nie otwierała się na czarnej dziurze.
  let started = false;
  const start = () => {
    if (started) return;
    started = true;
    run();
  };
  const first = new Image();
  first.onload = start;
  first.onerror = start;
  first.src = shots[0];
  // Bezpiecznik na wolne łącze — intro nie może zawiesić wejścia na stronę.
  setTimeout(start, 700);

  // Da się przeskoczyć — nikt nie chce oglądać tego samego przy każdym odświeżeniu.
  intro.addEventListener("click", finish);
  window.addEventListener("keydown", finish, { once: true });
}
