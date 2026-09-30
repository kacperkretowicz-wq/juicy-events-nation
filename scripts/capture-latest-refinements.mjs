import path from 'path';
import { chromium } from 'playwright';

const outDir = 'C:\\Users\\kretowicz_k\\.gemini\\antigravity\\brain\\82846f00-5c8a-49ed-a9af-70728b6a02fc\\screenshots';

async function main() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  // Test port 5002 (Wersja 1)
  await page.goto('http://localhost:5002/?reduced=1', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  // 1. Hero with semi-transparent showreel CTA button
  await page.mouse.move(950, 450);
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(outDir, 'v1-07-hero-glass-cta.png') });
  console.log('Saved v1-07-hero-glass-cta.png');

  // 2. Work play button semi-transparent
  const workEl = await page.$('#praca');
  if (workEl) {
    await workEl.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(outDir, 'v1-08-work-glass-play.png') });
    console.log('Saved v1-08-work-glass-play.png');
  }

  // 3. Kompetencje: Clean title only on left, vertical examples list on right
  const kompEl = await page.$('#kompetencje');
  if (kompEl) {
    await kompEl.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(outDir, 'v1-09-kompetencje-clean.png') });
    console.log('Saved v1-09-kompetencje-clean.png');

    // Scroll slightly to item 2 to see the scroll sweep
    const item2 = await page.$('.expertise-item:nth-child(2)');
    if (item2) {
      await item2.scrollIntoViewIfNeeded();
      await page.waitForTimeout(600);
      await page.screenshot({ path: path.join(outDir, 'v1-10-kompetencje-item2.png') });
      console.log('Saved v1-10-kompetencje-item2.png');
    }
  }

  await browser.close();
  console.log('Done capturing verification screenshots.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
