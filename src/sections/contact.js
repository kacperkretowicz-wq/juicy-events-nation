import { bindContactHeadlineReveal, syncHeadlineReveals } from "../effects.js";

const RECIPIENT = "kontakt@juicyevents.pl";

/** Po wczytaniu kadru przeliczamy triggery — kontakt jest na końcu strony. */
export function initContactParallaxRefresh() {
  const img = document.querySelector(".contact__bg img");
  if (!img) return;

  const refresh = () => syncHeadlineReveals();
  if (img.complete) {
    refresh();
    return;
  }
  img.addEventListener("load", refresh, { once: true });
}

export function initContactHeadlineReveal() {
  bindContactHeadlineReveal();
}

export function initSiteClosing() {
  initContactForm();
  initContactHeadlineReveal();
  initContactParallaxRefresh();
}

export function initContactForm() {
  const form = document.querySelector("[data-contact-form]");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const subject = encodeURIComponent(`Brief: Juicy Events · ${data.get("name")}`);
    const body = encodeURIComponent(
      [
        "Dzień dobry,",
        "",
        `Zgłaszający: ${data.get("name")}`,
        `Email: ${data.get("email")}`,
        "",
        data.get("message") || "",
        "",
        "Wiadomość ze strony juicyevents.pl",
      ].join("\n")
    );

    window.location.href = `mailto:${RECIPIENT}?subject=${subject}&body=${body}`;
  });
}
