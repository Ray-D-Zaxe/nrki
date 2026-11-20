/**
 * ============================================================================
 * ISSUE 01 — BROADSHEET MAGAZINE VIEWER & SPECIMEN WORKBENCH CONTROLLER
 * (`magazines/issue-01-newspaper-web-design/broadsheet-magazine-viewer.js`)
 * ----------------------------------------------------------------------------
 * Architectural Overview & Rationale:
 *   1. Hash-Routed 4-Page SPA (`#intro`, `#elements`, `#components`, `#colophon`):
 *      Hash routing works identically on both `file://` and Cloudflare Pages
 *      without requiring server-side URL rewrites, while supporting browser
 *      Back/Forward history.
 *   2. Per-Specimen & Global 5-Mode Switching (`light`, `dark`, `accent`,
 *      `faded`, `uwu`): Every Specimen Container updates `data-theme` on its
 *      own `.specimen-preview-stage` independently, proving the library's tokens
 *      are genuinely container-scoped rather than locked to `:root`.
 *   3. Context-Aware Code Drawer & Clipboard Fallback: Toggles between HTML,
 *      CSS, and (only when present) JS snippets, and copies ONLY the currently
 *      displayed code tab with an off-screen textarea fallback for `file://`.
 * ============================================================================
 */

(function initializeBroadsheetMagazine(browserWindow, browserDocument) {
  "use strict";

  const STORAGE_KEY_MAGAZINE_THEME = "nrki-broadsheet-magazine-theme";
  const VALID_SECTION_IDS = ["intro", "elements", "components", "colophon"];

  const BROADSHEET_THEME_MODES = [
    { themeKey: "light", displayLabel: "Light" },
    { themeKey: "dark", displayLabel: "Dark" },
    { themeKey: "accent", displayLabel: "Accent" },
    { themeKey: "faded", displayLabel: "Faded" },
    { themeKey: "uwu", displayLabel: "UwU" },
  ];

  const TOKEN_SWATCH_DEFINITIONS = [
    { tokenName: "--nrki-surface-canvas", tokenRole: "Canvas Backing" },
    { tokenName: "--nrki-surface-panel", tokenRole: "Secondary Panel" },
    { tokenName: "--nrki-surface-elevated", tokenRole: "Card / Sheet" },
    { tokenName: "--nrki-ink-heading", tokenRole: "Heading Ink" },
    { tokenName: "--nrki-ink-body", tokenRole: "Reading Ink" },
    { tokenName: "--nrki-accent-primary", tokenRole: "Primary Accent" },
    { tokenName: "--nrki-accent-highlight", tokenRole: "Highlight Accent" },
    { tokenName: "--nrki-border-strong", tokenRole: "Strong Rule" },
  ];

  /* ========================================================================
     1. CLIPBOARD UTILITY WITH `file://` FALLBACK
     ======================================================================== */
  /**
   * Copies raw source code to the system clipboard and resolves cleanly on
   * both HTTPS (`navigator.clipboard`) and local `file://` contexts.
   *
   * @param {string} sourceSnippetText
   * @returns {Promise<void>}
   */
  async function copyCodeSnippetToClipboard(sourceSnippetText) {
    if (
      browserWindow.navigator &&
      browserWindow.navigator.clipboard &&
      typeof browserWindow.navigator.clipboard.writeText === "function"
    ) {
      try {
        await browserWindow.navigator.clipboard.writeText(sourceSnippetText);
        return;
      } catch (_clipboardApiBlockedError) {
        // Fall through to off-screen textarea copy for insecure `file://` contexts
      }
    }

    const hiddenCopyField = browserDocument.createElement("textarea");
    hiddenCopyField.value = sourceSnippetText;
    hiddenCopyField.setAttribute("readonly", "");
    hiddenCopyField.className = "nrki-sr-only";
    browserDocument.body.appendChild(hiddenCopyField);
    hiddenCopyField.select();
    browserDocument.execCommand("copy");
    browserDocument.body.removeChild(hiddenCopyField);
  }

  /* ========================================================================
     2. HASH-ROUTED 4-PAGE VIEW SWITCHER
     ======================================================================== */
  function resolveActiveMagazineSectionId() {
    const rawHashFragment = (browserWindow.location.hash || "")
      .replace(/^#/, "")
      .trim();
    return VALID_SECTION_IDS.includes(rawHashFragment)
      ? rawHashFragment
      : null;
  }

  function activateMagazineSection(targetSectionId) {
    const resolvedSectionId = VALID_SECTION_IDS.includes(targetSectionId)
      ? targetSectionId
      : "intro";

    browserDocument
      .querySelectorAll("[data-magazine-view]")
      .forEach((sectionElement) => {
        const isRequestedView =
          sectionElement.getAttribute("data-magazine-view") ===
          resolvedSectionId;
        sectionElement.hidden = !isRequestedView;
      });

    browserDocument
      .querySelectorAll("[data-magazine-nav-target]")
      .forEach((navLinkElement) => {
        const isCurrentTab =
          navLinkElement.getAttribute("data-magazine-nav-target") ===
          resolvedSectionId;
        navLinkElement.classList.toggle("is-current-page", isCurrentTab);
        if (isCurrentTab) {
          navLinkElement.setAttribute("aria-current", "page");
        } else {
          navLinkElement.removeAttribute("aria-current");
        }
      });
  }

  function bindMagazineSectionRouting() {
    const initialSectionId = resolveActiveMagazineSectionId() || "intro";
    activateMagazineSection(initialSectionId);

    browserWindow.addEventListener("hashchange", () => {
      const requestedSectionId = resolveActiveMagazineSectionId();
      if (requestedSectionId) {
        activateMagazineSection(requestedSectionId);
        browserWindow.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }

  /* ========================================================================
     3. GLOBAL 5-MODE THEME CONTROLLER & TOKEN SWATCH SYNCHRONIZER
     ======================================================================== */
  function refreshIntroTokenSwatches() {
    const swatchGridContainer = browserDocument.getElementById(
      "magazine-token-swatch-grid"
    );
    if (!swatchGridContainer) return;

    const computedRootStyles = browserWindow.getComputedStyle(
      browserDocument.documentElement
    );
    swatchGridContainer.innerHTML = "";

    TOKEN_SWATCH_DEFINITIONS.forEach((tokenDefinition) => {
      const resolvedHexValue = computedRootStyles
        .getPropertyValue(tokenDefinition.tokenName)
        .trim();

      const swatchCard = browserDocument.createElement("div");
      swatchCard.className = "magazine-token-swatch";

      const colorChip = browserDocument.createElement("div");
      colorChip.className = "magazine-token-chip";
      colorChip.style.backgroundColor = resolvedHexValue;

      const metadataColumn = browserDocument.createElement("div");
      metadataColumn.className = "magazine-token-meta";

      const tokenCodeLabel = browserDocument.createElement("code");
      tokenCodeLabel.textContent = tokenDefinition.tokenName;

      const tokenRoleNote = browserDocument.createElement("span");
      tokenRoleNote.textContent = `${tokenDefinition.tokenRole} (${resolvedHexValue})`;

      metadataColumn.appendChild(tokenCodeLabel);
      metadataColumn.appendChild(tokenRoleNote);
      swatchCard.appendChild(colorChip);
      swatchCard.appendChild(metadataColumn);
      swatchGridContainer.appendChild(swatchCard);
    });
  }

  function applyGlobalMagazineThemeMode(selectedThemeKey, shouldSyncStages) {
    browserDocument.documentElement.setAttribute(
      "data-theme",
      selectedThemeKey
    );

    try {
      browserWindow.localStorage.setItem(
        STORAGE_KEY_MAGAZINE_THEME,
        selectedThemeKey
      );
    } catch (_storageUnavailableError) {
      // Safe fallback when storage is restricted in strict private browsing
    }

    browserDocument
      .querySelectorAll("[data-global-theme-option]")
      .forEach((globalModeButton) => {
        const isCurrentGlobalMode =
          globalModeButton.getAttribute("data-global-theme-option") ===
          selectedThemeKey;
        globalModeButton.setAttribute(
          "aria-pressed",
          String(isCurrentGlobalMode)
        );
      });

    if (shouldSyncStages) {
      browserDocument
        .querySelectorAll(".specimen-container")
        .forEach((specimenContainer) => {
          const previewStage = specimenContainer.querySelector(
            "[data-specimen-stage]"
          );
          if (previewStage) {
            previewStage.setAttribute("data-theme", selectedThemeKey);
          }
          specimenContainer
            .querySelectorAll("[data-specimen-mode-option]")
            .forEach((stageModeButton) => {
              const isSelectedMode =
                stageModeButton.getAttribute("data-specimen-mode-option") ===
                selectedThemeKey;
              stageModeButton.setAttribute(
                "aria-pressed",
                String(isSelectedMode)
              );
            });
        });
    }

    refreshIntroTokenSwatches();
  }

  function bindGlobalThemeSwitcher() {
    const initialThemeKey =
      browserDocument.documentElement.getAttribute("data-theme") || "light";

    browserDocument
      .querySelectorAll("[data-global-theme-option]")
      .forEach((globalModeButton) => {
        globalModeButton.addEventListener("click", () => {
          const nextThemeKey = globalModeButton.getAttribute(
            "data-global-theme-option"
          );
          applyGlobalMagazineThemeMode(nextThemeKey, true);
        });
      });

    applyGlobalMagazineThemeMode(initialThemeKey, true);
  }

  /* ========================================================================
     4. SPECIMEN CONTAINER BUILDER (5-MODE TOGGLE + CODE TABS + ACTIVE COPY)
     ======================================================================== */
  /**
   * Builds one interactive Specimen Container with:
   *   - Header: title, category stamp, usage note, and 5-mode toggle buttons
   *   - Stage: live rendered element/component inside an isolated `[data-theme]`
   *   - Code Toolbar: `HTML`, `CSS`, conditional `JS`, and context-aware `Copy`
   *   - Code Drawer: collapsible `<pre><code>` displaying the active tab
   *
   * @param {Object} specimenEntry
   * @param {string} defaultThemeMode
   * @returns {HTMLElement}
   */
  function renderBroadsheetSpecimenCard(specimenEntry, defaultThemeMode) {
    const containerElement = browserDocument.createElement("article");
    containerElement.className = "specimen-container";
    containerElement.id = specimenEntry.specimenId;

    // --- A. Header Bar (Title, Category, Rationale & 5-Mode Toggle) ---
    const headerBar = browserDocument.createElement("header");
    headerBar.className = "specimen-container-header";

    const headerDetails = browserDocument.createElement("div");
    headerDetails.className = "specimen-header-details";

    const titleRow = browserDocument.createElement("div");
    titleRow.className = "specimen-title-row";

    const headingElement = browserDocument.createElement("h3");
    headingElement.textContent = specimenEntry.specimenTitle;

    const categoryBadge = browserDocument.createElement("span");
    categoryBadge.className = "nrki-badge nrki-badge-accent";
    categoryBadge.textContent = specimenEntry.categoryLabel;

    titleRow.appendChild(headingElement);
    titleRow.appendChild(categoryBadge);

    const rationaleParagraph = browserDocument.createElement("p");
    rationaleParagraph.className = "specimen-usage-note";
    rationaleParagraph.textContent = specimenEntry.usageRationale;

    headerDetails.appendChild(titleRow);
    headerDetails.appendChild(rationaleParagraph);

    const modeSwitcherBar = browserDocument.createElement("div");
    modeSwitcherBar.className = "specimen-mode-bar";
    modeSwitcherBar.setAttribute("role", "group");
    modeSwitcherBar.setAttribute(
      "aria-label",
      `Preview theme mode for ${specimenEntry.specimenTitle}`
    );

    // --- B. Isolated Preview Stage (`[data-theme="<mode>"]`) ---
    const previewStage = browserDocument.createElement("div");
    previewStage.className = "specimen-preview-stage";
    previewStage.setAttribute("data-specimen-stage", "");
    previewStage.setAttribute("data-theme", defaultThemeMode);
    previewStage.innerHTML = specimenEntry.previewHtml;

    BROADSHEET_THEME_MODES.forEach((themeOption) => {
      const modeToggleButton = browserDocument.createElement("button");
      modeToggleButton.type = "button";
      modeToggleButton.className = "specimen-mode-button";
      modeToggleButton.textContent = themeOption.displayLabel;
      modeToggleButton.setAttribute(
        "data-specimen-mode-option",
        themeOption.themeKey
      );
      modeToggleButton.setAttribute(
        "aria-pressed",
        String(themeOption.themeKey === defaultThemeMode)
      );

      modeToggleButton.addEventListener("click", () => {
        previewStage.setAttribute("data-theme", themeOption.themeKey);
        modeSwitcherBar
          .querySelectorAll("[data-specimen-mode-option]")
          .forEach((peerModeButton) => {
            peerModeButton.setAttribute(
              "aria-pressed",
              String(peerModeButton === modeToggleButton)
            );
          });
      });

      modeSwitcherBar.appendChild(modeToggleButton);
    });

    headerBar.appendChild(headerDetails);
    headerBar.appendChild(modeSwitcherBar);

    // --- C. Code Inspection Toolbar & Collapsible Source Drawer ---
    const codeToolbar = browserDocument.createElement("div");
    codeToolbar.className = "specimen-code-toolbar";

    const codeTabsContainer = browserDocument.createElement("div");
    codeTabsContainer.className = "specimen-code-tabs";

    const copyButton = browserDocument.createElement("button");
    copyButton.type = "button";
    copyButton.className = "specimen-copy-button";
    copyButton.textContent = "Select Tab to Copy";
    copyButton.disabled = true;

    const codeDrawer = browserDocument.createElement("div");
    codeDrawer.className = "specimen-code-drawer";
    codeDrawer.hidden = true;

    const preElement = browserDocument.createElement("pre");
    const codeElement = browserDocument.createElement("code");
    preElement.appendChild(codeElement);
    codeDrawer.appendChild(preElement);

    // Map ONLY available snippets (`js` button appears strictly when `jsSnippet` exists)
    const availableCodeSnippets = [
      { languageKey: "html", languageLabel: "HTML", sourceText: specimenEntry.htmlSnippet },
      { languageKey: "css", languageLabel: "CSS", sourceText: specimenEntry.cssSnippet },
    ];
    if (
      typeof specimenEntry.jsSnippet === "string" &&
      specimenEntry.jsSnippet.trim().length > 0
    ) {
      availableCodeSnippets.push({
        languageKey: "js",
        languageLabel: "JS",
        sourceText: specimenEntry.jsSnippet,
      });
    }

    let activeLanguageKey = null;
    let copyFeedbackResetTimer = null;

    availableCodeSnippets.forEach((snippetDefinition) => {
      const codeTabButton = browserDocument.createElement("button");
      codeTabButton.type = "button";
      codeTabButton.className = "specimen-code-tab-button";
      codeTabButton.textContent = snippetDefinition.languageLabel;
      codeTabButton.setAttribute(
        "data-code-tab",
        snippetDefinition.languageKey
      );
      codeTabButton.setAttribute("aria-expanded", "false");

      codeTabButton.addEventListener("click", () => {
        const isCollapsingActiveTab =
          activeLanguageKey === snippetDefinition.languageKey;

        if (isCollapsingActiveTab) {
          activeLanguageKey = null;
          codeDrawer.hidden = true;
          codeTabButton.setAttribute("aria-expanded", "false");
          copyButton.disabled = true;
          copyButton.classList.remove("is-copied");
          copyButton.textContent = "Select Tab to Copy";
          return;
        }

        activeLanguageKey = snippetDefinition.languageKey;
        codeElement.textContent = snippetDefinition.sourceText;
        codeDrawer.hidden = false;

        codeTabsContainer
          .querySelectorAll("[data-code-tab]")
          .forEach((peerTabButton) => {
            peerTabButton.setAttribute(
              "aria-expanded",
              String(peerTabButton === codeTabButton)
            );
          });

        copyButton.disabled = false;
        copyButton.classList.remove("is-copied");
        copyButton.textContent = `Copy ${snippetDefinition.languageLabel}`;
      });

      codeTabsContainer.appendChild(codeTabButton);
    });

    copyButton.addEventListener("click", async () => {
      if (!activeLanguageKey) return;
      const matchingSnippet = availableCodeSnippets.find(
        (candidateSnippet) => candidateSnippet.languageKey === activeLanguageKey
      );
      if (!matchingSnippet) return;

      await copyCodeSnippetToClipboard(matchingSnippet.sourceText);

      if (copyFeedbackResetTimer) {
        browserWindow.clearTimeout(copyFeedbackResetTimer);
      }

      copyButton.classList.add("is-copied");
      copyButton.textContent = `Copied ${matchingSnippet.languageLabel} ✓`;

      copyFeedbackResetTimer = browserWindow.setTimeout(() => {
        copyButton.classList.remove("is-copied");
        copyButton.textContent = activeLanguageKey
          ? `Copy ${matchingSnippet.languageLabel}`
          : "Select Tab to Copy";
      }, 1600);
    });

    codeToolbar.appendChild(codeTabsContainer);
    codeToolbar.appendChild(copyButton);

    containerElement.appendChild(headerBar);
    containerElement.appendChild(previewStage);
    containerElement.appendChild(codeToolbar);
    containerElement.appendChild(codeDrawer);

    if (typeof specimenEntry.initializePreview === "function") {
      specimenEntry.initializePreview(previewStage);
    }

    return containerElement;
  }

  function mountSpecimenCatalogList(
    mountContainerId,
    specimenEntries,
    initialThemeMode
  ) {
    const targetMountContainer =
      browserDocument.getElementById(mountContainerId);
    if (!targetMountContainer || !Array.isArray(specimenEntries)) return;

    targetMountContainer.innerHTML = "";
    specimenEntries.forEach((specimenEntry) => {
      const renderedCard = renderBroadsheetSpecimenCard(
        specimenEntry,
        initialThemeMode
      );
      targetMountContainer.appendChild(renderedCard);
    });
  }

  /* ========================================================================
     5. INITIALIZATION ENTRYPOINT
     ======================================================================== */
  browserDocument.addEventListener("DOMContentLoaded", () => {
    const magazineNamespace = browserWindow.NRKIBroadsheetMagazine || {};
    const initialThemeMode =
      browserDocument.documentElement.getAttribute("data-theme") || "light";

    mountSpecimenCatalogList(
      "broadsheet-simple-elements-mount",
      magazineNamespace.simpleElementSpecimens,
      initialThemeMode
    );

    mountSpecimenCatalogList(
      "broadsheet-complex-components-mount",
      magazineNamespace.complexComponentSpecimens,
      initialThemeMode
    );

    bindMagazineSectionRouting();
    bindGlobalThemeSwitcher();
  });
})(window, document);
