const RECIPIENT = "kontakt@juicyevents.pl";

export function initContactForm() {
  const form = document.querySelector("[data-contact-form]");
  if (!form) return;

  const fields = [...form.querySelectorAll("input, select, textarea")];
  const stepLabel = form.querySelector("[data-step-current]");
  const stepBar = form.querySelector("[data-step-bar]");
  const status = form.querySelector("[data-form-status]");

  const setStep = (index) => {
    const step = Math.min(index + 1, fields.length);
    if (stepLabel) stepLabel.textContent = String(step);
    if (stepBar) stepBar.style.width = `${(step / fields.length) * 100}%`;
  };

  fields.forEach((field, index) => {
    field.addEventListener("focus", () => setStep(index));
  });
  setStep(0);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const subject = encodeURIComponent(`Brief — Juicy Events · ${data.get("need")}`);
    const body = encodeURIComponent(
      [
        "Dzień dobry,",
        "",
        `Zgłaszający: ${data.get("name")}`,
        `Email: ${data.get("email")}`,
        `Zakres: ${data.get("need")}`,
        "",
        data.get("message") || "",
        "",
        "— wiadomość ze strony juicyevents.pl",
      ].join("\n")
    );

    if (status) {
      status.hidden = false;
      status.textContent = "Otwieramy klienta poczty…";
    }
    window.location.href = `mailto:${RECIPIENT}?subject=${subject}&body=${body}`;
  });
}
