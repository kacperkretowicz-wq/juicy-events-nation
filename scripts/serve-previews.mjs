import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const previewsDir = path.resolve(__dirname, '../.previews');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.mp4': 'video/mp4',
  '.webp': 'image/webp',
};

function createStaticServer(targetDir, name) {
  return (req, res) => {
    let reqPath = decodeURI(req.url.split('?')[0]);
    if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
    const filePath = path.join(targetDir, reqPath);

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, {
        'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
        'Access-Control-Allow-Origin': '*',
      });
      fs.createReadStream(filePath).pipe(res);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(`404: Not found in ${name}`);
    }
  };
}

// 1. Port 5001: Wersja Bazowa
http.createServer(createStaticServer(path.join(previewsDir, 'base'), 'Base')).listen(5001, () => {
  console.log('[PORT 5001] Wersja Bazowa: http://localhost:5001/');
});

// 2. Port 5002: Wersja 1
http.createServer(createStaticServer(path.join(previewsDir, 'v1'), 'Version 1')).listen(5002, () => {
  console.log('[PORT 5002] Wersja 1: http://localhost:5002/');
});

// 3. Port 5003: Wersja 2
http.createServer(createStaticServer(path.join(previewsDir, 'v2'), 'Version 2')).listen(5003, () => {
  console.log('[PORT 5003] Wersja 2: http://localhost:5003/');
});

// 4. Port 5000: Panel porównawczy (Dashboard)
const hubHtml = `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Juicy Events — Porównanie 3 wersji</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #121212;
      color: #f4f2ec;
      padding: 2rem 1.5rem;
    }
    header {
      max-width: 1400px;
      margin: 0 auto 2.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.15);
      padding-bottom: 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      flex-wrap: wrap;
      gap: 1rem;
    }
    h1 { font-size: 2.2rem; font-weight: 700; letter-spacing: -0.02em; }
    p.lead { color: #a09d94; margin-top: 0.35rem; font-size: 1.05rem; }
    .nav-links { display: flex; gap: 0.75rem; flex-wrap: wrap; }
    .nav-btn {
      padding: 0.6rem 1.25rem;
      border-radius: 999px;
      font-weight: 600;
      font-size: 0.9rem;
      text-decoration: none;
      transition: all 0.2s ease;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }
    .nav-btn--base { background: #262626; color: #fff; }
    .nav-btn--v1 { background: #d52518; color: #fff; }
    .nav-btn--v2 { background: #234ee4; color: #fff; }
    .nav-btn:hover { opacity: 0.88; transform: translateY(-1px); }

    .grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 1.5rem;
      max-width: 1700px;
      margin: 0 auto;
    }
    @media (max-width: 1200px) {
      .grid { grid-template-columns: 1fr; }
    }
    .card {
      background: #1a1a1a;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      height: 85vh;
    }
    .card__header {
      padding: 1.1rem 1.4rem;
      background: #222;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .card__title { font-size: 1.15rem; font-weight: 700; display: flex; align-items: center; gap: 0.6rem; }
    .tag { font-size: 0.72rem; padding: 0.2rem 0.55rem; border-radius: 4px; text-transform: uppercase; font-weight: 700; letter-spacing: 0.04em; }
    .tag--base { background: rgba(255, 255, 255, 0.15); color: #fff; }
    .tag--v1 { background: #d52518; color: #fff; }
    .tag--v2 { background: #234ee4; color: #fff; }
    .card__desc { padding: 0.75rem 1.4rem; font-size: 0.85rem; color: #9a9890; border-bottom: 1px solid rgba(255, 255, 255, 0.06); line-height: 1.4; }
    .card__frame { flex: 1; border: 0; width: 100%; height: 100%; background: #f4f2ec; }
  </style>
</head>
<body>
  <header>
    <div>
      <h1>Juicy Events — Porównanie 3 wersji</h1>
      <p class="lead">Wszystkie 3 wersje działają równolegle. Kliknij przycisk, aby otworzyć wybraną w pełnym oknie lub oglądaj obok siebie poniżej:</p>
    </div>
    <div class="nav-links">
      <a class="nav-btn nav-btn--base" href="http://localhost:5001" target="_blank">Otwórz Bazową ↗ (Port 5001)</a>
      <a class="nav-btn nav-btn--v1" href="http://localhost:5002" target="_blank">Otwórz Wersję 1 ↗ (Port 5002)</a>
      <a class="nav-btn nav-btn--v2" href="http://localhost:5003" target="_blank">Otwórz Wersję 2 ↗ (Port 5003)</a>
    </div>
  </header>

  <div class="grid">
    <!-- Kolumna 1: Bazowa -->
    <div class="card">
      <div class="card__header">
        <span class="card__title">Wersja Bazowa <span class="tag tag--base">upgrade-po-feedbacku</span></span>
        <a class="nav-btn nav-btn--base" style="padding: 0.35rem 0.8rem; font-size: 0.8rem;" href="http://localhost:5001" target="_blank">Pełne okno ↗</a>
      </div>
      <div class="card__desc">Czerwona ramka wokół wideo, mały akapit AI pod nagłówkiem, czarna pigułka „Zobacz realizacje”, klienci po lewej.</div>
      <iframe class="card__frame" src="http://localhost:5001/"></iframe>
    </div>

    <!-- Kolumna 2: Wersja 1 -->
    <div class="card">
      <div class="card__header">
        <span class="card__title">Wersja 1 <span class="tag tag--v1">Czysty nagłówek</span></span>
        <a class="nav-btn nav-btn--v1" style="padding: 0.35rem 0.8rem; font-size: 0.8rem;" href="http://localhost:5002" target="_blank">Pełne okno ↗</a>
      </div>
      <div class="card__desc">Bez ramki wokół wideo, bez tekstu AI i pigułki. Tylko duży nagłówek. Klienci wycentrowani i zbalansowani na szerokość siatki.</div>
      <iframe class="card__frame" src="http://localhost:5002/"></iframe>
    </div>

    <!-- Kolumna 3: Wersja 2 -->
    <div class="card">
      <div class="card__header">
        <span class="card__title">Wersja 2 <span class="tag tag--v2">Showreel obok agencji</span></span>
        <a class="nav-btn nav-btn--v2" style="padding: 0.35rem 0.8rem; font-size: 0.8rem;" href="http://localhost:5003" target="_blank">Pełne okno ↗</a>
      </div>
      <div class="card__desc">Showreel wklejony obok pytania „Po co Ci agencja...”. Sekcja „Nasza praca” skrócona do szerokiego, czystego nagłówka przed portfolio.</div>
      <iframe class="card__frame" src="http://localhost:5003/"></iframe>
    </div>
  </div>
</body>
</html>`;

http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(hubHtml);
}).listen(5000, () => {
  console.log('[PORT 5000] Dashboard porównawczy: http://localhost:5000/');
});
