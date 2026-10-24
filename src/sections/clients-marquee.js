// Pas klientów: renderowany w runtime z /media/clients/clients.json
// (manifest [{"name":..,"file":..}], uzupełniany przez osobny proces — patrz
// public/media/clients/README, jeśli istnieje). Jeśli manifest jest pusty albo
// nieosiągalny, zostaje statyczna lista logotypów wpisana w index.html.
export async function initClientsLogos() {
  const wrap = document.querySelector("[data-marquee]");
  const track = wrap?.querySelector("[data-marquee-track]");
  if (!wrap || !track) return;

  let entries = [];
  try {
    const res = await fetch("/media/clients/clients.json", { cache: "no-store" });
    if (res.ok) entries = await res.json();
  } catch {
    entries = [];
  }

  if (!Array.isArray(entries) || !entries.length) return;

  track.innerHTML = "";
  entries.forEach(({ name, file }) => {
    if (!file) return;
    const li = document.createElement("li");
    li.className = "clients__item";
    const img = document.createElement("img");
    img.src = `/media/clients/${file}`;
    img.alt = name || "";
    img.width = 240;
    img.height = 120;
    img.loading = "lazy";
    img.decoding = "async";
    li.append(img);
    track.append(li);
  });
}
