import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');
const outDir = 'C:\\Users\\kretowicz_k\\.gemini\\antigravity\\brain\\82846f00-5c8a-49ed-a9af-70728b6a02fc\\screenshots';

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

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

const PORT = 4173;
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
    // 1. First hero stage: Intro with "Tworzymy wydarzenia..."
    await page.goto(`http://localhost:${PORT}/?reduced=1`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);

    // Make sure agency intro is visible for screenshot 1
    await page.evaluate(() => {
      const intro = document.querySelector('[data-agency-intro]');
      if (intro) {
        intro.style.opacity = '1';
        intro.style.visibility = 'visible';
      }
      const title = document.querySelector('[data-agency-headline]');
      if (title) title.style.opacity = '0';
    });
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(outDir, '01-hero-intro.png') });
    console.log('Saved 01-hero-intro.png');

    // 2A. Agency headline on video background with showreel
    await page.evaluate(() => {
      const intro = document.querySelector('[data-agency-intro]');
      if (intro) intro.style.opacity = '0';
      const headline = document.querySelector('[data-agency-headline]');
      if (headline) {
        headline.style.opacity = '1';
        headline.style.visibility = 'visible';
      }
      const lightLayer = document.querySelector('[data-agency-layer="light"]');
      if (lightLayer) lightLayer.style.opacity = '1';
      const darkLayer = document.querySelector('[data-agency-layer="dark"]');
      if (darkLayer) darkLayer.style.opacity = '0';
    });
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(outDir, 'v2-agency-video.png') });
    console.log('Saved v2-agency-video.png');

    // 2B. Agency headline on cream background (after video wipes) with showreel
    await page.evaluate(() => {
      const media = document.querySelector('[data-agency-media]');
      if (media) media.style.clipPath = 'inset(0 0 100% 0)';
      const darkLayer = document.querySelector('[data-agency-layer="dark"]');
      if (darkLayer) {
        darkLayer.style.opacity = '1';
        darkLayer.style.clipPath = 'none';
      }
      const lightLayer = document.querySelector('[data-agency-layer="light"]');
      if (lightLayer) lightLayer.style.opacity = '0';
    });
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(outDir, 'v2-agency-cream.png') });
    console.log('Saved v2-agency-cream.png');

    // Reset styles for normal scrolling
    await page.evaluate(() => {
      const intro = document.querySelector('[data-agency-intro]');
      if (intro) intro.style.opacity = '';
      const headline = document.querySelector('[data-agency-headline]');
      if (headline) {
        headline.style.opacity = '';
        headline.style.visibility = '';
      }
      const darkLayer = document.querySelector('[data-agency-layer="dark"]');
      if (darkLayer) {
        darkLayer.style.opacity = '';
        darkLayer.style.clipPath = '';
      }
      const lightLayer = document.querySelector('[data-agency-layer="light"]');
      if (lightLayer) lightLayer.style.opacity = '';
      const media = document.querySelector('[data-agency-media]');
      if (media) media.style.clipPath = '';
    });

    // 3. Klienci
    const clientsSec = page.locator('#klienci');
    if (await clientsSec.count()) {
      await clientsSec.scrollIntoViewIfNeeded();
      await page.waitForTimeout(400);
      await clientsSec.screenshot({ path: path.join(outDir, 'v2-clients.png') });
      console.log('Saved v2-clients.png');
    }

    // 4. Nasza praca: compact headline
    const workSec = page.locator('#praca');
    if (await workSec.count()) {
      await workSec.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1200);
      await workSec.screenshot({ path: path.join(outDir, 'v2-nasza-praca.png') });
      console.log('Saved v2-nasza-praca.png');
    }

    // 5. Wybrane realizacje + hover test
    const projectsSec = page.locator('#realizacje');
    if (await projectsSec.count()) {
      await projectsSec.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(outDir, '05-realizacje.png') });
      console.log('Saved 05-realizacje.png');

      // Hover over the second card (which was previously lemon)
      const secondCard = page.locator('#realizacje .project-card').nth(1);
      if (await secondCard.count()) {
        await secondCard.hover();
        await page.waitForTimeout(600);
        await secondCard.screenshot({ path: path.join(outDir, '05-realizacje-hover.png') });
        console.log('Saved 05-realizacje-hover.png');
      }
    }

    // 6. Cele i misja (białe napisy)
    const missionSec = page.locator('.mission');
    if (await missionSec.count()) {
      await missionSec.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      await missionSec.screenshot({ path: path.join(outDir, '06-misja.png') });
      console.log('Saved 06-misja.png');
    }

    // 7. Kompetencje — aktywuj pozycję 02 jak na screenie użytkownika
    const expSec = page.locator('#kompetencje');
    if (await expSec.count()) {
      await expSec.scrollIntoViewIfNeeded();
      await page.waitForTimeout(400);
      // Kliknij pozycję 02, aby rozwinąć tagi i opis dokładnie jak na screenie użytkownika
      const item2Head = page.locator('.expertise-item').nth(1).locator('.expertise-item__head');
      if (await item2Head.count()) {
        await item2Head.click();
        await page.waitForTimeout(600);
      }
      await expSec.screenshot({ path: path.join(outDir, '07-kompetencje.png') });
      console.log('Saved 07-kompetencje.png');
    }

    // 8. Zespół (Jakub Gral na rażącym żółto-zielonym lemon)
    const teamSec = page.locator('#zespol');
    if (await teamSec.count()) {
      await teamSec.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      await teamSec.screenshot({ path: path.join(outDir, '08-zespol.png') });
      console.log('Saved 08-zespol.png');
    }

    // 9. Kontakt (spokojny krem, bez logo)
    const contactSec = page.locator('#kontakt');
    if (await contactSec.count()) {
      await contactSec.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      await contactSec.screenshot({ path: path.join(outDir, '09-kontakt.png') });
      console.log('Saved 09-kontakt.png');
    }

    // 10. Footer i czerwony wordmark (statyczny, bez Je! i bez ruchu)
    const footerSec = page.locator('.site-footer');
    if (await footerSec.count()) {
      await footerSec.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      await footerSec.screenshot({ path: path.join(outDir, '10-footer.png') });
      console.log('Saved 10-footer.png');
    }

    console.log('All screenshots captured successfully!');
  } catch (err) {
    console.error('Error taking screenshots:', err);
  } finally {
    await browser.close();
    server.close();
  }
});
