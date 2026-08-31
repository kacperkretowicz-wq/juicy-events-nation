import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { softMotion } from "../shared.js";

// Delikatny parallax na kadrach oznaczonych `data-parallax-media`.
// Kontener ma overflow:hidden, a media wewnątrz jest wyższe niż kontener
// i wyśrodkowane ujemnym marginesem (patrz parallax.css) — dzięki temu
// ruch nigdy nie odsłania krawędzi.
//
// data-parallax-media       — wartość = amplituda w % (domyślnie 8)
// data-parallax-trigger     — opcjonalny selektor przodka jako trigger scrolla
//                             (dla sekcji pinowanych, np. .mission)
export function initParallaxMedia(scope = document) {
  if (softMotion) return;

  scope.querySelectorAll("[data-parallax-media]").forEach((container) => {
    const media = container.querySelector("img, video");
    if (!media) return;

    const shift = parseFloat(container.dataset.parallaxMedia) || 8;
    const trigger = container.dataset.parallaxTrigger
      ? container.closest(container.dataset.parallaxTrigger) || container
      : container;

    gsap.fromTo(
      media,
      { yPercent: -shift },
      {
        yPercent: shift,
        ease: "none",
        scrollTrigger: {
          trigger,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          invalidateOnRefresh: true,
        },
      }
    );
  });
}
