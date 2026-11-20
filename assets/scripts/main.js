/**
 * ============================================================================
 * NRKI — MAIN CLIENT SCRIPT (`assets/scripts/main.js`)
 * ----------------------------------------------------------------------------
 * Zero-dependency browser runtime for all NRKI broadsheet pages:
 *
 * 1. initializeMastheadDateline()    — Live date, 5-minute clock, time zone,
 *                                      and edition stamp inside `.nrki-site-header`.
 * 2. initializeBroadsheetThemeAndMode() — 2-axis theme (`[data-theme]`) +
 *                                      mode (`[data-mode]`) persistence and
 *                                      synchronized header controls.
 * 3. initializeFilterGroups()        — Declarative category filtering on static
 *                                      HTML shelves using `.nrki-hidden`.
 * 4. initializePrintButtons()        — Browser Print-to-PDF hooks on resumes.
 * ============================================================================
 */

const STORAGE_KEY_BROADSHEET_THEME = "nrki-broadsheet-theme";
const STORAGE_KEY_BROADSHEET_MODE = "nrki-broadsheet-mode";
const LEGACY_STORAGE_KEY_MODE = "nrki-theme";
const VALID_BROADSHEET_THEMES = ["classic", "ancient", "minimalistic", "uwu"];
const VALID_COLOR_MODES = ["light", "dark"];
const THEME_TRANSITION_DURATION_MS = 220;
const DATELINE_REFRESH_INTERVAL_MS = 5 * 60 * 1000;

/* ============================================================================
   1. NEWSPAPER MASTHEAD DATELINE & 5-MINUTE CLOCK
   ============================================================================ */

/**
 * Populates `[data-masthead-date]`, `[data-masthead-time]`, `[data-masthead-tz]`,
 * and `[data-masthead-edition]` inside the site header, refreshing every 5 min.
 */
function initializeMastheadDateline() {
  function formatNewspaperDateline() {
    const currentTimestamp = new Date();

    const formattedDateLabel = currentTimestamp.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const formattedTimeLabel = currentTimestamp.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    const shortTimeZoneName =
      Intl.DateTimeFormat("en-US", { timeZoneName: "short" })
        .formatToParts(currentTimestamp)
        .find((datePart) => datePart.type === "timeZoneName")?.value || "LOCAL";

    const utcOffsetMinutes = -currentTimestamp.getTimezoneOffset();
    const offsetSign = utcOffsetMinutes >= 0 ? "+" : "-";
    const absoluteMinutes = Math.abs(utcOffsetMinutes);
    const padTwoDigits = (numericValue) => String(numericValue).padStart(2, "0");
    const utcOffsetString = `UTC${offsetSign}${padTwoDigits(
      Math.floor(absoluteMinutes / 60)
    )}:${padTwoDigits(absoluteMinutes % 60)}`;

    const currentHour = currentTimestamp.getHours();
    let editionLabel = "Late Night Dispatch";
    if (currentHour >= 5 && currentHour < 12) {
      editionLabel = "Morning Edition";
    } else if (currentHour >= 12 && currentHour < 17) {
      editionLabel = "Afternoon Edition";
    } else if (currentHour >= 17 && currentHour < 22) {
      editionLabel = "Evening Edition";
    }

    document.querySelectorAll("[data-masthead-date]").forEach((dateElement) => {
      dateElement.textContent = formattedDateLabel;
      dateElement.setAttribute(
        "datetime",
        currentTimestamp.toISOString().split("T")[0]
      );
    });

    document.querySelectorAll("[data-masthead-time]").forEach((timeElement) => {
      timeElement.textContent = formattedTimeLabel;
    });

    document.querySelectorAll("[data-masthead-tz]").forEach((zoneElement) => {
      zoneElement.textContent = `${shortTimeZoneName} (${utcOffsetString})`;
    });

    document
      .querySelectorAll("[data-masthead-edition]")
      .forEach((editionElement) => {
        editionElement.textContent = editionLabel;
      });
  }

  formatNewspaperDateline();
  setInterval(formatNewspaperDateline, DATELINE_REFRESH_INTERVAL_MS);
}

/* ============================================================================
   2. 2-AXIS BROADSHEET THEME & COLOR MODE SYSTEM
   ----------------------------------------------------------------------------
   Maintains orthogonal `[data-theme]` ("classic" | "ancient" | "minimalistic"
   | "uwu") and `[data-mode]` ("light" | "dark") attributes on `<html>`.
   Using two independent axes avoids multiplying token blocks by 8 and lets
   the theme dropdown and the Light/Dark ink button operate independently.
   ============================================================================ */

/**
 * Temporarily applies `.nrki-theme-animating` to `<html>` so ink and surface
 * transitions animate smoothly on user-initiated theme or mode switches.
 */
function triggerThemeTransitionAnimation() {
  const documentRoot = document.documentElement;
  documentRoot.classList.add("nrki-theme-animating");
  window.setTimeout(() => {
    documentRoot.classList.remove("nrki-theme-animating");
  }, THEME_TRANSITION_DURATION_MS);
}

/**
 * Applies the selected theme personality to `<html>`, syncs all theme `<select>`
 * controls on the page, and persists the preference in localStorage.
 *
 * @param {string} requestedTheme
 */
function applyBroadsheetTheme(requestedTheme) {
  const resolvedTheme = VALID_BROADSHEET_THEMES.includes(requestedTheme)
    ? requestedTheme
    : "classic";

  document.documentElement.setAttribute("data-theme", resolvedTheme);
  localStorage.setItem(STORAGE_KEY_BROADSHEET_THEME, resolvedTheme);

  document
    .querySelectorAll("[data-theme-select]")
    .forEach((themeSelectElement) => {
      if (themeSelectElement.value !== resolvedTheme) {
        themeSelectElement.value = resolvedTheme;
      }
    });
}

/**
 * Applies the selected color polarity ("light" | "dark") to `<html>`, updates
 * all Light/Dark ink toggle buttons, and stores the choice in localStorage.
 *
 * @param {string} requestedMode
 */
function applyColorMode(requestedMode) {
  const resolvedMode = VALID_COLOR_MODES.includes(requestedMode)
    ? requestedMode
    : "light";
  const isDarkMode = resolvedMode === "dark";

  document.documentElement.setAttribute("data-mode", resolvedMode);
  localStorage.setItem(STORAGE_KEY_BROADSHEET_MODE, resolvedMode);
  // Keep legacy key synchronized for backwards compatibility across cached pages.
  localStorage.setItem(LEGACY_STORAGE_KEY_MODE, resolvedMode);

  document
    .querySelectorAll("[data-theme-toggle]")
    .forEach((modeToggleButton) => {
      modeToggleButton.setAttribute("aria-pressed", String(isDarkMode));
      modeToggleButton.textContent = isDarkMode
        ? "Ink: Night ☾"
        : "Ink: Paper ☀";
    });
}

/**
 * Restores saved theme + mode preferences and binds the masthead dropdown
 * (`[data-theme-select]`) and Light/Dark ink button (`[data-theme-toggle]`).
 */
function initializeBroadsheetThemeAndMode() {
  const storedTheme = localStorage.getItem(STORAGE_KEY_BROADSHEET_THEME);
  const storedMode =
    localStorage.getItem(STORAGE_KEY_BROADSHEET_MODE) ||
    localStorage.getItem(LEGACY_STORAGE_KEY_MODE);

  const prefersDarkScheme =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  const initialTheme = VALID_BROADSHEET_THEMES.includes(storedTheme)
    ? storedTheme
    : "classic";
  const initialMode = VALID_COLOR_MODES.includes(storedMode)
    ? storedMode
    : prefersDarkScheme
      ? "dark"
      : "light";

  applyBroadsheetTheme(initialTheme);
  applyColorMode(initialMode);

  document
    .querySelectorAll("[data-theme-select]")
    .forEach((themeSelectElement) => {
      themeSelectElement.addEventListener("change", (changeEvent) => {
        triggerThemeTransitionAnimation();
        applyBroadsheetTheme(changeEvent.currentTarget.value);
      });
    });

  document
    .querySelectorAll("[data-theme-toggle]")
    .forEach((modeToggleButton) => {
      modeToggleButton.addEventListener("click", () => {
        const currentMode =
          document.documentElement.getAttribute("data-mode") === "dark"
            ? "dark"
            : "light";
        const nextMode = currentMode === "dark" ? "light" : "dark";
        triggerThemeTransitionAnimation();
        applyColorMode(nextMode);
      });
    });
}

/* ============================================================================
   3. DECLARATIVE CATEGORY FILTERING (Static HTML Shelves)
   ============================================================================ */

/**
 * Wires `[data-filter-scope]` groups so clicking filter pills hides
 * non-matching rows using `.nrki-hidden` without inline display styles.
 */
function initializeFilterGroups() {
  const filterScopes = document.querySelectorAll("[data-filter-scope]");

  filterScopes.forEach((filterScope) => {
    const activeFiltersByKey = {};
    const filterButtons = filterScope.querySelectorAll(
      "[data-filter-key][data-filter-value]"
    );
    const filterableEntries =
      filterScope.querySelectorAll("[data-filter-item]");
    const emptyStateElement = filterScope.querySelector("[data-filter-empty]");

    filterButtons.forEach((filterButton) => {
      const filterKey = filterButton.getAttribute("data-filter-key");
      const filterValue = filterButton.getAttribute("data-filter-value");
      if (
        filterButton.classList.contains("is-active") ||
        !(filterKey in activeFiltersByKey)
      ) {
        activeFiltersByKey[filterKey] = filterButton.classList.contains(
          "is-active"
        )
          ? filterValue
          : "all";
      }
    });

    filterButtons.forEach((filterButton) => {
      filterButton.addEventListener("click", () => {
        const selectedKey = filterButton.getAttribute("data-filter-key");
        const selectedValue = filterButton.getAttribute("data-filter-value");
        activeFiltersByKey[selectedKey] = selectedValue;

        filterButtons.forEach((peerButton) => {
          if (peerButton.getAttribute("data-filter-key") === selectedKey) {
            const isMatchingButton =
              peerButton.getAttribute("data-filter-value") === selectedValue;
            peerButton.classList.toggle("is-active", isMatchingButton);
            peerButton.setAttribute("aria-pressed", String(isMatchingButton));
          }
        });

        let visibleEntryCount = 0;
        filterableEntries.forEach((entryElement) => {
          const matchesAllActiveFilters = Object.entries(
            activeFiltersByKey
          ).every(([filterKey, requiredValue]) => {
            if (!requiredValue || requiredValue === "all") return true;
            const entryTokens =
              entryElement.getAttribute(`data-${filterKey}`) || "";
            return entryTokens.split(" ").includes(requiredValue);
          });

          entryElement.classList.toggle("nrki-hidden", !matchesAllActiveFilters);
          if (matchesAllActiveFilters) {
            visibleEntryCount += 1;
          }
        });

        if (emptyStateElement) {
          emptyStateElement.classList.toggle(
            "nrki-hidden",
            visibleEntryCount > 0
          );
        }
      });
    });
  });
}

/* ============================================================================
   4. RESUME PRINT / SAVE AS PDF
   ============================================================================ */

/**
 * Sets clean PDF filenames via `[data-print-title]` and binds print triggers.
 */
function initializePrintButtons() {
  const printTitleElement = document.querySelector("[data-print-title]");
  const desiredPrintTitle = printTitleElement
    ? printTitleElement.getAttribute("data-print-title")
    : null;
  const originalDocumentTitle = document.title;

  if (desiredPrintTitle) {
    window.addEventListener("beforeprint", () => {
      document.title = desiredPrintTitle;
    });
    window.addEventListener("afterprint", () => {
      document.title = originalDocumentTitle;
    });
  }

  document
    .querySelectorAll('[data-action="print-resume"]')
    .forEach((printButton) => {
      printButton.addEventListener("click", () => {
        if (desiredPrintTitle) {
          document.title = desiredPrintTitle;
        }
        window.print();
      });
    });
}

/* ============================================================================
   5. INITIALIZATION ENTRYPOINT
   ============================================================================ */

document.addEventListener("DOMContentLoaded", () => {
  initializeMastheadDateline();
  initializeBroadsheetThemeAndMode();
  initializeFilterGroups();
  initializePrintButtons();
});
