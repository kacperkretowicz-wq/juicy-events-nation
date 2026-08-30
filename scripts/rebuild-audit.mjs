import { chromium } from "playwright";
import { mkdir, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const URL = process.env.AUDIT_URL || "http://127.0.0.1:5173/";
const STEP = Number(process.env.AUDIT_STEP || 500);
const WIDTH = Number(process.env.AUDIT_W || 1512);
const HEIGHT = Number(process.env.AUDIT_H || 900);
const OUT = path.join(__dirname, "..", ".debug-scroll", process.env.AUDIT_OUT || "rebuild");

function probe() {
  const rect = (sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { top: Math.round(r.top), bottom: Math.round(r.bottom), h: Math.round(r.height) };
  };

  const st = window.__jen?.ScrollTrigger;

  return {
    reduced: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    triggers: st?.getAll?.().length ?? null,
    pins: st?.getAll?.().filter((t) => t.pin).length ?? null,
    scrollY: Math.round(window.scrollY),
    docHeight: Math.round(document.documentElement.scrollHeight),
    headerSolid: document.querySelector("[data-site-header]")?.classList.contains("site-header--solid") ?? null,
    headerHidden: document.querySelector("[data-site-header]")?.classList.contains("site-header--hidden") ?? null,
    curtainTransform: (() => {
      const el = document.querySelector("[data-agency-curtain]");
      return el ? getComputedStyle(el).transform : null;
    })(),
    darkClip: (() => {
      const el = document.querySelector("[data-agency-layer='dark']");
      return el ? el.style.clipPath || getComputedStyle(el).clipPath : null;
    })(),
    expertiseActive: [...document.querySelectorAll("[data-expertise-item]")].findIndex((el) =>
      el.classList.contains("is-active")
    ),
    methodActive: [...document.querySelectorAll("[data-method-step]")].findIndex((el) =>
      el.classList.contains("is-active")
    ),
    hero: rect(".hero"),
    agencyStage: rect("[data-agency-stage]"),
    expertise: rect("[data-expertise]"),
  };
}

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: WIDTH, height: HEIGHT },
  reducedMotion: "no-preference",
});

const errors = [];
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push(msg.text());
});
page.on("pageerror", (err) => errors.push(`pageerror: ${err.message}`));

await page.goto(URL, { waitUntil: "load" });
await page.waitForTimeout(2500);

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });

const height = await page.evaluate(() => document.documentElement.scrollHeight);
const report = [];
let index = 0;

for (let y = 0; y < height; y += STEP) {
  await page.evaluate(async (target) => {
    const lenis = window.__jen?.lenis;
    if (lenis) lenis.scrollTo(target, { immediate: true, force: true });
    else window.scrollTo(0, target);
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  }, y);
  await page.waitForTimeout(420);

  const data = await page.evaluate(probe);
  const file = `y${String(y).padStart(6, "0")}.png`;
  await page.screenshot({ path: path.join(OUT, file) });
  report.push({ ...data, screenshot: file });
  index += 1;
}

await writeFile(
  path.join(OUT, "report.json"),
  JSON.stringify({ url: URL, viewport: `${WIDTH}x${HEIGHT}`, height, frames: index, errors, report }, null, 2)
);

await browser.close();

console.log(`Frames: ${index}  docHeight: ${height}`);
if (errors.length) {
  console.log("\nCONSOLE ERRORS:");
  errors.forEach((e) => console.log(" -", e));
} else {
  console.log("No console errors.");
}
console.log("Saved to", OUT);
