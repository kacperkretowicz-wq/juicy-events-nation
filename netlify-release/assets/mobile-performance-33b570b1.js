export const mobilePerformance = matchMedia('(max-width: 767px), (hover: none) and (pointer: coarse)').matches;

if (mobilePerformance) {
  document.documentElement.classList.add('is-mobile-performance');
}

export function prepareHomepageMedia() {
  const hero = document.querySelector('[data-agency-video]');
  const work = document.querySelector('[data-work-video]');
  if (!hero || !work) return;

  if (!mobilePerformance) {
    hero.src = hero.dataset.loopSrc;
    hero.preload = 'auto';
    hero.autoplay = true;
    work.src = work.dataset.workPreview;
    work.preload = 'auto';
    work.autoplay = true;
    return;
  }

  hero.muted = true;
  hero.src = hero.dataset.mobileFilmSrc;
  hero.preload = 'auto';
  hero.autoplay = true;
  const frame = hero.closest('[data-agency-media]');
  const bounds = frame?.getBoundingClientRect();
  let inView = !!bounds && bounds.top < innerHeight && bounds.bottom > 0;

  const syncPlayback = () => {
    if (!hero.muted) return;
    if (!inView || document.hidden) {
      hero.pause();
    } else if (hero.paused) {
      hero.play().catch(() => {});
    }
  };

  document.addEventListener('visibilitychange', syncPlayback);
  hero.addEventListener('volumechange', syncPlayback);
  if ('IntersectionObserver' in window && frame) {
    new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting && entry.intersectionRatio >= .15;
      syncPlayback();
    }, { threshold: .15 }).observe(frame);
  }
  syncPlayback();
}

export function bindMobileHeroSound({ video, media, button, onSoundOn, onSoundOff }) {
  const setSound = (enabled) => {
    video.muted = !enabled;
    if (button) {
      button.textContent = enabled ? 'Wyłącz dźwięk showreela' : 'Włącz dźwięk showreela';
      button.setAttribute('aria-pressed', String(enabled));
    }
    if (enabled) onSoundOn();
    else onSoundOff();
  };

  const toggleSound = () => {
    const enableSound = video.muted;
    setSound(enableSound);
    video.play().catch(() => { if (enableSound) setSound(false); });
  };

  if (button) {
    button.setAttribute('aria-label', 'Dźwięk showreela');
    setSound(false);
  }
  button?.addEventListener('click', toggleSound);
  media.addEventListener('click', toggleSound);
  video.addEventListener('jen:audio-released', () => setSound(false));
}
