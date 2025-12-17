// ========= Utility =========
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

// ========= Footer year =========
$("#year").textContent = new Date().getFullYear();

// ========= Theme toggle (saved) =========
const themeToggle = $("#themeToggle");
const savedTheme = localStorage.getItem("theme");
if (savedTheme) document.documentElement.setAttribute("data-theme", savedTheme);

themeToggle.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  const next = current === "light" ? "" : "light";
  if (next) document.documentElement.setAttribute("data-theme", next);
  else document.documentElement.removeAttribute("data-theme");
  localStorage.setItem("theme", next || "");
});

// ========= Modal =========
const modal = $("#modal");
const modalTitle = $("#modalTitle");
const modalMeta = $("#modalMeta");
const modalContent = $("#modalContent");

function openModal({ title, meta, contentNode }) {
  modalTitle.textContent = title || "";
  modalMeta.textContent = meta || "";
  modalContent.innerHTML = "";
  modalContent.appendChild(contentNode);

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");

  // Focus management
  const closeBtn = modal.querySelector("[data-close]");
  closeBtn?.focus();
}

function closeModal() {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  modalContent.innerHTML = "";
}

modal.addEventListener("click", (e) => {
  if (e.target.matches("[data-close]") || e.target.hasAttribute("data-close")) {
    closeModal();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
});

// ========= Gallery click -> modal =========
const galleryGrid = $("#galleryGrid");
galleryGrid.addEventListener("click", (e) => {
  const tile = e.target.closest(".tile");
  if (!tile) return;

  const fullSrc = tile.dataset.full;
  const title = tile.dataset.title;
  const meta = tile.dataset.meta;

  const img = document.createElement("img");
  img.src = fullSrc;
  img.alt = title ? `${title} — full view` : "Artwork full view";

  openModal({ title, meta, contentNode: img });
});

// ========= Gallery filters =========
const chips = $$(".chip");
chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    chips.forEach(c => c.classList.remove("is-active"));
    chip.classList.add("is-active");

    const filter = chip.dataset.filter;
    const tiles = $$(".tile");

    tiles.forEach((t) => {
      const tags = (t.dataset.tags || "").split(" ").map(s => s.trim());
      const show = filter === "all" || tags.includes(filter);
      t.style.display = show ? "" : "none";
    });
  });
});

// ========= Project "Details" buttons -> modal =========
$$("button[data-modal-title]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const title = btn.dataset.modalTitle || "Details";
    const body = btn.dataset.modalBody || "";

    const wrapper = document.createElement("div");
    wrapper.className = "details";

    // Convert the text into simple paragraphs + bullets (newline-based)
    const lines = body.split("\n").map(l => l.trim()).filter(Boolean);

    const pre = document.createElement("div");
    pre.style.whiteSpace = "pre-wrap";
    pre.style.color = "var(--muted)";
    pre.textContent = lines.join("\n");

    wrapper.appendChild(pre);

    openModal({ title, meta: "Project notes", contentNode: wrapper });
  });
});
