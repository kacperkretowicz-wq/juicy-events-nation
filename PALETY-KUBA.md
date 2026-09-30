# Juicy Events — Warianty kolorystyczne (Jakub)

## Co tu jest

Jakub stworzył **4 nowe warianty kolorystyczne** strony na bazie Twojej wersji `test/wersja-1-aktualizacja`.
Zmienione zostały **wyłącznie** tokeny kolorów i kolory kafelków realizacji — fonty, layout, animacje, treści, JS — bez zmian.

---

## Linki do podglądu (Netlify)

| Wersja | Branch | Link |
|--------|--------|------|
| Twoja — Preview | `test/wersja-1-aktualizacja` | https://juicy-events-preview.netlify.app |
| Twoja — Colors/Goodman | `experiment/colors-10-bg-motion-goodman` | https://juicy-events-colors.netlify.app |
| **KUBA 1** — Kiwi & Carrot | `jakub/palette-kiwi-carrot` | https://6abd90b2c004fcbb6220cfd9--juicy-events-nation.netlify.app |
| **KUBA 2** — Dare Devil | `jakub/palette-dare-devil` | https://6abd90bbcb21a705c69954a3--juicy-events-nation.netlify.app |
| **KUBA 3** — Electric Sapphire | `jakub/palette-electric-sapphire` | https://6abd90c9e953c6b9e05d3295--juicy-events-nation.netlify.app |
| **KUBA 4** — Cherry Cobalt | `jakub/palette-cherry-cobalt` | https://6abd90d1c509b300e095326b--juicy-events-nation.netlify.app |

---

## Palety kolorów

### KUBA 1 — Kiwi & Carrot (inspiracja: Tolia Foods)
- Akcent główny: **Crisp Carrot** `#e86e2c`
- Highlight: **Sunshine** `#ffc926`
- Karta Jakuba: **Forest Green** `#18542a`
- Kafelki realizacji: 🟠 carrot / 🟡 sunshine / 🌲 forest green (po 2x)

### KUBA 2 — Dare Devil (inspiracja: The Shaft Creative)
- Akcent główny: **Dare Devil** `#ff5822`
- Highlight: **Gold** `#f2b806`
- Karta Jakuba: **Electric** `#3939ff`
- Kafelki realizacji: 🔥 dare devil / 🟡 gold / 🔵 electric / 🟣 royal (max 2 powtórzenia)

### KUBA 3 — Electric Sapphire (inspiracja: Figma Flow)
- Akcent główny: **Electric Sapphire** `#4242ff`
- Highlight: **Sunflower Gold** `#ffb825`
- Karta Jakuba: **Tiger Flame** `#f74c25`
- Kafelki realizacji: 🔵 sapphire / 🟡 sunflower / 🔴 tiger flame (po 2x)

### KUBA 4 — Cherry Cobalt (inspiracja: Haven)
- Akcent główny: **Cherry** `#d20001`
- Highlight: **Soft Pink** `#fec6e9`
- Karta Jakuba: **Cobalt** `#0212ee`
- Tło cream: **Sand** `#f3f3e9`
- Kafelki realizacji: ❤️ cherry / 🔵 cobalt / 🩷 soft pink (po 2x)

---

## Jak odpalić wszystkie 6 wersji lokalnie

### Wymagania
- Node.js 18+
- Git

### Kroki

```bash
# 1. Sklonuj repo
git clone https://github.com/kacperkretowicz-wq/juicy-events-nation.git
cd juicy-events-nation

# 2. Pobierz wszystkie branche
git fetch --all

# 3. Utwórz worktrees dla każdej wersji
git worktree add .worktrees/preview       origin/test/wersja-1-aktualizacja
git worktree add .worktrees/goodman       origin/experiment/colors-10-bg-motion-goodman
git worktree add .worktrees/kuba-1        origin/jakub/palette-kiwi-carrot
git worktree add .worktrees/kuba-2        origin/jakub/palette-dare-devil
git worktree add .worktrees/kuba-3        origin/jakub/palette-electric-sapphire
git worktree add .worktrees/kuba-4        origin/jakub/palette-cherry-cobalt

# 4. Zainstaluj zależności w każdej wersji
for dir in .worktrees/preview .worktrees/goodman .worktrees/kuba-1 .worktrees/kuba-2 .worktrees/kuba-3 .worktrees/kuba-4; do
  (cd "$dir" && npm install)
done

# 5. Odpal wszystkie serwery (każdy na osobnym porcie)
(cd .worktrees/preview  && npx vite --port 5174) &
(cd .worktrees/goodman  && npx vite --port 5175) &
(cd .worktrees/kuba-1   && npx vite --port 5176) &
(cd .worktrees/kuba-2   && npx vite --port 5177) &
(cd .worktrees/kuba-3   && npx vite --port 5178) &
(cd .worktrees/kuba-4   && npx vite --port 5179) &

wait
```

### Porty po uruchomieniu
| Port | Wersja |
|------|--------|
| http://localhost:5174 | Twoja — Preview (wersja 1) |
| http://localhost:5175 | Twoja — Colors Goodman |
| http://localhost:5176 | KUBA 1 — Kiwi & Carrot |
| http://localhost:5177 | KUBA 2 — Dare Devil |
| http://localhost:5178 | KUBA 3 — Electric Sapphire |
| http://localhost:5179 | KUBA 4 — Cherry Cobalt |

---

## Prompt dla Claude Code (żeby uruchomił lokalnie)

Wklej poniższy prompt do Claude Code:

```
Mam repo https://github.com/kacperkretowicz-wq/juicy-events-nation.git z wieloma branchami.
Chcę uruchomić lokalnie 6 wersji strony jednocześnie.

Wykonaj:
1. git fetch --all
2. Utwórz git worktrees dla 6 branchy:
   - .worktrees/preview       ← test/wersja-1-aktualizacja        (port 5174)
   - .worktrees/goodman       ← experiment/colors-10-bg-motion-goodman (port 5175)
   - .worktrees/kuba-1        ← jakub/palette-kiwi-carrot          (port 5176)
   - .worktrees/kuba-2        ← jakub/palette-dare-devil            (port 5177)
   - .worktrees/kuba-3        ← jakub/palette-electric-sapphire     (port 5178)
   - .worktrees/kuba-4        ← jakub/palette-cherry-cobalt         (port 5179)
3. W każdym worktree uruchom: npm install
4. Uruchom 6 serwerów Vite równocześnie (każdy na swoim porcie), trzymaj je wszystkie żywe w jednym terminalu.
5. Otwórz w przeglądarce http://localhost:5174 żebym mógł sprawdzić.
```

---

## Jak wrzucić KUBA 1-4 na Netlify (osobne witryny)

```bash
npm install -g netlify-cli
netlify login

for branch in kuba-1 kuba-2 kuba-3 kuba-4; do
  cd .worktrees/$branch
  npm run build
  netlify deploy --dir=dist --prod
  cd -
done
```

---

*Wygenerowano automatycznie. Branche jakub/palette-* nie ruszają żadnych plików Kacpra — zmienione tylko tokens.css, projects.css i data-tile w index.html.*
