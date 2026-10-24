# Client logos

Logos collected from each client's homepage header (or fallback source), trimmed, and
recolored to solid black (`#141414`) on a transparent background. SVGs had every
`fill`/`stroke` (including gradients) set to `#141414`, except `none`. Raster logos were
converted by keying on the alpha channel (or, for the one flat-background asset, by distance
from the sampled background color) and painting every non-background pixel `#141414`.

See `clients.json` for the manifest (`name`, `file`, source `url`, `wordmark` flag).

## Sources

| # | Name | File | Source of logo asset |
|---|------|------|------------------------|
| 1 | Multichem | multichem.svg | `<img>` in header, `https://www.multichem.pl/assets/img/nev-logo.svg` |
| 2 | PayComplete | paycomplete.png | `<img>` in header, `.../wp-content/uploads/2023/08/paycomplete_logo.png` |
| 3 | John Deere | deere.svg | deere.pl renders its header via JS; rendered DOM (headless Chrome) found `<img>` pointing to John Deere's global brand CDN: `https://cdn-ux.deere.com/brand-foundations/2.0.0/logos/jd-logo.svg`. The source SVG ships multiple color variants as `<g id="green">`/`<g id="black">` toggled by CSS `:target`; the `black` group was extracted into a standalone file before recoloring. |
| 4 | Phinance | phinance.svg | `<img>` in header, `.../wp-content/uploads/2026/07/Phinance_logo-02_153x47.svg` |
| 5 | Studio Figura | studiofigura.svg | No `<img>` logo in the header; found an inline `<svg class="footer-logo">` in the footer (BeautifulSoup lowercases `viewBox`/attribute case, so the SVG was re-extracted with regex to preserve valid SVG attribute casing). |
| 6 | Agencja Ochrony LION | lionochrona.png | lion-ochrona.pl is a React SPA with no static header markup; used `og:image` from the static HTML: `https://api.lion-ochrona.pl/uploads/logos/....png`. |
| 7 | Best Driver | bestdriver.png | Instagram `best_driver_pl` has no public meta (login wall). Found the brand's own site via search: `https://bestdriver.pl`, logo `<img src="xlogo.png...">` (PageSpeed-optimized filename). |
| 8 | ARC Europe Polska | arceurope.svg | `<img>` in header/footer, `.../img/sites/3/logo-footer-arceurope-1.svg` (a white/yellow logo meant for a dark background — recolored to black like the rest). |
| 9 | Zeelandia | zeelandia.svg | `<img>` in header, Plone CMS `@@site-logo` view: `https://www.zeelandia.pl/@@site-logo/zeelandia.svg`. |
| 10 | Poznański Prestiż | poznanskiprestiz.png | Header `<img>` used a lazy-load placeholder (`blank.gif`); real logo recovered from `data-wpfc-original-src`: `.../2024/01/Poznanski_Prestiz_zloty_komplet128x.png`. |
| 11 | Active4Woman | active4woman.svg | **Wordmark.** Instagram-only brand (event/camp organizer); `active4woman.pl`/`.com` do not resolve, and it's a distinct brand from unrelated "Active Woman" studios found in search. Rendered as a bold-sans text wordmark ("ACTIVE4WOMAN", Liberation Sans Bold path positioning via PIL metrics → SVG `<text>`). |
| 12 | Legimi | legimi.svg | Header logo is an empty `<div id="logo">` painted via CSS `background-image`; found in `navbar-menu.min.css`: `#logo{background-image:url(./cf9611688b77ec596577eda92d789991.svg)}`, resolved against `/Content/css/`. |
| 13 | Wydawnictwo NOWE | wydawnictwonowe.png | `<img>` in header, `.../2022/08/wydawnictwo-nowe-logovbig.png`. |
| 14 | Wadowscy Campery | wadowscy-campery.png | `<img>` in `<header>`, `.../2022/06/WADOWSCY_CAMPERY_biale.png` (white logo, recolored). |
| 15 | Wadowscy Klasyczne | wadowscy-klasyczne.png | `<img>` with alt "Logo Wadowscy Klasyczne", `https://wadowscy.pl/wp-content/uploads/Wadowscy-klasyczne.webp`. Only one of the three Wadowscy sub-brands without real transparency (flat white background), so background removal used color-distance thresholding instead of the alpha channel. |
| 16 | Wadowscy Volvo | wadowscy-volvo.svg | Inline `<svg>` VOLVO wordmark inside `.bar__logo.a-logo` in the header (dealer site using Volvo's standard wordmark). |
| 17 | Ergo Hestia | ergohestia.svg | `<img>` in header, `https://ergohestia.pl/static/assets/images/icons/logo.svg` (site redirects to `www.`, needed `-L`). |
| 18 | Nationale-Nederlanden | nn.svg | Inline `<svg aria-label="Nationale-Nederlanden logo">` in the header (also had to re-extract with regex instead of BeautifulSoup to preserve `viewBox` casing). |
| 19 | NoFrame | noframe.png | `<img class="jet-logo__img">` in header, `.../2019/07/Logo_NoFrame_White_RGB.png` (white logo on transparent, recolored to black). |
| 20 | Kaferdam Poznań | kaferdam.svg | Instagram-only (`kaferdam_poznan`); found the brand's own landing page `https://kaferdam.com` ("Kaferdam Kawiarnia Poznań"), logo `<img class="logo-white">` → `/img/kaferdam-logo-white.svg`. |
| 21 | Zdziczenie Obyczajów | zdziczenieobyczajow.svg | **Wordmark.** No dedicated website found (`zdziczenieobyczajow.pl`/`.com` don't resolve; web search only surfaces an unrelated Bolesław Leśmian play of the same name). Rendered as a bold-sans text wordmark, same method as Active4Woman. |
| 22 | Propontis | propontis.png | `<img>` in header, `.../2025/09/logo-propontis-white-2025.webp` (white logo on transparent, recolored). |
| 23 | Rekord Mobile | rekordmobile.svg | Homepage is a JS "coming soon" intro page with no static markup; rendered DOM (headless Chrome) found `<img>` in `.logo`: `.../themes/rekord/intro/assets/images/rekord-mobile.svg`. Logo uses a gradient `fill="url(#a)"` for part of the wordmark — gradients are also flattened to solid `#141414` by the SVG recolor script. |
| 24 | Erste Bank | erste.svg | `<img class="header__logo--desktop">`, resolves to a CMS file-server URL serving `image/svg+xml` (`Content-Disposition: ...logo.svg`). SVG fill is driven by a `<style>` class (`.d{fill:#fff}`), recolored to black. |
| 25 | WZ Partners | wzpartners.png | `<img>` in `<header>`, `.../app/uploads/2021/04/logo-1.png`. |
| 26 | Apollogic | apollogic.svg | `<img class="mob-standard-logo">` in header, `.../2022/03/logo-Apollogic.svg`. |
| 27 | Petit Paris | petitparis.svg | `<img class="normal">` in header, `.../2018/03/petit-black.svg`. |

## Problems / known limitations

- **John Deere (`deere.svg`) and Agencja Ochrony LION (`lionochrona.png`)**: both source
  logos use a badge/emblem where the inner icon (the leaping deer; the "LION" wordmark inside
  the shield) was originally a *different* color from the surrounding badge shape. Flattening
  everything to one black fill makes the icon merge visually into the badge outline, so fine
  detail inside those emblems is lost even though the overall silhouette (oval badge / shield)
  is still recognizable. A hand-vectorized two-tone version would preserve more detail if
  needed later.
- **Active4Woman and Zdziczenie Obyczajów**: no standalone website exists for either brand, and
  Instagram's web view is login-walled (no `og:` meta reachable without a session), so these
  are rendered text wordmarks rather than captured logos, per the task's fallback instructions.
  Marked `"wordmark": true` in `clients.json`.
- **Wadowscy sub-brands**: kept as three separate files (`wadowscy-campery.png`,
  `wadowscy-klasyczne.png`, `wadowscy-volvo.svg`) since each dealership/sub-brand uses a
  visually distinct logo (campervan centre wordmark, script "Wadowscy klasyczne" lockup, and
  the standard Volvo wordmark, respectively).
- **Best Driver and Kaferdam Poznań**: both were given as Instagram handles in the brief, but
  each brand turned out to have its own website (`bestdriver.pl`, `kaferdam.com`), so the real
  site logo was used instead of a wordmark fallback.
- All files were verified by rendering to PNG and visually inspecting before being written to
  this folder (see the file list in `clients.json` for the final set).
