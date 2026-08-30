import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
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
      },
    },
  },
});
