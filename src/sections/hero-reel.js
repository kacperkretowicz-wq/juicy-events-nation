// Po montażu intro showreel startuje od właściwego fragmentu.
// Pętla wraca do tego samego miejsca, bez rozbiegu filmu.
const START_AT = 31;

export function initHeroReel() {
  const video = document.querySelector("[data-agency-video]");
  if (!video) return;

  // Native looping returns to frame zero, exposing the unwanted lead-in again.
  video.loop = false;

  const seekToStart = () => {
    try {
      video.currentTime = Math.min(START_AT, Math.max(0, (video.duration || START_AT + 1) - 1));
    } catch {
      // Seek przed gotowością bufora potrafi rzucić — poster i tak pokazuje kadr.
    }
  };

  if (video.readyState >= 1) seekToStart();
  else video.addEventListener("loadedmetadata", seekToStart, { once: true });

  document.addEventListener("jen:intro-done", seekToStart, { once: true });

  video.addEventListener("ended", () => {
    seekToStart();
    const section = video.closest("[data-agency]");
    const rect = section?.getBoundingClientRect();
    if (!rect || (rect.top < window.innerHeight && rect.bottom > 0)) {
      video.play().catch(() => {});
    }
  });
}
