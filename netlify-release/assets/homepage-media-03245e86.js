function watchReelPreview(video, frame) {
  const preview = video?.getAttribute('src');
  if (!video || !preview || !frame) return;

  let retryFrame = 0;
  let retried = false;

  const isPreview = () => video.getAttribute('src') === preview;
  const isVisible = () => {
    const { top, bottom } = frame.getBoundingClientRect();
    return !document.hidden && top < innerHeight && bottom > 0;
  };

  function retryInterruptedPreview() {
    if (retryFrame || retried || !isPreview() || !isVisible()) return;
    retryFrame = requestAnimationFrame(() => {
      retryFrame = 0;
      if (!isPreview() || !isVisible() || !video.paused) return;
      retried = true;
      updatePlayback();
    });
  }

  function updatePlayback() {
    if (!isPreview()) return;

    if (!isVisible()) {
      retried = false;
      video.pause();
    } else if (video.paused) {
      video.play().catch(error => {
        if (error.name === 'AbortError') retryInterruptedPreview();
      });
    }
  }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(updatePlayback, { threshold: [0, .05] }).observe(frame);
  }
  document.addEventListener('visibilitychange', updatePlayback);
  document.addEventListener('jen:intro-removed', () => requestAnimationFrame(updatePlayback));
  window.addEventListener('pageshow', updatePlayback);
  window.addEventListener('focus', updatePlayback);
  video.addEventListener('canplay', updatePlayback);
  video.addEventListener('play', updatePlayback);
  video.addEventListener('pause', retryInterruptedPreview);

  function restorePreview() {
    retried = false;
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
