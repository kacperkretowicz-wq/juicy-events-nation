# Juicy Events — wersja 2 (środowisko testowe)

Kopia robocza strony. Oryginał leży nietknięty obok, w `juicy-events-nation-master/`,
więc każdą zmianę można porównać albo wycofać.

```bash
npm install
npm run dev
```

Sekcja 1 (wideo hero: lot logo, kurcząca się kurtyna, przejście nagłówka)
została **bez zmian w układzie i animacji**. Doszła w niej tylko jedna rzecz,
o którą prosiłeś: kursor.

---

## 1. Kursor „Odtwórz reel" na kadrze hero

`src/sections/cursor.js`, `src/style/sections/cursor.css`

Kadr hero jest teraz klikalny i sam o tym mówi — kursor zamienia się w czerwony
krążek z etykietą **▶ ODTWÓRZ REEL** i otwiera showreel. Scena zostaje czysta,
bez doklejania przycisku na wideo.

Ten sam mechanizm obsługuje resztę strony (`data-cursor` na elemencie):
karty realizacji → „Zobacz realizację", kadr „Nasza praca" → „Odtwórz
z dźwiękiem", galeria pozioma → „Przeciągnij". Na dotyku kursor w ogóle nie
powstaje, a kadr działa też z klawiatury (`role="button"` + Enter/Spacja).

---

## 2. Naprawione błędy

| Co było źle | Gdzie | Naprawa |
|---|---|---|
| **Polskie ogonki i przecinki ucinane** w nagłówkach (`SIĘ`, `PRECYZJĄ,`, `EMOCJĄ.`) — `line-height: 0.94` plus maska `overflow: hidden` | `base.css`, `tokens.css` | interlinia 1.0 + zapas w masce (`padding-top/bottom` z ujemnym marginesem, żeby rytm składu został bez zmian) |
| **Karty realizacji podskakiwały** na końcu animacji wejścia — przesunięcie prawej kolumny robione `transform`, a GSAP kasował go przez `clearProps` | `projects.css` | przesunięcie na `margin-top` |
| **Ikony social w stopce owalne** (19×44 zamiast 44×44) — `.site-footer__col a { width: fit-content }` wygrywało specyficznością | `layout.css`, `base.css` | `:not(.social__icon)` + `flex: none` |
| **Wielkie napisy przejeżdżały przez nawigację** (mostek „Od briefu do wyniku") | `layout.css`, `shared.js` | stan `--floating`: scrim + blur nad ciemnymi sekcjami po odjechaniu od góry |
| **Dłuższe opisy kompetencji ucinane** przez sztywne `max-height: 24rem` | `expertise.css`, `expertise.js` | `grid-template-rows: 0fr → 1fr` — rozwinięcie zawsze pokazuje całość |
| **Zamknięte menu i showreel łapały Tab** (`aria-hidden` bez `inert`) | `shared.js`, `base.css` | `inert` + pułapka fokusu + powrót fokusu po zamknięciu |
| **Pierwszy kadr galerii poziomej ucinany** przy krawędzi ekranu (snap bez `scroll-padding`) | `standard.css` | `scroll-padding-left` równy wcięciu toru |
| **Parallax odsłaniał krawędzie** kadrów w „Nasza praca" i „Wartości" (zapas 8% przy ruchu ±11,6%) | `work.css` | zapas podniesiony do 14% |
| **Zły link podświetlony** w scroll-spy — kolejność w menu ≠ kolejność w dokumencie | `shared.js` | sortowanie po pozycji w dokumencie |
| **Kotwice `#…` chowały się pod nagłówkiem** | `shared.js` | offset o wysokość nagłówka |
| **Najdłuższe polskie słowa wypadały poza ekran** na 390 px (`white-space: nowrap` w linii) | `shared.js`, `tokens.css` | zawijanie awaryjne już przy pierwszym podziale + niższe minimum skali |
| **Kontrast poniżej WCAG AA w 48 miejscach**: czerwień `#ff3a2f` na kremie (3,27:1) i biały tekst na czerwieni (2,86–3,56:1) | cały arkusz | `--accent-text: #d4231a` (4,75:1) do małego tekstu na jasnym; czarny zamiast białego na czerwonych płaszczyznach (5,5–6,8:1) |
| **29 celów dotykowych poniżej 32 px** (logo 150×15, linki nawigacji 21 px, linki kontaktowe) | `layout.css`, `base.css`, `team.css`, `contact.css` | wyściółka bez zmiany wyglądu |
| **Brak walidacji formularza** — natywne dymki znikały po jednym kliknięciu | `contact.js`, `contact.css` | walidacja na `blur`, komunikat pod polem, `aria-live`, fokus na pierwszym błędzie, `autocomplete` |
| **Cztery filmy showreelu wczytywane przy wejściu** na stronę | `index.html`, `shared.js` | `data-src` + `preload="none"` — plik startuje dopiero na swoim ujęciu |
| **Galeria pozioma bez klawiatury** i bez sygnału, że jest czym przewijać | `standard.js`, `standard.css` | strzałki, obsługa ←/→, `role="region"`, pasek postępu |
| Gradienty bez koloru bazowego — brak gradientu oznaczał kremowy tekst na kremowym tle | `layout.css`, `needs.css` | `background-color` pod `background-image` |

Zostawione świadomie:

- **Dwa `<h1>`** w sekcji 1 — druga kopia to ciemna warstwa przejścia, ma
  `aria-hidden`, więc czytnik ekranu widzi jeden nagłówek. Poprawka wymagałaby
  ruszenia struktury sekcji, której nie ruszam.
- **`prefers-reduced-motion`** — decyzja właściciela z komentarza w `shared.js`
  zostaje; `?reduced` w URL nadal daje spokojną wersję. Wyłączyłem tylko
  nieskończoną pętlę CSS paska haseł, bo ta męczy najbardziej.

---

## 3. Zmiany w układach i sekcjach

**Agencja (blok jasny)** — była jedna kolumna dosunięta do prawej krawędzi
i pusta lewa połowa ekranu. Teraz układ redakcyjny: manifest po lewej,
rozwinięcie po prawej za cienką linią, pod nim trzy filary (Strategia /
Kreacja / Produkcja).

**Pasek haseł** — nowy, nieskończony ticker między agencją a „Naszą pracą":
Event design · Produkcja · Strategia · Scenografia · Technika & AV · Oprawa
artystyczna · Hospitality. Zatrzymuje się pod kursorem.

**Nasza praca** — kadr rozciągnięty na pełną wysokość kolumny (obie kolumny
mają teraz identyczną wysokość; wcześniej pod kartą zostawało ~300 px pustki),
ramka wjeżdżająca na hover, a pod tekstem pasek trzech kadrów z własnym
parallaxem.

**Cele i misja** — kadr przestał być wypraną mgłą (mocniejsze krycie,
desaturacja, kontrast), doszła czerwona łuna i pionowa kreska przy przypisie.

**Kompetencje** — lewa kolumna była pustą czarną płaszczyzną na całą wysokość
ekranu. Teraz pokazuje kadr przypisany do aktywnej kompetencji, przenikający
razem z listą. Aktywna pozycja dostała czerwony znacznik na krawędzi.

**Realizacje** — numery kadrów, czerwona przesłona na hover, wskaźnik postępu
slajdów w kaflach ze zdjęciami.

**Metoda** — z płaskiej listy na oś czasu: przyklejona kolumna opisowa po
lewej, kroki nanizane na czerwoną szynę, która wypełnia się ze scrollem
i zapala kolejne punkty.

**Wartości** — kolaż: drugi, mniejszy kadr zachodzi na główny z własnym
parallaxem; pod leadem trzy konkretne obietnice.

**Zakresy** — karty w schodkach zamiast równego rządka, numeracja, czerwona
przesłona wjeżdżająca od dołu na kartach jasnej i ciemnej.

**Standard realizacji** — większe kadry (realna podróż w bok zamiast toru,
który prawie mieścił się w kadrze), numery na kadrach, naprzemienne wysokości,
strzałki i pasek postępu.

**Zespół** — monogramy zamiast pustego miejsca nad nazwiskiem. Karta bez
kompletu danych wygląda teraz na celową („Dołącza do zespołu" + przerywana
ramka), a nie na niedokończoną.

**Kontakt** — własna strzałka `select`, podpowiedź pod opisem, gwiazdki przy
polach wymaganych, komunikaty błędów, informacja co się stanie po wysłaniu.

**Nagłówek** — pasek postępu czytania, podświetlenie aktywnej sekcji,
wypełnienie CTA wjeżdżające od dołu, trzy stany tła zamiast dwóch.

**Menu** — numeracja pozycji, czerwona łuna w tle, pułapka fokusu.

**Showreel** — kropki nawigacyjne, pasek odliczania do kolejnego ujęcia,
zamykanie klikiem w tło, sterowanie ←/→, leniwe wczytywanie filmów.

**Stopka** — gradient zamiast płaskiej czerni, wordmark na gradiencie.

**Kolorystyka** — trzy stopnie jasnego (`cream` → `cream-deep` → `sand`)
i trzy ciemnego (`dark` → `dark-soft` → `dark-warm`), pełna rampa czerwieni
z osobnym odcieniem do małego tekstu, skala cieni, skala odstępów 4/8,
jawna skala `z-index`.

---

## 4. Narzędzia kontrolne

```bash
node scripts/shots.mjs --tag x --stops 16
node scripts/shots.mjs --tag m --w 390 --h 844
node scripts/audit.mjs
node scripts/interact.mjs
```

- `shots.mjs` — zrzuty całej strony na wybranej szerokości (Playwright).
- `audit.mjs` — kontrast WCAG, przepełnienia poziome, cele dotykowe, fokus
  w zamkniętych warstwach, brakujące `alt`/`width`/`height`.
- `interact.mjs` — kursor, showreel z hero, Esc, mega menu, walidacja
  formularza, strzałki galerii.

Stan po zmianach: cele dotykowe poniżej progu 29 → 1 (fałszywy alarm — tam cała
karta jest klikalna), fokusowalne elementy w zamkniętych warstwach 0, brak
błędów w konsoli na 1440 / 1024 / 390 px, `npm run build` przechodzi.
