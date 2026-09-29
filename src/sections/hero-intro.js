import gsap from "gsap";
import { lenis } from "../shared.js";

// Intro: 1) logotyp Je! na czerni, 2) dwa mrugnięcia logo, 3) pełny ekran —
// zdjęcia co 420 ms; po 2. kadrze logo znika, montaż leci dalej.
// Po feedbacku 28.09 („za dużo się dzieje”) spokojniej niż wcześniej (6 błysków
// co 55 ms i 9 kadrów co 300 ms) — i w granicy WCAG 2.3.1 (maks. 3 błyski na sekundę).

const CUT_MS = 420;
const CUTS = 6;
const LOGO_HOLD = 0.6;
const LOGO_BLINKS = 2;
const LOGO_BLINK_DURATION = 0.18;
const LOGO_HIDE_AFTER_SHOTS = 2;

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

  const bgImg = intro.querySelector("[data-hero-intro-img]");
  const logo = intro.querySelector("[data-hero-intro-logo]");
  const markJ = intro.querySelector("[data-hero-intro-j]");
  const markE = intro.querySelector("[data-hero-intro-e]");
  const video = document.querySelector("[data-agency-video]");

  // Intro is part of the brand opening and must run on the normal page.
  // Keep an explicit query opt-out for users who need a still first frame.
  const noMotion = new URLSearchParams(window.location.search).has("reduced");
  if (noMotion || !bgImg || !logo || !markJ || !markE) {
    intro.remove();
    document.dispatchEvent(new CustomEvent("jen:intro-done"));
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
  let timeline = null;

  const finish = () => {
    if (done) return;
    done = true;
    clearTimeout(timer);
    timeline?.kill();
    window.removeEventListener("keydown", finish);
    intro.classList.add("is-done");
    document.body.style.overflow = "";
    lenis.start();
    video?.dispatchEvent(new CustomEvent("jen:intro-done"));
    document.dispatchEvent(new CustomEvent("jen:intro-done"));
    intro.addEventListener("transitionend", () => intro.remove(), { once: true });
    setTimeout(() => intro.remove(), 350);
  };

  const hideLogo = () => {
    gsap.to(logo, { opacity: 0, duration: 0.1, ease: "power1.out" });
  };

  let shown = 0;
  const showNextShot = () => {
    if (done) return;
    if (shown >= shots.length) {
      finish();
      return;
    }
    bgImg.src = shots[shown];
    shown += 1;
    if (shown === LOGO_HIDE_AFTER_SHOTS) hideLogo();
    timer = setTimeout(showNextShot, CUT_MS);
  };

  const startMontage = () => {
    if (done) return;
    gsap.set(bgImg, { opacity: 1 });
    showNextShot();
  };

  const run = () => {
    gsap.set(bgImg, { opacity: 0 });
    gsap.set(logo, { opacity: 1 });
    gsap.set([markJ, markE], { opacity: 1 });

    const tl = timeline = gsap.timeline({ defaults: { ease: "none" } });
    tl.to({}, { duration: LOGO_HOLD })
      .to([markJ, markE], {
        opacity: 0,
        duration: LOGO_BLINK_DURATION,
        repeat: LOGO_BLINKS,
        yoyo: true,
        ease: "steps(1)",
      })
      .set([markJ, markE], { opacity: 1 })
      .call(startMontage);
  };

  let started = false;
  const start = () => {
    if (started || done) return;
    started = true;
    run();
  };

  const first = new Image();
  first.onload = start;
  first.onerror = start;
  first.src = shots[0];
  setTimeout(start, 700);

  intro.addEventListener("click", finish);
  window.addEventListener("keydown", finish, { once: true });
}
