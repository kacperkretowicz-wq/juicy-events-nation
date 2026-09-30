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

const COLOR_PRESETS = {
  "paper-orange": { bg: "#f4f2ec", surface: "#ffffff", text: "#17130f", accent: "#f4511e", bottom: "#e33a1b", lemon: "#f1ff66", blue: "#3b5bff" },
  "paper-tomato": { bg: "#f7f0e7", surface: "#ffffff", text: "#17130f", accent: "#f13a1b", bottom: "#d72612", lemon: "#f1ff66", blue: "#3455e8" },
  sunshine: { bg: "#fff15a", surface: "#fff8d9", text: "#17130a", accent: "#f45b1a", bottom: "#d92316", lemon: "#f8e94e", blue: "#2846d8" },
  "cream-carrot": { bg: "#f4ead1", surface: "#fff8e8", text: "#182016", accent: "#ff5a1a", bottom: "#d93a14", lemon: "#f0eb43", blue: "#3156d8" },
  "forest-kiwi": { bg: "#185b2d", surface: "#e9f2d0", text: "#f7f2d8", accent: "#a8cc00", bottom: "#e83a1a", lemon: "#c8e52a", blue: "#5f8cff" },
  "red-cream": { bg: "#e6291d", surface: "#fff4e4", text: "#fff4e4", accent: "#f8e94e", bottom: "#b81c15", lemon: "#f8e94e", blue: "#3156d8" },
  "cobalt-paper": { bg: "#2748d8", surface: "#f7f5ee", text: "#f7f5ee", accent: "#f05a22", bottom: "#d92d20", lemon: "#f3e83d", blue: "#2748d8" },
  "cobalt-cream": { bg: "#3145ce", surface: "#fff8e8", text: "#fff8e8", accent: "#ff6a20", bottom: "#c92525", lemon: "#f3e83d", blue: "#3145ce" },
  "violet-cream": { bg: "#6426b8", surface: "#fff4e4", text: "#fff4e4", accent: "#ff5a1a", bottom: "#e3291d", lemon: "#f3e83d", blue: "#6b5bff" },
  "aqua-tomato": { bg: "#21b9b6", surface: "#f7f2e8", text: "#0c2830", accent: "#ee4726", bottom: "#bf2718", lemon: "#f7e945", blue: "#1266d8" },
  "pink-orange": { bg: "#e84488", surface: "#fff1e8", text: "#fff1e8", accent: "#ff6a18", bottom: "#c8264f", lemon: "#f3e83d", blue: "#5144d8" },
  "black-sun": { bg: "#111111", surface: "#f9f4e8", text: "#f9f4e8", accent: "#f3e83d", bottom: "#ef4a1f", lemon: "#f3e83d", blue: "#3b5bff" },
};

const COLOR_KEYS = ["bg", "surface", "text", "accent", "bottom"];
const COLOR_PARAM = { bg: "color-bg", surface: "color-surface", text: "color-text", accent: "color-accent", bottom: "color-bottom" };

const GOOGLE_FONT_CSS = "https://fonts.googleapis.com/css2?" + [
  "family=Anton", "family=Archivo:wght@400;500;600;700;800", "family=Archivo+Black", "family=Bebas+Neue",
  "family=Bricolage+Grotesque:opsz,wdth,wght@10..48,75..100,200..800", "family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,500;1,600",
  "family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700", "family=DM+Serif+Display", "family=Epilogue:wght@400;500;600;700;800",
  "family=Figtree:wght@400;500;600;700;800", "family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700",
  "family=IBM+Plex+Mono:wght@400;500;600", "family=IBM+Plex+Sans:wght@400;500;600;700", "family=Instrument+Sans:wdth,wght@75..100,400;75..100,500;75..100,600;75..100,700",
  "family=Manrope:wght@400;500;600;700;800", "family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600;6..72,700",
  "family=Outfit:wght@400;500;600;700;800", "family=Playfair+Display:opsz,wght@5..1200,400;5..1200,500;5..1200,600;5..1200,700",
  "family=Plus+Jakarta+Sans:wght@400;500;600;700;800", "family=Sora:wght@400;500;600;700;800", "family=Space+Grotesk:wght@400;500;600;700",
  "family=Space+Mono:wght@400;700", "family=Syne:wght@400;500;600;700;800", "family=Unbounded:wght@400;500;600;700", "family=Urbanist:wght@400;500;600;700;800",
  "family=Albert+Sans:wght@400;500;600;700;800", "family=Cabin:wght@400;500;600;700", "family=Kumbh+Sans:wght@400;500;600;700", "family=Lexend:wght@400;500;600;700",
  "family=Mulish:wght@400;500;600;700;800", "family=Oxanium:wght@400;500;600;700;800", "family=Raleway:wght@400;500;600;700;800", "family=Red+Hat+Display:wght@400;500;600;700;800",
  "family=Spectral:ital,wght@0,400;0,500;0,600;0,700;1,500;1,600", "family=Titillium+Web:wght@400;600;700", "family=Work+Sans:wght@400;500;600;700;800", "family=Young+Serif", "family=Zilla+Slab:wght@400;500;600;700",
].join("&") + "&display=swap";

const isHex = (value) => /^#[0-9a-f]{6}$/i.test(value ?? "");

export function initPaletteLab() {
  const params = new URLSearchParams(window.location.search);
  const isLocalPreview = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  if (!params.has("palette-lab")) return;

  const root = document.documentElement;
  const validFonts = new Set(FONTS.map(([key]) => key));
  const initialFont = validFonts.has(params.get("font")) ? params.get("font") : FONTS[0][0];
  const initialPreset = COLOR_PRESETS[params.get("preset")] ? params.get("preset") : "paper-orange";
  const colors = { ...COLOR_PRESETS[initialPreset] };
  COLOR_KEYS.forEach((key) => {
    const value = params.get(COLOR_PARAM[key]);
    if (isHex(value)) colors[key] = value.toLowerCase();
  });
  let activePreset = initialPreset;
  const panel = document.querySelector(".palette-lab");
  const panelToggle = panel?.querySelector("[data-palette-toggle]") ?? null;
  let panelCollapsed = params.get("panel") === "closed";
  if (!params.has("panel")) {
    try {
      panelCollapsed = window.localStorage.getItem("juicy-palette-panel") === "closed";
    } catch {
      panelCollapsed = false;
    }
  }

  root.dataset.paletteLab = "";
  root.dataset.fontChoice = initialFont;
  root.dataset.colorPreset = activePreset;

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

  const applyColors = () => {
    root.style.setProperty("--page-bg", colors.bg);
    root.style.setProperty("--cream", colors.surface);
    root.style.setProperty("--cream-deep", colors.surface);
    root.style.setProperty("--page-fg", colors.text);
    root.style.setProperty("--ink", colors.text);
    root.style.setProperty("--dark", colors.text);
    root.style.setProperty("--dark-soft", colors.text);
    root.style.setProperty("--accent", colors.accent);
    root.style.setProperty("--accent-deep", colors.bottom);
    root.style.setProperty("--footer-accent", colors.bottom);
    root.style.setProperty("--accent-text", colors.accent);
    root.style.setProperty("--accent-soft", colors.accent);
    root.style.setProperty("--accent-warm", colors.accent);
    root.style.setProperty("--lemon", colors.lemon || colors.accent);
    root.style.setProperty("--blue", colors.blue || colors.accent);
  };

  const syncPressed = (value) => document.querySelectorAll("[data-font-choice]").forEach((item) => {
    item.setAttribute("aria-pressed", String(item.dataset.fontChoice === value));
  });

  const syncColorInputs = () => document.querySelectorAll("[data-color-input]").forEach((input) => {
    if (colors[input.dataset.colorInput]) input.value = colors[input.dataset.colorInput];
  });

  const syncPresetPressed = () => document.querySelectorAll("[data-color-preset]").forEach((item) => {
    item.setAttribute("aria-pressed", String(item.dataset.colorPreset === activePreset));
  });

  const syncPanelToggle = () => {
    if (!panel) return;
    panel.classList.toggle("is-collapsed", panelCollapsed);
    panelToggle?.setAttribute("aria-expanded", String(!panelCollapsed));
    const label = panelToggle?.querySelector("[data-palette-toggle-label]");
    const icon = panelToggle?.querySelector("[data-palette-toggle-icon]");
    if (label) label.textContent = panelCollapsed ? "Pokaż panel" : "Zwiń panel";
    if (icon) icon.textContent = panelCollapsed ? "+" : "−";
  };

  const syncLinks = () => {
    document.querySelectorAll("[data-font-choice], [data-color-preset]").forEach((item) => {
      const next = new URL(window.location.href);
      next.searchParams.set("palette-lab", "1");
      next.searchParams.set("panel", panelCollapsed ? "closed" : "open");
      next.searchParams.delete("palette");
      next.searchParams.delete("bg-effect");
      if (item.dataset.fontChoice) next.searchParams.set("font", item.dataset.fontChoice);
      if (item.dataset.colorPreset) {
        next.searchParams.set("font", root.dataset.fontChoice);
        next.searchParams.set("preset", item.dataset.colorPreset);
        COLOR_KEYS.forEach((key) => next.searchParams.delete(COLOR_PARAM[key]));
      }
      item.setAttribute("href", next.pathname + next.search + next.hash);
    });
  };

  const updateUrl = () => {
    const next = new URL(window.location.href);
    next.searchParams.set("palette-lab", "1");
    next.searchParams.set("font", root.dataset.fontChoice);
    next.searchParams.set("preset", activePreset);
    COLOR_KEYS.forEach((key) => next.searchParams.set(COLOR_PARAM[key], colors[key]));
    window.history.replaceState(null, "", next);
  };

  const selectFont = (key) => {
    if (!validFonts.has(key)) return;
    applyFont(key);
    syncPressed(key);
    const next = new URL(window.location.href);
    next.searchParams.set("palette-lab", "1");
    next.searchParams.set("font", key);
    window.history.replaceState(null, "", next);
    syncLinks();
  };

  const selectPreset = (key) => {
    const preset = COLOR_PRESETS[key];
    if (!preset) return;
    Object.assign(colors, preset);
    activePreset = key;
    root.dataset.colorPreset = key;
    applyColors();
    syncColorInputs();
    syncPresetPressed();
    const next = new URL(window.location.href);
    next.searchParams.set("palette-lab", "1");
    next.searchParams.set("font", root.dataset.fontChoice);
    next.searchParams.set("preset", key);
    COLOR_KEYS.forEach((colorKey) => next.searchParams.delete(COLOR_PARAM[colorKey]));
    window.history.replaceState(null, "", next);
    syncLinks();
  };

  const selectColor = (key, value) => {
    if (!COLOR_KEYS.includes(key) || !isHex(value)) return;
    colors[key] = value.toLowerCase();
    activePreset = "custom";
    root.dataset.colorPreset = activePreset;
    applyColors();
    syncPresetPressed();
    updateUrl();
    syncLinks();
  };

  applyFont(initialFont);
  applyColors();
  syncPanelToggle();
  syncColorInputs();
  syncPressed(initialFont);
  syncPresetPressed();
  syncLinks();

  document.querySelectorAll("[data-font-choice]").forEach((button) => {
    const font = FONTS.find(([fontKey]) => fontKey === button.dataset.fontChoice);
    if (font) button.style.fontFamily = font[2];
  });

  panelToggle?.addEventListener("click", () => {
    panelCollapsed = !panelCollapsed;
    syncPanelToggle();
    try {
      window.localStorage.setItem("juicy-palette-panel", panelCollapsed ? "closed" : "open");
    } catch {
      // Private browsing may disable localStorage; the current state still works.
    }
    const next = new URL(window.location.href);
    next.searchParams.set("palette-lab", "1");
    next.searchParams.set("panel", panelCollapsed ? "closed" : "open");
    window.history.replaceState(null, "", next);
    syncLinks();
  });

  document.addEventListener("click", (event) => {
    const fontButton = event.target?.closest?.("[data-font-choice]") ?? null;
    const colorPreset = event.target?.closest?.("[data-color-preset]") ?? null;
    const reset = event.target?.closest?.("[data-colors-reset]") ?? null;
    if (fontButton) {
      event.preventDefault();
      selectFont(fontButton.dataset.fontChoice);
    } else if (colorPreset) {
      event.preventDefault();
      selectPreset(colorPreset.dataset.colorPreset);
    } else if (reset) {
      event.preventDefault();
      selectPreset(activePreset === "custom" ? initialPreset : activePreset);
    }
  }, true);

  document.addEventListener("input", (event) => {
    const input = event.target?.closest?.("[data-color-input]") ?? null;
    if (input) selectColor(input.dataset.colorInput, input.value);
  }, true);
}
