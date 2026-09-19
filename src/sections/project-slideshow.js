import { isScrollActive, touchCoarse } from "../shared.js";

// Szybki podgląd zdjęć w okienku peek — tylko na hover (0,4 s / slajd).
const INTERVAL = 400;

export function initProjectSlideshow() {
  const peeks = [...document.querySelectorAll("[data-peek-slideshow]")];
  if (!peeks.length) return;

  peeks.forEach((peek) => {
    const card = peek.closest(".project-card");
    const slides = [...peek.querySelectorAll("[data-peek-slide]")];
    if (!card || slides.length < 2) return;

    let index = 0;
    let timer = null;

    const show = (next) => {
      slides[index]?.classList.remove("is-active");
      index = next;
      slides[index]?.classList.add("is-active");
    };

    const reset = () => {
      window.clearInterval(timer);
      timer = null;
      show(0);
    };

    const start = () => {
      if (timer) return;
      if (touchCoarse && isScrollActive()) return;
      timer = window.setInterval(() => {
        if (touchCoarse && isScrollActive()) return;
        show((index + 1) % slides.length);
      }, INTERVAL);
    };

    const canHover = window.matchMedia("(hover: hover)").matches;

    if (canHover) {
      card.addEventListener("mouseenter", start);
      card.addEventListener("mouseleave", reset);
      card.addEventListener("focusin", start);
      card.addEventListener("focusout", (event) => {
        if (!card.contains(event.relatedTarget)) reset();
      });
      return;
    }

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) start();
            else reset();
          });
        },
        { threshold: 0.45 }
      );
      observer.observe(card);
    } else {
      start();
    }
  });
}
