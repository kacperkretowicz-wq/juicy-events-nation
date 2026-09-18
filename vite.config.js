import { defineConfig } from "vite";
import { readFileSync } from "fs";
import { resolve } from "path";

const PARTIAL_MARKERS = {
  "<!-- @site-closing -->": resolve(__dirname, "partials/site-closing.html"),
  "<!-- @float-cta -->": resolve(__dirname, "partials/float-cta.html"),
};

function htmlPartialsPlugin() {
  return {
    name: "html-partials",
    transformIndexHtml(html) {
      let out = html;
      for (const [marker, file] of Object.entries(PARTIAL_MARKERS)) {
        if (!out.includes(marker)) continue;
        out = out.replace(marker, readFileSync(file, "utf8"));
      }
      return out;
    },
  };
}

export default defineConfig({
  plugins: [htmlPartialsPlugin()],
  server: { open: true, port: 5173, host: true, strictPort: true },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        realizacje: resolve(__dirname, "realizacje.html"),
        realizacjeActiveFashion: resolve(__dirname, "realizacje-active-fashion.html"),
        realizacjeJohnDeere: resolve(__dirname, "realizacje-john-deere.html"),
        realizacjeMultichem: resolve(__dirname, "realizacje-multichem.html"),
        realizacjeRainbow: resolve(__dirname, "realizacje-rainbow.html"),
        realizacjeRetroRush: resolve(__dirname, "realizacje-retro-rush.html"),
        realizacjeVolvo: resolve(__dirname, "realizacje-volvo.html"),
        politykaPrywatnosci: resolve(__dirname, "polityka-prywatnosci.html"),
      },
    },
  },
});
