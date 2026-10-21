// Szybki podgląd zdjęć w okienku na środku kafla — tylko hover myszą (0,7 s / slajd).
// Na dotyku okienko jest ukryte (CSS), więc nic tu nie startuje.
const INTERVAL = 700;

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
      timer = window.setInterval(() => show((index + 1) % slides.length), INTERVAL);
    };

    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    card.addEventListener("mouseenter", start);
    card.addEventListener("mouseleave", reset);
    card.addEventListener("focusin", start);
    card.addEventListener("focusout", (event) => {
      if (!card.contains(event.relatedTarget)) reset();
    });
  });
}
