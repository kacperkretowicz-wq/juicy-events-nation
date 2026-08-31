// Standard realizacji — poziomy tor kart przewijany natywnie.
// Bez pinowania sekcji: wcześniej scroll „zatrzymywał się" na tej sekcji, zanim
// tor doszedł do końca, co czytało się jak zablokowana strona.
export function initStandard() {
  const section = document.querySelector(".standard");
  const viewport = section?.querySelector("[data-standard-viewport]");
  const track = section?.querySelector("[data-standard-track]");
  if (!section || !viewport || !track) return;

  // Przeciąganie myszą jako uzupełnienie kółka/trackpada.
  let dragging = false;
  let originX = 0;
  let originScroll = 0;

  track.addEventListener("pointerdown", (event) => {
    dragging = true;
    originX = event.clientX;
    originScroll = viewport.scrollLeft;
    track.classList.add("is-dragging");
    track.setPointerCapture(event.pointerId);
  });

  track.addEventListener("pointermove", (event) => {
    if (!dragging) return;
    viewport.scrollLeft = originScroll + (originX - event.clientX);
  });

  const endDrag = () => {
    dragging = false;
    track.classList.remove("is-dragging");
  };

  track.addEventListener("pointerup", endDrag);
  track.addEventListener("pointercancel", endDrag);
}
