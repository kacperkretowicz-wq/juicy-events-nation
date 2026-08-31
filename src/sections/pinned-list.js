import { ScrollTrigger } from "gsap/ScrollTrigger";
import { softMotion } from "../shared.js";

/**
 * Przypina sekcję i przełącza aktywny element listy wraz z postępem scrolla.
 * Bez pinowania (reduced motion, mobile) lista pozostaje w pełni rozwinięta.
 */
export function initPinnedList({ section, items, dwell = 0.72, onChange }) {
  if (!section || items.length < 2) return;

  const setActive = (index) => {
    items.forEach((item, i) => item.classList.toggle("is-active", i === index));
    onChange?.(index);
  };

  if (softMotion || window.matchMedia("(max-width: 980px)").matches) {
    items.forEach((item) => item.classList.add("is-active"));
    return;
  }

  setActive(0);

  ScrollTrigger.create({
    trigger: section,
    start: "top top",
    end: () => `+=${Math.round(window.innerHeight * dwell * items.length)}`,
    pin: true,
    anticipatePin: 1,
    scrub: true,
    invalidateOnRefresh: true,
    onUpdate: ({ progress }) => {
      const index = Math.min(items.length - 1, Math.floor(progress * items.length));
      setActive(index);
    },
  });
}
