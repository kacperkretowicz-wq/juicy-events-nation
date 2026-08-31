// Standard realizacji — poziomy tor kart przewijany natywnie.
// Bez pinowania sekcji: wcześniej scroll „zatrzymywał się" na tej sekcji, zanim
// tor doszedł do końca, co czytało się jak zablokowana strona.
//
// Doszły trzy rzeczy, których brakowało: strzałki (tor dało się ruszyć wyłącznie
// gestem), obsługa klawiatury i pasek postępu.
export function initStandard() {
  const section = document.querySelector(".standard");
  const viewport = section?.querySelector("[data-standard-viewport]");
  const track = section?.querySelector("[data-standard-track]");
  if (!section || !viewport || !track) return;

  const prev = section.querySelector("[data-standard-prev]");
  const next = section.querySelector("[data-standard-next]");
  const progress = section.querySelector("[data-standard-progress]");

  const maxScroll = () => Math.max(0, viewport.scrollWidth - viewport.clientWidth);

  const sync = () => {
    const max = maxScroll();
    const ratio = max > 0 ? viewport.scrollLeft / max : 0;

    if (progress) {
      // Szerokość „główki" paska = udział widocznego wycinka w całym torze.
      const visible = max > 0 ? viewport.clientWidth / viewport.scrollWidth : 1;
      const width = Math.max(12, visible * 100);
      progress.style.setProperty("--track-progress", `${width.toFixed(1)}%`);
      progress.style.setProperty("--track-offset", `${(ratio * (100 - width)).toFixed(1)}%`);
    }

    if (prev) prev.disabled = viewport.scrollLeft <= 2;
    if (next) next.disabled = viewport.scrollLeft >= max - 2;
  };

  /** Przewija o szerokość jednej karty (z odstępem) — zawsze ląduje na kadrze. */
  const step = (direction) => {
    const card = track.querySelector(".standard-card");
    const gap = parseFloat(getComputedStyle(track).columnGap) || 24;
    const distance = (card?.getBoundingClientRect().width ?? viewport.clientWidth * 0.8) + gap;
    viewport.scrollBy({ left: direction * distance, behavior: "smooth" });
  };

  prev?.addEventListener("click", () => step(-1));
  next?.addEventListener("click", () => step(1));

  // Klawiatura: viewport ma tabindex="0" i rolę regionu.
  viewport.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      step(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      step(-1);
    }
  });

  viewport.addEventListener("scroll", sync, { passive: true });
  window.addEventListener("resize", sync);

  // Przeciąganie myszą jako uzupełnienie kółka/trackpada.
  // WYŁĄCZNIE dla myszy: `.standard__viewport` ma natywny overflow-x:auto,
  // więc na dotyku przeglądarka i tak przewija sama. Bez filtra pointerType
  // ten handler reagował też na touch (pointerdown.button jest 0 również przy
  // dotyku) i ręcznie nadpisywał scrollLeft RÓWNOLEGLE z natywnym scrollem —
  // na telefonie dawało to szarpany, dwukrotnie za szybki ruch pod palcem.
  let dragging = false;
  let originX = 0;
  let originScroll = 0;
  let moved = 0;

  track.addEventListener("pointerdown", (event) => {
    if (event.button !== 0 || event.pointerType !== "mouse") return;
    dragging = true;
    moved = 0;
    originX = event.clientX;
    originScroll = viewport.scrollLeft;
    track.classList.add("is-dragging");
    // W trakcie chwytu wyłączamy płynne przewijanie — inaczej pozycja goni
    // palec z opóźnieniem i przeciąganie wydaje się „gumowe".
    viewport.style.scrollBehavior = "auto";
    track.setPointerCapture(event.pointerId);
  });

  track.addEventListener("pointermove", (event) => {
    if (!dragging) return;
    const delta = originX - event.clientX;
    moved = Math.abs(delta);
    viewport.scrollLeft = originScroll + delta;
  });

  const endDrag = () => {
    if (!dragging) return;
    dragging = false;
    track.classList.remove("is-dragging");
    viewport.style.scrollBehavior = "";
  };

  track.addEventListener("pointerup", endDrag);
  track.addEventListener("pointercancel", endDrag);

  // Przeciągnięcie nie powinno kończyć się „kliknięciem" w kadr.
  track.addEventListener(
    "click",
    (event) => {
      if (moved > 8) {
        event.preventDefault();
        event.stopPropagation();
      }
      moved = 0;
    },
    true
  );

  sync();
}
