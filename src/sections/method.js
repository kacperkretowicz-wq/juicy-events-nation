import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { softMotion } from "../shared.js";

// Metoda — statyczna lista kroków (bez pinowania: sekcja ma wyglądać
// „jak na początku"). Ruch niesie tylko czerwona szyna po lewej: wypełnia się
// razem ze scrollem i wygasza kroki, do których jeszcze nie doszliśmy.
export function initMethod() {
  const section = document.querySelector("[data-method]");
  if (!section) return;

  const steps = [...section.querySelectorAll("[data-method-step]")];
  const rail = section.querySelector("[data-method-rail]");
  const list = section.querySelector("[data-method-steps]");

  if (softMotion || !rail || !list || !steps.length) {
    steps.forEach((step) => step.classList.add("is-active"));
    return;
  }

  steps.forEach((step, i) => step.classList.toggle("is-active", i === 0));

  gsap.fromTo(
    rail,
    { scaleY: 0 },
    {
      scaleY: 1,
      ease: "none",
      scrollTrigger: {
        trigger: list,
        start: "top 72%",
        end: "bottom 72%",
        scrub: 0.5,
        invalidateOnRefresh: true,
        onUpdate: ({ progress }) => {
          // Krok zapala się, gdy szyna minie jego wysokość.
          const reached = Math.ceil(progress * steps.length);
          steps.forEach((step, i) => step.classList.toggle("is-active", i < Math.max(1, reached)));
        },
      },
    }
  );
}
