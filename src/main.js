import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger, CustomEase);
window.__jen = { gsap, ScrollTrigger, lenis: null };

/* Blaed uses custom "smoothExpoOut" — approximate the same curve */
CustomEase.create("smoothExpoOut", "M0,0 C0.143,0 0.22,0.534 0.247,0.663 0.277,0.811 0.424,1 1,1");

const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const softMotion = prefersReduced;

const menu = document.getElementById("fullscreen-menu");
const showreel = document.getElementById("showreel");
const yearEl = document.querySelector("[data-year]");
const scrollbarThumb = document.querySelector(".site-scrollbar__thumb");

if (yearEl) yearEl.textContent = String(new Date().getFullYear());

/* ---------- Theme ---------- */
function applyTheme(theme) {
  document.body.dataset.theme = theme;
  localStorage.setItem("jen-theme", theme);
  document.querySelectorAll("[data-theme-label]").forEach((el) => {
    el.textContent = theme === "dark" ? "Light Mode" : "Dark Mode";
  });
}
applyTheme(localStorage.getItem("jen-theme") || "light");
document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
  btn.addEventListener("click", () => {
    applyTheme(document.body.dataset.theme === "dark" ? "light" : "dark");
  });
});

/* ---------- Lenis + GSAP ---------- */
const lenis = new Lenis({
  duration: softMotion ? 0.75 : 1.05,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
});
document.documentElement.classList.add("lenis", "lenis-smooth", "is-loaded");
window.__jen.lenis = lenis;
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

lenis.on("scroll", ({ progress }) => {
  if (scrollbarThumb) {
    const track = 1 - 0.18;
    scrollbarThumb.style.transform = `translateY(${progress * track * 100}vh)`;
  }
});

function scrollToHash(hash) {
  const el = document.querySelector(hash);
  if (!el) return;
  lenis.scrollTo(el, { offset: -20 });
}

document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const href = a.getAttribute("href");
    if (!href || href === "#") return;
    e.preventDefault();
    scrollToHash(href);
  });
});

/* ---------- Menu ---------- */
function openMenu() {
  menu?.classList.add("is-open");
  menu?.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  lenis.stop();
  gsap.fromTo(
    menu.querySelectorAll("li"),
    { y: 28, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.55, stagger: 0.04, ease: "smoothExpoOut", delay: 0.04 }
  );
}

function closeMenu() {
  menu?.classList.remove("is-open");
  menu?.setAttribute("aria-hidden", "true");
  if (!showreel?.classList.contains("is-open")) {
    document.body.style.overflow = "";
    lenis.start();
  }
}

document.querySelectorAll("[data-menu-open]").forEach((b) => b.addEventListener("click", openMenu));
document.querySelectorAll("[data-menu-close]").forEach((b) => b.addEventListener("click", closeMenu));
menu?.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));

/* ---------- Showreel ---------- */
const reelFigures = [...document.querySelectorAll("[data-showreel-track] figure")];
let reelIndex = 0;
let reelTimer = null;
let reelPlaying = true;

function showReelSlide(i) {
  reelFigures.forEach((f, idx) => {
    const on = idx === i;
    f.classList.toggle("is-active", on);
    const vid = f.querySelector("video");
    if (!vid) return;
    if (on && reelPlaying) vid.play().catch(() => {});
    else {
      vid.pause();
      if (!on) vid.currentTime = 0;
    }
  });
  reelIndex = i;
}
function playReel() {
  stopReel();
  reelPlaying = true;
  const playBtn = document.querySelector("[data-showreel-play]");
  if (playBtn) playBtn.textContent = "Pause";
  const active = reelFigures[reelIndex];
  active?.querySelector("video")?.play().catch(() => {});
  reelTimer = setInterval(() => {
    showReelSlide((reelIndex + 1) % reelFigures.length);
  }, 3200);
}
function stopReel() {
  reelPlaying = false;
  clearInterval(reelTimer);
  const playBtn = document.querySelector("[data-showreel-play]");
  if (playBtn) playBtn.textContent = "Play";
  reelFigures.forEach((f) => f.querySelector("video")?.pause());
}
function openShowreel() {
  showreel?.classList.add("is-open");
  showreel?.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  lenis.stop();
  showReelSlide(0);
  playReel();
}
function closeShowreel() {
  showreel?.classList.remove("is-open");
  showreel?.setAttribute("aria-hidden", "true");
  stopReel();
  if (!menu?.classList.contains("is-open")) {
    document.body.style.overflow = "";
    lenis.start();
  }
}
document.querySelectorAll("[data-showreel-open]").forEach((b) => b.addEventListener("click", openShowreel));
document.querySelectorAll("[data-showreel-close]").forEach((b) => b.addEventListener("click", closeShowreel));
document.querySelector("[data-showreel-prev]")?.addEventListener("click", () => {
  showReelSlide((reelIndex - 1 + reelFigures.length) % reelFigures.length);
});
document.querySelector("[data-showreel-next]")?.addEventListener("click", () => {
  showReelSlide((reelIndex + 1) % reelFigures.length);
});
document.querySelector("[data-showreel-play]")?.addEventListener("click", () => {
  if (reelPlaying) stopReel();
  else playReel();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeShowreel();
    closeMenu();
  }
});
if (reelFigures[0]) reelFigures[0].classList.add("is-active");

/* ---------- Contact ---------- */
const form = document.getElementById("contact-form");
const status = document.querySelector("[data-form-status]");
const stepLabel = document.querySelector("[data-step-label]");
form?.querySelectorAll("input, select, textarea").forEach((field, i) => {
  field.addEventListener("focus", () => {
    if (stepLabel) stepLabel.textContent = String(Math.min(i + 1, 4));
  });
});
form?.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const subject = encodeURIComponent(`Zapytanie — Juicy Events · ${data.get("need")}`);
  const body = encodeURIComponent(
    `Dzień dobry,\n\n${data.get("name")}\n${data.get("email")}\nZakres: ${data.get("need")}\n\n${data.get("message") || ""}\n\n— wiadomość ze strony Juicy Events Nation`
  );
  if (status) {
    status.hidden = false;
    status.textContent = "Otwieram klienta poczty…";
  }
  window.location.href = `mailto:knawrocki@juicyevents.pl?subject=${subject}&body=${body}`;
});

/* ---------- Split headlines into words ---------- */
function splitHeadline(el) {
  if (!el || el.dataset.splitDone) return;
  const text = el.textContent.trim();
  const words = text.split(/\s+/);
  el.textContent = "";
  el.classList.add("is-split");
  words.forEach((word) => {
    const line = document.createElement("span");
    line.className = "split-line";
    const inner = document.createElement("span");
    inner.className = "split-line__inner";
    inner.textContent = word;
    line.appendChild(inner);
    el.appendChild(line);
    el.appendChild(document.createTextNode(" "));
  });
  el.dataset.splitDone = "1";
}
document.querySelectorAll("[data-split]").forEach(splitHeadline);

/* =========================================================
   MOTION — patterns taken from blaedagency (GSAP + Lenis)
   ========================================================= */

const ease = softMotion ? "power2.out" : "smoothExpoOut";

/* Hero intro — Blaed: lines y 110%→0 (2s), then scale .8→1; media strip wipe */
(() => {
  const lines = document.querySelectorAll(".blaed-hero__title .js-line");
  const logo = document.querySelector("[data-logo]");
  const baseline = document.querySelector("[data-baseline]");
  const toggle = document.querySelector("[data-nav-toggle]");
  const media = document.querySelector("[data-hero-media]");
  const slicesHost = document.querySelector("[data-hero-slices]");

  if (slicesHost) {
    slicesHost.innerHTML = "";
    for (let i = 0; i < 8; i++) slicesHost.appendChild(document.createElement("span"));
  }
  const slices = slicesHost ? [...slicesHost.children] : [];

  gsap.set(lines, { y: "110%", scale: 0.8, transformOrigin: "0% 100%" });
  if (logo) gsap.set(logo, { y: "110%" });
  if (baseline) gsap.set(baseline, { y: "110%" });
  if (toggle) gsap.set(toggle, { clipPath: "inset(0% 0% 0% 100%)", x: "25%" });
  if (slices.length) gsap.set(slices, { scaleY: 1, transformOrigin: "50% 100%" });

  const tl = gsap.timeline({ defaults: { ease } });

  if (toggle) {
    tl.to(toggle, { clipPath: "inset(0% 0% 0% 0%)", x: "0%", duration: softMotion ? 0.7 : 1 }, 0);
  }
  if (logo) {
    tl.to(logo, { y: "0%", duration: softMotion ? 1 : 1.75 }, 0);
  }
  if (baseline) {
    tl.to(baseline, { y: "0%", duration: softMotion ? 0.7 : 1, ease: "expo.out" }, 0.7);
  }

  tl.to(
    lines,
    { y: "0%", duration: softMotion ? 1.1 : 2, stagger: 0.05, immediateRender: true },
    0.15
  ).to(
    lines,
    { scale: 1, duration: softMotion ? 0.7 : 1, stagger: 0.05, immediateRender: true },
    softMotion ? 0.85 : 1.25
  );

  if (slices.length) {
    tl.to(
      slices,
      {
        scaleY: 0,
        duration: softMotion ? 0.7 : 1,
        ease: "expo.out",
        stagger: { each: 0.05, from: "random" },
      },
      softMotion ? 0.45 : 0.75
    );
  } else if (media) {
    gsap.fromTo(
      media,
      { clipPath: "inset(12% 8% 12% 8%)" },
      { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease, delay: 0.2 }
    );
  }

  const heroVideo = document.querySelector("[data-hero-video]");
  if (heroVideo) {
    heroVideo.muted = true;
    tl.call(
      () => {
        heroVideo.play().catch(() => {});
      },
      null,
      softMotion ? 0.9 : 1.6
    );
  }
})();

/* Hero scroll — subtle media drift only (no fading text away) */
gsap.to("[data-hero-media]", {
  yPercent: 8,
  ease: "none",
  scrollTrigger: {
    trigger: "#hero",
    start: "top top",
    end: "bottom top",
    scrub: true,
  },
});

/* Statement */
(() => {
  const statement = document.querySelector("[data-statement]");
  if (!statement) return;
  const media = statement.querySelector(".statement__media-inner");
  const title = statement.querySelectorAll(".statement__title .line > span");
  gsap.set(title, { yPercent: 110 });
  ScrollTrigger.create({
    trigger: statement,
    start: "top 72%",
    once: true,
    onEnter: () => {
      gsap.to(title, {
        yPercent: 0,
        duration: softMotion ? 0.8 : 1.15,
        stagger: 0.06,
        ease,
      });
    },
  });
  if (media) {
    gsap.fromTo(
      media,
      { yPercent: -8 },
      {
        yPercent: 12,
        ease: "none",
        scrollTrigger: {
          trigger: statement,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      }
    );
  }
})();

/* Controlled parallax — only large media wrappers, not every tiny block */
document.querySelectorAll("[data-parallax]").forEach((el) => {
  if (el.closest("#hero")) return;
  if (el.classList.contains("img-ph") && !el.closest(".statement, .strip, .manifesto, .expertise, .project")) {
    return;
  }
  const speed = Math.min(parseFloat(el.getAttribute("data-parallax") || "0.12"), 0.28);
  gsap.fromTo(
    el,
    { yPercent: -speed * 22 },
    {
      yPercent: speed * 22,
      ease: "none",
      scrollTrigger: {
        trigger: el.parentElement || el,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    }
  );
});

/* Split title reveals */
document.querySelectorAll("[data-split]").forEach((el) => {
  const inners = el.querySelectorAll(".split-line__inner");
  gsap.set(inners, { yPercent: 110 });
  ScrollTrigger.create({
    trigger: el,
    start: "top 88%",
    once: true,
    onEnter: () => {
      gsap.to(inners, {
        yPercent: 0,
        duration: softMotion ? 0.7 : 0.95,
        stagger: 0.03,
        ease,
        overwrite: true,
      });
    },
  });
});

/* Soft fades */
document.querySelectorAll("[data-fade], [data-fade-group] > *").forEach((el) => {
  gsap.set(el, { y: 18, opacity: 0 });
  ScrollTrigger.create({
    trigger: el,
    start: "top 90%",
    once: true,
    onEnter: () => {
      gsap.to(el, { y: 0, opacity: 1, duration: 0.75, ease: "power2.out", overwrite: true });
    },
  });
});

/* Expertise rows — clip reveal */
document.querySelectorAll("[data-row]").forEach((row) => {
  const visual = row.querySelector(".expertise__visual");
  const body = row.querySelector(".expertise__body");
  if (visual) gsap.set(visual, { clipPath: "inset(100% 0 0 0)" });
  if (body) gsap.set(body, { y: 28, opacity: 0 });
  ScrollTrigger.create({
    trigger: row,
    start: "top 82%",
    once: true,
    onEnter: () => {
      if (visual) gsap.to(visual, { clipPath: "inset(0% 0 0 0)", duration: 1, ease });
      if (body) gsap.to(body, { y: 0, opacity: 1, duration: 0.75, delay: 0.1, ease: "power2.out" });
    },
  });
});

/* Projects */
document.querySelectorAll("[data-project]").forEach((card, i) => {
  gsap.set(card, { y: 40, opacity: 0 });
  ScrollTrigger.create({
    trigger: card,
    start: "top 90%",
    once: true,
    onEnter: () => {
      gsap.to(card, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        delay: (i % 2) * 0.06,
        ease,
        overwrite: "auto",
      });
    },
  });
});

/* Method steps */
document.querySelectorAll("[data-step]").forEach((step) => {
  gsap.set(step, { y: 20, opacity: 0 });
  ScrollTrigger.create({
    trigger: step,
    start: "top 92%",
    once: true,
    onEnter: () => gsap.to(step, { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }),
  });
});

/* Quote — once, not scrubbed half-opacity */
(() => {
  const quote = document.querySelector("[data-quote]");
  if (!quote) return;
  gsap.set(quote, { y: 24, opacity: 0 });
  ScrollTrigger.create({
    trigger: quote,
    start: "top 88%",
    once: true,
    onEnter: () => gsap.to(quote, { y: 0, opacity: 1, duration: 0.9, ease }),
  });
})();

/* Strip pin */
(() => {
  const strip = document.querySelector("[data-pin-strip]");
  if (!strip) return;
  const canPin = window.matchMedia("(min-width: 981px)").matches;
  const lines = strip.querySelectorAll("[data-strip-line]");
  if (canPin) {
    gsap.set(lines, { y: 40, opacity: 0 });
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: strip,
        start: "top top",
        end: "+=110%",
        pin: true,
        scrub: 0.45,
      },
    });
    lines.forEach((line, i) => {
      tl.to(line, { y: 0, opacity: 1, duration: 0.35 }, i * 0.2);
    });
    tl.to({}, { duration: 0.35 });
  } else {
    gsap.set(lines, { y: 20, opacity: 0 });
    ScrollTrigger.create({
      trigger: strip,
      start: "top 75%",
      once: true,
      onEnter: () => {
        gsap.to(lines, { y: 0, opacity: 1, stagger: 0.1, duration: 0.65, ease: "power2.out" });
      },
    });
  }
})();

/* Soft section cards */
document.querySelectorAll(".need, .news-card, .excellence__stack article, .contact > *").forEach((el) => {
  gsap.set(el, { y: 22, opacity: 0 });
  ScrollTrigger.create({
    trigger: el,
    start: "top 92%",
    once: true,
    onEnter: () => gsap.to(el, { y: 0, opacity: 1, duration: 0.65, ease: "power2.out" }),
  });
});

window.addEventListener("load", () => ScrollTrigger.refresh());
