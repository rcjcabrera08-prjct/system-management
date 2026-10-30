/* ────────────────────────────────────────────────────────────
   System Status Dashboard — Vanilla JavaScript
   Renders systems from a JSON array, handles tab filtering
   and sidebar navigation state. No frameworks.
   ──────────────────────────────────────────────────────────── */

"use strict";

/* ── Data ─────────────────────────────────────────────────── */

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
    updated: "2h ago",
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
    updated: "5h ago",
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
    updated: "1d ago",
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
    updated: "30m ago",
  },
];

/* ── Status metadata (labels come from CSS custom properties) */

const STATUS_META = {
  operational: { label: "Operational" },
  degraded: { label: "Degraded" },
};

const FILTERS = {
  all: () => true,
  operational: (s) => s.status === "operational",
  issues: (s) => s.status === "degraded",
};

/* ── State ────────────────────────────────────────────────── */

let currentFilter = "all";

/* ── DOM refs ─────────────────────────────────────────────── */

const grid = document.getElementById("systems-grid");
const emptyState = document.getElementById("empty-state");
const countLabel = document.getElementById("count-label");
const subtitle = document.getElementById("page-subtitle");
const filterGroup = document.getElementById("filter-group");
const sidebarNav = document.getElementById("sidebar-nav");

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

/* ── Card template ────────────────────────────────────────── */

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
        <span>${escapeHtml(system.updated)}</span>
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

function renderGrid() {
  const list = SYSTEMS.filter(FILTERS[currentFilter]);

  grid.innerHTML = list.map(cardHTML).join("");
  emptyState.hidden = list.length > 0;
  countLabel.textContent = `${list.length} of ${SYSTEMS.length} systems`;
}

/* ── Events ───────────────────────────────────────────────── */

filterGroup.addEventListener("click", (event) => {
  const button = event.target.closest(".filter-btn");
  if (!button) return;

  currentFilter = button.dataset.filter;

  filterGroup.querySelectorAll(".filter-btn").forEach((btn) => {
    const isActive = btn === button;
    btn.classList.toggle("is-active", isActive);
    btn.setAttribute("aria-pressed", String(isActive));
  });

  renderGrid();
});

sidebarNav.addEventListener("click", (event) => {
  const button = event.target.closest(".nav-item");
  if (!button) return;

  sidebarNav.querySelectorAll(".nav-item").forEach((btn) => {
    const isActive = btn === button;
    btn.classList.toggle("is-active", isActive);
    if (isActive) btn.setAttribute("aria-current", "page");
    else btn.removeAttribute("aria-current");
  });
});

grid.addEventListener("click", (event) => {
  if (event.target.closest(".open-link")) event.preventDefault();
});

document.getElementById("new-system-btn").addEventListener("click", () => {
  console.log("New system flow not wired up — CRD scope is read-only dashboard.");
});

/* ── Init ─────────────────────────────────────────────────── */

buildStats();
renderGrid();
