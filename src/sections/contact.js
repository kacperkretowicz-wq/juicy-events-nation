const RECIPIENT = "kontakt@juicyevents.pl";

/** Komunikat błędu dla pola albo pusty string, gdy jest w porządku. */
function validate(field) {
  const value = field.value.trim();

  if (field.hasAttribute("required") && !value) {
    return field.tagName === "SELECT" ? "Wybierz zakres projektu." : "To pole jest wymagane.";
  }
  if (field.type === "email" && value && !/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(value)) {
    return "Sprawdź adres — brakuje @ albo domeny.";
  }
  if (field.name === "name" && value && value.length < 3) {
    return "Wpisz imię i nazwę firmy.";
  }
  return "";
}

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

  const showError = (field, message) => {
    const box = field.parentElement?.querySelector("[data-field-error]");
    field.parentElement?.classList.toggle("has-error", Boolean(message));
    field.setAttribute("aria-invalid", message ? "true" : "false");
    if (box) box.textContent = message;
    return !message;
  };

  fields.forEach((field, index) => {
    field.addEventListener("focus", () => setStep(index));

    // Walidacja na blur, nie na każdym znaku — inaczej pole krzyczy „błąd",
    // zanim użytkownik zdąży dopisać drugą literę.
    field.addEventListener("blur", () => showError(field, validate(field)));

    // Gdy pole już pokazało błąd, poprawka kasuje go natychmiast.
    field.addEventListener("input", () => {
      if (field.parentElement?.classList.contains("has-error")) showError(field, validate(field));
    });
  });
  setStep(0);

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    let firstInvalid = null;
    fields.forEach((field) => {
      const message = validate(field);
      showError(field, message);
      if (message && !firstInvalid) firstInvalid = field;
    });

    if (firstInvalid) {
      if (status) {
        status.hidden = false;
        status.dataset.state = "error";
        status.textContent = "Uzupełnij zaznaczone pola — bez nich nie ruszymy dalej.";
      }
      firstInvalid.focus();
      return;
    }

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
      status.dataset.state = "ok";
      status.textContent = "Otwieramy klienta poczty… Jeśli nic się nie stało, napisz na kontakt@juicyevents.pl.";
    }
    window.location.href = `mailto:${RECIPIENT}?subject=${subject}&body=${body}`;
  });
}
