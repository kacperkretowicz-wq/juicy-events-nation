import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const URL = process.env.AUDIT_URL || "http://127.0.0.1:5173/";
const OUT = path.join(__dirname, "..", ".debug-scroll", "project-video");

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const errors = [];
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push(msg.text());
});
page.on("pageerror", (err) => errors.push(`pageerror: ${err.message}`));

await page.goto(URL, { waitUntil: "load" });
await page.locator("#realizacje").scrollIntoViewIfNeeded();
await page.waitForTimeout(1200);
await page.screenshot({ path: path.join(OUT, "01-before.png") });

const button = page.locator("[data-video-card]").first();
await button.click();
await page.waitForTimeout(700);
await page.screenshot({ path: path.join(OUT, "02-expanded.png") });

const ariaExpanded = await button.getAttribute("aria-expanded");
const titleVisible = await page.locator(".project-card--video .project-card__title a").first().isVisible();
const statVisible = await page.locator(".project-card--video .project-card__stat").first().isVisible();

await button.click();
await page.waitForTimeout(700);
await page.screenshot({ path: path.join(OUT, "03-collapsed.png") });
const ariaExpandedAfter = await button.getAttribute("aria-expanded");

await writeFile(
  path.join(OUT, "report.json"),
  JSON.stringify({ ariaExpanded, titleVisible, statVisible, ariaExpandedAfter, errors }, null, 2)
);

await browser.close();

console.log(JSON.stringify({ ariaExpanded, titleVisible, statVisible, ariaExpandedAfter, errors }, null, 2));
