/* ────────────────────────────────────────────────────────────
   System Status Dashboard — Vanilla JavaScript
   Renders systems from a JSON array, handles filtering, search,
   sorting, sidebar views, modals, theme and toasts.
   ──────────────────────────────────────────────────────────── */

"use strict";

/* ── Data ─────────────────────────────────────────────────── */

const now = Date.now();
const HOUR = 3600e3;
const DAY = 24 * HOUR;

const SYSTEMS = [
  {
    id: "acadtrack",
    title: "AcadTrack",
    description:
      "Academic tracking and record management platform built with Flask and PostgreSQL. Handles schedules, grades, and student progress across campuses.",
    tech: ["Python", "Flask", "PostgreSQL"],
    status: "operational",
    uptime: 99.98,
    version: "v3.1.0",
    updatedAt: now - 2 * HOUR,
  },
  {
    id: "teacher-management",
    title: "Teacher Management Portal",
    description:
      "Portal for managing teacher assignments, workloads, and attendance. Lightweight web app optimized for quick daily administrative workflows.",
    tech: ["Flask", "JavaScript"],
    status: "operational",
    uptime: 99.95,
    version: "v2.4.2",
    updatedAt: now - 5 * HOUR,
  },
  {
    id: "facilitator-dashboard",
    title: "Facilitator Dashboard",
    description:
      "Progress-tracking dashboard for facilitators, delivered as an installable PWA. Available offline with deferred sync to the central service.",
    tech: ["JavaScript", "PWA"],
    status: "degraded",
    uptime: 98.7,
    version: "v1.8.0",
    updatedAt: now - 1 * DAY,
  },
  {
    id: "shopper",
    title: "Shopper",
    description:
      "Catalog and cart experience for a retail storefront. Backed by Flask services with PostgreSQL persistence and a mobile-first PWA client.",
    tech: ["Flask", "PostgreSQL", "PWA"],
    status: "operational",
    uptime: 100,
    version: "v4.0.1",
    updatedAt: now - 30 * 60e3,
  },
];

const LOGS = [
  { id: 1, level: "info", system: "Shopper", action: "Deployment", detail: "v4.0.1 shipped to production.", time: now - 30 * 60e3 },
  { id: 2, level: "info", system: "AcadTrack", action: "Deployment", detail: "v3.1.0 shipped to production.", time: now - 2 * HOUR },
  { id: 3, level: "info", system: "Teacher Management Portal", action: "Deployment", detail: "v2.4.2 shipped to production.", time: now - 5 * HOUR },
  { id: 4, level: "warn", system: "Facilitator Dashboard", action: "Status change", detail: "Marked degraded — sync queue backlog over the last hour.", time: now - 26 * HOUR },
  { id: 5, level: "info", system: "Facilitator Dashboard", action: "Added", detail: "Registered for monitoring.", time: now - 30 * DAY },
];
let logId = LOGS.length + 1;

/* ── Status metadata ──────────────────────────────────────── */

const STATUS_META = {
  operational: { label: "Operational" },
  degraded: { label: "Degraded" },
};

const FILTERS = {
  all: () => true,
  operational: (s) => s.status === "operational",
  issues: (s) => s.status === "degraded",
};

const SORTERS = {
  updated: (a, b) => b.updatedAt - a.updatedAt,
  name: (a, b) => a.title.localeCompare(b.title),
  uptimeDesc: (a, b) => b.uptime - a.uptime,
  uptimeAsc: (a, b) => a.uptime - b.uptime,
};

/* ── State ────────────────────────────────────────────────── */

let currentFilter = "all";
let searchQuery = "";
let sortBy = "updated";
let modalOpen = false;
let lastFocused = null;

/* ── DOM refs ─────────────────────────────────────────────── */

const grid = document.getElementById("systems-grid");
const emptyState = document.getElementById("empty-state");
const clearFiltersBtn = document.getElementById("clear-filters-btn");
const countLabel = document.getElementById("count-label");
const subtitle = document.getElementById("page-subtitle");
const filterGroup = document.getElementById("filter-group");
const sidebarNav = document.getElementById("sidebar-nav");
const searchInput = document.getElementById("search-input");
const sortSelect = document.getElementById("sort-select");
const newSystemBtn = document.getElementById("new-system-btn");
const themeToggle = document.getElementById("theme-toggle");
const modal = document.getElementById("modal");
const modalPanel = document.getElementById("modal-panel");
const toastRegion = document.getElementById("toast-region");

const statTotal = document.getElementById("stat-total");
const statOperational = document.getElementById("stat-operational");
const statIssues = document.getElementById("stat-issues");
const statUptime = document.getElementById("stat-uptime");

/* ── Helpers ──────────────────────────────────────────────── */

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[ch]);
}

function formatUptime(value) {
  return value === 100 ? "100%" : value.toFixed(2) + "%";
}

function statValue(sum, count) {
  return sum === 0 ? "0%" : (sum / count).toFixed(2) + "%";
}

function timeAgo(ts) {
  const diff = Date.now() - ts;
  if (diff < 60e3) return "just now";
  const mins = Math.floor(diff / 60e3);
  if (mins < 60) return mins + "m ago";
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return hrs + "h ago";
  const days = Math.floor(hrs / 24);
  if (days < 30) return days + "d ago";
  return Math.floor(days / 30) + "mo ago";
}

/* ── Templates ────────────────────────────────────────────── */

function cardHTML(system) {
  const meta = STATUS_META[system.status];
  const barWidth = Math.min(100, system.uptime);
  const techTags = system.tech.map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join("");

  return `
    <article class="system-card">
      <div class="card-top">
        <div class="card-title-row">
          <span class="dot dot--${system.status}" aria-hidden="true"></span>
          <h3>${escapeHtml(system.title)}</h3>
        </div>
        <span class="badge badge--${system.status}">${meta.label}</span>
      </div>

      <p class="card-desc">${escapeHtml(system.description)}</p>

      <div class="tag-row">${techTags}</div>

      <div class="uptime-block">
        <div class="uptime-head">
          <span>Uptime · 30D</span>
          <span class="uptime-val">${formatUptime(system.uptime)}</span>
        </div>
        <div class="uptime-track">
          <div class="uptime-bar uptime-bar--${system.status}" style="width:${barWidth}%"></div>
        </div>
      </div>

      <div class="card-footer">
        <span class="version">${escapeHtml(system.version)}</span>
        <span data-time="${system.updatedAt}">${timeAgo(system.updatedAt)}</span>
        <a href="#" class="open-link" data-id="${escapeHtml(system.id)}" aria-label="Open ${escapeHtml(system.title)}">
          OPEN
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </a>
      </div>
    </article>
  `;
}

function logHTML(log) {
  return `
    <div class="log-item">
      <span class="log-icon log-icon--${log.level}" aria-hidden="true"></span>
      <div class="log-body">
        <p class="log-title"><strong>${escapeHtml(log.system)}</strong> — ${escapeHtml(log.action)}</p>
        <p class="log-detail">${escapeHtml(log.detail)}</p>
      </div>
      <span class="log-time" data-time="${log.time}">${timeAgo(log.time)}</span>
    </div>
  `;
}

const closeBtnHTML =
  '<button class="modal-close" type="button" data-close-modal aria-label="Close">' +
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">' +
  '<path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg></button>';

function newSystemFormHTML() {
  return `
    <div class="modal-head">
      <h2 id="modal-title">Add system</h2>
      ${closeBtnHTML}
    </div>
    <form id="system-form" class="modal-body" novalidate>
      <div class="form-group">
        <label class="form-label" for="f-title">Name</label>
        <input class="field" id="f-title" name="title" type="text" required maxlength="60" placeholder="e.g. Payroll API" autocomplete="off" />
      </div>
      <div class="form-group">
        <label class="form-label" for="f-desc">Description</label>
        <textarea class="field" id="f-desc" name="description" rows="3" required placeholder="What does this system do?"></textarea>
      </div>
      <div class="form-group">
        <label class="form-label" for="f-tech">Tech stack</label>
        <input class="field" id="f-tech" name="tech" type="text" placeholder="Comma separated — e.g. Flask, PostgreSQL" autocomplete="off" />
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label" for="f-status">Status</label>
          <select class="field" id="f-status" name="status">
            <option value="operational">Operational</option>
            <option value="degraded">Degraded</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label" for="f-uptime">Uptime %</label>
          <input class="field" id="f-uptime" name="uptime" type="number" min="0" max="100" step="0.01" value="100" required />
        </div>
        <div class="form-group">
          <label class="form-label" for="f-version">Version</label>
          <input class="field" id="f-version" name="version" type="text" placeholder="v1.0.0" autocomplete="off" />
        </div>
      </div>
      <div class="modal-actions">
        <button class="btn-ghost" type="button" data-close-modal>Cancel</button>
        <button class="btn-primary" type="submit">Add system</button>
      </div>
    </form>
  `;
}

function detailHTML(system) {
  const meta = STATUS_META[system.status];
  const barWidth = Math.min(100, system.uptime);
  const techTags = system.tech.map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join("");
  const related = LOGS
    .filter((l) => l.system === system.title)
    .sort((a, b) => b.time - a.time)
    .slice(0, 5)
    .map(logHTML)
    .join("");

  return `
    <div class="modal-head">
      <h2 id="modal-title">${escapeHtml(system.title)}</h2>
      ${closeBtnHTML}
    </div>
    <div class="modal-body">
      <div class="detail-row">
        <span class="badge badge--${system.status}">${meta.label}</span>
        <span class="version">${escapeHtml(system.version)}</span>
      </div>

      <p class="card-desc">${escapeHtml(system.description)}</p>

      <div class="tag-row">${techTags}</div>

      <div class="uptime-block">
        <div class="uptime-head">
          <span>Uptime · 30D</span>
          <span class="uptime-val">${formatUptime(system.uptime)}</span>
        </div>
        <div class="uptime-track">
          <div class="uptime-bar uptime-bar--${system.status}" style="width:${barWidth}%"></div>
        </div>
      </div>

      <div class="detail-row">
        <span>Last updated</span>
        <span data-time="${system.updatedAt}">${timeAgo(system.updatedAt)}</span>
      </div>

      ${related ? `<div class="detail-logs"><p class="detail-logs-title">Recent activity</p>${related}</div>` : ""}
    </div>
  `;
}

/* ── Render ───────────────────────────────────────────────── */

function buildStats() {
  const total = SYSTEMS.length;
  const operational = SYSTEMS.filter((s) => s.status === "operational").length;
  const issues = total - operational;
  const avgUptime = statValue(
    SYSTEMS.reduce((sum, s) => sum + s.uptime, 0),
    total
  );

  statTotal.textContent = String(total);
  statOperational.textContent = `${operational}/${total}`;
  statIssues.textContent = String(issues);
  statUptime.textContent = avgUptime;
  subtitle.textContent = `${operational} of ${total} systems operational · avg ${avgUptime} uptime`;
}

function visibleSystems() {
  const q = searchQuery.trim().toLowerCase();

  return SYSTEMS
    .filter(FILTERS[currentFilter])
    .filter((s) => {
      if (!q) return true;
      return (
        s.title.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.version.toLowerCase().includes(q) ||
        s.tech.join(" ").toLowerCase().includes(q)
      );
    })
    .sort(SORTERS[sortBy] || SORTERS.updated);
}

function renderGrid() {
  const list = visibleSystems();

  grid.innerHTML = list.map(cardHTML).join("");
  emptyState.hidden = list.length > 0;
  countLabel.textContent = `${list.length} of ${SYSTEMS.length} systems`;
}

function renderLogs() {
  const logsList = document.getElementById("logs-list");
  const logsEmpty = document.getElementById("logs-empty");
  if (!logsList || !logsEmpty) return;

  const sorted = LOGS.slice().sort((a, b) => b.time - a.time);
  logsList.innerHTML = sorted.map(logHTML).join("");
  logsEmpty.hidden = sorted.length > 0;
}

/* ── Views ────────────────────────────────────────────────── */

function switchView(view) {
  sidebarNav.querySelectorAll(".nav-item").forEach((btn) => {
    const isActive = btn.dataset.nav === view;
    btn.classList.toggle("is-active", isActive);
    if (isActive) btn.setAttribute("aria-current", "page");
    else btn.removeAttribute("aria-current");
  });

  document.querySelectorAll(".view").forEach((v) => {
    v.hidden = v.id !== "view-" + view;
  });

  if (view === "logs") renderLogs();
  else if (view === "dashboard") { buildStats(); renderGrid(); }
}

function setActiveFilter(filter) {
  filterGroup.querySelectorAll(".filter-btn").forEach((btn) => {
    const isActive = btn.dataset.filter === filter;
    btn.classList.toggle("is-active", isActive);
    btn.setAttribute("aria-pressed", String(isActive));
  });
}

/* ── Theme ────────────────────────────────────────────────── */

function applyTheme(dark) {
  document.documentElement.dataset.theme = dark ? "dark" : "light";
  try { localStorage.setItem("theme", dark ? "dark" : "light"); } catch (e) {}
  themeToggle.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
}

/* ── Modal ────────────────────────────────────────────────── */

function openModal(html) {
  modalPanel.innerHTML = html;
  lastFocused = document.activeElement;
  modal.hidden = false;
  modalOpen = true;
  document.body.classList.add("no-scroll");

  requestAnimationFrame(() => {
    const target = modalPanel.querySelector("input, select, textarea") || modalPanel.querySelector("button");
    if (target) target.focus();
  });
}

function closeModal() {
  if (!modalOpen) return;
  modalOpen = false;
  modal.hidden = true;
  modalPanel.innerHTML = "";
  document.body.classList.remove("no-scroll");
  if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
}

/* ── Toasts ───────────────────────────────────────────────── */

function toast(message, type = "info") {
  const el = document.createElement("div");
  el.className = `toast toast--${type}`;
  el.textContent = message;
  toastRegion.appendChild(el);

  requestAnimationFrame(() => el.classList.add("toast--show"));

  setTimeout(() => {
    el.classList.remove("toast--show");
    setTimeout(() => el.remove(), 300);
  }, 3200);
}

/* ── Live time labels ─────────────────────────────────────── */

function tickTimes() {
  document.querySelectorAll("[data-time]").forEach((el) => {
    const ts = Number(el.dataset.time);
    if (Number.isFinite(ts)) el.textContent = timeAgo(ts);
  });
}

/* ── Events ───────────────────────────────────────────────── */

filterGroup.addEventListener("click", (event) => {
  const button = event.target.closest(".filter-btn");
  if (!button) return;
  currentFilter = button.dataset.filter;
  setActiveFilter(currentFilter);
  renderGrid();
});

sidebarNav.addEventListener("click", (event) => {
  const button = event.target.closest(".nav-item");
  if (!button) return;
  switchView(button.dataset.nav);
});

grid.addEventListener("click", (event) => {
  const link = event.target.closest(".open-link");
  if (!link) return;
  event.preventDefault();
  const system = SYSTEMS.find((s) => s.id === link.dataset.id);
  if (system) openModal(detailHTML(system));
});

searchInput.addEventListener("input", () => {
  searchQuery = searchInput.value;
  renderGrid();
});

sortSelect.addEventListener("change", () => {
  sortBy = sortSelect.value;
  renderGrid();
});

clearFiltersBtn.addEventListener("click", () => {
  currentFilter = "all";
  searchQuery = "";
  searchInput.value = "";
  setActiveFilter("all");
  renderGrid();
});

newSystemBtn.addEventListener("click", () => {
  openModal(newSystemFormHTML());
});

themeToggle.addEventListener("click", () => {
  applyTheme(document.documentElement.dataset.theme !== "dark");
});

modal.addEventListener("click", (event) => {
  if (event.target === modal || event.target.closest("[data-close-modal]")) closeModal();
});

modal.addEventListener("keydown", (event) => {
  if (event.key !== "Tab" || !modalOpen) return;
  const focusables = modalPanel.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  if (!focusables.length) return;
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modalOpen) closeModal();
});

modalPanel.addEventListener("submit", (event) => {
  if (!event.target.matches("#system-form")) return;
  event.preventDefault();

  const f = event.target;
  const title = f.title.value.trim();
  const description = f.description.value.trim();
  if (!title || !description) return;

  const tech = f.tech.value.split(",").map((t) => t.trim()).filter(Boolean);
  const rawUptime = Number(f.uptime.value);
  const uptime = Number.isFinite(rawUptime) ? Math.min(100, Math.max(0, rawUptime)) : 100;

  SYSTEMS.push({
    id: "sys-" + Date.now(),
    title,
    description,
    tech,
    status: f.status.value,
    uptime,
    version: f.version.value.trim() || "v1.0.0",
    updatedAt: Date.now(),
  });

  LOGS.unshift({
    id: logId++,
    level: "info",
    system: title,
    action: "Added",
    detail: "Registered for monitoring.",
    time: Date.now(),
  });

  closeModal();
  buildStats();
  renderGrid();
  toast(`Added "${title}" to monitoring`, "success");
});

/* ── Init ─────────────────────────────────────────────────── */

buildStats();
renderGrid();
setInterval(tickTimes, 30e3);