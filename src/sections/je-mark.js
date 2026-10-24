// Znak Je! w sekcji „Nasza praca” — zastępuje ciemną animację (feedback: „element
// bardziej designerski”). Wideo z wydarzeń gra w literach; przy wjeździe w kadr
// J i e! zjeżdżają się w logo, a kolorowe kopie (cytryna, pomarańcz) rozchodzą
// w „przesunięcie druku”. Na desktopie znak lekko reaguje na kursor.
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { softMotion } from "../shared.js";

function lazyVideo(root, video) {
  const start = parseFloat(video.dataset.start) || 0;
  let loaded = false;

  const load = () => {
    if (loaded || !video.dataset.src) return;
    loaded = true;
    video.addEventListener(
      "loadedmetadata",
      () => {
        try {
          video.currentTime = Math.min(start, Math.max(0, (video.duration || start + 1) - 1));
        } catch {
          // Seek przed gotowością bufora potrafi rzucić — zostaje klatka startowa.
        }
      },
      { once: true }
    );
    video.src = video.dataset.src;
    video.preload = "auto";
    video.load();
  };

  if (!("IntersectionObserver" in window)) {
    load();
    video.play().catch(() => {});
    return;
  }

  new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          load();
          video.play().catch(() => {});
        } else if (loaded) {
          video.pause();
        }
      });
    },
    { rootMargin: "240px 0px" }
  ).observe(root);
}

export function initJeMark() {
  const root = document.querySelector("[data-je-mark]");
  const stage = root?.querySelector("[data-je-mark-stage]");
  if (!root || !stage) return;

  const video = root.querySelector("[data-je-video]");
  if (video) lazyVideo(root, video);

  if (softMotion) {
    stage.style.setProperty("--je-off", "2.2%");
    return;
  }

  // split: 1 = litery rozsunięte, 0 = złożone logo. px/py: kursor w zakresie -1…1.
  const state = { split: 1, px: 0, py: 0 };

  const render = () => {
    const w = stage.clientWidth || 1;
    const s = state.split;
    const jx = -w * 0.07 * s - state.px * 9;
    const jy = -w * 0.035 * s - state.py * 6;
    const ex = w * 0.07 * s + state.px * 9;
    const ey = w * 0.035 * s + state.py * 6;
    const off = 0.6 + (1 - s) * 1.8 + Math.hypot(state.px, state.py) * 0.6;
    stage.style.setProperty("--jx", `${jx.toFixed(1)}px`);
    stage.style.setProperty("--jy", `${jy.toFixed(1)}px`);
    stage.style.setProperty("--ex", `${ex.toFixed(1)}px`);
    stage.style.setProperty("--ey", `${ey.toFixed(1)}px`);
    stage.style.setProperty("--je-off", `${off.toFixed(2)}%`);
  };

  render();

  ScrollTrigger.create({
    trigger: root,
    start: "top 95%",
    end: "center 55%",
    scrub: 0.6,
    invalidateOnRefresh: true,
    onUpdate: ({ progress }) => {
      state.split = 1 - gsap.parseEase("power2.out")(progress);
      render();
    },
  });

  if (!window.matchMedia("(hover: hover) and (min-width: 981px)").matches) return;

  const section = root.closest(".work") || root;
  const toX = gsap.quickTo(state, "px", { duration: 0.8, ease: "power3.out", onUpdate: render });
  const toY = gsap.quickTo(state, "py", { duration: 0.8, ease: "power3.out", onUpdate: render });

  section.addEventListener("pointermove", (event) => {
    const rect = stage.getBoundingClientRect();
    const nx = (event.clientX - (rect.left + rect.width / 2)) / (window.innerWidth / 2);
    const ny = (event.clientY - (rect.top + rect.height / 2)) / (window.innerHeight / 2);
    toX(gsap.utils.clamp(-1, 1, nx));
    toY(gsap.utils.clamp(-1, 1, ny));
  });

  section.addEventListener("pointerleave", () => {
    toX(0);
    toY(0);
  });
}
