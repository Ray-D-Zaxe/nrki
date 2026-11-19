/**
 * ============================================================================
 * NRKI — MAIN CLIENT SCRIPT (`assets/scripts/main.js`)
 * ----------------------------------------------------------------------------
 * Plain, zero-dependency JavaScript powering global masthead and page behaviors:
 *
 * 1. initMastheadDateline() — Newspaper dateline in the header showing:
 *                             - Full Date (e.g. "Thursday, Nov 5, 2026")
 *                             - Time (updates every 5 minutes)
 *                             - Time Zone & UTC offset (e.g. "IST · UTC+05:30")
 *                             - Dynamic Edition (Morning / Afternoon / Evening / Night)
 * 2. initThemeToggle()      — Light ("Paper") / Dark ("Night") theme switching
 *                             with localStorage persistence.
 * 3. initFilterGroups()     — Declarative filtering for static HTML lists.
 * 4. initPrintButtons()     — Triggers browser Print-to-PDF on web resume pages.
 * ============================================================================
 */

const STORAGE_KEY_THEME = "nrki-theme";
const FIVE_MINUTES_MS = 5 * 60 * 1000;

/**
 * 1. NEWSPAPER MASTHEAD DATELINE & 5-MINUTE CLOCK
 * Populates `[data-masthead-date]`, `[data-masthead-time]`, `[data-masthead-tz]`,
 * and `[data-masthead-edition]` inside the site header, and refreshes every
 * 5 minutes (300,000 ms).
 */
function initMastheadDateline() {
  function formatNewspaperDateline() {
    const now = new Date();

    // 1. Format full newspaper date: e.g. "Thursday, Nov 5, 2026"
    const dateStr = now.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    // 2. Format hours & minutes (24-hour or 12-hour editorial style)
    const timeStr = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    // 3. Extract short Time Zone name (e.g. "IST", "EST", "PST") + UTC offset
    const tzShort =
      Intl.DateTimeFormat("en-US", { timeZoneName: "short" })
        .formatToParts(now)
        .find((part) => part.type === "timeZoneName")?.value || "LOCAL";

    const offsetMinutes = -now.getTimezoneOffset();
    const sign = offsetMinutes >= 0 ? "+" : "-";
    const absMins = Math.abs(offsetMinutes);
    const pad = (n) => String(n).padStart(2, "0");
    const utcOffset = `UTC${sign}${pad(Math.floor(absMins / 60))}:${pad(
      absMins % 60
    )}`;

    // 4. Determine newspaper edition from local hour
    const hour = now.getHours();
    let editionLabel = "Late Night Dispatch";
    if (hour >= 5 && hour < 12) {
      editionLabel = "Morning Edition";
    } else if (hour >= 12 && hour < 17) {
      editionLabel = "Afternoon Edition";
    } else if (hour >= 17 && hour < 22) {
      editionLabel = "Evening Edition";
    }

    // Update DOM elements if present
    document.querySelectorAll("[data-masthead-date]").forEach((el) => {
      el.textContent = dateStr;
      el.setAttribute("datetime", now.toISOString().split("T")[0]);
    });

    document.querySelectorAll("[data-masthead-time]").forEach((el) => {
      el.textContent = timeStr;
    });

    document.querySelectorAll("[data-masthead-tz]").forEach((el) => {
      el.textContent = `${tzShort} (${utcOffset})`;
    });

    document.querySelectorAll("[data-masthead-edition]").forEach((el) => {
      el.textContent = editionLabel;
    });
  }

  // Run immediately on load, then update every 5 minutes
  formatNewspaperDateline();
  setInterval(formatNewspaperDateline, FIVE_MINUTES_MS);
}

/**
 * 2. THEME SYSTEM
 * Reads the user's saved theme ("light" | "dark") from localStorage or falls
 * back to OS preference, applies `data-theme` on `<html>`, and binds clicks
 * on any `[data-theme-toggle]` button.
 */
function initThemeToggle() {
  const root = document.documentElement;
  const savedTheme = localStorage.getItem(STORAGE_KEY_THEME);
  const prefersDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  const initialTheme = savedTheme || (prefersDark ? "dark" : "light");
  applyTheme(initialTheme);

  const toggleButtons = document.querySelectorAll("[data-theme-toggle]");
  toggleButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const current =
        root.getAttribute("data-theme") === "dark" ? "dark" : "light";
      const next = current === "dark" ? "light" : "dark";
      root.classList.add("theme-transition");
      applyTheme(next);
      localStorage.setItem(STORAGE_KEY_THEME, next);
      setTimeout(() => root.classList.remove("theme-transition"), 220);
    });
  });
}

/**
 * Applies the given theme ("light" | "dark") to `<html>` and updates all
 * theme toggle buttons' text and `aria-pressed` state.
 *
 * @param {"light" | "dark"} theme
 */
function applyTheme(theme) {
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);

  const toggleButtons = document.querySelectorAll("[data-theme-toggle]");
  toggleButtons.forEach((btn) => {
    const isDark = theme === "dark";
    btn.setAttribute("aria-pressed", String(isDark));
    btn.textContent = isDark ? "Ink: Night ☾" : "Ink: Paper ☀";
  });
}

/**
 * 3. DECLARATIVE CATEGORY FILTERING (For static HTML lists)
 */
function initFilterGroups() {
  const scopes = document.querySelectorAll("[data-filter-scope]");

  scopes.forEach((scope) => {
    const activeFilters = {};
    const buttons = scope.querySelectorAll(
      "[data-filter-key][data-filter-value]"
    );
    const items = scope.querySelectorAll("[data-filter-item]");
    const emptyState = scope.querySelector("[data-filter-empty]");

    buttons.forEach((btn) => {
      const key = btn.getAttribute("data-filter-key");
      const val = btn.getAttribute("data-filter-value");
      if (btn.classList.contains("is-active") || !(key in activeFilters)) {
        activeFilters[key] = btn.classList.contains("is-active") ? val : "all";
      }
    });

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const key = btn.getAttribute("data-filter-key");
        const val = btn.getAttribute("data-filter-value");
        activeFilters[key] = val;

        buttons.forEach((peer) => {
          if (peer.getAttribute("data-filter-key") === key) {
            const isMatch = peer.getAttribute("data-filter-value") === val;
            peer.classList.toggle("is-active", isMatch);
            peer.setAttribute("aria-pressed", String(isMatch));
          }
        });

        let visibleCount = 0;
        items.forEach((item) => {
          const matchesAll = Object.entries(activeFilters).every(
            ([filterKey, filterVal]) => {
              if (!filterVal || filterVal === "all") return true;
              const itemVal = item.getAttribute(`data-${filterKey}`) || "";
              return itemVal.split(" ").includes(filterVal);
            }
          );

          item.classList.toggle("is-hidden", !matchesAll);
          if (matchesAll) visibleCount += 1;
        });

        if (emptyState) {
          emptyState.classList.toggle("is-hidden", visibleCount > 0);
        }
      });
    });
  });
}

/**
 * 4. RESUME PRINT / SAVE AS PDF
 */
function initPrintButtons() {
  const printTitleEl = document.querySelector("[data-print-title]");
  const printTitle = printTitleEl
    ? printTitleEl.getAttribute("data-print-title")
    : null;
  const originalTitle = document.title;

  if (printTitle) {
    window.addEventListener("beforeprint", () => {
      document.title = printTitle;
    });
    window.addEventListener("afterprint", () => {
      document.title = originalTitle;
    });
  }

  const printButtons = document.querySelectorAll(
    '[data-action="print-resume"]'
  );
  printButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (printTitle) {
        document.title = printTitle;
      }
      window.print();
    });
  });
}

// Initialize all modules once the DOM is parsed
document.addEventListener("DOMContentLoaded", () => {
  initMastheadDateline();
  initThemeToggle();
  initFilterGroups();
  initPrintButtons();
});
