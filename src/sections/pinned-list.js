import { ScrollTrigger } from "gsap/ScrollTrigger";
import { lenis, softMotion } from "../shared.js";

/**
 * Przypina sekcję i przełącza aktywny element listy wraz z postępem scrolla.
 *
 * Pozycje są też klikalne (`[data-pinned-select]` wewnątrz elementu): klik przewija
 * stronę dokładnie w to miejsce toru, w którym dana pozycja jest aktywna — bez
 * scrollowania „na wyczucie".
 *
 * Bez pinowania (wąski ekran, reduced motion) ta sama lista działa jak akordeon:
 * panele startują zwinięte i rozwijają się kliknięciem. Próg 980 px jest żywy —
 * obrót telefonu albo zwężenie okna przełącza tryb bez przeładowania.
 */
export function initPinnedList({ section, items, dwell = 0.72, onChange }) {
  if (!section || items.length < 2) return;

  const triggers = items.map((item) => item.querySelector("[data-pinned-select]"));
  const bodies = items.map((item) => item.querySelector("[data-pinned-body]"));
  const mq = window.matchMedia("(max-width: 980px)");

  let activeIndex = -1;
  let mode = null;
  let pinTrigger = null;
  let pinHandlers = [];

  const setActive = (index) => {
    if (index === activeIndex) return;
    activeIndex = index;
    items.forEach((item, i) => item.classList.toggle("is-active", i === index));
    triggers.forEach((btn, i) => btn?.setAttribute("aria-expanded", String(i === index)));
    if (index >= 0) onChange?.(index);
  };

  const measure = () =>
    bodies.forEach((body, i) => {
      if (body) items[i].style.setProperty("--panel-h", `${body.scrollHeight}px`);
    });

  const accordionHandlers = items.map((item, i) => () => {
    const btn = triggers[i];
    const wasOpen = item.classList.contains("is-active");
    if (wasOpen) {
      item.classList.remove("is-active");
      btn?.setAttribute("aria-expanded", "false");
      return;
    }
    items.forEach((other, j) => {
      other.classList.toggle("is-active", j === i);
      triggers[j]?.setAttribute("aria-expanded", String(j === i));
    });
    measure();
    onChange?.(i);
  });

  const enableAccordion = () => {
    section.classList.add("is-accordion");
    activeIndex = -1;
    items.forEach((item, i) => {
      item.classList.remove("is-active");
      triggers[i]?.setAttribute("aria-expanded", "false");
      triggers[i]?.addEventListener("click", accordionHandlers[i]);
    });
    measure();
    window.addEventListener("resize", measure);
  };

  const disableAccordion = () => {
    section.classList.remove("is-accordion");
    window.removeEventListener("resize", measure);
    items.forEach((_, i) => {
      triggers[i]?.removeEventListener("click", accordionHandlers[i]);
    });
  };

  const enablePin = () => {
    setActive(0);
    pinTrigger = ScrollTrigger.create({
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

    const scrollToIndex = (index) => {
      if (!pinTrigger) return;
      const span = pinTrigger.end - pinTrigger.start;
      const y = pinTrigger.start + (span * (index + 0.5)) / items.length;
      lenis.scrollTo(y, { duration: 0.9 });
    };

    pinHandlers = items.map((_, i) => () => scrollToIndex(i));
    triggers.forEach((btn, i) => btn?.addEventListener("click", pinHandlers[i]));
  };

  const disablePin = () => {
    pinHandlers.forEach((handler, i) => {
      triggers[i]?.removeEventListener("click", handler);
    });
    pinHandlers = [];
    pinTrigger?.kill();
    pinTrigger = null;
  };

  const applyMode = () => {
    const next = softMotion || mq.matches ? "accordion" : "pin";
    if (next === mode) return;
    if (mode === "accordion") disableAccordion();
    if (mode === "pin") disablePin();
    mode = next;
    if (next === "accordion") enableAccordion();
    else enablePin();
    ScrollTrigger.refresh();
  };

  const destroy = () => {
    mq.removeEventListener("change", applyMode);
    if (mode === "accordion") disableAccordion();
    if (mode === "pin") disablePin();
    mode = null;
  };

  applyMode();
  mq.addEventListener("change", applyMode);

  return { destroy };
}
