import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ease, softMotion } from "../shared.js";
import { kickVisibleHeadlines } from "../effects.js";

/** Na mobile: delikatny dryf okładki w kadrze podczas scrolla. */
export function initProjectCoverDrift() {
  if (softMotion) return;
  if (!window.matchMedia("(max-width: 980px)").matches) return;

  document.querySelectorAll("[data-projects] .project-card__cover").forEach((cover) => {
    const media = cover.closest(".project-card__media");
    if (!media) return;

    gsap.fromTo(
      cover,
      { yPercent: -10 },
      {
        yPercent: 10,
        ease: "none",
        scrollTrigger: {
          trigger: media,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      }
    );
  });
}

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
    if (card.closest(".projects--goodman")) return;
    const reveal = () => {
      if (card.dataset.revealed === "1") return;
      card.dataset.revealed = "1";
      gsap.fromTo(
        card,
        { opacity: 0, y: softMotion ? 16 : 56 },
        {
          opacity: 1,
          y: 0,
          duration: softMotion ? 0.6 : 0.95,
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
