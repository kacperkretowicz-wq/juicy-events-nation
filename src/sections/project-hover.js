// Etykieta „Zobacz case” jadąca za kursorem nad kaflem realizacji (jak „Discover”
// u Leveled). Pozycję trzymają zmienne --cx/--cy; resztę (kolor tła, kadr 9:16)
// robi CSS pod :hover.
const FOLLOW = 0.24;

export function initProjectHover() {
  if (!window.matchMedia("(hover: hover) and (min-width: 981px)").matches) return;

  document.querySelectorAll(".project-card__media").forEach((media) => {
    if (!media.querySelector(".project-card__cursor")) return;

    let x = 0;
    let y = 0;
    let tx = 0;
    let ty = 0;
    let raf = null;

    const write = () => {
      media.style.setProperty("--cx", `${x.toFixed(1)}px`);
      media.style.setProperty("--cy", `${y.toFixed(1)}px`);
    };

    const loop = () => {
      x += (tx - x) * FOLLOW;
      y += (ty - y) * FOLLOW;
      write();
      raf = Math.abs(tx - x) > 0.3 || Math.abs(ty - y) > 0.3 ? requestAnimationFrame(loop) : null;
    };

    const target = (event) => {
      const rect = media.getBoundingClientRect();
      tx = event.clientX - rect.left;
      ty = event.clientY - rect.top;
    };

    media.addEventListener("pointerenter", (event) => {
      target(event);
      x = tx;
      y = ty;
      write();
    });

    media.addEventListener("pointermove", (event) => {
      target(event);
      if (!raf) raf = requestAnimationFrame(loop);
    });
  });
}
