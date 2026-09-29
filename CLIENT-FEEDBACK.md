# Juicy Nation — poprawki po uwagach klienta

Punkt wyjścia: `experiment/colors-10-bg-motion`, commit `931a148` (wersja preview1). Ta kopia jest osobną gałęzią `client/less-noise-red-figtree`.

## Uwagi klienta i wdrożenie

- Figtree: domyślny krój całej strony, łącznie z nagłówkami i etykietami. Font ładuje się z Google Fonts; fallback to systemowy sans serif.
- Za dużo kolorów: główny akcent zmieniony z pomarańczu na czerwień. Żółte i niebieskie powierzchnie zastąpione ciepłymi neutralnymi tonami. Sekcja kontaktowa jest teraz jasna.
- Za dużo tekstu: skrócony opis „Nasza praca”, nagłówek kompetencji i sekcja misji.
- Za dużo ruchu: usunięte migające intro, rotator w misji, automatyczny film w sekcji „Nasza praca”, ruch logotypów, pływający przycisk i dodatkowe mikroefekty. Showreel w „Nasza praca” jest dostępny po kliknięciu.

## Weryfikacja

`npm run build` przechodzi. Lokalny Edge, 1440 px i 390 px: Figtree załadowany, bez poziomego przewijania i błędów JavaScript; menu oraz przycisk showreela reagują. To jest wariant do oceny klienta, bez wdrożenia na Netlify.
