// „Jaki masz plan?": klik w wiersz prowadzi do briefu i wpisuje wybraną kategorię
// w pole „Co planujesz" (jeśli jest puste) — klient nie zaczyna od pustej kartki.
// Samo przewinięcie do #kontakt robi wspólny handler kotwic w shared.js.
export function initServices() {
  const section = document.querySelector("[data-services]");
  const form = document.querySelector("[data-contact-form]");
  const message = form?.querySelector("textarea[name='message']");
  if (!section || !message) return;

  section.querySelectorAll("[data-plan]").forEach((link) => {
    link.addEventListener("click", () => {
      const plan = link.dataset.plan;
      if (!plan) return;
      if (!message.value.trim()) message.value = `${plan} — `;
      // Fokus po dojechaniu scrolla (Lenis ~1 s), bez wyrywania widoku w trakcie.
      setTimeout(() => message.focus({ preventScroll: true }), 1100);
    });
  });
}
