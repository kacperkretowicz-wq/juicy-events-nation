import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ease, softMotion } from "../shared.js";

// Mostek między realizacjami a metodą. Każda linia jest maskowana (overflow:hidden),
// a litery wjeżdżają z dołu z lekkim zbiegiem do środka i płynnym staggerem —
// jednorazowo, gdy sekcja wejdzie w kadr. Bez scrubu (spokojniej, „pod kontrolą").
export function initBridgeAssemble() {
  const section = document.querySelector("[data-bridge]");
  if (!section) return;

  const lines = [...section.querySelectorAll("[data-assemble]")];
  if (!lines.length) return;

  lines.forEach((line) => {
    const text = line.textContent.trim();
    // Czytnik ekranu dostaje całe zdanie, nie listę pojedynczych liter.
    line.setAttribute("aria-label", text);

    // maska (overflow:hidden) + wewnętrzny wrapper, w którym siedzą litery
    const inner = document.createElement("span");
    inner.className = "assemble__inner";
    const chars = [...text].map((ch) => {
      const span = document.createElement("span");
      span.className = "assemble__char";
      span.setAttribute("aria-hidden", "true");
      span.textContent = ch === " " ? "\u00A0" : ch;
      return span;
    });
    inner.append(...chars);
    line.textContent = "";
    line.classList.add("is-assemble");
    line.append(inner);
    line._chars = chars;
  });

  if (softMotion || window.matchMedia("(max-width: 980px)").matches) return;

  lines.forEach((line) => {
    const chars = line._chars;
    const mid = (chars.length - 1) / 2;

    gsap.set(chars, {
      yPercent: 120,
      x: (i) => (i - mid) * 14,
      rotate: (i) => (i - mid) * 1.2,
      opacity: 0,
    });

    ScrollTrigger.create({
      trigger: section,
      start: "top 78%",
      once: true,
      onEnter: () => {
        gsap.to(chars, {
          yPercent: 0,
          x: 0,
          rotate: 0,
          opacity: 1,
          duration: softMotion ? 0.7 : 1.05,
          ease,
          stagger: { each: 0.028, from: "center" },
        });
      },
    });
  });
}
