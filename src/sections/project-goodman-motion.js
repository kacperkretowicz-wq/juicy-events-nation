import Lenis from "lenis";

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

// Measured Goodman rules: 142 design units minus the accumulated 62-unit
// navigation travel, native sticky containment, and image translation -5..5%.
export function initGoodmanProjectMotion({ root = document, scrollEngine = window.__jen?.lenis } = {}) {
  const section = root.querySelector(".projects--goodman, .goodman-demo");
  if (!section) return () => {};
  const media = [...section.querySelectorAll(".project-card__media, .goodman-row__figure")];
  const header = document.querySelector("[data-site-header]");
  const ownsScroll = !scrollEngine;
  const engine = scrollEngine || new Lenis({ lerp: 0.1, smoothWheel: true });
  let previous = window.scrollY;
  let hidden = 0;
  let frame = 0;
  const originalOptions = { ...engine.options };
  let active = false;

  const update = () => {
    const y = window.scrollY;
    const unit = innerWidth / (innerWidth > 768 ? 1440 : innerWidth > 480 ? 768 : 375);
    const maxTravel = 62 * unit;
    const delta = y - previous;
    const end = document.documentElement.scrollHeight - innerHeight - maxTravel;
    hidden = clamp(hidden + (y > end && delta > 0 ? -delta : delta), 0, maxTravel);
    previous = y;
    const desktop = innerWidth > 768;
    const reduced = new URLSearchParams(location.search).has("reduced") || document.documentElement.classList.contains("reduced-motion");
    section.style.setProperty("--goodman-nav-y", `${desktop && !reduced ? -hidden : 0}px`);
    const bounds = section.getBoundingClientRect();
    const visible = desktop && !reduced && bounds.top < innerHeight && bounds.bottom > 0;
    if (active !== visible) {
      active = visible;
      if (!ownsScroll) {
        engine.options.lerp = visible ? 0.065 : originalOptions.lerp;
        engine.options.duration = visible ? undefined : originalOptions.duration;
        engine.options.wheelMultiplier = visible ? 0.8 : originalOptions.wheelMultiplier;
      }
    }
    if (header) {
      const menuOpen = Boolean(document.querySelector(".mega-menu.is-open, .showreel.is-open"));
      header.style.transform = visible && !menuOpen ? `translate3d(0, ${-hidden / maxTravel * header.offsetHeight}px, 0)` : "";
    }
    media.forEach((element) => {
      const rect = element.getBoundingClientRect();
      const progress = clamp((rect.top + rect.height) / (innerHeight + rect.height), 0, 1);
      element.style.setProperty("--parallax-y", `${reduced ? 0 : (0.5 - progress) * 10}%`);
    });
  };
  const schedule = () => {
    if (frame) return;
    frame = requestAnimationFrame(() => { frame = 0; update(); });
  };
  let scrollFrame = 0;
  const tick = time => { engine.raf(time); scrollFrame = requestAnimationFrame(tick); };
  if (ownsScroll) scrollFrame = requestAnimationFrame(tick);
  engine.on("scroll", update);
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule, { passive: true });
  update();
  return () => {
    engine.off("scroll", update);
    window.removeEventListener("scroll", schedule);
    window.removeEventListener("resize", schedule);
    cancelAnimationFrame(frame);
    if (ownsScroll) { cancelAnimationFrame(scrollFrame); engine.destroy(); }
    else Object.assign(engine.options, originalOptions);
    if (header) header.style.transform = "";
  };
}
