import { ScrollTrigger } from "gsap/ScrollTrigger";
import { softMotion } from "../shared.js";

/**
 * Lista kompetencji — zwykły scroll strony + akordeon na klik.
 * Naraz może być rozwinięty tylko jeden panel; ponowne kliknięcie zwija.
 */
export function initPinnedList({ section, items, onChange }) {
  if (!section || items.length < 2) return;

  const triggers = items.map((item) => item.querySelector("[data-pinned-select]"));
  const bodies = items.map((item) => item.querySelector("[data-pinned-body]"));

  section.classList.add("is-accordion");

  const measure = () => {
    bodies.forEach((body, i) => {
      if (body) items[i].style.setProperty("--panel-h", `${body.scrollHeight}px`);
    });
  };

  const setExclusive = (index) => {
    items.forEach((item, i) => {
      const open = i === index;
      item.classList.toggle("is-active", open);
      triggers[i]?.setAttribute("aria-expanded", String(open));
    });
    if (index >= 0) onChange?.(index);
  };

  measure();
  window.addEventListener("resize", measure);
  ScrollTrigger.addEventListener("refresh", measure);

  if (softMotion) return;

  items.forEach((item, i) => {
    const btn = triggers[i];
    if (!btn) return;

    btn.addEventListener("click", () => {
      const wasOpen = item.classList.contains("is-active");
      if (wasOpen) {
        setExclusive(-1);
        return;
      }
      setExclusive(i);
      measure();
    });
  });
}
