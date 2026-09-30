import gsap from "gsap";

const DURATION = 0.15;
const STAGGER_STEP = 0.075;
const EASE = "power1.out";

// Kolory przejścia menu — losowy wybór przy każdym kliknięciu
const PALETTE = ["#e2231a", "#ff5048"];

const CATEGORY_COLORS = {
  realizacje: "#234ee4",
  agencja: "#a23b72",
  kompetencje: "#168579",
  zespol: "#b97520",
  kontakt: "#713fc1",
};

export function getNavigationColor(href) {
  const destination = new URL(href, window.location.href);
  const category = destination.hash.slice(1);
  return CATEGORY_COLORS[category] ||
    (destination.pathname.includes("realizacje") ? CATEGORY_COLORS.realizacje : CATEGORY_COLORS.agencja);
}

let overlayEl = null;
let gridEl = null;
let cols = 6;
let rows = 4;
let lastColorIndex = -1;
let currentColor = PALETTE[0];
let isTransitioning = false;

function updateDimensions() {
  const w = window.innerWidth || document.documentElement.clientWidth || 1;
  const h = window.innerHeight || document.documentElement.clientHeight || 1;

  // Compute cols and rows dynamically so every cell stays virtually a 1:1 perfect square
  const targetSize = w < 768 ? Math.max(80, Math.floor(w / 4)) : w < 1200 ? 160 : 200;
  cols = Math.max(4, Math.round(w / targetSize));
  const cellWidth = w / cols;
  rows = Math.max(3, Math.round(h / cellWidth));
}

function buildGrid() {
  if (!gridEl) return;
  updateDimensions();

  gridEl.style.setProperty("--cols", String(cols));
  gridEl.style.setProperty("--rows", String(rows));

  const total = cols * rows;
  const currentCount = gridEl.children.length;

  if (currentCount !== total) {
    gridEl.innerHTML = "";
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < total; i++) {
      const cell = document.createElement("div");
      cell.className = "page-transition_cell";
      fragment.appendChild(cell);
    }
    gridEl.appendChild(fragment);
  }
}

function getDiagonalGroups(cells) {
  const groups = {};
  cells.forEach((cell, index) => {
    const row = Math.floor(index / cols);
    const col = index % cols;
    // Diagonal grouping: sweeps from bottom-right (0) to top-left (maxDiag)
    const diag = (rows - 1 - row) + (cols - 1 - col);
    if (!groups[diag]) groups[diag] = [];
    groups[diag].push(cell);
  });
  return groups;
}

function pickRandomColor() {
  let next;
  do {
    next = Math.floor(Math.random() * PALETTE.length);
  } while (next === lastColorIndex && PALETTE.length > 1);
  lastColorIndex = next;
  return PALETTE[next];
}

export function getCurrentColor() {
  return currentColor;
}

export function animateLeave(color) {
  return new Promise((resolve) => {
    if (!overlayEl || !gridEl) {
      initPageTransition();
    }
    buildGrid();

    currentColor = color || window.__jen_test_color || pickRandomColor();
    overlayEl.style.setProperty("--rndm-color", currentColor);

    const cells = Array.from(gridEl.children);
    if (!cells.length) return resolve();

    gsap.set(cells, { backgroundColor: currentColor });

    gsap.set(overlayEl, { pointerEvents: "all" });
    gsap.set(cells, { autoAlpha: 0 });

    const groups = getDiagonalGroups(cells);
    const maxDiag = (rows - 1) + (cols - 1);
    const tl = gsap.timeline({ onComplete: resolve });

    for (let d = 0; d <= maxDiag; d++) {
      if (groups[d]) {
        tl.to(
          groups[d],
          {
            autoAlpha: 1,
            duration: DURATION,
            ease: EASE,
          },
          d * STAGGER_STEP
        );
      }
    }
  });
}

export function animateEnter() {
  return new Promise((resolve) => {
    if (!overlayEl || !gridEl) return resolve();
    buildGrid();

    const cells = Array.from(gridEl.children);
    if (!cells.length) {
      gsap.set(overlayEl, { pointerEvents: "none" });
      return resolve();
    }

    const groups = getDiagonalGroups(cells);
    const maxDiag = (rows - 1) + (cols - 1);
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(overlayEl, { pointerEvents: "none" });
        gsap.set(cells, { autoAlpha: 0 });
        resolve();
      },
    });

    for (let d = 0; d <= maxDiag; d++) {
      if (groups[d]) {
        tl.to(
          groups[d],
          {
            autoAlpha: 0,
            duration: DURATION,
            ease: EASE,
          },
          d * STAGGER_STEP
        );
      }
    }
  });
}

export async function transitionTo(onCovered, color) {
  if (isTransitioning) return;
  isTransitioning = true;

  try {
    await animateLeave(color);

    if (typeof onCovered === "function") {
      await onCovered();
    }

    // Solid hold pause so the punchy color impact registers cleanly
    await new Promise((r) => setTimeout(r, 260));

    // Double RAF to guarantee the DOM and scroll are completely painted
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

    await animateEnter();
  } finally {
    isTransitioning = false;
  }
}

export function initPageTransition() {
  if (overlayEl) return;

  overlayEl = document.querySelector(".page-transition");
  if (!overlayEl) {
    overlayEl = document.createElement("div");
    overlayEl.className = "page-transition";
    overlayEl.setAttribute("aria-hidden", "true");

    gridEl = document.createElement("div");
    gridEl.className = "page-transition_grid";
    overlayEl.appendChild(gridEl);

    document.body.appendChild(overlayEl);
  } else {
    gridEl = overlayEl.querySelector(".page-transition_grid");
  }

  buildGrid();

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (!isTransitioning) {
        buildGrid();
      }
    }, 150);
  });

  // Arriving from a cross-page transition
  const storedColor = sessionStorage.getItem("jen_page_transition_color");
  if (storedColor) {
    sessionStorage.removeItem("jen_page_transition_color");
    overlayEl.style.setProperty("--rndm-color", storedColor);
    const cells = Array.from(gridEl.children);
    gsap.set(overlayEl, { pointerEvents: "all" });
    gsap.set(cells, { autoAlpha: 1, backgroundColor: storedColor });

    if (window.location.hash) {
      const target = document.querySelector(window.location.hash);
      if (target) {
        if (window.__jen?.lenis) {
          window.__jen.lenis.scrollTo(target, { immediate: true });
        } else {
          window.scrollTo(0, target.offsetTop);
        }
      }
    }

    requestAnimationFrame(() => {
      setTimeout(() => {
        animateEnter();
      }, 80);
    });
  }
}
