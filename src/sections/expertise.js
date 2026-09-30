import { ScrollTrigger } from "gsap/ScrollTrigger";
import { lenis, softMotion } from "../shared.js";
import { playGlowSweep } from "../effects.js";
import { initPinnedList } from "./pinned-list.js";

/** Sticky nagłówek + scroll listy z opisami (Sweetpunk) — desktop i mobile. */
function initExpertiseScrollList(section, items, onChange) {
  const triggers = [];
  const clickHandlers = [];
  let activeIndex = -1;
  const narrow = () => window.matchMedia("(max-width: 980px)").matches;

  const setActive = (index) => {
    if (index === activeIndex) return;
    activeIndex = index;

    items.forEach((item, i) => {
      const active = i === index;
      item.classList.toggle("is-active", active);
      item.querySelector("[data-pinned-select]")?.setAttribute("aria-expanded", active ? "true" : "false");
      if (active) {
        const h3 = item.querySelector(".expertise-item__head h3");
        playGlowSweep(h3);
      }
    });
    onChange(index);
  };

  section.classList.add("is-scroll");

  items.forEach((item, index) => {
    triggers.push(
      ScrollTrigger.create({
        trigger: item,
        start: narrow() ? "top 62%" : "top 58%",
        end: narrow() ? "bottom 38%" : "bottom 42%",
        onEnter: () => setActive(index),
        onEnterBack: () => setActive(index),
      })
    );

    const head = item.querySelector("[data-pinned-select]");
    const onClick = (event) => {
      event.preventDefault();
      setActive(index);
      const offset = narrow() ? -window.innerHeight * 0.3 : -window.innerHeight * 0.34;
      lenis.scrollTo(item, { offset, duration: 0.85 });
    };
    head?.addEventListener("click", onClick);
    clickHandlers.push({ head, onClick });
  });

  setActive(0);

  return () => {
    section.classList.remove("is-scroll");
    triggers.forEach((st) => st.kill());
    clickHandlers.forEach(({ head, onClick }) => head?.removeEventListener("click", onClick));
  };
}

export function initExpertise() {
  const section = document.querySelector("[data-expertise]");
  if (!section) return;

  const items = [...section.querySelectorAll("[data-expertise-item]")];
  const counter = section.querySelector("[data-expertise-current]");


  const onChange = (index) => {
    if (counter) counter.textContent = String(index + 1).padStart(2, "0");
  };

  let teardownScroll = null;
  let pinnedList = null;
  const narrowMode = window.matchMedia("(max-width: 980px)");

  const applyMode = () => {
    teardownScroll?.();
    teardownScroll = null;
    pinnedList?.destroy();
    pinnedList = null;

    // Na telefonie opis działa jak zwykły akordeon. Sticky, dwukolumnowy tor
    // wymaga precyzyjnego scrolla i zostawiamy go dla szerokich ekranów.
    if (softMotion || narrowMode.matches) {
      pinnedList = initPinnedList({ section, items, onChange });
      ScrollTrigger.refresh();
      return;
    }

    teardownScroll = initExpertiseScrollList(section, items, onChange);
    ScrollTrigger.refresh();
  };

  let resizeTimer = null;
  const onResize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 200);
  };

  applyMode();
  window.addEventListener("resize", onResize);
  narrowMode.addEventListener("change", applyMode);
}
