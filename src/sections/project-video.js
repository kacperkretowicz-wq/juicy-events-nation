// Karta projektu z wideo: autoplay w viewport + rozwinięcie kadru po kliknięciu,
// przy czym tytuł/opis obok karty zawsze zostają w pełni widoczne (skalujemy tylko medium).
export function initProjectVideo() {
  const buttons = [...document.querySelectorAll("[data-video-card]")];
  if (!buttons.length) return;

  const collapseAll = (except) => {
    buttons.forEach((button) => {
      if (button === except) return;
      const card = button.closest(".project-card");
      if (!card?.classList.contains("is-expanded")) return;
      card.classList.remove("is-expanded");
      button.setAttribute("aria-expanded", "false");
    });
  };

  buttons.forEach((button) => {
    const card = button.closest(".project-card");
    const video = button.querySelector("[data-project-video]");

    if (video && "IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) video.play().catch(() => {});
            else video.pause();
          });
        },
        { threshold: 0.25 }
      );
      observer.observe(button);
    }

    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const expanded = card?.classList.toggle("is-expanded");
      button.setAttribute("aria-expanded", String(Boolean(expanded)));
      if (expanded) collapseAll(button);
    });
  });

  document.addEventListener("click", (event) => {
    const openButton = buttons.find((button) => button.closest(".project-card")?.classList.contains("is-expanded"));
    if (!openButton || openButton.contains(event.target)) return;
    collapseAll();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") collapseAll();
  });
}
