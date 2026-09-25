// Showreel w hero gra od razu, wyciszony, jako tło. Przycisk „Odtwórz showreel”
// (pigułka za kursorem + odtwarzanie z dźwiękiem) został usunięty — nie było go
// w feedbacku właściciela, a początek ma być czystym „strzałem” showreelem.
//
// Film zaczyna się od START_AT, a nie od zera: pierwsze sekundy materiału to
// rozbieg, który nie nadaje się na tło hero.
const START_AT = 31;

export function initHeroReel() {
  const video = document.querySelector("[data-agency-video]");
  if (!video) return;

  const seekToStart = () => {
    try {
      video.currentTime = START_AT;
    } catch {
      // Seek przed gotowością bufora potrafi rzucić — poster i tak pokazuje kadr.
    }
  };

  if (video.readyState >= 1) seekToStart();
  else video.addEventListener("loadedmetadata", seekToStart, { once: true });
}
