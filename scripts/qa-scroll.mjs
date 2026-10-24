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
await new Promise((r) => server.listen(5056, r));

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:5055".replace("5055", "5056") + "/index.html", { waitUntil: "load" });
await page.waitForTimeout(1500);

const total = await page.evaluate(() => document.documentElement.scrollHeight);
const steps = 14;
for (let i = 0; i <= steps; i++) {
  const frac = i / steps;
  await page.mouse.wheel(0, frac === 0 ? 0 : 1200);
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(outDir, `scroll-${String(i).padStart(2, "0")}.png`) });
}

await browser.close();
server.close();
