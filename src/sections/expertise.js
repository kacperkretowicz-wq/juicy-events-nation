import { initPinnedList } from "./pinned-list.js";

export function initExpertise() {
  const section = document.querySelector("[data-expertise]");
  if (!section) return;

  const items = [...section.querySelectorAll("[data-expertise-item]")];
  const counter = section.querySelector("[data-expertise-current]");

  initPinnedList({
    section,
    items,
    onChange: (index) => {
      if (counter) counter.textContent = String(index + 1).padStart(2, "0");
    },
  });
}
