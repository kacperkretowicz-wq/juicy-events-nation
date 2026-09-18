// Pływające kółko „Kontakt" — widoczne wszędzie, chowa się, gdy sekcja kontaktu
// (lub stopka z danymi kontaktowymi) jest już na ekranie; wtedy tylko by zasłaniało.
import { lenis } from "../shared.js";

export function initFloatCta() {
  const cta = document.querySelector("[data-float-cta]");
  if (!cta) return;

  const zones = [document.getElementById("kontakt"), document.querySelector(".site-footer")].filter(Boolean);
  if (zones.length && "IntersectionObserver" in window) {
    const visible = new Set();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.add(entry.target);
          else visible.delete(entry.target);
        });
        cta.classList.toggle("is-hidden", visible.size > 0);
      },
      { threshold: 0.15 }
    );
    zones.forEach((zone) => io.observe(zone));
  }

  // Nad pomarańczowymi powierzchniami (`data-surface="accent"`) kółko odwraca kolory —
  // niebieskie na niebieskim znikałoby. Sprawdzamy środek kółka przy każdym scrollu.
  const accentZones = [...document.querySelectorAll("[data-surface='accent']")];
  if (!accentZones.length) return;

  const updateTone = () => {
    const rect = cta.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const overAccent = accentZones.some((zone) => {
      const z = zone.getBoundingClientRect();
      return cy >= z.top && cy <= z.bottom && cx >= z.left && cx <= z.right;
    });
    cta.classList.toggle("is-inverted", overAccent);
  };

  let ticking = false;
  const scheduleTone = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      updateTone();
    });
  };

  scheduleTone();
  lenis.on("scroll", scheduleTone);
  window.addEventListener("resize", scheduleTone);
}
