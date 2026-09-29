import gsap from "gsap";
import { lenis } from "../shared.js";

// Intro: znak Je! na czerni — spokojne pojawienie się, krótka pauza, wyciemnienie
// do hero. Po feedbacku 2026-09-28 („dyskoteka”) bez migania znaku i bez montażu
// zdjęć co 300 ms. Klik lub dowolny klawisz pomija intro.

const FADE_IN = 0.6;
const HOLD = 0.7;
const FADE_OUT = 0.45;

export function initHeroIntro() {
  const intro = document.querySelector("[data-hero-intro]");
  if (!intro) return;

  const logo = intro.querySelector("[data-hero-intro-logo]");
  const video = document.querySelector("[data-agency-video]");

  // `?reduced` w URL — wersja bez intro (np. do pokazania klientowi pierwszej klatki).
  const noMotion = new URLSearchParams(window.location.search).has("reduced");
  if (noMotion || !logo) {
    intro.remove();
    document.dispatchEvent(new CustomEvent("jen:intro-done"));
    return;
  }

  document.body.style.overflow = "hidden";
  lenis.stop();

  let done = false;
  let timeline = null;

  const finish = () => {
    if (done) return;
    done = true;
    timeline?.kill();
    window.removeEventListener("keydown", finish);
    intro.classList.add("is-done");
    document.body.style.overflow = "";
    lenis.start();
    video?.dispatchEvent(new CustomEvent("jen:intro-done"));
    document.dispatchEvent(new CustomEvent("jen:intro-done"));
    intro.addEventListener("transitionend", () => intro.remove(), { once: true });
    setTimeout(() => intro.remove(), 900);
  };

  gsap.set(logo, { opacity: 0, scale: 0.96 });
  timeline = gsap
    .timeline()
    .to(logo, { opacity: 1, scale: 1, duration: FADE_IN, ease: "power2.out" })
    .to(logo, { opacity: 0, duration: FADE_OUT, ease: "power1.in" }, `+=${HOLD}`)
    .call(finish);

  intro.addEventListener("click", finish);
  window.addEventListener("keydown", finish, { once: true });
}
