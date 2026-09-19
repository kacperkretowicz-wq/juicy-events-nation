import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { mobileScrollProfile, softMotion } from "../shared.js";

// Delikatny parallax na kadrach oznaczonych `data-parallax-media`.
// Kontener ma overflow:hidden, a media wewnątrz jest wyższe niż kontener
// i wyśrodkowane ujemnym marginesem (patrz parallax.css) — dzięki temu
// ruch nigdy nie odsłania krawędzi.
//
// data-parallax-media       — wartość = amplituda w % (domyślnie 8)
// data-parallax-trigger     — selektor sekcji-pin (np. .mission, .contact):
//                             scroll od „top top” do „bottom bottom” — cały dystans sticky.
function bindParallaxMedia(container) {
  if (container.dataset.parallaxBound === "1") return;

  const centered = container.dataset.parallaxCenter === "true";
  const media = centered ? container : container.querySelector("img, video");
  if (!media) return;

  let shift = parseFloat(container.dataset.parallaxMedia) || 8;
  if (mobileScrollProfile) shift *= 0.55;
  const triggerSel = container.dataset.parallaxTrigger;
  const trigger = triggerSel ? container.closest(triggerSel) || container : container;
  const pinnedSection = Boolean(triggerSel);

  container.dataset.parallaxBound = "1";

  const scrollTrigger = {
    trigger,
    start: pinnedSection ? "top top" : "top bottom",
    end: pinnedSection ? "bottom bottom" : "bottom top",
    scrub: mobileScrollProfile ? 0.55 : true,
    fastScrollEnd: mobileScrollProfile,
    invalidateOnRefresh: true,
  };

  let tween;
  if (centered) {
    gsap.set(media, { position: "absolute", left: "50%", top: "50%", xPercent: -50, yPercent: -50 });
    tween = gsap.fromTo(
      media,
      { yPercent: -50 - shift },
      { yPercent: -50 + shift, ease: "none", scrollTrigger }
    );
  } else {
    tween = gsap.fromTo(
      media,
      { yPercent: -shift },
      { yPercent: shift, ease: "none", scrollTrigger }
    );
  }
  container._parallaxScrollTrigger = tween.scrollTrigger;
}

export function initParallaxMedia(scope = document) {
  if (softMotion) return;
  scope.querySelectorAll("[data-parallax-media]").forEach(bindParallaxMedia);
}

/** Po pinach / obrazkach layout się rozjeżdża — same refresh nie naprawia złych start/end. */
export function rebuildParallaxMedia(scope = document) {
  if (softMotion) return;
  scope.querySelectorAll("[data-parallax-media]").forEach((container) => {
    container._parallaxScrollTrigger?.kill();
    container._parallaxScrollTrigger = null;
    delete container.dataset.parallaxBound;

    const centered = container.dataset.parallaxCenter === "true";
    const media = centered ? container : container.querySelector("img, video");
    if (media) gsap.killTweensOf(media);
  });
  initParallaxMedia(scope);
  ScrollTrigger.refresh();
}

export function refreshParallaxMedia() {
  ScrollTrigger.refresh();
}
