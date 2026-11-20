/**
 * ============================================================================
 * NRKI — MAIN CLIENT SCRIPT (`assets/scripts/main.js`)
 * ----------------------------------------------------------------------------
 * Zero-dependency browser runtime for all NRKI broadsheet pages:
 *
 * 1. initializeMastheadDateline()       — Live date, 5-minute clock, time zone,
 *                                         and edition stamp inside `.nrki-site-header`.
 * 2. initializeMobileAndTabletBottomBar() — Builds the fixed mobile/tablet
 *                                         (`max-width: 1024px`) bottom nav bar
 *                                         and 1-tap theme/mode drawer sheet
 *                                         directly from `.nrki-site-nav`.
 * 3. initializeBroadsheetThemeAndMode() — 2-axis theme (`[data-theme]`) +
 *                                         mode (`[data-mode]`) persistence and
 *                                         synchronized header & bottom-bar controls.
 * 4. initializeFilterGroups()           — Declarative category filtering on static
 *                                         HTML shelves using `.nrki-hidden`.
 * 5. initializePrintButtons()           — Browser Print-to-PDF hooks on resumes.
 * ============================================================================
 */

const STORAGE_KEY_BROADSHEET_THEME = "nrki-broadsheet-theme";
const STORAGE_KEY_BROADSHEET_MODE = "nrki-broadsheet-mode";
const LEGACY_STORAGE_KEY_MODE = "nrki-theme";
const VALID_BROADSHEET_THEMES = ["classic", "ancient", "minimalistic", "uwu"];
const BROADSHEET_THEME_LABELS = [
  { themeKey: "classic", displayLabel: "Classic" },
  { themeKey: "ancient", displayLabel: "Ancient" },
  { themeKey: "minimalistic", displayLabel: "Minimalistic" },
  { themeKey: "uwu", displayLabel: "UwU" },
];
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
   2. MOBILE & TABLET STICKY BOTTOM BAR + THEME & MODE DRAWER (`max-width: 1024px`)
   ----------------------------------------------------------------------------
   Mirrors Issue 01's Pocket Newspaper bottom bar across all NRKI site pages on
   mobile and tablet viewports: turns `.nrki-site-nav` into a bottom navigation
   bar paired with a 1-tap theme & mode trigger button and popup sheet.
   ============================================================================ */

/**
 * Maps full desktop nav link labels to compact mobile/tablet bottom-bar labels.
 *
 * @param {string} rawNavLabel
 * @returns {string}
 */
function formatCompactBottomNavLabel(rawNavLabel) {
  const cleanedLabel = (rawNavLabel || "").trim();
  if (/^magazines$/i.test(cleanedLabel)) return "Mags";
  if (/^about/i.test(cleanedLabel)) return "About";
  return cleanedLabel;
}

/**
 * Synchronizes the mobile/tablet bottom-bar theme trigger text (`classic ☀`)
 * and the drawer's `[data-theme-option]` pill states.
 */
function synchronizeMobileBottomBarControls() {
  const activeTheme =
    document.documentElement.getAttribute("data-theme") || "classic";
  const activeMode =
    document.documentElement.getAttribute("data-mode") === "dark"
      ? "dark"
      : "light";
  const modeIcon = activeMode === "dark" ? "☾" : "☀";

  document
    .querySelectorAll("[data-mobile-theme-drawer-toggle]")
    .forEach((triggerButton) => {
      triggerButton.textContent = `${activeTheme} ${modeIcon}`;
    });

  document
    .querySelectorAll("[data-theme-option]")
    .forEach((themePillButton) => {
      const isSelected =
        themePillButton.getAttribute("data-theme-option") === activeTheme;
      themePillButton.setAttribute("aria-pressed", String(isSelected));
    });
}

/**
 * Mounts `.nrki-mobile-theme-sheet` and `.nrki-mobile-bottom-bar` onto `document.body`
 * for any NRKI site page that contains `.nrki-site-header .nrki-site-nav`.
 */
function initializeMobileAndTabletBottomBar() {
  const primarySiteNav = document.querySelector(
    ".nrki-site-header .nrki-site-nav"
  );
  if (
    !primarySiteNav ||
    document.querySelector(".nrki-mobile-bottom-bar")
  ) {
    return;
  }

  const navAnchors = Array.from(primarySiteNav.querySelectorAll("a[href]"));
  if (navAnchors.length === 0) return;

  document.body.classList.add("nrki-has-mobile-bar");

  // 1. Build 1-Tap Bottom Theme & Mode Drawer Sheet
  const themeSheetElement = document.createElement("div");
  themeSheetElement.className = "nrki-mobile-theme-sheet";
  themeSheetElement.hidden = true;
  themeSheetElement.setAttribute("role", "dialog");
  themeSheetElement.setAttribute(
    "aria-label",
    "Mobile and tablet theme and mode switcher"
  );
  themeSheetElement.setAttribute("data-mobile-theme-sheet", "");

  const topBarElement = document.createElement("div");
  topBarElement.className = "nrki-modal-topbar";
  topBarElement.style.marginBottom = "0.75rem";
  topBarElement.style.paddingBottom = "0.5rem";

  const sheetEyebrow = document.createElement("span");
  sheetEyebrow.className = "nrki-eyebrow";
  sheetEyebrow.style.margin = "0";
  sheetEyebrow.textContent = "Broadsheet Edition & Ink";

  const closeSheetButton = document.createElement("button");
  closeSheetButton.type = "button";
  closeSheetButton.className = "nrki-button nrki-button-small";
  closeSheetButton.setAttribute("data-mobile-theme-sheet-close", "");
  closeSheetButton.textContent = "Done ×";

  topBarElement.appendChild(sheetEyebrow);
  topBarElement.appendChild(closeSheetButton);

  const stackContainer = document.createElement("div");
  stackContainer.className = "nrki-stack-sm";

  const themeSection = document.createElement("div");
  const themeHeading = document.createElement("p");
  themeHeading.className = "nrki-aside-label";
  themeHeading.style.marginBottom = "0.35rem";
  themeHeading.textContent = "Theme Personality";

  const themeOptionsGroup = document.createElement("div");
  themeOptionsGroup.className = "nrki-mobile-theme-options";

  BROADSHEET_THEME_LABELS.forEach((themeDefinition) => {
    const themeButton = document.createElement("button");
    themeButton.type = "button";
    themeButton.className = "nrki-mobile-theme-pill";
    themeButton.setAttribute("data-theme-option", themeDefinition.themeKey);
    themeButton.setAttribute("aria-pressed", "false");
    themeButton.textContent = themeDefinition.displayLabel;
    themeOptionsGroup.appendChild(themeButton);
  });

  themeSection.appendChild(themeHeading);
  themeSection.appendChild(themeOptionsGroup);

  const modeSection = document.createElement("div");
  const modeHeading = document.createElement("p");
  modeHeading.className = "nrki-aside-label";
  modeHeading.style.marginBottom = "0.35rem";
  modeHeading.textContent = "Color Polarity";

  const modeToggleInSheet = document.createElement("button");
  modeToggleInSheet.type = "button";
  modeToggleInSheet.className = "nrki-theme-toggle";
  modeToggleInSheet.setAttribute("data-theme-toggle", "");
  modeToggleInSheet.setAttribute("aria-pressed", "false");
  modeToggleInSheet.textContent = "Ink: Paper ☀";

  modeSection.appendChild(modeHeading);
  modeSection.appendChild(modeToggleInSheet);

  stackContainer.appendChild(themeSection);
  stackContainer.appendChild(modeSection);

  themeSheetElement.appendChild(topBarElement);
  themeSheetElement.appendChild(stackContainer);

  // 2. Build Sticky Bottom Navigation + Theme Trigger Bar
  const bottomBarNav = document.createElement("nav");
  bottomBarNav.className = "nrki-mobile-bottom-bar";
  bottomBarNav.setAttribute("aria-label", "Mobile and tablet navigation");

  navAnchors.forEach((sourceAnchor) => {
    const mobileNavLink = document.createElement("a");
    mobileNavLink.className = "nrki-mobile-nav-link";
    mobileNavLink.href = sourceAnchor.getAttribute("href") || "#";
    mobileNavLink.textContent = formatCompactBottomNavLabel(
      sourceAnchor.textContent
    );
    if (sourceAnchor.getAttribute("aria-current") === "page") {
      mobileNavLink.setAttribute("aria-current", "page");
    }
    bottomBarNav.appendChild(mobileNavLink);
  });

  const drawerToggleButton = document.createElement("button");
  drawerToggleButton.type = "button";
  drawerToggleButton.className = "nrki-mobile-theme-trigger";
  drawerToggleButton.setAttribute("data-mobile-theme-drawer-toggle", "");
  drawerToggleButton.setAttribute("aria-expanded", "false");
  drawerToggleButton.setAttribute(
    "aria-label",
    "Toggle theme and color mode drawer"
  );
  drawerToggleButton.textContent = "classic ☀";

  bottomBarNav.appendChild(drawerToggleButton);

  document.body.appendChild(themeSheetElement);
  document.body.appendChild(bottomBarNav);

  function setDrawerOpenState(shouldOpen) {
    themeSheetElement.hidden = !shouldOpen;
    drawerToggleButton.setAttribute("aria-expanded", String(shouldOpen));
  }

  drawerToggleButton.addEventListener("click", () => {
    setDrawerOpenState(themeSheetElement.hidden);
  });

  closeSheetButton.addEventListener("click", () => {
    setDrawerOpenState(false);
  });

  document.addEventListener("keydown", (keyboardEvent) => {
    if (keyboardEvent.key === "Escape" && !themeSheetElement.hidden) {
      setDrawerOpenState(false);
      drawerToggleButton.focus();
    }
  });
}

/* ============================================================================
   3. 2-AXIS BROADSHEET THEME & COLOR MODE SYSTEM
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
 * and mobile drawer controls on the page, and persists in localStorage.
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

  synchronizeMobileBottomBarControls();
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
  localStorage.setItem(LEGACY_STORAGE_KEY_MODE, resolvedMode);

  document
    .querySelectorAll("[data-theme-toggle]")
    .forEach((modeToggleButton) => {
      modeToggleButton.setAttribute("aria-pressed", String(isDarkMode));
      modeToggleButton.textContent = isDarkMode
        ? "Ink: Night ☾"
        : "Ink: Paper ☀";
    });

  synchronizeMobileBottomBarControls();
}

/**
 * Restores saved theme + mode preferences and binds the masthead dropdown
 * (`[data-theme-select]`), mobile drawer pills (`[data-theme-option]`),
 * and Light/Dark ink buttons (`[data-theme-toggle]`).
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
    .querySelectorAll("[data-theme-option]")
    .forEach((themePillButton) => {
      themePillButton.addEventListener("click", () => {
        const chosenTheme = themePillButton.getAttribute("data-theme-option");
        triggerThemeTransitionAnimation();
        applyBroadsheetTheme(chosenTheme);
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
   4. DECLARATIVE CATEGORY FILTERING (Static HTML Shelves)
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
   5. RESUME PRINT / SAVE AS PDF
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
   6. INITIALIZATION ENTRYPOINT
   ============================================================================ */

document.addEventListener("DOMContentLoaded", () => {
  initializeMastheadDateline();
  initializeMobileAndTabletBottomBar();
  initializeBroadsheetThemeAndMode();
  initializeFilterGroups();
  initializePrintButtons();
});
