// Pętle „marquee” — pas klientów i wordmark JUICY EVENTS w stopce.
// Tor jedzie w lewo; scroll go przyspiesza, a scroll w górę odwraca kierunek
// (feedback właściciela: „JUICY EVENTS zrobiłbym ruszające się”).
// Bez JS / z `?reduced` tor stoi — treść jest normalnie czytelna.
import gsap from "gsap";
import { lenis, softMotion } from "../shared.js";

const MAX_BOOST = 6;

function createLoop(marquee) {
  const track = marquee.querySelector("[data-marquee-track]");
  const originals = track ? [...track.children] : [];
  if (!track || !originals.length) return null;

  const speed = parseFloat(marquee.dataset.marqueeSpeed) || 60; // px/s
  let setWidth = 0;
  let x = 0;
  let dir = -1;
  let boost = 0;
  let visible = false;

  const appendClones = (nodes) =>
    nodes.forEach((node) => {
      const clone = node.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      clone.dataset.marqueeClone = "";
      track.appendChild(clone);
    });

  const fill = () => {
    track.querySelectorAll("[data-marquee-clone]").forEach((node) => node.remove());
    // Jeden zestaw musi przykryć cały kadr…
    let guard = 0;
    while (track.getBoundingClientRect().width < marquee.clientWidth && guard < 24) {
      appendClones(originals);
      guard += 1;
    }
    setWidth = track.getBoundingClientRect().width;
    // …a drugi, identyczny, sprawia, że przeskok o setWidth jest niewidoczny.
    appendClones([...track.children]);
    x = setWidth ? x % setWidth : 0;
  };

  const tick = (_, deltaMs) => {
    if (!visible || !setWidth) return;
    const velocity = lenis.velocity || 0;
    const target = Math.min(MAX_BOOST, Math.abs(velocity) * 0.18);
    boost += (target - boost) * 0.08;
    if (Math.abs(velocity) > 0.8) dir = velocity > 0 ? -1 : 1;

    x += dir * speed * (1 + boost) * (Math.min(deltaMs, 64) / 1000);
    if (x <= -setWidth) x += setWidth;
    if (x > 0) x -= setWidth;
    track.style.transform = `translate3d(${x.toFixed(2)}px, 0, 0)`;
  };

  fill();
  gsap.ticker.add(tick);

  if ("IntersectionObserver" in window) {
    new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        visible = entry.isIntersecting;
      });
    }, { rootMargin: "80px 0px" }).observe(marquee);
  } else {
    visible = true;
  }

  return { fill };
}

export function initMarquees(scope = document) {
  if (softMotion) return;
  const loops = [...scope.querySelectorAll("[data-marquee]")].map(createLoop).filter(Boolean);
  if (!loops.length) return;

  // Szerokość zestawu zależy od kroju — po doczytaniu fontów i po zmianie
  // szerokości okna przeliczamy klony.
  document.fonts?.ready.then(() => loops.forEach((loop) => loop.fill()));
  // …i po doczytaniu logotypów (pas klientów).
  window.addEventListener("load", () => loops.forEach((loop) => loop.fill()), { once: true });

  let lastWidth = window.innerWidth;
  let timer = null;
  window.addEventListener("resize", () => {
    if (Math.abs(window.innerWidth - lastWidth) < 20) return;
    clearTimeout(timer);
    timer = setTimeout(() => {
      lastWidth = window.innerWidth;
      loops.forEach((loop) => loop.fill());
    }, 180);
  });
}
