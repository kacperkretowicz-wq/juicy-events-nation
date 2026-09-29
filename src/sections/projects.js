import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ease, softMotion } from "../shared.js";
import { kickVisibleHeadlines } from "../effects.js";

export function initProjects() {
  const grid = document.querySelector("[data-projects]");
  const onGridLayout = () => {
    ScrollTrigger.refresh();
    kickVisibleHeadlines();
  };
  grid?.querySelectorAll("img").forEach((img) => {
    if (img.complete) return;
    img.addEventListener("load", onGridLayout);
  });

  const cards = [...document.querySelectorAll("[data-project], [data-need-card], [data-team-card]")];
  if (!cards.length) return;

  cards.forEach((card) => {
    const reveal = () => {
      if (card.dataset.revealed === "1") return;
      card.dataset.revealed = "1";
      gsap.fromTo(
        card,
        { opacity: 0, y: softMotion ? 12 : 28 },
        {
          opacity: 1,
          y: 0,
          duration: softMotion ? 0.6 : 0.9,
          ease,
          overwrite: "auto",
          clearProps: "transform",
        }
      );
    };

    // Stan schowany ustawia CSS pod `.js` (bez JS karty są widoczne, bez FOUC).
    ScrollTrigger.create({
      trigger: card,
      start: "top 92%",
      once: true,
      onEnter: reveal,
      onRefresh(self) {
        if (self.isActive) reveal();
      },
    });
  });
}
