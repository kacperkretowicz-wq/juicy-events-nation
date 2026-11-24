export const mobilePerformance = matchMedia('(max-width: 767px), (hover: none) and (pointer: coarse)').matches;

if (mobilePerformance) {
  document.documentElement.classList.add('is-mobile-performance');
}

let updateHeroPreview = () => {};

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
  const frame = hero.closest('[data-agency-media]');
  const connection = navigator.connection;
  let introDone = !document.querySelector('[data-hero-intro]');
  let inView = false;

  updateHeroPreview = () => {
    if (!hero.muted) return;
    const limitedData = connection?.saveData || /2g$/.test(connection?.effectiveType ?? '');
    if (!introDone || !inView || document.hidden || limitedData) {
      if (!hero.paused) hero.pause();
      return;
    }
    if (!hero.getAttribute('src')) hero.src = hero.dataset.loopSrc;
    hero.play().catch(() => {});
  };

  document.addEventListener('jen:intro-done', () => {
    introDone = true;
    updateHeroPreview();
  }, { once: true });
  document.addEventListener('visibilitychange', updateHeroPreview);

  if ('IntersectionObserver' in window && frame) {
    new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting && entry.intersectionRatio >= .15;
      updateHeroPreview();
    }, { threshold: .15 }).observe(frame);
  } else {
    inView = frame?.getBoundingClientRect().top < innerHeight;
    updateHeroPreview();
  }
}

export function restoreMobileHeroPreview(video) {
  video.removeAttribute('src');
  video.preload = 'none';
  video.load();
  updateHeroPreview();
}
