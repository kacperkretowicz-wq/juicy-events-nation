import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { chromium } from "playwright";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, "../dist");
const outDir = path.resolve(__dirname, "../qa-screens");
fs.mkdirSync(outDir, { recursive: true });

const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".mp4": "video/mp4" };

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split("?")[0]);
  if (reqPath === "/") reqPath = "/index.html";
  const filePath = path.join(distDir, reqPath);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404);
    res.end("not found");
  }
});

await new Promise((r) => server.listen(5055, r));

const browser = await chromium.launch();
const consoleErrors = [];

async function shot(name, url, viewport, fn) {
  const page = await browser.newPage({ viewport });
  page.on("pageerror", (e) => consoleErrors.push(`[${name}] pageerror: ${e.message}`));
  page.on("console", (msg) => { if (msg.type() === "error") consoleErrors.push(`[${name}] console: ${msg.text()}`); });
  await page.goto(url, { waitUntil: "load", timeout: 30000 });
  await page.waitForTimeout(1800);
  if (fn) await fn(page);
  await page.screenshot({ path: path.join(outDir, name + ".png"), fullPage: true });
  await page.close();
}

const desktop = { width: 1440, height: 900 };
const mobile = { width: 375, height: 800 };

await shot("home-desktop", "http://localhost:5055/index.html", desktop);
await shot("home-mobile", "http://localhost:5055/index.html", mobile);
await shot("realizacje-desktop", "http://localhost:5055/realizacje.html", desktop);
await shot("realizacje-mobile", "http://localhost:5055/realizacje.html", mobile);
await shot("detail-signature-qrowd", "http://localhost:5055/realizacje-signature-qrowd.html", desktop);
await shot("detail-best-driver", "http://localhost:5055/realizacje-best-driver.html", desktop);
await shot("privacy", "http://localhost:5055/polityka-prywatnosci.html", desktop);

// Check horizontal overflow at 375px on home + realizacje
for (const url of ["http://localhost:5055/index.html", "http://localhost:5055/realizacje.html", "http://localhost:5055/realizacje-signature-qrowd.html"]) {
  const page = await browser.newPage({ viewport: mobile });
  await page.goto(url, { waitUntil: "load", timeout: 30000 });
  await page.waitForTimeout(1200);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  console.log("overflow", url, overflow);
  await page.close();
}

await browser.close();
server.close();

console.log("\n--- console errors ---");
consoleErrors.forEach((e) => console.log(e));
console.log(consoleErrors.length, "errors total");
