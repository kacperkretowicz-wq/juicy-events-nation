const wordmark = document.querySelector('.site-footer__wordmark');
const floatingLink = document.querySelector('[data-float-cta]');

if (wordmark && floatingLink && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(([entry]) => {
    floatingLink.classList.toggle('is-over-wordmark', entry.isIntersecting);
  });

  observer.observe(wordmark);
}

const agencyStage = document.querySelector('.agency__stage');
if (agencyStage && floatingLink && 'IntersectionObserver' in window) {
  new IntersectionObserver(([entry]) => {
    floatingLink.classList.toggle('is-over-hero', entry.isIntersecting);
  }).observe(agencyStage);
}
