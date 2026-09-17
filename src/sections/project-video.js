// Wideo w okienku peek — gra tylko na hover (okładka to statyczny poster).
export function initProjectVideo() {
  const peeks = [...document.querySelectorAll("[data-peek-video]")];
  if (!peeks.length) return;

  peeks.forEach((peek) => {
    const card = peek.closest(".project-card");
    const video = peek.querySelector("video");
    if (!card || !video) return;

    const play = () => {
      video.preload = "auto";
      video.play().catch(() => {});
    };

    const stop = () => {
      video.pause();
      video.currentTime = 0;
    };

    const canHover = window.matchMedia("(hover: hover)").matches;

    if (canHover) {
      card.addEventListener("mouseenter", play);
      card.addEventListener("mouseleave", stop);
      card.addEventListener("focusin", play);
      card.addEventListener("focusout", (event) => {
        if (!card.contains(event.relatedTarget)) stop();
      });
      return;
    }

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => entries.forEach((entry) => (entry.isIntersecting ? play() : stop())),
        { threshold: 0.45 }
      );
      observer.observe(card);
    } else {
      play();
    }
  });
}
