export const mobilePerformance = matchMedia('(max-width: 767px), (hover: none) and (pointer: coarse)').matches;

if (mobilePerformance) {
  document.documentElement.classList.add('is-mobile-performance');
}

let updateMobileBackground = () => {};

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

  hero.dataset.loopSrc = hero.dataset.mobileLoopSrc;
  hero.dataset.filmSrc = hero.dataset.mobileFilmSrc;
  hero.muted = true;
  hero.src = hero.dataset.loopSrc;
  hero.preload = 'auto';
  hero.autoplay = true;
  const frame = hero.closest('[data-agency-media]');
  const bounds = frame?.getBoundingClientRect();
  let inView = !!bounds && bounds.top < innerHeight && bounds.bottom > 0;

  updateMobileBackground = () => {
    if (!hero.muted) return;
    hero.autoplay = inView && !document.hidden;
    if (!hero.autoplay) {
      hero.pause();
    } else if (hero.paused) {
      hero.play().catch(() => {});
    }
  };

  document.addEventListener('visibilitychange', updateMobileBackground);
  if ('IntersectionObserver' in window && frame) {
    new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting && entry.intersectionRatio >= .15;
      updateMobileBackground();
    }, { threshold: .15 }).observe(frame);
  }
  updateMobileBackground();
}

export function restoreMobileHeroPreview(video) {
  video.src = video.dataset.loopSrc;
  updateMobileBackground();
}
