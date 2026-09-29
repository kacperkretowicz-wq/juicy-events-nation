# Koncept „Mozaika Tolia” — 2026-09-29 (gałąź `claude/koncept-tolia-mozaika`)

Trzecia propozycja, zbudowana na wersji umiarkowanej (Figtree, czerwony kafelek z filmem, spokojniejsze
efekty — opis niżej). Inspiracja: pin od właściciela „Portfolio – Tolia Foods” (identyfikacja Maevi Studio,
tagi: paleta gastronomiczna / meksykańska / pomarańczowa). Pozostałych trzech pinów nie dało się otworzyć
(Pinterest zablokowany w środowisku), więc koncept opiera się na palecie i kompozycji z tego pinu.

- Paleta Tolia jako system: tło Tolia Cream `#f3e8cc`, czerwień Tomato Burst (marka), Forest Green `#18542a`
  zamiast czerni w stopce i menu, Sunshine do napisów na zieleni/czerwieni i hover, Kiwi tylko w mozaice.
- Kompetencje jako „mozaika Tolia”: trzy kolumny bloków bez odstępów, pary kolorów wprost z palety
  (czarny tytuł na słońcu, czerwień na kremie, słońce na czerwieni, zieleni i czerni, zieleń na kiwi),
  nazwy kompetencji dużymi wersalikami Figtree 800 — jak podpisy na palecie.
- Pełna paleta pojawia się tylko w tej jednej sekcji; reszta strony jest kremowa. Zespół bez zmian
  (biel / czerwień / czerń / niebieski).
- Misja: zdjęcie jako pas, który z obu stron rozpływa się w krem; napisy białe.
- Stopka i menu w butelkowej zieleni; napis JUICY EVENTS słonecznym żółtym na pomidorze.
- Kafle realizacji po najechaniu: czerwień / słońce / zieleń. Panel `/?palette-lab=1` startuje z presetem „Mozaika Tolia”.

---

# Kierunek wizualny — 2026-09-29 (wersja umiarkowana)

Baza: `experiment/colors-10-bg-motion` (wersja oceniona przez właściciela 28.09). Struktura i efekty,
o które właściciel prosił wcześniej, zostają — zmienia się font, paleta i „ilość” (tekst, kolory, ruch).
Wersja mocno odchudzona leży osobno na gałęzi `claude/wersja-minimalna-figtree`.

## Feedback, który wdraża ta wersja
- 28.09: Figtree jako główny font; „za dużo się dzieje, za dużo kolorów — festyn / dyskoteka”;
  „pomarańczowy zamieniłbym na czerwony z poprzedniego projektu”; za dużo tekstu, efektów, kolorów, brak oddechu.
- 25.09 (zrzuty z czatu zespołu): „marki” w hero na biało; „Po co Ci agencja…” — wszystko siedzi;
  „Nasza praca” — zwykły czerwony kafelek z krótkim filmem w kwadracie; misja — napisy na biało;
  Jakub na niebiesko; kontakt bez logo Je!; przetestować palety (Tolia Foods).
  Uwaga: kafelek z 25.09 (`bc6ebc5`) został 15 min później zastąpiony pionowym kadrem z migającym Je!
  (`931a148`) — tu wraca kafelek, o który prosił właściciel.

## Font
Figtree (SIL OFL 1.1) w całym serwisie, self-hosted w `public/fonts/figtree` (wariant zmienny,
latin + latin-ext), licencja w `public/fonts/licenses/Figtree-OFL.txt`. Usunięte: PP Mori, ABC Diatype,
Cabinet Grotesk, Satoshi.

## Paleta (w stylu Tolia Foods)
Krem `#f6efdf` (tło), czerń `#1c1712`, czerwień Tomato Burst `#d52518` (kolor marki zamiast pomarańczu),
słońce `#ffc926` (tylko hover — „przycisk czerwony, a jak najedziesz — żółty”), niebieski `#2f4fd1`
(karta Jakuba). Zespół zostaje w czterech kolorach: biel / czerwień / czerń / niebieski.
Czerwone słowo-klucz tylko w 3 nagłówkach (hero, „Nasza praca”, kontakt); na ciemnym tle i na zdjęciach — biel.
Kontakt na kremie zamiast cytryny. Tokeny: `src/style/tokens.css`.

## Mniej ruchu i tekstu (bez wycinania sekcji)
- Intro Je!: 2 mrugnięcia zamiast 6 i 6 zdjęć co 420 ms zamiast 9 co 300 ms (mieści się w WCAG 2.3.1).
- Bez kolorowej „poświaty” na nagłówkach, bez ziarna i bez magnetycznych przycisków.
- Logotypy klientów stoją i są równo rozłożone; napis JUICY EVENTS w stopce jedzie wolniej.
- Kafle realizacji: kolory tła z palety zespołu, etykieta „Zobacz case” bez przechylenia, pokaz zdjęć 0,9 s.
- Kręcące się kółko „Kontakt” mniejsze i wolniejsze; krótsze przewijanie hero i misji.
- Krótsze opisy w „Nasza praca”, kompetencjach i na liście realizacji; bez liczników (06).

## Media
- `work-square.mp4` (8 s, 720×720, 0,8 MB) — pętla z gali Active & Fashion.Art do czerwonego kafelka.
- `work-showreel.mp4` przekodowany z HEVC do H.264 (6 MB zamiast 26 MB) — HEVC nie gra w Chrome/Firefox
  na wielu komputerach.

## Panel „Czcionki i kolory”
Ukryty na stronie; otwiera go adres `/?palette-lab=1` (np. do wspólnej sesji wideo z klientem).
Domyślnie: Figtree + preset „Tolia: krem + pomidor”; wariant „Tolia + zieleń” pokazuje ciemne sekcje w zieleni.
