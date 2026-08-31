// Lightbox dla galerii zdjęć (realizacje.html + podstrony realizacji).
// Zero bibliotek — klawiatura (← → Esc), klik w tło, swipe na dotyku.

export function initLightbox() {
  const grids = [...document.querySelectorAll(".gallery__grid")];
  if (!grids.length) return;

  // Wszystkie zdjęcia z galerii w kolejności występowania.
  const items = grids.flatMap((grid) =>
    [...grid.querySelectorAll(".gallery-item__media img")]
  );
  if (!items.length) return;

  const lenis = window.__jen?.lenis;

  const box = document.createElement("div");
  box.className = "lightbox";
  box.setAttribute("aria-hidden", "true");
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-label", "Podgląd zdjęcia");
  box.innerHTML = `
    <button class="lightbox__close" type="button" aria-label="Zamknij">Zamknij</button>
    <button class="lightbox__nav lightbox__nav--prev" type="button" aria-label="Poprzednie">&#8592;</button>
    <figure class="lightbox__stage">
      <img class="lightbox__img" alt="" />
      <figcaption class="lightbox__caption"></figcaption>
    </figure>
    <button class="lightbox__nav lightbox__nav--next" type="button" aria-label="Następne">&#8594;</button>
    <p class="lightbox__count"><span data-lb-current>1</span> / ${items.length}</p>
  `;
  document.body.appendChild(box);

  const imgEl = box.querySelector(".lightbox__img");
  const capEl = box.querySelector(".lightbox__caption");
  const countEl = box.querySelector("[data-lb-current]");

  let index = 0;
  let lastFocus = null;

  const render = () => {
    const src = items[index];
    imgEl.src = src.currentSrc || src.src;
    const caption = src.getAttribute("alt") || src.closest(".gallery-item")?.querySelector("h2")?.textContent || "";
    imgEl.alt = caption;
    capEl.textContent = caption;
    capEl.hidden = !caption;
    countEl.textContent = String(index + 1);
  };

  const open = (i) => {
    index = i;
    lastFocus = document.activeElement;
    render();
    box.classList.add("is-open");
    box.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    lenis?.stop();
    box.querySelector(".lightbox__close").focus();
  };

  const close = () => {
    box.classList.remove("is-open");
    box.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    lenis?.start();
    imgEl.removeAttribute("src");
    lastFocus?.focus?.();
  };

  const go = (delta) => {
    index = (index + delta + items.length) % items.length;
    render();
  };

  items.forEach((img, i) => {
    const media = img.closest(".gallery-item__media");
    if (!media) return;
    media.classList.add("is-zoomable");
    media.setAttribute("role", "button");
    media.setAttribute("tabindex", "0");
    media.setAttribute("aria-label", `Powiększ zdjęcie ${i + 1}`);
    media.addEventListener("click", () => open(i));
    media.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open(i);
      }
    });
  });

  box.querySelector(".lightbox__close").addEventListener("click", close);
  box.querySelector(".lightbox__nav--prev").addEventListener("click", () => go(-1));
  box.querySelector(".lightbox__nav--next").addEventListener("click", () => go(1));
  box.addEventListener("click", (e) => {
    if (e.target === box || e.target.classList.contains("lightbox__stage")) close();
  });

  document.addEventListener("keydown", (e) => {
    if (!box.classList.contains("is-open")) return;
    if (e.key === "Escape") close();
    else if (e.key === "ArrowLeft") go(-1);
    else if (e.key === "ArrowRight") go(1);
  });

  // Swipe
  let touchX = null;
  box.addEventListener("touchstart", (e) => (touchX = e.touches[0].clientX), { passive: true });
  box.addEventListener("touchend", (e) => {
    if (touchX == null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 45) go(dx < 0 ? 1 : -1);
    touchX = null;
  });
}
