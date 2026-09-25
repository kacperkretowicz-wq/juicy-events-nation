import { ScrollTrigger } from "gsap/ScrollTrigger";
import { lenis, softMotion } from "../shared.js";
import { initPinnedList } from "./pinned-list.js";

/** Czysty h3 bez warstwy text-glow (tylko kolor + nawiasy w CSS). */
function repairExpertiseTitles(items) {
  items.forEach((item) => {
    const h3 = item.querySelector(".expertise-item__head h3");
    if (!h3?.classList.contains("text-glow")) return;
    const base = h3.querySelector(".text-glow__base");
    if (base) h3.innerHTML = base.innerHTML;
    h3.classList.remove("text-glow", "is-text-glow-done");
    delete h3.dataset.glowReady;
    delete h3.dataset.glowPlayed;
  });
}

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
      item.querySelector("[data-pinned-select]")?.setAttribute("aria-expanded", "true");
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

  repairExpertiseTitles(items);

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
