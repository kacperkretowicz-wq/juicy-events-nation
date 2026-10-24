// Pływające kółko „Kontakt/Oferta" — widoczne w hero, dopóki nie miniemy pasa
// klientów (dalej jego miejsce przy krawędzi zajmuje kwadracik showreela,
// showreel-toggle.js). Chowa się też nad kontaktem / stopką, żeby nie zasłaniać.
import { onScrollFrame } from "../shared.js";

export function initFloatCta() {
  const cta = document.querySelector("[data-float-cta]");
  if (!cta) return;

  const visible = new Set();
  let pastLogos = false;
  const syncHidden = () => cta.classList.toggle("is-hidden", visible.size > 0 || pastLogos);

  const zones = [document.getElementById("kontakt"), document.querySelector(".site-footer")].filter(Boolean);
  if (zones.length && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.add(entry.target);
          else visible.delete(entry.target);
        });
        syncHidden();
      },
      { threshold: 0.15 }
    );
    zones.forEach((zone) => io.observe(zone));
  }

  const clients = document.getElementById("klienci");
  if (clients) {
    // Skok do kotwicy może ominąć cały pas bez zmiany stanu IntersectionObserver.
    const updatePastLogos = () => {
      pastLogos = clients.getBoundingClientRect().bottom < 0;
      syncHidden();
    };
    updatePastLogos();
    onScrollFrame(updatePastLogos);
    window.addEventListener("resize", updatePastLogos);
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

  updateTone();
  onScrollFrame(updateTone);
  window.addEventListener("resize", updateTone);
}
