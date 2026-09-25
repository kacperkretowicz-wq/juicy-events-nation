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
  ["albert-sans", "Albert Sans", '"Albert Sans", sans-serif'],
  ["cabin", "Cabin", '"Cabin", sans-serif'],
  ["kumbh-sans", "Kumbh Sans", '"Kumbh Sans", sans-serif'],
  ["lexend", "Lexend", '"Lexend", sans-serif'],
  ["mulish", "Mulish", '"Mulish", sans-serif'],
  ["oxanium", "Oxanium", '"Oxanium", sans-serif'],
  ["raleway", "Raleway", '"Raleway", sans-serif'],
  ["red-hat-display", "Red Hat Display", '"Red Hat Display", sans-serif'],
  ["spectral", "Spectral", '"Spectral", serif'],
  ["titillium-web", "Titillium Web", '"Titillium Web", sans-serif'],
  ["work-sans", "Work Sans", '"Work Sans", sans-serif'],
  ["young-serif", "Young Serif", '"Young Serif", serif'],
  ["zilla-slab", "Zilla Slab", '"Zilla Slab", serif'],
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
  "family=Albert+Sans:wght@400;500;600;700;800",
  "family=Cabin:wght@400;500;600;700",
  "family=Kumbh+Sans:wght@400;500;600;700",
  "family=Lexend:wght@400;500;600;700",
  "family=Mulish:wght@400;500;600;700;800",
  "family=Oxanium:wght@400;500;600;700;800",
  "family=Raleway:wght@400;500;600;700;800",
  "family=Red+Hat+Display:wght@400;500;600;700;800",
  "family=Spectral:ital,wght@0,400;0,500;0,600;0,700;1,500;1,600",
  "family=Titillium+Web:wght@400;600;700",
  "family=Work+Sans:wght@400;500;600;700;800",
  "family=Young+Serif",
  "family=Zilla+Slab:wght@400;500;600;700",
].join("&") + "&display=swap";

export function initPaletteLab() {
  const params = new URLSearchParams(window.location.search);
  const isLocalPreview = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  if (!params.has("palette-lab") && !isLocalPreview) return;

  const root = document.documentElement;
  const validFonts = new Set(FONTS.map(([key]) => key));
  const initialFont = validFonts.has(params.get("font")) ? params.get("font") : FONTS[0][0];

  root.dataset.paletteLab = "";
  root.dataset.fontChoice = initialFont;

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

  const syncPressed = (value) => {
    document.querySelectorAll("[data-font-choice]").forEach((item) => {
      item.setAttribute("aria-pressed", String(item.dataset.fontChoice === value));
    });
  };

  const syncFontLinks = () => {
    document.querySelectorAll("[data-font-choice]").forEach((item) => {
      const next = new URL(window.location.href);
      next.searchParams.set("palette-lab", "1");
      next.searchParams.delete("palette");
      next.searchParams.delete("bg-effect");
      next.searchParams.set("font", item.dataset.fontChoice);
      item.setAttribute("href", next.pathname + next.search + next.hash);
    });
  };

  const selectFont = (key) => {
    if (!validFonts.has(key)) return;
    applyFont(key);
    syncPressed(key);
    const next = new URL(window.location.href);
    next.searchParams.set("palette-lab", "1");
    next.searchParams.delete("palette");
    next.searchParams.delete("bg-effect");
    next.searchParams.set("font", key);
    window.history.replaceState(null, "", next);
    syncFontLinks();
  };

  syncFontLinks();
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
}
