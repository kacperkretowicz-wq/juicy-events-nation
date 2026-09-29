const FONTS = [
  ["figtree", "Figtree", '"Figtree", "Helvetica Neue", Arial, sans-serif'],
  ["space-grotesk", "Space Grotesk", '"Space Grotesk", sans-serif'],
  ["instrument-sans", "Instrument Sans", '"Instrument Sans", sans-serif'],
  ["dm-sans", "DM Sans", '"DM Sans", sans-serif'],
  ["plus-jakarta", "Plus Jakarta Sans", '"Plus Jakarta Sans", sans-serif'],
  ["outfit", "Outfit", '"Outfit", sans-serif'],
  ["manrope", "Manrope", '"Manrope", sans-serif'],
  ["sora", "Sora", '"Sora", sans-serif'],
  ["bricolage", "Bricolage Grotesque", '"Bricolage Grotesque", sans-serif'],
  ["archivo", "Archivo", '"Archivo", sans-serif'],
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
  // Obecna paleta strony (Tolia: krem, pomidor, słońce) — domyślna po otwarciu panelu.
  tolia: {
    bg: "#f6efdf", surface: "#f6efdf", white: "#fffdf8", text: "#1c1712", muted: "#6d6456",
    accent: "#d52518", accentText: "#c81f14", accentDeep: "#b81d12", bottom: "#d52518", footer: "#d52518",
    lemon: "#ffc926", blue: "#2f4fd1", dark: "#1c1712", darkSoft: "#2b241d", inverseText: "#f6efdf", onAccent: "#fffdf8",
  },
  // Ten sam układ, ale ciemne sekcje w butelkowej zieleni zamiast czerni.
  "tolia-forest": {
    bg: "#f6efdf", surface: "#f6efdf", white: "#fffdf8", text: "#1c1712", muted: "#6d6456",
    accent: "#d52518", accentText: "#c81f14", accentDeep: "#b81d12", bottom: "#d52518", footer: "#d52518",
    lemon: "#ffc926", blue: "#2f4fd1", dark: "#18542a", darkSoft: "#1f6333", inverseText: "#f6efdf", onAccent: "#fffdf8",
  },
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

const COLOR_KEYS = [
  "bg", "surface", "surfaceAlt", "white", "text", "muted", "inverseText",
  "dark", "darkSoft", "accent", "accentText", "accentDeep", "footer",
  "lemon", "blue", "onAccent", "line",
];
const COLOR_PARAM = {
  bg: "color-bg",
  surface: "color-surface",
  surfaceAlt: "color-surface-alt",
  white: "color-white",
  text: "color-text",
  muted: "color-muted",
  inverseText: "color-inverse-text",
  dark: "color-dark",
  darkSoft: "color-dark-soft",
  accent: "color-accent",
  accentText: "color-accent-text",
  accentDeep: "color-accent-deep",
  footer: "color-footer",
  lemon: "color-lemon",
  blue: "color-blue",
  onAccent: "color-on-accent",
  line: "color-line",
};

const blendHex = (foreground, background, amount) => {
  const fg = Number.parseInt(foreground.slice(1), 16);
  const bg = Number.parseInt(background.slice(1), 16);
  const channel = (shift) => Math.round(
    ((fg >> shift) & 255) * (1 - amount) + ((bg >> shift) & 255) * amount,
  ).toString(16).padStart(2, "0");
  return `#${channel(16)}${channel(8)}${channel(0)}`;
};

const withAlpha = (hex, alpha) => {
  const value = Number.parseInt(hex.slice(1), 16);
  return `rgba(${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255}, ${alpha})`;
};

// Klucze podane wprost w presecie wygrywają z wyliczonymi (np. ciemny kolor sekcji).
const expandPreset = (preset) => ({
  surfaceAlt: blendHex(preset.surface, preset.bg, 0.12),
  white: preset.surface,
  muted: blendHex(preset.text, preset.bg, 0.28),
  inverseText: preset.surface,
  dark: "#17130f",
  darkSoft: "#29231f",
  accentText: preset.accent,
  accentDeep: preset.bottom,
  footer: preset.bottom,
  onAccent: preset.surface,
  line: preset.text,
  ...preset,
});

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

const hexToHsl = (hex) => {
  const [red, green, blue] = [1, 3, 5].map((index) => Number.parseInt(hex.slice(index, index + 2), 16) / 255);
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const difference = max - min;
  let hue = 0;
  let saturation = 0;
  const lightness = (max + min) / 2;
  if (difference) {
    saturation = difference / (1 - Math.abs(2 * lightness - 1));
    switch (max) {
      case red: hue = ((green - blue) / difference) % 6; break;
      case green: hue = (blue - red) / difference + 2; break;
      default: hue = (red - green) / difference + 4;
    }
    hue *= 60;
  }
  return [Math.round((hue + 360) % 360), Math.round(saturation * 100), Math.round(lightness * 100)];
};

const hslToHex = (hue, saturation, lightness) => {
  const s = saturation / 100;
  const l = lightness / 100;
  const amount = s * Math.min(l, 1 - l);
  const channel = (offset) => {
    const k = (offset + hue / 30) % 12;
    return Math.round(255 * (l - amount * Math.max(-1, Math.min(k - 3, 9 - k, 1)))).toString(16).padStart(2, "0");
  };
  return `#${channel(0)}${channel(8)}${channel(4)}`;
};

export function initPaletteLab() {
  const params = new URLSearchParams(window.location.search);
  const isLocalPreview = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  if (!params.has("palette-lab") && !isLocalPreview) return;

  const root = document.documentElement;
  const validFonts = new Set(FONTS.map(([key]) => key));
  const initialFont = validFonts.has(params.get("font")) ? params.get("font") : FONTS[0][0];
  const initialPreset = COLOR_PRESETS[params.get("preset")] ? params.get("preset") : "tolia";
  const colors = expandPreset(COLOR_PRESETS[initialPreset]);
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
    root.style.setProperty("--cream-deep", colors.surfaceAlt);
    root.style.setProperty("--white", colors.white);
    root.style.setProperty("--page-fg", colors.text);
    root.style.setProperty("--ink", colors.text);
    root.style.setProperty("--muted", colors.muted);
    root.style.setProperty("--muted-light", withAlpha(colors.inverseText, 0.68));
    root.style.setProperty("--on-dark-muted", withAlpha(colors.inverseText, 0.8));
    root.style.setProperty("--on-dark-line", withAlpha(colors.inverseText, 0.32));
    root.style.setProperty("--dark", colors.dark);
    root.style.setProperty("--dark-soft", colors.darkSoft);
    root.style.setProperty("--line", withAlpha(colors.line, 0.16));
    root.style.setProperty("--line-light", withAlpha(colors.inverseText, 0.22));
    root.style.setProperty("--accent", colors.accent);
    root.style.setProperty("--accent-deep", colors.accentDeep);
    root.style.setProperty("--footer-accent", colors.footer);
    root.style.setProperty("--accent-text", colors.accentText);
    root.style.setProperty("--accent-soft", colors.accent);
    root.style.setProperty("--accent-warm", colors.accent);
    root.style.setProperty("--on-accent", colors.onAccent);
    root.style.setProperty("--lemon", colors.lemon);
    root.style.setProperty("--blue", colors.blue);
  };

  const syncPressed = (value) => document.querySelectorAll("[data-font-choice]").forEach((item) => {
    item.setAttribute("aria-pressed", String(item.dataset.fontChoice === value));
  });

  const setSwatchColor = (button, value) => {
    if (!button || !isHex(value)) return;
    button.dataset.value = value.toLowerCase();
    button.style.setProperty("--swatch-color", value);
  };

  const syncColorInputs = () => document.querySelectorAll("[data-color-input]").forEach((button) => {
    if (colors[button.dataset.colorInput]) setSwatchColor(button, colors[button.dataset.colorInput]);
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
    Object.assign(colors, expandPreset(preset));
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
    syncColorInputs();
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

  document.querySelectorAll("[data-font-choice]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      selectFont(button.dataset.fontChoice);
    });
  });

  document.querySelectorAll("[data-color-preset]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      selectPreset(button.dataset.colorPreset);
    });
  });

  document.querySelector("[data-colors-reset]")?.addEventListener("click", (event) => {
    event.preventDefault();
    selectPreset(activePreset === "custom" ? initialPreset : activePreset);
  });

  const objectEditor = panel?.querySelector("[data-palette-object-controls]");
  const pickToggle = panel?.querySelector("[data-palette-pick-toggle]");
  const pickStatus = panel?.querySelector("[data-palette-pick-status]");
  const selectedLabel = panel?.querySelector("[data-palette-selected-label]");
  const OBJECT_STORAGE_KEY = "juicy-palette-object-colors";
  const OBJECT_PROPERTIES = ["backgroundColor", "color", "borderColor"];
  let pickingElement = false;
  let selectedElement = null;
  let selectedSelector = "";
  let objectEdits = {};
  let picker = null;

  try {
    const stored = JSON.parse(window.localStorage.getItem(OBJECT_STORAGE_KEY) || "{}");
    if (stored && typeof stored === "object" && !Array.isArray(stored)) objectEdits = stored;
  } catch {
    objectEdits = {};
  }

  const getSelector = (element) => {
    if (element === document.body) return "body";
    if (element.id) {
      const idSelector = `#${window.CSS.escape(element.id)}`;
      if (document.querySelectorAll(idSelector).length === 1) return idSelector;
    }
    const parts = [];
    let current = element;
    while (current && current !== document.body) {
      const tag = current.tagName.toLowerCase();
      let part = tag;
      if (current.parentElement) {
        const siblings = [...current.parentElement.children].filter((sibling) => sibling.tagName === current.tagName);
        if (siblings.length > 1) part += `:nth-of-type(${siblings.indexOf(current) + 1})`;
      }
      parts.unshift(part);
      const selector = `body > ${parts.join(" > ")}`;
      try {
        if (document.querySelectorAll(selector).length === 1) return selector;
      } catch {
        // Continue building the selector until it is valid and unique.
      }
      current = current.parentElement;
    }
    return `body > ${parts.join(" > ")}`;
  };

  const toHex = (value, fallback) => {
    const match = value.match(/[\d.]+/g);
    if (!match || match.length < 3) return fallback;
    return `#${match.slice(0, 3).map((channel) => Math.round(Number(channel)).toString(16).padStart(2, "0")).join("")}`;
  };

  const saveObjectEdits = () => {
    try {
      window.localStorage.setItem(OBJECT_STORAGE_KEY, JSON.stringify(objectEdits));
    } catch {
      if (pickStatus) pickStatus.textContent = "Zmiana działa do odświeżenia, ale przeglądarka nie pozwoliła jej zapisać.";
    }
  };

  const syncObjectInputs = () => {
    if (!selectedElement) return;
    const computed = window.getComputedStyle(selectedElement);
    panel?.querySelectorAll("[data-object-color]").forEach((button) => {
      const property = button.dataset.objectColor;
      setSwatchColor(button, toHex(computed[property], property === "backgroundColor" ? "#ffffff" : "#17130f"));
    });
  };

  const selectElement = (element) => {
    selectedElement?.removeAttribute("data-palette-picked");
    selectedElement = element;
    selectedSelector = getSelector(element);
    element.setAttribute("data-palette-picked", "");
    const name = element.tagName.toLowerCase();
    const description = (element.innerText || element.getAttribute("aria-label") || "").trim().replace(/\s+/g, " ").slice(0, 46);
    if (selectedLabel) selectedLabel.textContent = description ? `<${name}> ${description}` : `<${name}>`;
    if (objectEditor) objectEditor.hidden = false;
    if (pickStatus) pickStatus.textContent = "Element wybrany. Zmień dowolny z kolorów poniżej.";
    const saved = objectEdits[selectedSelector];
    if (saved && typeof saved === "object") {
      OBJECT_PROPERTIES.forEach((property) => {
        if (isHex(saved[property])) element.style.setProperty(property.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`), saved[property], "important");
      });
    }
    syncObjectInputs();
  };

  const selectObjectColor = (property, value) => {
      if (!selectedElement || !OBJECT_PROPERTIES.includes(property) || !isHex(value)) return;
      const cssProperty = property.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
      if (!objectEdits[selectedSelector]) {
        objectEdits[selectedSelector] = {
          original: Object.fromEntries(OBJECT_PROPERTIES.map((name) => {
            const cssName = name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
            return [name, { value: selectedElement.style.getPropertyValue(cssName), priority: selectedElement.style.getPropertyPriority(cssName) }];
          })),
        };
      }
      selectedElement.style.setProperty(cssProperty, value, "important");
      objectEdits[selectedSelector][property] = value.toLowerCase();
      saveObjectEdits();
  };

  pickToggle?.addEventListener("click", () => {
    pickingElement = !pickingElement;
    root.toggleAttribute("data-palette-pick-mode", pickingElement);
    pickToggle.setAttribute("aria-pressed", String(pickingElement));
    pickToggle.textContent = pickingElement ? "Anuluj wybór elementu" : "Wybierz element na stronie";
    if (pickStatus) pickStatus.textContent = pickingElement ? "Kliknij dowolny element strony poza tym panelem." : "Włącz wybór i kliknij element, którego kolory chcesz zmienić.";
  });

  document.addEventListener("click", (event) => {
    if (!pickingElement || !(event.target instanceof Element) || panel?.contains(event.target) || picker?.contains(event.target)) return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    selectElement(event.target);
    pickingElement = false;
    root.removeAttribute("data-palette-pick-mode");
    pickToggle?.setAttribute("aria-pressed", "false");
    if (pickToggle) pickToggle.textContent = "Wybierz inny element";
  }, true);

  panel?.querySelector("[data-object-reset]")?.addEventListener("click", () => {
    if (!selectedElement) return;
    const original = objectEdits[selectedSelector]?.original || {};
    OBJECT_PROPERTIES.forEach((property) => {
      const cssProperty = property.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
      if (original[property]?.value) selectedElement.style.setProperty(cssProperty, original[property].value, original[property].priority || "");
      else selectedElement.style.removeProperty(cssProperty);
    });
    delete objectEdits[selectedSelector];
    saveObjectEdits();
    syncObjectInputs();
    if (pickStatus) pickStatus.textContent = "Przywrócono oryginalne kolory tego elementu.";
  });

  panel?.querySelector("[data-object-reset-all]")?.addEventListener("click", () => {
    Object.keys(objectEdits).forEach((selector) => {
      try {
        document.querySelector(selector)?.removeAttribute("data-palette-picked");
        const element = document.querySelector(selector);
        const original = objectEdits[selector]?.original || {};
        OBJECT_PROPERTIES.forEach((property) => {
          if (!element) return;
          const cssProperty = property.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
          if (original[property]?.value) element.style.setProperty(cssProperty, original[property].value, original[property].priority || "");
          else element.style.removeProperty(cssProperty);
        });
      } catch {
        // Ignore selectors that became invalid after page markup changed.
      }
    });
    objectEdits = {};
    saveObjectEdits();
    selectedElement?.removeAttribute("data-palette-picked");
    selectedElement = null;
    selectedSelector = "";
    if (objectEditor) objectEditor.hidden = true;
    if (pickStatus) pickStatus.textContent = "Usunięto wszystkie indywidualne zmiany kolorów.";
  });

  Object.entries(objectEdits).forEach(([selector, saved]) => {
    try {
      const element = document.querySelector(selector);
      if (!element || !saved || typeof saved !== "object") return;
      OBJECT_PROPERTIES.forEach((property) => {
        if (isHex(saved[property])) element.style.setProperty(property.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`), saved[property], "important");
      });
    } catch {
      // A page update can invalidate a saved selector; skip it safely.
    }
  });

  picker = document.createElement("div");
  picker.className = "palette-color-picker";
  picker.id = "palette-color-picker";
  picker.hidden = true;
  picker.setAttribute("role", "dialog");
  picker.setAttribute("aria-label", "Wybór koloru");
  picker.innerHTML = `
    <div class="palette-color-picker__head">
      <strong data-picker-title>Wybierz kolor</strong>
      <button type="button" data-picker-close aria-label="Zamknij wybór koloru">×</button>
    </div>
    <div class="palette-color-picker__current" data-picker-preview></div>
    <label>Odcień <input type="range" min="0" max="360" value="0" data-picker-hue></label>
    <label>Nasycenie <input type="range" min="0" max="100" value="100" data-picker-saturation></label>
    <label>Jasność <input type="range" min="0" max="100" value="50" data-picker-lightness></label>
    <label>Kod HEX <input type="text" maxlength="7" spellcheck="false" autocomplete="off" inputmode="text" data-picker-hex aria-label="Wpisz dowolny kolor w formacie HEX"></label>
  `;
  document.body.append(picker);

  const hueInput = picker.querySelector("[data-picker-hue]");
  const saturationInput = picker.querySelector("[data-picker-saturation]");
  const lightnessInput = picker.querySelector("[data-picker-lightness]");
  const hexInput = picker.querySelector("[data-picker-hex]");
  const preview = picker.querySelector("[data-picker-preview]");
  let activeSwatch = null;

  const closePicker = () => {
    picker.hidden = true;
    activeSwatch?.setAttribute("aria-expanded", "false");
    activeSwatch = null;
  };

  const showPickerColor = (value) => {
    const [hue, saturation, lightness] = hexToHsl(value);
    hueInput.value = String(hue);
    saturationInput.value = String(saturation);
    lightnessInput.value = String(lightness);
    hexInput.value = value.toUpperCase();
    preview.style.backgroundColor = value;
    picker.style.setProperty("--picker-hue", `hsl(${hue} 100% 50%)`);
  };

  const choosePickerColor = (value) => {
    if (!activeSwatch || !isHex(value)) return;
    const normalized = value.toLowerCase();
    setSwatchColor(activeSwatch, normalized);
    if (activeSwatch.dataset.colorInput) selectColor(activeSwatch.dataset.colorInput, normalized);
    else selectObjectColor(activeSwatch.dataset.objectColor, normalized);
    showPickerColor(normalized);
  };

  document.querySelectorAll("[data-color-input], [data-object-color]").forEach((button) => {
    button.setAttribute("aria-haspopup", "dialog");
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-controls", picker.id);
    button.addEventListener("click", (event) => {
      event.preventDefault();
      if (activeSwatch === button) {
        closePicker();
        return;
      }
      closePicker();
      activeSwatch = button;
      button.setAttribute("aria-expanded", "true");
      picker.querySelector("[data-picker-title]").textContent = button.closest(".palette-lab__color-control")?.querySelector("span")?.textContent || "Wybierz kolor";
      showPickerColor(isHex(button.dataset.value) ? button.dataset.value : "#ffffff");
      picker.hidden = false;
      const anchor = button.getBoundingClientRect();
      const width = picker.offsetWidth;
      const height = picker.offsetHeight;
      let left = anchor.left - width - 12;
      if (left < 12) left = anchor.right + 12;
      picker.style.left = `${Math.max(12, Math.min(left, window.innerWidth - width - 12))}px`;
      picker.style.top = `${Math.max(12, Math.min(anchor.top, window.innerHeight - height - 12))}px`;
      hexInput.focus();
      hexInput.select();
    });
  });

  [hueInput, saturationInput, lightnessInput].forEach((input) => {
    input.addEventListener("input", () => {
      choosePickerColor(hslToHex(Number(hueInput.value), Number(saturationInput.value), Number(lightnessInput.value)));
    });
  });

  hexInput.addEventListener("input", () => {
    const raw = hexInput.value.trim();
    const value = raw.startsWith("#") ? raw : `#${raw}`;
    if (isHex(value)) choosePickerColor(value);
  });
  hexInput.addEventListener("blur", () => {
    if (activeSwatch) hexInput.value = activeSwatch.dataset.value.toUpperCase();
  });
  picker.querySelector("[data-picker-close]").addEventListener("click", closePicker);
  document.addEventListener("pointerdown", (event) => {
    if (!picker.hidden && !picker.contains(event.target) && event.target !== activeSwatch) closePicker();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !picker.hidden) closePicker();
  });
}
