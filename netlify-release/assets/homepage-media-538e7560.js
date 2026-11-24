export const useCompactReels = matchMedia('(max-width: 767px), (hover: none) and (pointer: coarse)').matches;

function watchReelPreview(video, preview, frame) {
  if (!video || !preview || !frame) return;

  function updatePlayback() {
    if (video.getAttribute('src') !== preview) return;

    const { top, bottom } = frame.getBoundingClientRect();
    video.autoplay = !document.hidden && top < innerHeight && bottom > 0;

    if (!video.autoplay) {
      video.pause();
    } else if (video.paused) {
      video.play().catch(() => {});
    }
  }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(updatePlayback, { threshold: [0, .05] }).observe(frame);
  }
  document.addEventListener('visibilitychange', updatePlayback);
  document.addEventListener('jen:intro-done', updatePlayback);

  function restorePreview() {
    video.defaultMuted = true;
    video.muted = true;
    video.loop = true;
    video.preload = 'auto';
    video.src = preview;
    updatePlayback();
  }

  restorePreview();
  return restorePreview;
}

export function prepareHomepageMedia() {
  const hero = document.querySelector('[data-agency-video]');
  const work = document.querySelector('[data-work-video]');

  return {
    restoreHeroPreview: watchReelPreview(
      hero,
      useCompactReels ? hero?.dataset.mobileLoopSrc : hero?.dataset.loopSrc,
      hero?.closest('[data-agency-media]'),
    ),
    restoreWorkPreview: watchReelPreview(work, work?.dataset.workPreview, work),
  };
}

export function playReelFromBeginning(video, source) {
  video.autoplay = false;
  video.loop = false;
  video.removeAttribute('poster');
  video.defaultMuted = false;
  video.muted = false;
  video.src = source;
  video.currentTime = 0;
  return video.play();
}
