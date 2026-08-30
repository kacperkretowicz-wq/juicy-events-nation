import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { lenis, softMotion } from "../shared.js";

export function initStandard() {
  const section = document.querySelector(".standard");
  const viewport = section?.querySelector("[data-standard-viewport]");
  const track = section?.querySelector("[data-standard-track]");
  if (!section || !viewport || !track) return;
  if (softMotion || window.matchMedia("(max-width: 980px)").matches) return;

  const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);

  const tween = gsap.to(track, {
    x: () => -distance(),
    ease: "none",
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: () => `+=${distance() + window.innerHeight * 0.4}`,
      pin: true,
      anticipatePin: 1,
      scrub: 0.6,
      invalidateOnRefresh: true,
    },
  });

  // Przeciąganie kart przekłada się na scroll strony, więc nie walczy z pinem.
  let dragging = false;
  let originX = 0;
  let originScroll = 0;

  track.addEventListener("pointerdown", (event) => {
    dragging = true;
    originX = event.clientX;
    originScroll = lenis.scroll;
    track.classList.add("is-dragging");
    track.setPointerCapture(event.pointerId);
  });

  track.addEventListener("pointermove", (event) => {
    if (!dragging) return;
    lenis.scrollTo(originScroll + (originX - event.clientX) * 1.6, { immediate: true });
  });

  const endDrag = () => {
    dragging = false;
    track.classList.remove("is-dragging");
  };

  track.addEventListener("pointerup", endDrag);
  track.addEventListener("pointercancel", endDrag);

  return tween;
}
