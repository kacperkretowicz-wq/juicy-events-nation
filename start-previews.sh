#!/bin/bash
# Uruchamia wszystkie podglądy Juice Events lokalnie
# Ctrl+C aby zatrzymać wszystkie

REPO="/Users/jakubczupajlo/Documents/CURSOR/Juice Events WEB"

echo ""
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║   JUICE EVENTS — lokalne podglądy                            ║"
echo "╠═══════════════════════════════════════════════════════════════╣"
echo "║  5174  juicy-events-preview  (Kacper wersja 1)               ║"
echo "║  5175  juicy-events-colors   (Kacper Goodman)                ║"
echo "║  5176  Kiwi & Carrot         (pomaranczowy + forest green)   ║"
echo "║  5177  Dare Devil            (ogien + fiolet + zloto)        ║"
echo "║  5178  Electric Sapphire     (niebieski + tygrys + zloto)    ║"
echo "║  5179  Cherry Cobalt         (czerwien + kobalt + piasek)    ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# Zabij poprzednie instancje
for port in 5174 5175 5176 5177 5178 5179; do
  pkill -f "vite --port $port" 2>/dev/null
done
sleep 1

# Start wszystkich serwerów
(cd "$REPO/.worktrees/test-wersja-1-aktualizacja"       && npx vite --port 5174) &
(cd "$REPO/.worktrees/experiment-colors-goodman"         && npx vite --port 5175) &
(cd "$REPO/.worktrees/palette-kiwi-carrot"               && npx vite --port 5176) &
(cd "$REPO/.worktrees/palette-dare-devil"                && npx vite --port 5177) &
(cd "$REPO/.worktrees/palette-electric-sapphire"         && npx vite --port 5178) &
(cd "$REPO/.worktrees/palette-cherry-cobalt"             && npx vite --port 5179) &

echo "Wszystkie 6 serwerow uruchomione. Ctrl+C aby zatrzymac wszystkie."
echo ""

trap "pkill -f 'vite --port 517'; echo 'Zatrzymano.'; exit" INT TERM
wait
