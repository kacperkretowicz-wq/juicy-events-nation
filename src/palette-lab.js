const PALETTES = [
  ["warm", "Ciepły papier"],
  ["plum", "Kość + śliwka"],
  ["sage", "Szałwia + koral"],
  ["cobalt", "Biel + kobalt"],
  ["coral", "Biel + koral"],
  ["ultramarine", "Biel + ultramaryna"],
  ["aqua", "Biel + aqua"],
  ["violet", "Biel + fiolet"],
];

export function initPaletteLab() {
  const params = new URLSearchParams(window.location.search);
  if (!params.has("palette-lab")) return;

  const root = document.documentElement;
  const valid = new Set(PALETTES.map(([key]) => key));
  const initial = valid.has(params.get("palette")) ? params.get("palette") : PALETTES[0][0];

  root.dataset.paletteLab = "";
  root.dataset.palette = initial;

  document.querySelectorAll("[data-palette-choice]").forEach((button) => {
    const key = button.dataset.paletteChoice;
    button.setAttribute("aria-pressed", String(key === initial));
    button.addEventListener("click", () => {
      if (!valid.has(key)) return;
      root.dataset.palette = key;
      document.querySelectorAll("[data-palette-choice]").forEach((item) => {
        item.setAttribute("aria-pressed", String(item.dataset.paletteChoice === key));
      });
      const next = new URL(window.location.href);
      next.searchParams.set("palette-lab", "1");
      next.searchParams.set("palette", key);
      window.history.replaceState(null, "", next);
    });
  });
}
