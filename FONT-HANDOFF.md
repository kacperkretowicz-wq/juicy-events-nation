# Typografia i kierunek wizualny — 2026-09-29

Wdrożony feedback właściciela z 2026-09-28 („za dużo tekstu, efektów, kolorów — festyn / dyskoteka”).

## Font
Figtree (SIL OFL 1.1) w całym serwisie — nagłówki, tekst, etykiety. Self-hosted w `public/fonts/figtree`
(wariant zmienny 300–900, podzielony na latin + latin-ext), licencja w `public/fonts/licenses/Figtree-OFL.txt`.
Usunięte: PP Mori, ABC Diatype (pliki z leveled-agency.fr), Cabinet Grotesk i Satoshi.

## Kolory
Jedno jasne tło (#f5f4f0), czerń (#111) i jeden akcent: czerwień z poprzedniej wersji strony (#ff281e).
Wypadły pomarańcz, cytryna i niebieski. Czerwień: przyciski, obracające się kółko „Kontakt”,
słowo-klucz w 3 nagłówkach (hero, „Nasza praca”, kontakt), wordmark w stopce.
Tokeny: `src/style/tokens.css`.

## Mniej efektów
- Intro: sam znak Je! na czerni (bez migania i montażu zdjęć co 300 ms).
- Logotypy klientów i wordmark stopki stoją w miejscu (bez pętli marquee), logotypy w skali szarości.
- Misja: jedno zdanie zamiast przypiętej sekcji z rotującymi słowami.
- Kompetencje: statyczna lista na białym tle zamiast podświetlanej listy na czerni.
- Realizacje: spokojna siatka 2 kolumn, bez kolorowych teł na hover i bez etykiety za kursorem.
- Zespół: cztery jednakowe białe karty.
- Kontakt: na czerni, przechodzi w stopkę (zamiast cytrynowego tła).
- Bez ziarna, magnetycznych przycisków, czerwonej poświaty na nagłówkach i panelu „Czcionki i kolory”.

Poprzednia wersja (z laboratorium palet) zostaje na gałęzi `experiment/colors-10-bg-motion`.
