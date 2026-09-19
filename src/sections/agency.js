import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { softMotion } from "../shared.js";

// Faza A→B (0 → LOGO_END progresu aktu): logo ucieka do nagłówka strony,
// intro po prawej gaśnie, a "Po co Ci agencja" wjeżdża w jego miejsce.
const LOGO_END = 0.48;
const flyEase = gsap.parseEase("power2.inOut");
const fadeEase = gsap.parseEase("power1.out");

export function initAgency() {
  const section = document.querySelector("[data-agency]");
  if (!section) return;

  const act = section.querySelector("[data-agency-act]");
  const stage = section.querySelector("[data-agency-stage]");
  const media = section.querySelector("[data-agency-media]");
  const mediaInner = section.querySelector("[data-agency-media-inner]");
  const video = section.querySelector("[data-agency-video]");
  const logo = section.querySelector("[data-agency-logo]");
  const intro = section.querySelector("[data-agency-intro]");
  const headline = section.querySelector("[data-agency-headline]");
  const darkLayer = section.querySelector("[data-agency-layer='dark']");
  const edge = section.querySelector("[data-agency-edge]");
  const headerLogo = document.querySelector(".site-header__logo img");

  if (video) {
    const syncPlayback = (play) => {
      if (play) video.play().catch(() => {});
      else if (video.muted) video.pause();
    };

    ScrollTrigger.create({
      trigger: section,
      start: "top bottom",
      end: "bottom top",
      onEnter: () => syncPlayback(true),
      onEnterBack: () => syncPlayback(true),
      onLeave: () => syncPlayback(false),
      onLeaveBack: () => syncPlayback(false),
    });

    const playIfVisible = () => {
      const rect = section.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) syncPlayback(true);
    };
    playIfVisible();
    video.addEventListener("loadeddata", playIfVisible, { once: true });
  }

  if (softMotion || !act) {
    if (logo) logo.style.display = "none";
    if (intro) intro.style.display = "none";
    return;
  }

  gsap.set(headline, { autoAlpha: 0, yPercent: 12 });

  gsap.to(mediaInner, {
    yPercent: 8,
    ease: "none",
    scrollTrigger: { trigger: act, start: "top top", end: "bottom bottom", scrub: true },
  });

  let flyDelta = { x: 0, y: 0, scale: 1 };
  const measureFly = () => {
    if (!logo || !headerLogo || !stage) return;
    const prev = { x: gsap.getProperty(logo, "x"), y: gsap.getProperty(logo, "y"), scale: gsap.getProperty(logo, "scale") };
    gsap.set(logo, { x: 0, y: 0, scale: 1 });
    const from = logo.getBoundingClientRect();
    const stageRect = stage.getBoundingClientRect();
    const to = headerLogo.getBoundingClientRect();
    flyDelta = {
      x: to.left - (from.left - stageRect.left),
      y: to.top - (from.top - stageRect.top),
      scale: to.width / from.width,
    };
    gsap.set(logo, prev);
  };

  let darkOffsetTop = 0;
  const measureLayers = () => {
    if (!darkLayer || !stage) return;
    let y = 0;
    for (let node = darkLayer; node && node !== stage; node = node.offsetParent) {
      y += node.offsetTop;
    }
    darkOffsetTop = y;
  };

  const remeasure = () => {
    measureFly();
    measureLayers();
  };
  remeasure();
  window.addEventListener("resize", remeasure);
  document.addEventListener("jen:intro-done", remeasure, { once: true });

  if (logo) gsap.set(logo, { transformOrigin: "left top" });
  if (headerLogo) gsap.set(headerLogo, { autoAlpha: 0 });
  if (media) gsap.set(media, { clipPath: "inset(0 0 0% 0)" });
  if (edge) gsap.set(edge, { top: "100%" });

  const dockStart = LOGO_END * 0.7;
  const dockDur = LOGO_END * 0.3;
  const wipeDur = 1 - LOGO_END;

  const syncDarkClip = (progress) => {
    if (!darkLayer || !stage) return;
    const wipeT = gsap.utils.clamp(0, 1, (progress - LOGO_END) / (1 - LOGO_END));
    const visible = (1 - wipeT) * 100;
    const edgePx = (visible / 100) * stage.clientHeight;
    const clipTop = Math.max(0, edgePx - darkOffsetTop);
    darkLayer.style.clipPath = `inset(${clipTop}px 0 0 0)`;
  };

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: act,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => syncDarkClip(self.progress),
    },
  });

  if (logo) {
    tl.to(
      logo,
      { x: flyDelta.x, y: flyDelta.y, scale: flyDelta.scale, ease: flyEase, duration: dockStart },
      0
    );
    tl.to(logo, { autoAlpha: 0, ease: fadeEase, duration: dockDur }, dockStart);
  }
  if (headerLogo) {
    tl.to(headerLogo, { autoAlpha: 1, ease: fadeEase, duration: dockDur }, dockStart);
  }
  if (intro) {
    tl.to(intro, { autoAlpha: 0, ease: fadeEase, duration: LOGO_END }, 0);
  }
  if (headline) {
    tl.to(headline, { autoAlpha: 1, yPercent: 0, ease: flyEase, duration: LOGO_END }, 0);
  }
  if (media) {
    tl.to(media, { clipPath: "inset(0 0 100% 0)", ease: "none", duration: wipeDur }, LOGO_END);
  }
  if (edge) {
    tl.to(edge, { top: "0%", ease: "none", duration: wipeDur }, LOGO_END);
  }
}
