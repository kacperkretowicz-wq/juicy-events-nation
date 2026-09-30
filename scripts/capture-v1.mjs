import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');
const outDir = 'C:\\Users\\kretowicz_k\\.gemini\\antigravity\\brain\\82846f00-5c8a-49ed-a9af-70728b6a02fc\\screenshots';

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.mp4': 'video/mp4',
  '.webp': 'image/webp',
};

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath === '/') reqPath = '/index.html';
  const filePath = path.join(distDir, reqPath);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
      'Access-Control-Allow-Origin': '*',
    });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

const PORT = 4174;
server.listen(PORT, async () => {
  console.log(`Preview server listening on http://localhost:${PORT}`);

  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  try {
    await page.goto(`http://localhost:${PORT}/?reduced=1`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    // Klienci
    const clientsSec = page.locator('#klienci');
    if (await clientsSec.count()) {
      await clientsSec.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      await clientsSec.screenshot({ path: path.join(outDir, 'v1-clients.png') });
      console.log('Saved v1-clients.png');
    }

    // Nasza praca
    const workSec = page.locator('#praca');
    if (await workSec.count()) {
      await workSec.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      await workSec.screenshot({ path: path.join(outDir, 'v1-nasza-praca.png') });
      console.log('Saved v1-nasza-praca.png');
    }

    console.log('Version 1 captures finished successfully!');
  } catch (err) {
    console.error('Error during capture:', err);
  } finally {
    await browser.close();
    server.close();
  }
});
