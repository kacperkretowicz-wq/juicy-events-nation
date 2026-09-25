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

export function initPaletteLab() {
  const params = new URLSearchParams(window.location.search);
  const isLocalPreview = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  if (!params.has("palette-lab") && !isLocalPreview) return;

  const root = document.documentElement;
  const valid = new Set(PALETTES.map(([key]) => key));
  const validEffects = new Set(EFFECTS.map(([key]) => key));
  const initial = valid.has(params.get("palette")) ? params.get("palette") : PALETTES[0][0];
  const initialEffect = validEffects.has(params.get("bg-effect")) ? params.get("bg-effect") : EFFECTS[0][0];

  root.dataset.paletteLab = "";
  root.dataset.palette = initial;
  root.dataset.bgEffect = initialEffect;
  root.style.setProperty("--bg-progress", "0");
  root.style.setProperty("--bg-wave", "0");

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
      item.setAttribute("href", next.pathname + next.search + next.hash);
    });
  };

  syncEffectLinks(initial);

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
      window.history.replaceState(null, "", next);
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
    window.history.replaceState(null, "", next);
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
