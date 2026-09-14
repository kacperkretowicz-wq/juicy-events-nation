// Realizacje: kafelek-okładka przełącza się sam (John Deere → Volvo → … → i od nowa),
// a odpowiedni wiersz indeksu jest podświetlony. Najechanie na wiersz wybiera go
// i wstrzymuje obieg; poza ekranem obieg stoi. Czas slajdu = --rotator-ms w CSS.
import { softMotion } from "../shared.js";

const SLIDE_MS = 4500;

export function initCaseRotator() {
  const section = document.querySelector("[data-rotator]");
  if (!section) return;

  const slides = [...section.querySelectorAll("[data-rotator-slide]")];
  const items = [...section.querySelectorAll("[data-rotator-item]")];
  if (slides.length < 2 || slides.length !== items.length) return;

  section.style.setProperty("--rotator-ms", `${SLIDE_MS}ms`);

  let index = 0;
  let timer = null;
  let hovered = false;
  let inView = true;

  const setActive = (next) => {
    index = (next + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      const active = i === index;
      slide.classList.toggle("is-active", active);
      slide.setAttribute("aria-hidden", String(!active));
      slide.tabIndex = active ? 0 : -1;
    });
    items.forEach((item, i) => {
      const active = i === index;
      item.classList.toggle("is-active", active);
      if (!active) return;
      // Restart animacji paska postępu: zdjęcie i ponowne nadanie klasy w kolejnej klatce.
      const bar = item.querySelector(".case-row__bar");
      if (bar) {
        bar.style.animation = "none";
        void bar.offsetWidth;
        bar.style.animation = "";
      }
    });
  };

  const stop = () => {
    clearInterval(timer);
    timer = null;
  };

  const start = () => {
    if (timer || hovered || !inView || softMotion) return;
    timer = setInterval(() => setActive(index + 1), SLIDE_MS);
  };

  items.forEach((item, i) => {
    item.addEventListener("mouseenter", () => {
      hovered = true;
      section.classList.add("is-paused");
      stop();
      setActive(i);
    });
    item.addEventListener("focusin", () => setActive(i));
  });

  const list = items[0].parentElement;
  list.addEventListener("mouseleave", () => {
    hovered = false;
    section.classList.remove("is-paused");
    start();
  });

  // Obieg tylko, gdy sekcja jest na ekranie — nie ma sensu mielić slajdów w tle.
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView) start();
        else stop();
      },
      { threshold: 0.2 }
    );
    io.observe(section);
  } else {
    start();
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
    else start();
  });

  setActive(0);
}
