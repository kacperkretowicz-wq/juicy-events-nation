import { initPinnedList } from "./pinned-list.js";

export function initMethod() {
  const section = document.querySelector("[data-method]");
  if (!section) return;

  initPinnedList({
    section,
    items: [...section.querySelectorAll("[data-method-step]")],
    dwell: 0.6,
  });
}
