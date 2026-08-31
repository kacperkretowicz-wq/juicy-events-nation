// Karta realizacji z wideo: cały kadr jest linkiem do case study (jak karty
// zdjęciowe). Wideo gra jako cichy podgląd w viewport, a osobny przycisk w rogu
// (data-video-zoom) rozwija kadr w miejscu — bez opuszczania strony.
export function initProjectVideo() {
  const cards = [...document.querySelectorAll(".project-card--video")];
  if (!cards.length) return;

  const collapseAll = (except) => {
    cards.forEach((card) => {
      if (card === except || !card.classList.contains("is-expanded")) return;
      card.classList.remove("is-expanded");
      card.querySelector("[data-video-zoom]")?.setAttribute("aria-expanded", "false");
    });
  };

  cards.forEach((card) => {
    const media = card.querySelector("[data-video-card]");
    const video = card.querySelector("[data-project-video]");
    const zoom = card.querySelector("[data-video-zoom]");

    if (video && media && "IntersectionObserver" in window) {
      const play = () => video.play().catch(() => {});
      const observer = new IntersectionObserver(
        (entries) =>
          entries.forEach((entry) => {
            if (!entry.isIntersecting) {
              video.pause();
              return;
            }
            // W kadrze: dokładamy pełny bufor i gramy, gdy tylko są dane.
            // (bez tego karty z preload="metadata" potrafiły zostać na plakacie)
            if (video.preload !== "auto") {
              video.preload = "auto";
              video.load();
            }
            if (video.readyState >= 3) play();
            else video.addEventListener("canplay", play, { once: true });
          }),
        { threshold: 0.2 }
      );
      observer.observe(media);
    }

    zoom?.addEventListener("click", (event) => {
      // Nie nawiguj do case study — tylko rozwiń podgląd.
      event.preventDefault();
      event.stopPropagation();
      const expanded = card.classList.toggle("is-expanded");
      zoom.setAttribute("aria-expanded", String(expanded));
      if (expanded) collapseAll(card);
    });
  });

  document.addEventListener("click", (event) => {
    const open = cards.find((card) => card.classList.contains("is-expanded"));
    if (!open || open.contains(event.target)) return;
    collapseAll();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") collapseAll();
  });
}
