import { ScrollTrigger } from "gsap/ScrollTrigger";
import { lenis, softMotion } from "../shared.js";

/**
 * Przypina sekcję i przełącza aktywny element listy wraz z postępem scrolla.
 * Bez pinowania (reduced motion, mobile) lista pozostaje w pełni rozwinięta.
 *
 * Pozycje są też klikalne (`[data-pinned-select]` wewnątrz elementu): klik przewija
 * stronę dokładnie w to miejsce toru, w którym dana pozycja jest aktywna — bez
 * scrollowania „na wyczucie". Bez pina klik po prostu dowozi element w kadr.
 */
export function initPinnedList({ section, items, dwell = 0.72, onChange }) {
  if (!section || items.length < 2) return;

  const triggers = items.map((item) => item.querySelector("[data-pinned-select]"));

  let activeIndex = -1;
  const setActive = (index) => {
    if (index === activeIndex) return;
    activeIndex = index;
    items.forEach((item, i) => item.classList.toggle("is-active", i === index));
    triggers.forEach((btn, i) => btn?.setAttribute("aria-expanded", String(i === index)));
    onChange?.(index);
  };

  if (softMotion || window.matchMedia("(max-width: 980px)").matches) {
    items.forEach((item) => item.classList.add("is-active"));
    triggers.forEach((btn, i) => {
      btn?.setAttribute("aria-expanded", "true");
      btn?.addEventListener("click", () => lenis.scrollTo(items[i], { offset: -96 }));
    });
    return;
  }

  setActive(0);

  const trigger = ScrollTrigger.create({
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

  // Środek „okna" danej pozycji na torze pina — tam progress daje dokładnie ten indeks.
  const scrollToIndex = (index) => {
    const span = trigger.end - trigger.start;
    const y = trigger.start + (span * (index + 0.5)) / items.length;
    lenis.scrollTo(y, { duration: 0.9 });
  };

  triggers.forEach((btn, i) => btn?.addEventListener("click", () => scrollToIndex(i)));
}
