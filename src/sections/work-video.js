// Karta "Nasza praca": mały pionowy kafelek z wyciszonym, zapętlonym klipem. Klik w kafelek
// albo w „Odtwórz film” → kafelek rośnie w miejscu (GSAP, w swojej kolumnie, bez nakładki)
// do większego pionowego kadru i gra pełny film z dźwiękiem. Ponowny klik, Esc albo koniec
// filmu zwija go z powrotem i wraca do pętli. Na czas filmu czerwone kółko „Napisz do nas"
// wyjeżdża za prawą krawędź — wraca przy pierwszym scrollu po zamknięciu.
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { claimAudio, releaseAudio } from "../audio-bus.js";
import { softMotion } from "../shared.js";

const FILM_RATIO = 16 / 9; // wysokość / szerokość — pionowy film

export function initWorkVideo() {
  const group = document.querySelector("[data-work-video-group]");
  const video = group?.querySelector("[data-work-video]");
  const card = group?.querySelector(".work__card");
  const triggers = [...(group?.querySelectorAll("[data-work-video-trigger]") ?? [])];
  if (!group || !video || !card || !triggers.length) return;

  const previewSrc = video.dataset.workPreview || video.getAttribute("src") || "";
  const filmSrc = video.dataset.workFilm || "";
  const posterSrc = video.getAttribute("poster") || "";
  const floatCta = document.querySelector("[data-float-cta]");

  let open = false;
  let tween = null;

  // ——— Zapętlony podgląd ———
  video.muted = true;
  video.playsInline = true;
  const playPreview = () => {
    if (!open) video.play().catch(() => {});
  };
  video.addEventListener("canplay", playPreview, { once: true });
  document.addEventListener("jen:intro-done", playPreview, { once: true });

  // Film (5 MB) dociągamy w tle, dopiero gdy sekcja jest blisko — nie na starcie strony.
  let filmWarm = null;
  const warmFilm = () => {
    if (filmWarm || !filmSrc) return;
    filmWarm = document.createElement("video");
    filmWarm.muted = true;
    filmWarm.preload = "auto";
    filmWarm.src = filmSrc;
  };

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            playPreview();
            warmFilm();
          } else if (!open) {
            video.pause();
          }
        });
      },
      { threshold: 0.08, rootMargin: "200px 0px" }
    ).observe(group);
  }

  // ——— Rozmiar rozwiniętego kadru: pion 9:16, max szerokość kolumny i ~80% wysokości ekranu ———
  const expandedSize = () => {
    const column = group.clientWidth;
    const width = Math.min(column, (window.innerHeight * 0.8) / FILM_RATIO);
    return { width, height: width * FILM_RATIO };
  };

  const setLabels = (expanded) =>
    triggers.forEach((trigger) => trigger.setAttribute("aria-expanded", String(expanded)));

  // ——— Kółko „Napisz do nas": chowa się na czas filmu, wraca przy pierwszym scrollu ———
  // Tylko gesty użytkownika — sam `scroll` odpala też ScrollTrigger.refresh() po zwinięciu.
  const CTA_RETURN_EVENTS = ["wheel", "touchmove", "keydown"];
  let ctaReturn = null;
  const disarmCtaReturn = () => {
    if (!ctaReturn) return;
    CTA_RETURN_EVENTS.forEach((type) => window.removeEventListener(type, ctaReturn));
    ctaReturn = null;
  };
  const armCtaReturn = () => {
    disarmCtaReturn();
    ctaReturn = () => {
      floatCta?.classList.remove("is-away");
      disarmCtaReturn();
    };
    CTA_RETURN_EVENTS.forEach((type) =>
      window.addEventListener(type, ctaReturn, { passive: true })
    );
  };

  const resize = (from, to, onComplete) => {
    tween?.kill();
    // Start ustawiony od razu — bez tego przez klatkę kafelek nie ma wysokości (aspect-ratio: auto).
    gsap.set(card, from);
    tween = gsap.fromTo(card, from, {
      ...to,
      duration: softMotion ? 0.01 : 0.9,
      ease: "expo.inOut",
      onComplete: () => {
        // Sekcja zmieniła wysokość — przelicz pozycje triggerów niżej na stronie.
        ScrollTrigger.refresh();
        onComplete?.();
      },
    });
  };

  // ——— Otwórz / zamknij ———
  const expand = () => {
    if (open) return;
    open = true;
    disarmCtaReturn();
    floatCta?.classList.add("is-away");

    // Podmiana źródła i start w geście kliknięcia — przeglądarka od razu pozwala na dźwięk.
    claimAudio(video);
    video.loop = false;
    video.removeAttribute("poster");
    video.src = filmSrc;
    video.muted = false;
    video.play().catch(() => {
      video.controls = true;
    });

    tween?.kill();
    const from = { width: card.offsetWidth, height: card.offsetHeight };
    group.classList.add("is-expanded");
    setLabels(true);
    resize(from, expandedSize());
  };

  const collapse = () => {
    if (!open) return;
    open = false;
    releaseAudio(video);
    video.controls = false;

    tween?.kill();
    const from = { width: card.offsetWidth, height: card.offsetHeight };
    group.classList.remove("is-expanded");
    setLabels(false);
    // Docelowa szerokość małego kafelka z CSS (bez inline'owych wymiarów), wysokość 3:4.
    gsap.set(card, { clearProps: "width,height" });
    const smallWidth = card.offsetWidth;
    const to = { width: smallWidth, height: smallWidth * (4 / 3) };
    gsap.set(card, from);

    video.muted = true;
    video.loop = true;
    if (posterSrc) video.setAttribute("poster", posterSrc);
    video.src = previewSrc;
    playPreview();

    resize(from, to, () => {
      gsap.set(card, { clearProps: "width,height" });
      armCtaReturn();
    });
  };

  triggers.forEach((trigger) =>
    trigger.addEventListener("click", (event) => {
      event.stopPropagation();
      if (open) collapse();
      else expand();
    })
  );

  video.addEventListener("ended", () => {
    if (open) collapse();
  });
  video.addEventListener("jen:audio-released", () => {
    if (open) collapse();
  });
  document.addEventListener("keydown", (event) => {
    if (open && event.key === "Escape") collapse();
  });

  window.addEventListener("resize", () => {
    if (open && !tween?.isActive()) gsap.set(card, expandedSize());
  });
}
