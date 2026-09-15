// ——— Kursor kontekstowy ———
// Biało-czarna pigułka (kółko z trójkątem play + podpis) zastępuje wskaźnik
// WYŁĄCZNIE nad elementami z [data-cursor] — dziś jest to kadr showreelu w hero.
// Poza nimi nie dzieje się nic: zostaje zwykły kursor systemowy.
//
// Kursor powstaje tylko przy prawdziwym wskaźniku: na dotyku nie ma czego śledzić.
//
// Dwuwarstwowa struktura (root 0×0 + wewnętrzna .cursor__pill) rozdziela dwa
// niezależne transformy: root tylko ŚLEDZI pozycję (translate3d z lerpem
// w pikselach), a pigułka sama się WYŚRODKOWUJE na tym punkcie i skaluje przy
// wejściu (translate(-50%,-50%) scale(...) w CSS). Pigułka ma zmienną
// szerokość (zależną od długości podpisu) — bez tego rozdzielenia jej własny
// transform nadpisywałby transform pozycji ustawiany z JS.

export function initCursor() {
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
  if (!fine.matches) return;

  const root = document.createElement("div");
  root.className = "cursor";
  root.setAttribute("aria-hidden", "true");
  root.innerHTML = `
    <span class="cursor__pill">
      <span class="cursor__disc"></span>
      <span class="cursor__label"></span>
    </span>
  `;
  // Zanim padnie pierwszy pointermove (np. strona otwarta z klawiatury, bez
  // ruchu myszy), punkt startowy siedzi poza kadrem — pigułka jest i tak
  // niewidoczna (opacity: 0 do czasu is-active), ale to sprzątanie na wszelki
  // wypadek.
  root.style.transform = "translate3d(-9999px, -9999px, 0)";
  document.body.appendChild(root);
  document.documentElement.classList.add("has-cursor-fx");

  const label = root.querySelector(".cursor__label");

  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let x = targetX;
  let y = targetY;
  let raf = null;
  let primed = false;

  const loop = () => {
    // Kursor „dogania" wskaźnik — ruch jest miękki, ale nadal precyzyjny.
    x += (targetX - x) * 0.18;
    y += (targetY - y) * 0.18;
    root.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;

    if (Math.abs(targetX - x) > 0.1 || Math.abs(targetY - y) > 0.1) {
      raf = requestAnimationFrame(loop);
    } else {
      raf = null;
    }
  };

  const kick = () => {
    if (!raf) raf = requestAnimationFrame(loop);
  };

  // Widoczność steruje WYŁĄCZNIE obecność `[data-cursor]` pod wskaźnikiem —
  // poza takim elementem pigułka jest całkowicie niewidoczna (opacity: 0
  // w CSS), nie zostaje po niej żaden ślad ani kropka.
  const setTarget = (host) => {
    if (!host) {
      root.classList.remove("is-active");
      root.removeAttribute("data-icon");
      return;
    }
    label.textContent = host.dataset.cursor || "";
    root.dataset.icon = host.dataset.cursorIcon || "none";
    root.classList.add("is-active");
  };

  document.addEventListener(
    "pointermove",
    (event) => {
      if (event.pointerType !== "mouse") return;

      targetX = event.clientX;
      targetY = event.clientY;

      if (!primed) {
        primed = true;
        // Bez skoku z poprzedniej pozycji przy pierwszym ruchu.
        x = targetX;
        y = targetY;
      }

      setTarget(event.target instanceof Element ? event.target.closest("[data-cursor]") : null);
      kick();
    },
    { passive: true }
  );

  document.addEventListener("pointerdown", () => root.classList.add("is-pressed"));
  document.addEventListener("pointerup", () => {
    root.classList.remove("is-pressed");
    // Kliknięcie potrafi zmienić podpis (np. „Odtwórz showreel" → „Wycisz").
    // Bez ponownego odczytu etykieta zostawała nieaktualna aż do pierwszego
    // ruchu myszy.
    requestAnimationFrame(() => {
      const under = document.elementFromPoint(targetX, targetY);
      setTarget(under instanceof Element ? under.closest("[data-cursor]") : null);
    });
  });

  document.addEventListener("mouseleave", () => root.classList.remove("is-active", "is-pressed"));

  // Zmiana urządzenia wskazującego (np. podpięcie myszy do tabletu) nie
  // wymaga przeładowania strony — ale i tak nie chcemy kursora na dotyku.
  fine.addEventListener?.("change", (e) => {
    if (!e.matches) {
      root.classList.remove("is-active", "is-pressed");
      document.documentElement.classList.remove("has-cursor-fx");
    } else {
      document.documentElement.classList.add("has-cursor-fx");
    }
  });
}
