// Zrzuty ekranu do wizualnej kontroli zmian.
//   node scripts/shots.mjs [--w 1440] [--h 900] [--tag after] [--stops 18]
// Strona jest sterowana scrollem (Lenis + ScrollTrigger), więc każdy przystanek
// dostaje chwilę na dojechanie i domknięcie animacji.
import { chromium } from "playwright";
import { mkdirSync } from "fs";

const argv = process.argv.slice(2);
const arg = (name, fallback) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[i + 1] : fallback;
};

const W = Number(arg("w", 1440));
const H = Number(arg("h", 900));
const TAG = arg("tag", "shot");
const STOPS = Number(arg("stops", 18));
const BASE = arg("url", "http://localhost:5174/");
const OUT = arg("out", "C:/Users/Zdalny/AppData/Local/Temp/claude/shots");

mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
const problems = [];
page.on("pageerror", (e) => problems.push(`PAGEERROR: ${e.message}`));
page.on("console", (m) => {
  if (m.type() === "error") problems.push(`CONSOLE: ${m.text()}`);
});

await page.goto(BASE, { waitUntil: "load" });
await page.waitForTimeout(1800);

const total = await page.evaluate(() => document.body.scrollHeight - window.innerHeight);

for (let i = 0; i < STOPS; i++) {
  const y = Math.round((total * i) / (STOPS - 1));
  await page.evaluate((target) => {
    if (window.__jen?.lenis) window.__jen.lenis.scrollTo(target, { duration: 0.7 });
    else window.scrollTo(0, target);
  }, y);
  await page.waitForTimeout(1300);
  await page.screenshot({ path: `${OUT}/${TAG}-${String(i).padStart(2, "0")}.png` });
}

console.log(`scrollHeight: ${total + H} (${((total + H) / H).toFixed(1)} ekranów)`);
if (problems.length) console.log("PROBLEMY:\n" + [...new Set(problems)].join("\n"));
else console.log("Brak błędów w konsoli.");

await browser.close();
