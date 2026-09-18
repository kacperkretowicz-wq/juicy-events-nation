import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { softMotion } from "../shared.js";

// Delikatny parallax na kadrach oznaczonych `data-parallax-media`.
// Kontener ma overflow:hidden, a media wewnątrz jest wyższe niż kontener
// i wyśrodkowane ujemnym marginesem (patrz parallax.css) — dzięki temu
// ruch nigdy nie odsłania krawędzi.
//
// data-parallax-media       — wartość = amplituda w % (domyślnie 8)
// data-parallax-trigger     — selektor sekcji-pin (np. .mission, .contact):
//                             scroll od „top top” do „bottom bottom” — cały dystans sticky.
export function initParallaxMedia(scope = document) {
  if (softMotion) return;

  scope.querySelectorAll("[data-parallax-media]").forEach((container) => {
    const media = container.querySelector("img, video");
    if (!media) return;

    const shift = parseFloat(container.dataset.parallaxMedia) || 8;
    const triggerSel = container.dataset.parallaxTrigger;
    const trigger = triggerSel
      ? container.closest(triggerSel) || container
      : container;
    const pinnedSection = Boolean(triggerSel);

    gsap.fromTo(
      media,
      { yPercent: -shift },
      {
        yPercent: shift,
        ease: "none",
        scrollTrigger: {
          trigger,
          start: pinnedSection ? "top top" : "top bottom",
          end: pinnedSection ? "bottom bottom" : "bottom top",
          scrub: true,
          invalidateOnRefresh: true,
        },
      }
    );
  });
}
