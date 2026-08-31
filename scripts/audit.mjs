// Audyt strony: przepełnienia poziome, kontrast tekstu, cele dotykowe,
// fokusowalne elementy w zamkniętych warstwach, brakujące atrybuty.
//   node scripts/audit.mjs [--w 1440,1024,390] [--url http://localhost:5174/]
import { chromium } from "playwright";

const argv = process.argv.slice(2);
const arg = (n, d) => {
  const i = argv.indexOf(`--${n}`);
  return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[i + 1] : d;
};

const WIDTHS = arg("w", "1440,1024,390").split(",").map(Number);
const URL = arg("url", "http://localhost:5174/");

const browser = await chromium.launch();

for (const width of WIDTHS) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));

  await page.goto(URL, { waitUntil: "load" });
  await page.waitForTimeout(1500);

  // Przewiń całą stronę, żeby odpalić leniwe efekty i triggery.
  await page.evaluate(async () => {
    const total = document.body.scrollHeight;
    for (let y = 0; y < total; y += window.innerHeight * 0.8) {
      if (window.__jen?.lenis) window.__jen.lenis.scrollTo(y, { immediate: true });
      else window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.__jen?.lenis?.scrollTo(0, { immediate: true });
    await new Promise((r) => setTimeout(r, 250));
  });

  const report = await page.evaluate(() => {
    const out = { overflow: [], contrast: [], touch: [], focusInHidden: [], misc: [] };
    const name = (el) => `${el.tagName.toLowerCase()}.${(el.className || "").toString().trim().split(/\s+/)[0] || "-"}`;

    const docW = document.documentElement.clientWidth;
    document.querySelectorAll("body *").forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      if (getComputedStyle(el).position === "fixed") return;
      if (r.right <= docW + 2 && r.left >= -2) return;
      let p = el.parentElement;
      let clipped = false;
      while (p && p !== document.body) {
        const o = getComputedStyle(p).overflowX;
        if (o === "auto" || o === "scroll" || o === "hidden" || o === "clip") { clipped = true; break; }
        p = p.parentElement;
      }
      if (!clipped) out.overflow.push(`${name(el)} → ${Math.round(r.left)}…${Math.round(r.right)} (doc ${docW})`);
    });

    const lum = (c) => {
      const [r, g, b] = c.map((v) => { const s = v / 255; return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4); });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    const parse = (str) => {
      const m = str.match(/rgba?\(([^)]+)\)/);
      if (!m) return null;
      const p = m[1].split(/[\s,\/]+/).filter(Boolean).map(Number);
      return { rgb: p.slice(0, 3), a: p.length > 3 ? p[3] : 1 };
    };
    const bgOf = (el) => {
      let node = el;
      while (node && node !== document.documentElement) {
        const c = parse(getComputedStyle(node).backgroundColor);
        if (c && c.a > 0.85) return c.rgb;
        node = node.parentElement;
      }
      return [255, 255, 255];
    };

    document.querySelectorAll("p, a, h1, h2, h3, li, button, label, span").forEach((el) => {
      const text = el.textContent.trim();
      if (!text) return;
      if ([...el.children].some((c) => c.textContent.trim())) return;
      const cs = getComputedStyle(el);
      if (cs.visibility === "hidden" || cs.display === "none") return;
      let node = el, faded = false;
      while (node && node !== document.body) {
        if (parseFloat(getComputedStyle(node).opacity) < 0.75) { faded = true; break; }
        node = node.parentElement;
      }
      if (faded) return;
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      const fg = parse(cs.color);
      if (!fg) return;
      const bg = bgOf(el);
      const mixed = fg.rgb.map((v, i) => v * fg.a + bg[i] * (1 - fg.a));
      const l1 = lum(mixed), l2 = lum(bg);
      const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
      const size = parseFloat(cs.fontSize);
      const large = size >= 24 || (size >= 18.66 && Number(cs.fontWeight) >= 700);
      const min = large ? 3 : 4.5;
      if (ratio < min) out.contrast.push(`${name(el)} ${ratio.toFixed(2)}:1 (min ${min}) "${text.slice(0, 34)}"`);
    });

    document.querySelectorAll("a[href], button, input, select, textarea").forEach((el) => {
      const cs = getComputedStyle(el);
      if (cs.display === "none" || cs.visibility === "hidden") return;
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      if (el.closest("[inert]")) return;
      if (el.tagName === "A" && el.closest("p")) return;
      if (r.height < 32 || r.width < 32) {
        const label = (el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 24);
        out.touch.push(`${name(el)} ${Math.round(r.width)}x${Math.round(r.height)} "${label}"`);
      }
    });

    document.querySelectorAll('[aria-hidden="true"]').forEach((layer) => {
      const f = layer.querySelectorAll('a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (f.length && !layer.hasAttribute("inert")) out.focusInHidden.push(`${layer.id || name(layer)} → ${f.length} fokusowalnych bez inert`);
    });

    document.querySelectorAll("img").forEach((img) => {
      if (!img.hasAttribute("alt")) out.misc.push(`img bez alt: ${img.getAttribute("src")}`);
      if (!img.getAttribute("width") || !img.getAttribute("height")) out.misc.push(`img bez width/height: ${img.getAttribute("src")}`);
    });
    const h1 = document.querySelectorAll("h1");
    if (h1.length !== 1) out.misc.push(`liczba <h1>: ${h1.length}`);
    return out;
  });

  console.log(`\n===== ${width}px =====`);
  if (errors.length) console.log("BLEDY JS:", [...new Set(errors)].join(" | "));
  for (const [key, list] of Object.entries(report)) {
    const uniq = [...new Set(list)];
    console.log(`\n[${key}] ${uniq.length}`);
    uniq.slice(0, 60).forEach((l) => console.log("  -", l));
    if (uniq.length > 60) console.log(`  ... +${uniq.length - 60}`);
  }
  await page.close();
}

await browser.close();
