/** Jedna aktualizacja na klatkę dla listenerów podpiętych pod scroll (Lenis). */
const jobs = new Set();
let rafId = null;

export function scheduleOnScroll(fn) {
  jobs.add(fn);
  if (rafId != null) return;
  rafId = requestAnimationFrame(() => {
    rafId = null;
    jobs.forEach((job) => job());
    jobs.clear();
  });
}

const scrollFrameListeners = [];

export function onScrollFrame(fn) {
  scrollFrameListeners.push(fn);
}

export function runScrollFrameListeners() {
  scrollFrameListeners.forEach((fn) => fn());
}

let scrollActive = false;
let scrollIdleTimer = null;
const SCROLL_IDLE_MS = 150;

export function isScrollActive() {
  return scrollActive;
}

export function markScrollActivity() {
  scrollActive = true;
  clearTimeout(scrollIdleTimer);
  scrollIdleTimer = setTimeout(() => {
    scrollActive = false;
  }, SCROLL_IDLE_MS);
}

let scrollFramePending = false;

/** Wywołaj po ScrollTrigger.update — listenery scroll-frame raz na klatkę. */
export function flushScrollFrame() {
  if (scrollFramePending) return;
  scrollFramePending = true;
  scheduleOnScroll(() => {
    scrollFramePending = false;
    runScrollFrameListeners();
  });
}
