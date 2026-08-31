import { initPinnedList } from "./pinned-list.js";

export function initExpertise() {
  const section = document.querySelector("[data-expertise]");
  if (!section) return;

  const items = [...section.querySelectorAll("[data-expertise-item]")];
  const counter = section.querySelector("[data-expertise-current]");
  // Kadr przypisany do kompetencji — indeks 1:1 z listą.
  const figures = [...section.querySelectorAll("[data-expertise-figure]")];

  // Rozwijanie treści opiera się na grid-template-rows 0fr → 1fr (zamiast
  // sztywnego max-height, które ucinało dłuższe opisy). Ta technika wymaga
  // JEDNEGO dziecka z overflow:hidden — pakujemy więc akapity w wrapper.
  section.querySelectorAll(".expertise-item__body").forEach((body) => {
    if (body.firstElementChild?.classList.contains("expertise-item__body-inner")) return;
    const inner = document.createElement("div");
    inner.className = "expertise-item__body-inner";
    inner.append(...body.childNodes);
    body.appendChild(inner);
  });

  initPinnedList({
    section,
    items,
    onChange: (index) => {
      if (counter) counter.textContent = String(index + 1).padStart(2, "0");
      figures.forEach((figure, i) => figure.classList.toggle("is-active", i === index));
    },
  });
}
