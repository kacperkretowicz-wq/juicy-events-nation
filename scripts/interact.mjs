// Test interakcji: kursor kontekstowy, showreel z kadru hero, mega menu,
// walidacja formularza, strzałki galerii poziomej, pułapka fokusu.
import { chromium } from "playwright";
const OUT = "C:/Users/Zdalny/AppData/Local/Temp/claude/shots";
const b = await chromium.launch();
const page = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs = [];
page.on("pageerror", (e) => errs.push("PAGEERROR " + e.message));
page.on("console", (m) => m.type() === "error" && errs.push("CONSOLE " + m.text()));
const log = (...a) => console.log(...a);

await page.goto("http://localhost:5174/", { waitUntil: "load" });
await page.waitForTimeout(1500);

// 1. Kursor kontekstowy nad kadrem hero
await page.mouse.move(700, 500);
await page.waitForTimeout(500);
let cur = await page.evaluate(() => {
  const c = document.querySelector(".cursor");
  return c && {
    
    active: c.classList.contains("is-active"),
    label: c.querySelector(".cursor__label").textContent,
    icon: c.dataset.icon,
  };
});
log("1) kursor nad hero:", JSON.stringify(cur));
await page.screenshot({ path: `${OUT}/fx-cursor-hero.png` });

// 2. Klik w kadr hero otwiera showreel
await page.mouse.click(700, 500);
await page.waitForTimeout(900);
let reel = await page.evaluate(() => {
  const s = document.getElementById("showreel");
  return {
    open: s.classList.contains("is-open"),
    inert: s.hasAttribute("inert"),
    dots: s.querySelectorAll("[data-showreel-dots] button").length,
    videoSrc: !!s.querySelector("figure.is-active video")?.src,
    focus: document.activeElement?.className,
  };
});
log("2) showreel po kliknieciu hero:", JSON.stringify(reel));
await page.screenshot({ path: `${OUT}/fx-showreel.png` });

// 3. Esc zamyka i przywraca fokus
await page.keyboard.press("Escape");
await page.waitForTimeout(500);
log("3) po Esc:", JSON.stringify(await page.evaluate(() => ({
  open: document.getElementById("showreel").classList.contains("is-open"),
  inert: document.getElementById("showreel").hasAttribute("inert"),
}))));

// 4. Zamknięte warstwy nie łapią Taba
const tabbable = await page.evaluate(() => {
  const inLayer = [...document.querySelectorAll("#mega-menu a, #showreel button")];
  return inLayer.filter((el) => !el.closest("[inert]")).length;
});
log("4) fokusowalnych w zamknietych warstwach:", tabbable);

// 5. Walidacja formularza
await page.evaluate(() => document.querySelector("#kontakt").scrollIntoView());
await page.waitForTimeout(800);
await page.fill('input[name="email"]', "zle-maile");
await page.click('.contact-form button[type="submit"]');
await page.waitForTimeout(400);
const form = await page.evaluate(() => ({
  errors: [...document.querySelectorAll(".field.has-error [data-field-error]")].map((e) => e.textContent),
  status: document.querySelector("[data-form-status]").textContent,
  focused: document.activeElement?.getAttribute("name"),
}));
log("5) walidacja:", JSON.stringify(form));
await page.screenshot({ path: `${OUT}/fx-form-errors.png` });

// 6. Strzałki galerii poziomej
await page.evaluate(() => document.querySelector(".standard").scrollIntoView());
await page.waitForTimeout(700);
const before = await page.evaluate(() => document.querySelector("[data-standard-viewport]").scrollLeft);
await page.click("[data-standard-next]");
await page.waitForTimeout(900);
const after = await page.evaluate(() => ({
  left: document.querySelector("[data-standard-viewport]").scrollLeft,
  prevDisabled: document.querySelector("[data-standard-prev]").disabled,
  progressW: getComputedStyle(document.querySelector("[data-standard-progress]")).getPropertyValue("--track-progress"),
}));
log(`6) galeria: scrollLeft ${before} -> ${after.left}, prev wylaczony: ${after.prevDisabled}, pasek: ${after.progressW}`);
await page.screenshot({ path: `${OUT}/fx-standard.png` });

// 7. Mega menu (mobile)
await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(600);
await page.evaluate(() => window.__jen.lenis.scrollTo(2000, { immediate: true }));
await page.waitForTimeout(400);
await page.click("[data-menu-open]");
await page.waitForTimeout(900);
log("7) menu:", JSON.stringify(await page.evaluate(() => ({
  open: document.getElementById("mega-menu").classList.contains("is-open"),
  burgerExpanded: document.querySelector("[data-menu-open]").getAttribute("aria-expanded"),
  focus: document.activeElement?.className,
}))));
await page.screenshot({ path: `${OUT}/fx-menu.png` });

log(errs.length ? "BLEDY: " + [...new Set(errs)].join(" | ") : "Brak bledow konsoli.");
await b.close();
