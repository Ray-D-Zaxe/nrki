/**
 * ============================================================================
 * NRKI — MAIN CLIENT SCRIPT (`assets/scripts/main.js`)
 * ----------------------------------------------------------------------------
 * Zero-dependency browser runtime for all NRKI broadsheet pages:
 *
 * 1. initializeMastheadDateline()       — Live date, 5-minute clock, time zone,
 *                                         and edition stamp inside `.nrki-site-header`.
 * 2. initializeMobileAndTabletBottomBar() — Builds the fixed mobile/tablet
 *                                         (`max-width: 1024px`) 3-control bar
 *                                         (swappable Theme trigger, Swap button,
 *                                         and Hamburger menu opening `.nrki-mobile-nav-sheet`)
 *                                         plus the Theme/Mode drawer sheet.
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
const STORAGE_KEY_MOBILE_BAR_SWAPPED = "nrki-mobile-bar-swapped";
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
   2. MOBILE & TABLET STICKY BOTTOM BAR + NAV MENU & THEME DRAWERS (`max-width: 1024px`)
   ----------------------------------------------------------------------------
   Why this renders a 3-control bar (Theme button | Swap button | Hamburger menu)
   instead of cramming 6 inline links along the bottom edge:
   Separate popup sheets for Themes and Site Navigation keep every touch target
   at >= 44px height with comfortable spacing, while the center Swap button lets
   left- and right-handed readers flip button sides cleanly in one tap.
   ============================================================================ */

const SVG_XML_NAMESPACE = "http://www.w3.org/2000/svg";

/**
 * Builds a crisp opposing-arrows SVG icon (`⇄`) for swapping bottom-bar sides.
 *
 * @returns {SVGElement}
 */
function buildSwapArrowsIconSvg() {
  const iconSvg = document.createElementNS(SVG_XML_NAMESPACE, "svg");
  iconSvg.setAttribute("viewBox", "0 0 18 18");
  iconSvg.setAttribute("fill", "none");
  iconSvg.setAttribute("aria-hidden", "true");

  const arrowsPath = document.createElementNS(SVG_XML_NAMESPACE, "path");
  arrowsPath.setAttribute(
    "d",
    "M3 6H15M12 3L15 6L12 9M15 12H3M6 9L3 12L6 15"
  );
  arrowsPath.setAttribute("stroke", "currentColor");
  arrowsPath.setAttribute("stroke-width", "1.9");
  arrowsPath.setAttribute("stroke-linecap", "round");
  arrowsPath.setAttribute("stroke-linejoin", "round");

  iconSvg.appendChild(arrowsPath);
  return iconSvg;
}

/**
 * Builds a crisp 3-bar hamburger SVG icon for the bottom-bar navigation trigger.
 *
 * @returns {SVGElement}
 */
function buildHamburgerIconSvg() {
  const menuSvg = document.createElementNS(SVG_XML_NAMESPACE, "svg");
  menuSvg.setAttribute("viewBox", "0 0 18 18");
  menuSvg.setAttribute("fill", "none");
  menuSvg.setAttribute("aria-hidden", "true");

  const barsPath = document.createElementNS(SVG_XML_NAMESPACE, "path");
  barsPath.setAttribute("d", "M2.5 4.5H15.5M2.5 9H15.5M2.5 13.5H15.5");
  barsPath.setAttribute("stroke", "currentColor");
  barsPath.setAttribute("stroke-width", "2.1");
  barsPath.setAttribute("stroke-linecap", "round");

  menuSvg.appendChild(barsPath);
  return menuSvg;
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
 * Mounts `.nrki-mobile-theme-sheet`, `.nrki-mobile-nav-sheet`, and the
 * 3-control `.nrki-mobile-bottom-bar` onto `document.body` for NRKI pages.
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
  themeSheetElement.id = "nrki-mobile-theme-sheet";
  themeSheetElement.className = "nrki-mobile-theme-sheet";
  themeSheetElement.hidden = true;
  themeSheetElement.setAttribute("role", "dialog");
  themeSheetElement.setAttribute("aria-modal", "false");
  themeSheetElement.setAttribute(
    "aria-label",
    "Theme and color mode switcher"
  );
  themeSheetElement.setAttribute("data-mobile-theme-sheet", "");

  const themeTopBarElement = document.createElement("div");
  themeTopBarElement.className = "nrki-modal-topbar";
  themeTopBarElement.style.marginBottom = "0.75rem";
  themeTopBarElement.style.paddingBottom = "0.5rem";

  const themeSheetEyebrow = document.createElement("span");
  themeSheetEyebrow.className = "nrki-eyebrow";
  themeSheetEyebrow.style.margin = "0";
  themeSheetEyebrow.textContent = "Broadsheet Edition & Ink";

  const closeThemeSheetButton = document.createElement("button");
  closeThemeSheetButton.type = "button";
  closeThemeSheetButton.className = "nrki-button nrki-button-small";
  closeThemeSheetButton.setAttribute("data-mobile-theme-sheet-close", "");
  closeThemeSheetButton.textContent = "Done ×";

  themeTopBarElement.appendChild(themeSheetEyebrow);
  themeTopBarElement.appendChild(closeThemeSheetButton);

  const themeStackContainer = document.createElement("div");
  themeStackContainer.className = "nrki-stack-sm";

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

  themeStackContainer.appendChild(themeSection);
  themeStackContainer.appendChild(modeSection);

  themeSheetElement.appendChild(themeTopBarElement);
  themeSheetElement.appendChild(themeStackContainer);

  // 2. Build Site Navigation Menu Drawer Sheet (opened by Hamburger button)
  const navigationSheetElement = document.createElement("div");
  navigationSheetElement.id = "nrki-mobile-nav-sheet";
  navigationSheetElement.className = "nrki-mobile-nav-sheet";
  navigationSheetElement.hidden = true;
  navigationSheetElement.setAttribute("role", "dialog");
  navigationSheetElement.setAttribute("aria-modal", "false");
  navigationSheetElement.setAttribute("aria-label", "Site navigation menu");
  navigationSheetElement.setAttribute("data-mobile-nav-sheet", "");

  const navTopBarElement = document.createElement("div");
  navTopBarElement.className = "nrki-modal-topbar";
  navTopBarElement.style.marginBottom = "0.75rem";
  navTopBarElement.style.paddingBottom = "0.5rem";

  const navSheetEyebrow = document.createElement("span");
  navSheetEyebrow.className = "nrki-eyebrow";
  navSheetEyebrow.style.margin = "0";
  navSheetEyebrow.textContent = "Site Navigation";

  const closeNavSheetButton = document.createElement("button");
  closeNavSheetButton.type = "button";
  closeNavSheetButton.className = "nrki-button nrki-button-small";
  closeNavSheetButton.setAttribute("data-mobile-nav-sheet-close", "");
  closeNavSheetButton.textContent = "Close ×";

  navTopBarElement.appendChild(navSheetEyebrow);
  navTopBarElement.appendChild(closeNavSheetButton);

  const sheetNavLandmark = document.createElement("nav");
  sheetNavLandmark.setAttribute("aria-label", "Mobile and tablet site sections");

  const mobileNavList = document.createElement("ul");
  mobileNavList.className = "nrki-mobile-nav-list";

  navAnchors.forEach((sourceAnchor) => {
    const listItem = document.createElement("li");
    const menuLinkAnchor = document.createElement("a");
    menuLinkAnchor.className = "nrki-mobile-nav-menu-link";
    menuLinkAnchor.href = sourceAnchor.getAttribute("href") || "#";
    if (sourceAnchor.getAttribute("aria-current") === "page") {
      menuLinkAnchor.setAttribute("aria-current", "page");
    }

    const linkLabelSpan = document.createElement("span");
    linkLabelSpan.textContent = (sourceAnchor.textContent || "").trim();

    const linkArrowSpan = document.createElement("span");
    linkArrowSpan.setAttribute("aria-hidden", "true");
    linkArrowSpan.textContent = "→";

    menuLinkAnchor.appendChild(linkLabelSpan);
    menuLinkAnchor.appendChild(linkArrowSpan);
    menuLinkAnchor.addEventListener("click", () => {
      setActiveMobileSheet(null);
    });

    listItem.appendChild(menuLinkAnchor);
    mobileNavList.appendChild(listItem);
  });

  sheetNavLandmark.appendChild(mobileNavList);
  navigationSheetElement.appendChild(navTopBarElement);
  navigationSheetElement.appendChild(sheetNavLandmark);

  // 3. Build 3-Control Sticky Bottom Bar (Left Theme | Center Swap | Right Hamburger)
  const bottomBarRegion = document.createElement("div");
  bottomBarRegion.className = "nrki-mobile-bottom-bar";
  bottomBarRegion.setAttribute("role", "region");
  bottomBarRegion.setAttribute("aria-label", "Mobile and tablet quick controls");

  const themeDrawerToggleButton = document.createElement("button");
  themeDrawerToggleButton.type = "button";
  themeDrawerToggleButton.className = "nrki-mobile-theme-trigger";
  themeDrawerToggleButton.setAttribute("data-mobile-theme-drawer-toggle", "");
  themeDrawerToggleButton.setAttribute("aria-expanded", "false");
  themeDrawerToggleButton.setAttribute(
    "aria-controls",
    "nrki-mobile-theme-sheet"
  );
  themeDrawerToggleButton.setAttribute(
    "aria-label",
    "Open theme and color mode switcher"
  );
  themeDrawerToggleButton.textContent = "classic ☀";

  const swapBarControlsButton = document.createElement("button");
  swapBarControlsButton.type = "button";
  swapBarControlsButton.className = "nrki-mobile-swap-button";
  swapBarControlsButton.setAttribute("data-mobile-bar-swap", "");
  swapBarControlsButton.setAttribute("aria-pressed", "false");
  swapBarControlsButton.setAttribute(
    "aria-label",
    "Swap theme and navigation menu button positions"
  );
  swapBarControlsButton.setAttribute(
    "title",
    "Swap left and right controls"
  );
  swapBarControlsButton.appendChild(buildSwapArrowsIconSvg());

  const navigationMenuToggleButton = document.createElement("button");
  navigationMenuToggleButton.type = "button";
  navigationMenuToggleButton.className = "nrki-mobile-menu-trigger";
  navigationMenuToggleButton.setAttribute("data-mobile-nav-drawer-toggle", "");
  navigationMenuToggleButton.setAttribute("aria-expanded", "false");
  navigationMenuToggleButton.setAttribute(
    "aria-controls",
    "nrki-mobile-nav-sheet"
  );
  navigationMenuToggleButton.setAttribute(
    "aria-label",
    "Open site navigation menu"
  );

  const menuLabelSpan = document.createElement("span");
  menuLabelSpan.className = "nrki-mobile-menu-label";
  menuLabelSpan.textContent = "Menu";

  navigationMenuToggleButton.appendChild(buildHamburgerIconSvg());
  navigationMenuToggleButton.appendChild(menuLabelSpan);

  function applyMobileBottomBarOrder(shouldSwapSides) {
    bottomBarRegion.classList.toggle("is-swapped", shouldSwapSides);
    swapBarControlsButton.setAttribute("aria-pressed", String(shouldSwapSides));

    // Reorder DOM nodes directly so visual placement and keyboard Tab order always agree
    const orderedControls = shouldSwapSides
      ? [
          navigationMenuToggleButton,
          swapBarControlsButton,
          themeDrawerToggleButton,
        ]
      : [
          themeDrawerToggleButton,
          swapBarControlsButton,
          navigationMenuToggleButton,
        ];

    orderedControls.forEach((controlButton) => {
      bottomBarRegion.appendChild(controlButton);
    });
  }

  let isBottomBarSwapped =
    localStorage.getItem(STORAGE_KEY_MOBILE_BAR_SWAPPED) === "true";
  applyMobileBottomBarOrder(isBottomBarSwapped);

  document.body.appendChild(themeSheetElement);
  document.body.appendChild(navigationSheetElement);
  document.body.appendChild(bottomBarRegion);

  function setActiveMobileSheet(targetSheetKey) {
    const openThemeSheet = targetSheetKey === "theme";
    const openNavSheet = targetSheetKey === "nav";

    themeSheetElement.hidden = !openThemeSheet;
    navigationSheetElement.hidden = !openNavSheet;
    themeDrawerToggleButton.setAttribute(
      "aria-expanded",
      String(openThemeSheet)
    );
    navigationMenuToggleButton.setAttribute(
      "aria-expanded",
      String(openNavSheet)
    );
  }

  themeDrawerToggleButton.addEventListener("click", () => {
    setActiveMobileSheet(themeSheetElement.hidden ? "theme" : null);
  });

  navigationMenuToggleButton.addEventListener("click", () => {
    setActiveMobileSheet(navigationSheetElement.hidden ? "nav" : null);
  });

  closeThemeSheetButton.addEventListener("click", () => {
    setActiveMobileSheet(null);
    themeDrawerToggleButton.focus({ preventScroll: true });
  });

  closeNavSheetButton.addEventListener("click", () => {
    setActiveMobileSheet(null);
    navigationMenuToggleButton.focus({ preventScroll: true });
  });

  swapBarControlsButton.addEventListener("click", () => {
    isBottomBarSwapped = !isBottomBarSwapped;
    localStorage.setItem(
      STORAGE_KEY_MOBILE_BAR_SWAPPED,
      String(isBottomBarSwapped)
    );
    applyMobileBottomBarOrder(isBottomBarSwapped);
    swapBarControlsButton.focus({ preventScroll: true });
  });

  document.addEventListener("keydown", (keyboardEvent) => {
    if (keyboardEvent.key !== "Escape") return;
    if (!themeSheetElement.hidden) {
      setActiveMobileSheet(null);
      themeDrawerToggleButton.focus({ preventScroll: true });
    } else if (!navigationSheetElement.hidden) {
      setActiveMobileSheet(null);
      navigationMenuToggleButton.focus({ preventScroll: true });
    }
  });

  document.addEventListener("click", (pointerEvent) => {
    if (themeSheetElement.hidden && navigationSheetElement.hidden) return;
    const clickTarget = pointerEvent.target;
    if (
      bottomBarRegion.contains(clickTarget) ||
      themeSheetElement.contains(clickTarget) ||
      navigationSheetElement.contains(clickTarget)
    ) {
      return;
    }
    setActiveMobileSheet(null);
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
