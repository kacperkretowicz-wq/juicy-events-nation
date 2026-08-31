// Jeden „właściciel dźwięku" na stronę. Trzy niezależne moduły odciszają wideo
// (hero, sekcja „Nasza praca", podstrony realizacji) i żaden o sobie nie wie —
// bez tego potrafią grać z dźwiękiem jednocześnie.

let current = null;

/**
 * Przejmij dźwięk dla `video`. Poprzedni właściciel zostaje wyciszony i dostaje
 * event „jen:audio-released", żeby jego moduł mógł zresetować swój przycisk/stan.
 */
export function claimAudio(video) {
  if (current && current !== video) {
    current.muted = true;
    current.dispatchEvent(new CustomEvent("jen:audio-released"));
  }
  current = video;
}

/** Zwolnij dźwięk (ręczne wyciszenie, zamknięcie sekcji, opuszczenie viewportu). */
export function releaseAudio(video) {
  if (current === video) current = null;
}
