// Zdjęcia realizacji z atrybutów data — dla projektów, których zdjęcia dopiero dojadą.
// Kafel / strona case'a ma folder (data-media-dir) i listy plików (data-cover,
// data-slides, data-gallery). Dopóki listy są puste, zostaje neutralny placeholder —
// bez <img>, więc bez 404 i ikon zepsutych obrazków. Żeby podpiąć zdjęcia: wrzuć
// pliki do public/media/realizacje/<slug>/ i wpisz ich nazwy w atrybuty, np.
//   data-cover="cover.jpg" data-slides="01.jpg,02.jpg,03.jpg"

const list = (value) =>
  (value || "")
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean);

const img = (src, { alt = "", cls = "", eager = false } = {}) => {
  const el = document.createElement("img");
  el.src = src;
  el.alt = alt;
  el.decoding = "async";
  if (!eager) el.loading = "lazy";
  if (cls) el.className = cls;
  return el;
};

/** Kafle realizacji (realizacje.html): okładka + pokaz zdjęć w okienku na hover. */
export function hydrateProjectTiles(scope = document) {
  scope.querySelectorAll("[data-project][data-media-dir]").forEach((card) => {
    const dir = card.dataset.mediaDir;
    const cover = list(card.dataset.cover)[0];
    const slides = list(card.dataset.slides);
    const media = card.querySelector(".project-card__media");
    if (!media || !cover) return;

    const title = card.querySelector(".project-card__title")?.textContent.trim() || "";
    media.querySelector(".project-card__placeholder")?.remove();
    media.prepend(img(dir + cover, { alt: title, cls: "project-card__cover" }));

    if (slides.length >= 2) {
      const peek = document.createElement("span");
      peek.className = "project-card__peek";
      peek.dataset.projectPeek = "";
      peek.dataset.peekSlideshow = "";
      slides.forEach((name, i) => {
        const slide = document.createElement("span");
        slide.className = `peek-slide${i === 0 ? " is-active" : ""}`;
        slide.dataset.peekSlide = "";
        slide.append(img(dir + name));
        peek.append(slide);
      });
      media.append(peek);
    }
    card.classList.remove("project-card--pending");
  });
}

/** Strona case'a: zdjęcie główne + galeria (przed initLightbox, żeby lightbox je widział). */
export function hydrateCaseMedia(scope = document) {
  const root = scope.querySelector("[data-case-media]");
  if (!root) return;
  const dir = root.dataset.mediaDir;
  const cover = list(root.dataset.cover)[0];
  const gallery = list(root.dataset.gallery);
  const name = root.dataset.caseName || "";

  const hero = scope.querySelector("[data-case-hero]");
  if (hero && cover) {
    hero.querySelector(".realizacje-placeholder")?.remove();
    hero.classList.remove("is-pending");
    hero.append(img(dir + cover, { alt: `${name}, kadr z realizacji` }));
  }

  const grid = scope.querySelector("[data-case-gallery]");
  if (grid && gallery.length) {
    grid.closest(".gallery")?.removeAttribute("hidden");
    gallery.forEach((file, i) => {
      const item = document.createElement("article");
      item.className = `gallery-item${i % 4 === 0 ? " gallery-item--wide" : ""}`;
      const box = document.createElement("div");
      box.className = "gallery-item__media";
      box.append(img(dir + file, { alt: `${name}, zdjęcie ${i + 1}` }));
      item.append(box);
      grid.append(item);
    });
  }
}
