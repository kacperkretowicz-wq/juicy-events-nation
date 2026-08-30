import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ease, softMotion } from "../shared.js";

export function initProjects() {
  const cards = [...document.querySelectorAll("[data-project], [data-need-card], [data-team-card]")];
  if (!cards.length) return;

  cards.forEach((card) => {
    gsap.set(card, { opacity: 0, y: softMotion ? 16 : 56 });
    ScrollTrigger.create({
      trigger: card,
      start: "top 92%",
      once: true,
      onEnter: () =>
        gsap.to(card, {
          opacity: 1,
          y: 0,
          duration: softMotion ? 0.6 : 0.95,
          ease,
          overwrite: "auto",
        }),
    });
  });
}
