// Wideo w okienku na środku kafla — gra tylko na hover myszą (preload="none",
// plik dociąga się dopiero przy pierwszym najechaniu). Na dotyku okienko jest ukryte.
export function initProjectVideo() {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  document.querySelectorAll("[data-peek-video]").forEach((peek) => {
    const card = peek.closest(".project-card");
    const video = peek.querySelector("video");
    if (!card || !video) return;

    const play = () => {
      video.preload = "auto";
      video.play().catch(() => {});
    };

    const stop = () => {
      video.pause();
    };

    card.addEventListener("mouseenter", play);
    card.addEventListener("mouseleave", stop);
    card.addEventListener("focusin", play);
    card.addEventListener("focusout", (event) => {
      if (!card.contains(event.relatedTarget)) stop();
    });
  });
}
