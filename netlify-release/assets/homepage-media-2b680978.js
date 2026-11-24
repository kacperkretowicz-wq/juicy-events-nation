function watchReelPreview(video, frame) {
  const preview = video?.getAttribute('src');
  if (!video || !preview || !frame) return;

  function updatePlayback() {
    if (video.getAttribute('src') !== preview) return;

    const { top, bottom } = frame.getBoundingClientRect();
    const visible = !document.hidden && top < innerHeight && bottom > 0;

    if (!visible) {
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
  window.addEventListener('pageshow', updatePlayback);
  window.addEventListener('focus', updatePlayback);
  video.addEventListener('canplay', updatePlayback);
  video.addEventListener('play', updatePlayback);

  function restorePreview() {
    video.defaultMuted = true;
    video.muted = true;
    video.loop = true;
    video.autoplay = true;
    video.src = preview;
    updatePlayback();
  }

  updatePlayback();
  return restorePreview;
}

export function prepareHomepageMedia() {
  const hero = document.querySelector('[data-agency-video]');
  const work = document.querySelector('[data-work-video]');

  return {
    restoreHeroPreview: watchReelPreview(hero, hero?.closest('[data-agency-media]')),
    restoreWorkPreview: watchReelPreview(work, work),
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
