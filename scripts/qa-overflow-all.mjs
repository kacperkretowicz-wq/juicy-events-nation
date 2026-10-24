import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { chromium } from "playwright";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, "../dist");

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
await new Promise((r) => server.listen(5057, r));

const pages = fs.readdirSync(distDir).filter((f) => f.endsWith(".html"));
const browser = await chromium.launch();
let anyIssue = false;
const errors = [];

for (const file of pages) {
  const page = await browser.newPage({ viewport: { width: 375, height: 800 } });
  page.on("pageerror", (e) => errors.push(`[${file}] pageerror: ${e.message}`));
  page.on("console", (msg) => { if (msg.type() === "error") errors.push(`[${file}] console: ${msg.text()}`); });
  try {
    await page.goto(`http://localhost:5057/${file}`, { waitUntil: "load", timeout: 30000 });
    await page.waitForTimeout(900);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    console.log(overflow > 0 ? "OVERFLOW" : "ok", file, overflow);
    if (overflow > 0) anyIssue = true;
  } catch (e) {
    console.log("ERROR loading", file, e.message);
    anyIssue = true;
  }
  await page.close();
}

await browser.close();
server.close();

console.log("\n--- console/page errors ---");
errors.forEach((e) => console.log(e));
console.log(errors.length, "errors total");
if (anyIssue) process.exitCode = 1;
