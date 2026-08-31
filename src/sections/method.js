// Metoda — zwykła, statyczna lista kroków. Bez pinowania i bez przełączania
// aktywnego kroku w rytm scrolla (decyzja: sekcja ma wyglądać „jak na początku").
export function initMethod() {
  const section = document.querySelector("[data-method]");
  if (!section) return;

  section.querySelectorAll("[data-method-step]").forEach((step) => {
    step.classList.add("is-active");
  });
}
