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

  // 1. Hero headline "tak samo jak inne?"
  await page.evaluate(() => {
    window.scrollTo(0, window.innerHeight * 0.9);
  });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(outDir, 'v1-01-hero-headline-lemon.png') });
  console.log('Saved v1-01-hero-headline-lemon.png');

  // 2. Transition between Nasza praca and Wybrane realizacje
  const projectsEl = await page.$('#realizacje');
  if (projectsEl) {
    await page.evaluate((el) => {
      const rect = el.getBoundingClientRect();
      const currentScroll = window.scrollY;
      // scroll so the top of #realizacje is about 250px from top of viewport, showing the gap above it
      window.scrollTo(0, currentScroll + rect.top - 250);
    }, projectsEl);
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(outDir, 'v1-02-gap-work-projects.png') });
    console.log('Saved v1-02-gap-work-projects.png');
  }

  // 3. Hover on project card (should be strictly red)
  const card = await page.$('.project-card');
  if (card) {
    await card.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    const box = await card.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.waitForTimeout(600);
      await page.screenshot({ path: path.join(outDir, 'v1-03-project-hover-red.png') });
      console.log('Saved v1-03-project-hover-red.png');
    }
  }

  // 4. Kompetencje 2-column layout
  const kompEl = await page.$('#kompetencje');
  if (kompEl) {
    await kompEl.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(outDir, 'v1-04-kompetencje.png') });
    console.log('Saved v1-04-kompetencje.png');
  }

  // 5. Team with Jakub Gral on neon
  const teamEl = await page.$('#zespol');
  if (teamEl) {
    await teamEl.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(outDir, 'v1-05-zespol.png') });
    console.log('Saved v1-05-zespol.png');
  }

  // 6. Footer static
  const footerEl = await page.$('.site-footer');
  if (footerEl) {
    await footerEl.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(outDir, 'v1-06-footer.png') });
    console.log('Saved v1-06-footer.png');
  }

  await browser.close();
  console.log('Verification screenshots captured successfully.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
