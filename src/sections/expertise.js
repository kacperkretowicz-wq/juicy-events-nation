import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ensureHeadlineGlow, playGlowSweep } from "../effects.js";

export function initExpertise() {
  const section = document.querySelector("[data-expertise]");
  if (!section) return;
  const items = [...section.querySelectorAll("[data-expertise-item]")];
  const counter = section.querySelector("[data-expertise-current]");
  section.querySelectorAll(".expertise-item__tags").forEach(tags => {
    const labels = tags.textContent.split("/").map(text => text.trim()).filter(Boolean);
    tags.replaceChildren(...labels.map(text => {
      const label = document.createElement("span");
      label.className = "expertise-item__tag";
      label.textContent = text;
      return label;
    }));
  });
  section.classList.add("is-accordion");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches || new URLSearchParams(location.search).has("reduced");
  if (!reduced) {
    const headlines = [section.querySelector(".expertise__title"), ...section.querySelectorAll(".expertise-item__head h3")].filter(Boolean);
    headlines.forEach(headline => {
      ensureHeadlineGlow(headline);
      ScrollTrigger.create({
        trigger: headline,
        start: "top 88%",
        end: "bottom 12%",
        onEnter: () => playGlowSweep(headline),
        onEnterBack: () => playGlowSweep(headline),
      });
    });
  }
  const select = index => {
    items.forEach((item, i) => {
      const open = i === index;
      item.classList.toggle("is-active", open);
      const button = item.querySelector("[data-pinned-select]");
      const panel = item.querySelector("[data-pinned-body]");
      button.setAttribute("aria-expanded", String(open));
      panel.inert = !open;
      panel.setAttribute("aria-hidden", String(!open));
    });
    if (counter && index >= 0) counter.textContent = String(index + 1).padStart(2, "0");
    // Recalculate the following sections after the accordion finishes resizing.
    setTimeout(() => ScrollTrigger.refresh(), 450);
  };
  items.forEach((item, index) => {
    const button = item.querySelector("[data-pinned-select]");
    const panel = item.querySelector("[data-pinned-body]");
    button.id = `expertise-button-${index + 1}`;
    panel.id = `expertise-panel-${index + 1}`;
    button.setAttribute("aria-controls", panel.id);
    panel.setAttribute("role", "region");
    panel.setAttribute("aria-labelledby", button.id);
    button.addEventListener("click", () => select(item.classList.contains("is-active") ? -1 : index));
  });
  select(1);
}
