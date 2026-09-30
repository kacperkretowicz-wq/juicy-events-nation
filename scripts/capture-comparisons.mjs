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

  const versions = [
    { port: 5001, name: 'compare-base' },
    { port: 5002, name: 'compare-v1' },
    { port: 5003, name: 'compare-v2' },
  ];

  for (const v of versions) {
    console.log(`Capturing port ${v.port}...`);
    await page.goto(`http://localhost:${v.port}/?reduced=1`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    // Capture the transition from clients through work to realizacje
    const work = page.locator('#praca');
    if (await work.count()) {
      await work.scrollIntoViewIfNeeded();
      await page.waitForTimeout(800);
      await page.screenshot({ path: path.join(outDir, `${v.name}-work.png`) });
    }

    if (v.port === 5003) {
      // Also capture agency stage with showreel on port 5003
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
        const headline = document.querySelector('[data-agency-headline]');
        if (headline) {
          headline.style.opacity = '1';
          headline.style.visibility = 'visible';
        }
        const intro = document.querySelector('[data-agency-intro]');
        if (intro) intro.style.opacity = '0';
      });
      await page.waitForTimeout(400);
      await page.screenshot({ path: path.join(outDir, `${v.name}-agency.png`) });
    }
  }

  await browser.close();
  console.log('All comparison captures saved!');
}

main().catch(console.error);
