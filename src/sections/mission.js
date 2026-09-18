import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { softMotion } from "../shared.js";

// Jedna linia: „Nie boimy się” + slot. Kolejka tylko w dół — aktywne słowo w slocie,
// następne czekają pod spodem, zużyte idą nad (bez zamiany z góry na dół).
const FADED = 0.34;
const STEP = 100;

export function initMission() {
  const section = document.querySelector("[data-mission]");
  const words = [...section?.querySelectorAll("[data-mission-word]")];
  const rotator = section?.querySelector("[data-mission-rotator]");
  const note = section?.querySelector("[data-mission-note]");
  if (!section || words.length < 3 || !rotator) return;

  let queueState = { active: 0, t: 0 };

  const applyQueue = (active, t) => {
    queueState = { active, t };
    words.forEach((word, i) => {
      let y = 0;
      let opacity = FADED;

      if (i < active) {
        y = -STEP * (active - i + t);
        opacity = FADED;
      } else if (i === active) {
        if (active === words.length - 1) {
          y = 0;
          opacity = 1;
        } else {
          y = -STEP * t;
          opacity = 1 - (1 - FADED) * t;
        }
      } else if (i === active + 1) {
        y = STEP * (1 - t);
        opacity = FADED + (1 - FADED) * t;
      } else {
        y = STEP * (i - active - t);
        opacity = FADED;
      }

      gsap.set(word, { yPercent: y, opacity });
    });
  };

  const fitRotator = () => {
    const line = rotator.closest(".mission__line");
    const lead = line?.querySelector(".mission__lead");
    rotator.style.width = "";
    if (line) line.style.fontSize = "";

    gsap.set(words, { position: "relative", yPercent: 0, opacity: 1 });

    const lineWidth = line?.getBoundingClientRect().width ?? 0;
    const gap = parseFloat(getComputedStyle(line).columnGap) || 0;
    const measureWidest = () =>
      Math.max(...words.map((word) => word.getBoundingClientRect().width));

    let size = parseFloat(getComputedStyle(line).fontSize);
    let widest = measureWidest();
    let leadWidth = lead?.getBoundingClientRect().width ?? 0;
    let available = Math.max(80, lineWidth - leadWidth - gap);

    while (widest > available && size > 28) {
      size *= 0.97;
      if (line) line.style.fontSize = `${size}px`;
      widest = measureWidest();
      leadWidth = lead?.getBoundingClientRect().width ?? 0;
      available = Math.max(80, lineWidth - leadWidth - gap);
    }

    gsap.set(words, { position: "absolute" });
    applyQueue(queueState.active, queueState.t);
  };

  if (softMotion) {
    fitRotator();
    words.forEach((word, i) => {
      gsap.set(word, {
        position: "absolute",
        yPercent: 0,
        opacity: i === 0 ? 1 : FADED,
      });
    });
    if (note) gsap.set(note, { opacity: 1, yPercent: 0 });
    return;
  }

  fitRotator();
  window.addEventListener("resize", fitRotator);
  ScrollTrigger.addEventListener("refresh", fitRotator);

  applyQueue(0, 0);
  if (note) gsap.set(note, { opacity: 0, yPercent: 12 });

  const step = 1 / (words.length - 1);

  ScrollTrigger.create({
    trigger: section,
    start: "top top",
    end: "bottom bottom",
    scrub: true,
    onUpdate: ({ progress }) => {
      const active = Math.min(words.length - 1, Math.floor(progress / step));
      const t = active === words.length - 1 ? 0 : gsap.utils.clamp(0, 1, (progress - active * step) / step);

      applyQueue(active, t);

      if (note) {
        const noteT = gsap.utils.clamp(0, 1, (progress - 0.82) / 0.18);
        gsap.set(note, { opacity: noteT, yPercent: 12 * (1 - noteT) });
      }
    },
  });
}
