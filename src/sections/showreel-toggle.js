// Kwadracik showreela (prawy dół): zastępuje czerwony znacznik, który cały czas
// zasłaniał obraz (feedback klienta). Widoczny dopiero po minięciu pasa klientów
// (tam, gdzie wcześniej stało kółko „Kontakt” — float-cta.js), na zmianę pokazuje
// logo i krótką wyciszoną pętlę. Klik otwiera pełny showreel z dźwiękiem (shared.js).
import { onScrollFrame } from "../shared.js";

export function initShowreelToggle() {
  const toggle = document.querySelector("[data-showreel-toggle]");
  const video = toggle?.querySelector("[data-showreel-toggle-video]");
  if (!toggle) return;

  toggle.hidden = false;

  const visible = new Set();
  let pastLogos = false;
  const sync = () => toggle.classList.toggle("is-visible", pastLogos && visible.size === 0);

  const clients = document.getElementById("klienci");
  if (clients) {
    // Aktualizujemy też po skoku, który całkowicie omija pas logotypów.
    const updatePastLogos = () => {
      pastLogos = clients.getBoundingClientRect().bottom < 0;
      sync();
    };
    updatePastLogos();
    onScrollFrame(updatePastLogos);
    window.addEventListener("resize", updatePastLogos);
  } else {
    pastLogos = true;
  }

  const hideZones = [document.getElementById("kontakt"), document.querySelector(".site-footer")].filter(Boolean);
  if (hideZones.length && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.add(entry.target);
          else visible.delete(entry.target);
        });
        sync();
      },
      { threshold: 0.15 }
    );
    hideZones.forEach((zone) => io.observe(zone));
  }

  sync();

  if (!video) return;

  const LOGO_MS = 3200;
  const VIDEO_MS = 2600;
  let timer = null;

  const showVideo = () => {
    toggle.classList.add("is-video-face");
    video.currentTime = 0;
    video.play().catch(() => {});
    timer = setTimeout(showLogo, VIDEO_MS);
  };

  const showLogo = () => {
    toggle.classList.remove("is-video-face");
    video.pause();
    timer = setTimeout(showVideo, LOGO_MS);
  };

  timer = setTimeout(showVideo, LOGO_MS);
}
