// Kafelek-slajdshow dla realizacji bez wideo: proste crossfade zdjęć w karcie,
// aktywne tylko gdy kafelek jest w viewport (IntersectionObserver — jak w project-video.js).
const INTERVAL = 3500;

export function initProjectSlideshow() {
  const cards = [...document.querySelectorAll("[data-slideshow-card]")];
  if (!cards.length) return;

  cards.forEach((card) => {
    const slides = [...card.querySelectorAll("[data-slideshow-slide]")];
    if (slides.length < 2) return;

    let index = 0;
    let timer = null;

    const show = (next) => {
      slides[index]?.classList.remove("is-active");
      index = next;
      slides[index]?.classList.add("is-active");
    };

    const start = () => {
      if (timer) return;
      timer = window.setInterval(() => show((index + 1) % slides.length), INTERVAL);
    };

    const stop = () => {
      window.clearInterval(timer);
      timer = null;
    };

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => (entry.isIntersecting ? start() : stop()));
        },
        { threshold: 0.25 }
      );
      observer.observe(card);
    } else {
      start();
    }
  });
}
