const PALETTES = [
  ["warm", "Ciepły papier"],
  ["plum", "Kość + śliwka"],
  ["sage", "Szałwia + koral"],
  ["cobalt", "Biel + kobalt"],
  ["coral", "Biel + koral"],
  ["ultramarine", "Biel + ultramaryna"],
  ["aqua", "Biel + aqua"],
  ["violet", "Biel + fiolet"],
  ["navy", "Granatowe płótno"],
  ["terracotta", "Ceglane płótno"],
  ["plum-deep", "Głęboka śliwka"],
  ["petrol", "Petrolowe płótno"],
  ["violet-deep", "Fioletowe płótno"],
  ["electric-blue", "Elektryczny błękit"],
  ["tomato", "Pomidorowa czerwień"],
  ["fuchsia", "Fuksja"],
  ["ultraviolet", "Ultrafiolet"],
  ["aqua-pop", "Aqua pop"],
  ["orange-pop", "Pomarańczowy"],
  ["acid-lime", "Acid limonka"],
  ["black-neon", "Czerń + neon"],
  ["ultra-red", "Ultra czerwień"],
  ["royal-blue", "Royal blue"],
  ["signal-orange", "Signal orange"],
  ["pink-lava", "Pink lava"],
  ["violet-cyan", "Fiolet + cyan"],
  ["acid-turquoise", "Acid turkus"],
  ["lime-punch", "Lime punch"],
  ["sun-yellow", "Sun yellow"],
  ["deep-teal", "Deep teal"],
  ["neon-coral", "Neon coral"],
];

const EFFECTS = [
  ["calm", "Spokojny"],
  ["zipper", "Zamek"],
  ["blob", "Bouncy blob"],
  ["wave", "Fala"],
  ["sweep", "Sweep"],
];

const FONTS = [
  ["pp-mori", "PP Mori", '"PP Mori", "Helvetica Neue", Arial, sans-serif'],
  ["space-grotesk", "Space Grotesk", '"Space Grotesk", sans-serif'],
  ["instrument-sans", "Instrument Sans", '"Instrument Sans", sans-serif'],
  ["dm-sans", "DM Sans", '"DM Sans", sans-serif'],
  ["plus-jakarta", "Plus Jakarta Sans", '"Plus Jakarta Sans", sans-serif'],
  ["outfit", "Outfit", '"Outfit", sans-serif'],
  ["manrope", "Manrope", '"Manrope", sans-serif'],
  ["sora", "Sora", '"Sora", sans-serif'],
  ["bricolage", "Bricolage Grotesque", '"Bricolage Grotesque", sans-serif'],
  ["archivo", "Archivo", '"Archivo", sans-serif'],
  ["figtree", "Figtree", '"Figtree", sans-serif'],
  ["urbanist", "Urbanist", '"Urbanist", sans-serif'],
  ["epilogue", "Epilogue", '"Epilogue", sans-serif'],
  ["syne", "Syne", '"Syne", sans-serif'],
  ["unbounded", "Unbounded", '"Unbounded", sans-serif'],
  ["ibm-plex-sans", "IBM Plex Sans", '"IBM Plex Sans", sans-serif'],
  ["archivo-black", "Archivo Black", '"Archivo Black", sans-serif'],
  ["anton", "Anton", '"Anton", sans-serif'],
  ["bebas-neue", "Bebas Neue", '"Bebas Neue", sans-serif'],
  ["fraunces", "Fraunces", '"Fraunces", serif'],
  ["dm-serif", "DM Serif Display", '"DM Serif Display", serif'],
  ["cormorant", "Cormorant Garamond", '"Cormorant Garamond", serif'],
  ["playfair", "Playfair Display", '"Playfair Display", serif'],
  ["newsreader", "Newsreader", '"Newsreader", serif'],
  ["space-mono", "Space Mono", '"Space Mono", monospace'],
  ["ibm-plex-mono", "IBM Plex Mono", '"IBM Plex Mono", monospace'],
];

const GOOGLE_FONT_CSS = "https://fonts.googleapis.com/css2?" + [
  "family=Anton",
  "family=Archivo:wght@400;500;600;700;800",
  "family=Archivo+Black",
  "family=Bebas+Neue",
  "family=Bricolage+Grotesque:opsz,wdth,wght@10..48,75..100,200..800",
  "family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,500;1,600",
  "family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700",
  "family=DM+Serif+Display",
  "family=Epilogue:wght@400;500;600;700;800",
  "family=Figtree:wght@400;500;600;700;800",
  "family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700",
  "family=IBM+Plex+Mono:wght@400;500;600",
  "family=IBM+Plex+Sans:wght@400;500;600;700",
  "family=Instrument+Sans:wdth,wght@75..100,400;75..100,500;75..100,600;75..100,700",
  "family=Manrope:wght@400;500;600;700;800",
  "family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600;6..72,700",
  "family=Outfit:wght@400;500;600;700;800",
  "family=Playfair+Display:opsz,wght@5..1200,400;5..1200,500;5..1200,600;5..1200,700",
  "family=Plus+Jakarta+Sans:wght@400;500;600;700;800",
  "family=Roboto+Mono:wght@400;500",
  "family=Sora:wght@400;500;600;700;800",
  "family=Space+Grotesk:wght@400;500;600;700",
  "family=Space+Mono:wght@400;700",
  "family=Syne:wght@400;500;600;700;800",
  "family=Unbounded:wght@400;500;600;700",
  "family=Urbanist:wght@400;500;600;700;800",
].join("&") + "&display=swap";

export function initPaletteLab() {
  const params = new URLSearchParams(window.location.search);
  const isLocalPreview = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  if (!params.has("palette-lab") && !isLocalPreview) return;

  const root = document.documentElement;
  const valid = new Set(PALETTES.map(([key]) => key));
  const validEffects = new Set(EFFECTS.map(([key]) => key));
  const validFonts = new Set(FONTS.map(([key]) => key));
  const initial = valid.has(params.get("palette")) ? params.get("palette") : PALETTES[0][0];
  const initialEffect = validEffects.has(params.get("bg-effect")) ? params.get("bg-effect") : EFFECTS[0][0];
  const initialFont = validFonts.has(params.get("font")) ? params.get("font") : FONTS[0][0];

  root.dataset.paletteLab = "";
  root.dataset.palette = initial;
  root.dataset.bgEffect = initialEffect;
  root.dataset.fontChoice = initialFont;
  root.style.setProperty("--bg-progress", "0");
  root.style.setProperty("--bg-wave", "0");

  if (!document.querySelector("link[data-palette-fonts]")) {
    const fontLink = document.createElement("link");
    fontLink.rel = "stylesheet";
    fontLink.href = GOOGLE_FONT_CSS;
    fontLink.dataset.paletteFonts = "";
    document.head.append(fontLink);
  }

  const applyFont = (key) => {
    const font = FONTS.find(([fontKey]) => fontKey === key);
    if (!font) return;
    const [, , stack] = font;
    root.dataset.fontChoice = key;
    root.style.setProperty("--font", stack);
    root.style.setProperty("--font-display", stack);
    root.style.setProperty("--font-accent", stack);
    root.style.setProperty("--font-label", stack);
  };

  applyFont(initialFont);

  const syncPressed = (selector, dataKey, value) => {
    document.querySelectorAll(selector).forEach((item) => {
      item.setAttribute("aria-pressed", String(item.dataset[dataKey] === value));
    });
  };

  const syncEffectLinks = (palette) => {
    document.querySelectorAll("[data-bg-effect]").forEach((item) => {
      const next = new URL(window.location.href);
      next.searchParams.set("palette-lab", "1");
      next.searchParams.set("palette", palette);
      next.searchParams.set("bg-effect", item.dataset.bgEffect);
      next.searchParams.set("font", root.dataset.fontChoice || initialFont);
      item.setAttribute("href", next.pathname + next.search + next.hash);
    });
  };

  const syncFontLinks = () => {
    document.querySelectorAll("[data-font-choice]").forEach((item) => {
      const next = new URL(window.location.href);
      next.searchParams.set("palette-lab", "1");
      next.searchParams.set("palette", root.dataset.palette || initial);
      next.searchParams.set("bg-effect", root.dataset.bgEffect || initialEffect);
      next.searchParams.set("font", item.dataset.fontChoice);
      item.setAttribute("href", next.pathname + next.search + next.hash);
    });
  };

  syncEffectLinks(initial);
  syncFontLinks();

  document.querySelectorAll("[data-palette-choice]").forEach((button) => {
    const key = button.dataset.paletteChoice;
    button.setAttribute("aria-pressed", String(key === initial));
    button.addEventListener("click", () => {
      if (!valid.has(key)) return;
      root.dataset.palette = key;
      syncPressed("[data-palette-choice]", "paletteChoice", key);
      syncEffectLinks(key);
      const next = new URL(window.location.href);
      next.searchParams.set("palette-lab", "1");
      next.searchParams.set("palette", key);
      next.searchParams.set("font", root.dataset.fontChoice || initialFont);
      window.history.replaceState(null, "", next);
      syncFontLinks();
    });
  });

  const selectEffect = (key) => {
    if (!validEffects.has(key)) return;
    root.dataset.bgEffect = key;
    syncPressed("[data-bg-effect]", "bgEffect", key);
    const next = new URL(window.location.href);
    next.searchParams.set("palette-lab", "1");
    next.searchParams.set("bg-effect", key);
    if (valid.has(root.dataset.palette)) next.searchParams.set("palette", root.dataset.palette);
    next.searchParams.set("font", root.dataset.fontChoice || initialFont);
    window.history.replaceState(null, "", next);
    syncFontLinks();
  };

  document.querySelectorAll("[data-bg-effect]").forEach((button) => {
    const key = button.dataset.bgEffect;
    button.setAttribute("aria-pressed", String(key === initialEffect));
    button.onclick = () => selectEffect(key);
  });

  document.addEventListener("click", (event) => {
    const button = event.target?.closest?.("[data-bg-effect]") ?? null;
    if (button) selectEffect(button.dataset.bgEffect);
  }, true);

  const selectFont = (key) => {
    if (!validFonts.has(key)) return;
    applyFont(key);
    syncPressed("[data-font-choice]", "fontChoice", key);
    const next = new URL(window.location.href);
    next.searchParams.set("palette-lab", "1");
    next.searchParams.set("font", key);
    if (valid.has(root.dataset.palette)) next.searchParams.set("palette", root.dataset.palette);
    if (validEffects.has(root.dataset.bgEffect)) next.searchParams.set("bg-effect", root.dataset.bgEffect);
    window.history.replaceState(null, "", next);
    syncEffectLinks(root.dataset.palette);
    syncFontLinks();
  };

  document.querySelectorAll("[data-font-choice]").forEach((button) => {
    const key = button.dataset.fontChoice;
    const font = FONTS.find(([fontKey]) => fontKey === key);
    if (font) button.style.fontFamily = font[2];
    button.setAttribute("aria-pressed", String(key === initialFont));
    button.addEventListener("click", () => selectFont(key));
  });

  document.addEventListener("click", (event) => {
    const button = event.target?.closest?.("[data-font-choice]") ?? null;
    if (button) selectFont(button.dataset.fontChoice);
  }, true);

  let frame = 0;
  const updateProgress = () => {
    frame = 0;
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const progress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
    root.style.setProperty("--bg-progress", progress.toFixed(4));
    root.style.setProperty("--bg-wave", Math.sin(progress * Math.PI * 2).toFixed(4));
  };
  const requestProgress = () => {
    if (frame) return;
    frame = window.requestAnimationFrame(updateProgress);
  };

  window.addEventListener("scroll", requestProgress, { passive: true });
  window.addEventListener("resize", requestProgress, { passive: true });
  window.addEventListener("load", requestProgress, { once: true });
  requestProgress();
}
