/**
 * ============================================================================
 * ISSUE 01 — BROADSHEET MAGAZINE VIEWER & REUSABLE SPECIMEN WORKBENCH
 * (`magazines/issue-01-newspaper-web-design/broadsheet-magazine-viewer.js`)
 * ----------------------------------------------------------------------------
 * Architectural Rationale:
 *   1. Reusable Section Workbench Engine (`mountBroadsheetSectionWorkbench`):
 *      Builds the Desktop/Tablet Broadsheet Spread (left numbered directory
 *      + single active specimen stage + optional `Full Sheet` mode) AND the
 *      Mobile Pocket Newspaper stream (scroll-snap jump strip + folio dividers)
 *      from a single catalog descriptor so additional magazine issues can reuse
 *      this file directly.
 *   2. Orthogonal 2-Axis Theme Controller (`data-theme` × `data-mode`):
 *      Separates personality (`classic`, `ancient`, `minimalistic`, `uwu`)
 *      from Light/Dark polarity (`light`, `dark`) on both `<html>` and every
 *      independent Specimen Container preview stage.
 *   3. Classic Zero-Bundler Browser Script: Runs cleanly over both `file://`
 *      and HTTP/Cloudflare Pages with clipboard fallback.
 * ============================================================================
 */

(function initializeBroadsheetNewspaperMagazine(browserWindow, browserDocument) {
  "use strict";

  const STORAGE_KEY_THEME = "nrki-broadsheet-theme";
  const STORAGE_KEY_MODE = "nrki-broadsheet-mode";

  const ORDERED_SECTION_IDS = [
    "intro",
    "layouts",
    "elements",
    "components",
    "colophon",
  ];

  const BROADSHEET_THEME_DEFINITIONS = [
    { themeKey: "classic", displayLabel: "Classic" },
    { themeKey: "ancient", displayLabel: "Ancient" },
    { themeKey: "minimalistic", displayLabel: "Minimalistic" },
    { themeKey: "uwu", displayLabel: "UwU" },
  ];

  const BROADSHEET_MODE_DEFINITIONS = [
    { modeKey: "light", displayLabel: "Light", iconPrefix: "☀" },
    { modeKey: "dark", displayLabel: "Dark", iconPrefix: "☾" },
  ];

  const TOKEN_SWATCH_DEFINITIONS = [
    { tokenName: "--nrki-surface-canvas", tokenRole: "Paper Backing" },
    { tokenName: "--nrki-surface-panel", tokenRole: "Column Shade" },
    { tokenName: "--nrki-surface-elevated", tokenRole: "Card Sheet" },
    { tokenName: "--nrki-ink-heading", tokenRole: "Display Ink" },
    { tokenName: "--nrki-ink-body", tokenRole: "Prose Ink" },
    { tokenName: "--nrki-accent-primary", tokenRole: "Primary Ink" },
    { tokenName: "--nrki-border-ornament", tokenRole: "Border / Trim" },
    { tokenName: "--nrki-border-strong", tokenRole: "Heavy Rule" },
  ];

  /* ========================================================================
     1. CLIPBOARD HELPER WITH `file://` FALLBACK
     ======================================================================== */
  async function copyCodeSnippetToClipboard(sourceSnippetText) {
    if (
      browserWindow.navigator &&
      browserWindow.navigator.clipboard &&
      typeof browserWindow.navigator.clipboard.writeText === "function"
    ) {
      try {
        await browserWindow.navigator.clipboard.writeText(sourceSnippetText);
        return;
      } catch (_clipboardApiBlocked) {
        // Fall back to hidden textarea selection when running under `file://`
      }
    }

    const scratchCopyField = browserDocument.createElement("textarea");
    scratchCopyField.value = sourceSnippetText;
    scratchCopyField.setAttribute("readonly", "");
    scratchCopyField.className = "nrki-sr-only";
    browserDocument.body.appendChild(scratchCopyField);
    scratchCopyField.select();
    browserDocument.execCommand("copy");
    browserDocument.body.removeChild(scratchCopyField);
  }

  /* ========================================================================
     1B. LIGHTWEIGHT SAFE SYNTAX HIGHLIGHTER FOR CODE SPECIMENS & DRAWER
     ------------------------------------------------------------------------
     Why a single-pass tokenizer is used: Every source fragment outside matched
     tokens goes straight through HTML escaping and is never re-scanned, so
     inserted `<span class="nrki-tok-*">` tags cannot corrupt or nest badly.
     ======================================================================== */
  function escapeHtmlEntities(rawSourceText) {
    return rawSourceText
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function highlightHtmlTagMarkup(rawTagString) {
    const openingMatch = rawTagString.match(/^<\/?[a-zA-Z0-9-]+/);
    if (!openingMatch) return escapeHtmlEntities(rawTagString);

    const tagPrefix = openingMatch[0];
    const remainderText = rawTagString.slice(tagPrefix.length);
    let highlightedResult = `<span class="nrki-tok-tag">${escapeHtmlEntities(
      tagPrefix
    )}</span>`;

    const attributePattern =
      /(\s+)([a-zA-Z0-9:-]+)(?:(=)("[^"]*"|'[^']*'))?/g;
    let scanCursor = 0;
    let attrMatch;

    while ((attrMatch = attributePattern.exec(remainderText)) !== null) {
      if (attrMatch.index > scanCursor) {
        highlightedResult += escapeHtmlEntities(
          remainderText.slice(scanCursor, attrMatch.index)
        );
      }
      highlightedResult += escapeHtmlEntities(attrMatch[1]);
      highlightedResult += `<span class="nrki-tok-prop">${escapeHtmlEntities(
        attrMatch[2]
      )}</span>`;
      if (attrMatch[3] && attrMatch[4]) {
        highlightedResult += escapeHtmlEntities(attrMatch[3]);
        highlightedResult += `<span class="nrki-tok-string">${escapeHtmlEntities(
          attrMatch[4]
        )}</span>`;
      }
      scanCursor = attributePattern.lastIndex;
    }

    if (scanCursor < remainderText.length) {
      highlightedResult += escapeHtmlEntities(remainderText.slice(scanCursor));
    }
    return highlightedResult;
  }

  function renderHighlightedCodeMarkup(rawSourceText, languageKey) {
    if (!rawSourceText) return "";

    if (languageKey === "html") {
      const htmlPattern = /(<!--[\s\S]*?-->)|(<\/?[a-zA-Z0-9-]+(?:\s+[^>]*)?>)/g;
      const htmlChunks = [];
      let scanCursor = 0;
      let tokenMatch;

      while ((tokenMatch = htmlPattern.exec(rawSourceText)) !== null) {
        if (tokenMatch.index > scanCursor) {
          htmlChunks.push(
            escapeHtmlEntities(rawSourceText.slice(scanCursor, tokenMatch.index))
          );
        }
        if (tokenMatch[1]) {
          htmlChunks.push(
            `<span class="nrki-tok-comment">${escapeHtmlEntities(
              tokenMatch[1]
            )}</span>`
          );
        } else if (tokenMatch[2]) {
          htmlChunks.push(highlightHtmlTagMarkup(tokenMatch[2]));
        }
        scanCursor = htmlPattern.lastIndex;
      }

      if (scanCursor < rawSourceText.length) {
        htmlChunks.push(escapeHtmlEntities(rawSourceText.slice(scanCursor)));
      }
      return htmlChunks.join("");
    }

    const languagePattern =
      languageKey === "css"
        ? /(\/\*[\s\S]*?\*\/)|("(?:\\.|[^"])*"|'(?:\\.|[^'])*')|(@[a-z-]+)|([a-z-]+(?=\s*:))/gi
        : /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|(`(?:\\.|[^`])*`|"(?:\\.|[^"])*"|'(?:\\.|[^'])*')|\b(const|let|var|function|return|if|else|for|of|in|async|await|true|false|null|new)\b/g;

    const codeChunks = [];
    let scanCursor = 0;
    let tokenMatch;

    while ((tokenMatch = languagePattern.exec(rawSourceText)) !== null) {
      if (tokenMatch.index > scanCursor) {
        codeChunks.push(
          escapeHtmlEntities(rawSourceText.slice(scanCursor, tokenMatch.index))
        );
      }
      if (tokenMatch[1]) {
        codeChunks.push(
          `<span class="nrki-tok-comment">${escapeHtmlEntities(
            tokenMatch[1]
          )}</span>`
        );
      } else if (tokenMatch[2]) {
        codeChunks.push(
          `<span class="nrki-tok-string">${escapeHtmlEntities(
            tokenMatch[2]
          )}</span>`
        );
      } else if (tokenMatch[3]) {
        codeChunks.push(
          `<span class="nrki-tok-keyword">${escapeHtmlEntities(
            tokenMatch[3]
          )}</span>`
        );
      } else if (tokenMatch[4]) {
        codeChunks.push(
          `<span class="nrki-tok-prop">${escapeHtmlEntities(
            tokenMatch[4]
          )}</span>`
        );
      }
      scanCursor = languagePattern.lastIndex;
    }

    if (scanCursor < rawSourceText.length) {
      codeChunks.push(escapeHtmlEntities(rawSourceText.slice(scanCursor)));
    }
    return codeChunks.join("");
  }

  /* ========================================================================
     2. HASH-ROUTED 5-PAGE NEWSPAPER SECTION CONTROLLER
     ======================================================================== */
  function resolveHashSectionId() {
    const cleanedHash = (browserWindow.location.hash || "")
      .replace(/^#/, "")
      .trim();
    return ORDERED_SECTION_IDS.includes(cleanedHash) ? cleanedHash : null;
  }

  function updateSectionFolioStamp(sectionId) {
    const pageIndex = Math.max(1, ORDERED_SECTION_IDS.indexOf(sectionId) + 1);
    const paddedPageNumber = String(pageIndex).padStart(2, "0");
    browserDocument
      .querySelectorAll("[data-magazine-page-indicator]")
      .forEach((indicatorNode) => {
        indicatorNode.textContent = `Page ${paddedPageNumber} of 05`;
      });
  }

  function activateNewspaperSection(targetSectionId) {
    const resolvedSectionId = ORDERED_SECTION_IDS.includes(targetSectionId)
      ? targetSectionId
      : "intro";

    browserDocument
      .querySelectorAll("[data-magazine-view]")
      .forEach((sectionNode) => {
        const shouldDisplaySection =
          sectionNode.getAttribute("data-magazine-view") === resolvedSectionId;
        sectionNode.hidden = !shouldDisplaySection;
      });

    browserDocument
      .querySelectorAll("[data-magazine-nav-target]")
      .forEach((navElement) => {
        const isCurrentSection =
          navElement.getAttribute("data-magazine-nav-target") ===
          resolvedSectionId;
        navElement.classList.toggle("is-current-page", isCurrentSection);
        if (isCurrentSection) {
          navElement.setAttribute("aria-current", "page");
        } else {
          navElement.removeAttribute("aria-current");
        }
      });

    updateSectionFolioStamp(resolvedSectionId);
    updateMobileReadingProgress();
  }

  function bindNewspaperSectionRouting() {
    const initialSectionId = resolveHashSectionId() || "intro";
    activateNewspaperSection(initialSectionId);

    browserWindow.addEventListener("hashchange", () => {
      const requestedSectionId = resolveHashSectionId();
      if (requestedSectionId) {
        activateNewspaperSection(requestedSectionId);
        browserWindow.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }

  /* ========================================================================
     3. GLOBAL DUAL THEME + MODE SWITCHER & LIVE TOKEN SWATCHES
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

    TOKEN_SWATCH_DEFINITIONS.forEach((tokenDescriptor) => {
      const resolvedValue = computedRootStyles
        .getPropertyValue(tokenDescriptor.tokenName)
        .trim();

      const swatchCard = browserDocument.createElement("div");
      swatchCard.className = "magazine-token-swatch";

      const colorBox = browserDocument.createElement("div");
      colorBox.className = "magazine-token-chip";
      colorBox.style.backgroundColor = resolvedValue;

      const labelColumn = browserDocument.createElement("div");
      labelColumn.className = "magazine-token-meta";

      const codeName = browserDocument.createElement("code");
      codeName.textContent = tokenDescriptor.tokenName;

      const roleDescription = browserDocument.createElement("span");
      roleDescription.textContent = `${tokenDescriptor.tokenRole} · ${resolvedValue}`;

      labelColumn.appendChild(codeName);
      labelColumn.appendChild(roleDescription);
      swatchCard.appendChild(colorBox);
      swatchCard.appendChild(labelColumn);
      swatchGridContainer.appendChild(swatchCard);
    });
  }

  function synchronizeMobileThemeTriggerLabel(themeKey, modeKey) {
    const mobileTrigger = browserDocument.querySelector(
      "[data-mobile-theme-drawer-toggle]"
    );
    const earEditionLabel = browserDocument.querySelector(
      "[data-magazine-edition-stamp]"
    );
    const modeIcon = modeKey === "dark" ? "☾" : "☀";

    if (mobileTrigger) {
      mobileTrigger.textContent = `${themeKey} ${modeIcon}`;
    }
    if (earEditionLabel) {
      earEditionLabel.textContent = `${themeKey.toUpperCase()} · ${modeKey.toUpperCase()} EDITION`;
    }
  }

  /**
   * Updates a single Light/Dark mode toggle button (`[data-global-mode-toggle]`
   * or `[data-specimen-mode-toggle]`) so one button cleanly toggles and
   * displays the active polarity (`☀ Light` vs. `☾ Dark`).
   *
   * @param {HTMLButtonElement} modeToggleButton
   * @param {string} activeModeKey
   */
  function synchronizeModeToggleButtonState(modeToggleButton, activeModeKey) {
    const isDarkMode = activeModeKey === "dark";
    modeToggleButton.setAttribute("data-current-mode", activeModeKey);
    modeToggleButton.setAttribute("aria-pressed", String(isDarkMode));
    modeToggleButton.textContent = isDarkMode ? "☾ Dark" : "☀ Light";
    modeToggleButton.setAttribute(
      "aria-label",
      isDarkMode
        ? "Dark mode active — click to switch to Light mode"
        : "Light mode active — click to switch to Dark mode"
    );
  }

  function applyGlobalThemeAndMode(nextThemeKey, nextModeKey, syncStages) {
    const resolvedTheme =
      nextThemeKey ||
      browserDocument.documentElement.getAttribute("data-theme") ||
      "classic";
    const resolvedMode =
      nextModeKey ||
      browserDocument.documentElement.getAttribute("data-mode") ||
      "light";

    browserDocument.documentElement.setAttribute("data-theme", resolvedTheme);
    browserDocument.documentElement.setAttribute("data-mode", resolvedMode);

    try {
      browserWindow.localStorage.setItem(STORAGE_KEY_THEME, resolvedTheme);
      browserWindow.localStorage.setItem(STORAGE_KEY_MODE, resolvedMode);
    } catch (_storageRestrictedError) {
      // Safe fallback when private mode blocks localStorage
    }

    browserDocument
      .querySelectorAll("[data-global-theme-option]")
      .forEach((themeButton) => {
        const isSelected =
          themeButton.getAttribute("data-global-theme-option") ===
          resolvedTheme;
        themeButton.setAttribute("aria-pressed", String(isSelected));
      });

    browserDocument
      .querySelectorAll("[data-global-mode-toggle]")
      .forEach((modeToggleButton) => {
        synchronizeModeToggleButtonState(modeToggleButton, resolvedMode);
      });

    if (syncStages) {
      browserDocument
        .querySelectorAll(".specimen-container")
        .forEach((specimenContainer) => {
          const previewStage = specimenContainer.querySelector(
            "[data-specimen-stage]"
          );
          if (previewStage) {
            previewStage.setAttribute("data-theme", resolvedTheme);
            previewStage.setAttribute("data-mode", resolvedMode);
          }

          specimenContainer
            .querySelectorAll("[data-specimen-theme-option]")
            .forEach((stageThemeButton) => {
              stageThemeButton.setAttribute(
                "aria-pressed",
                String(
                  stageThemeButton.getAttribute(
                    "data-specimen-theme-option"
                  ) === resolvedTheme
                )
              );
            });

          specimenContainer
            .querySelectorAll("[data-specimen-mode-toggle]")
            .forEach((stageModeToggleButton) => {
              synchronizeModeToggleButtonState(
                stageModeToggleButton,
                resolvedMode
              );
            });
        });
    }

    synchronizeMobileThemeTriggerLabel(resolvedTheme, resolvedMode);
    refreshIntroTokenSwatches();
  }

  function bindGlobalThemeAndModeControls() {
    const initialTheme =
      browserDocument.documentElement.getAttribute("data-theme") || "classic";
    const initialMode =
      browserDocument.documentElement.getAttribute("data-mode") || "light";

    browserDocument
      .querySelectorAll("[data-global-theme-option]")
      .forEach((themeButton) => {
        themeButton.addEventListener("click", () => {
          const chosenTheme = themeButton.getAttribute(
            "data-global-theme-option"
          );
          const currentMode =
            browserDocument.documentElement.getAttribute("data-mode") ||
            "light";
          applyGlobalThemeAndMode(chosenTheme, currentMode, true);
        });
      });

    browserDocument
      .querySelectorAll("[data-global-mode-toggle]")
      .forEach((modeToggleButton) => {
        modeToggleButton.addEventListener("click", () => {
          const currentTheme =
            browserDocument.documentElement.getAttribute("data-theme") ||
            "classic";
          const currentMode =
            browserDocument.documentElement.getAttribute("data-mode") === "dark"
              ? "dark"
              : "light";
          const nextMode = currentMode === "dark" ? "light" : "dark";
          applyGlobalThemeAndMode(currentTheme, nextMode, true);
        });
      });

    applyGlobalThemeAndMode(initialTheme, initialMode, true);
  }

  /* ========================================================================
     4. SPECIMEN CONTAINER BUILDER (PER-STAGE THEME+MODE + CODE DRAWER + COPY)
     ======================================================================== */
  function buildBroadsheetSpecimenContainer(
    specimenEntry,
    initialThemeKey,
    initialModeKey
  ) {
    const containerElement = browserDocument.createElement("article");
    containerElement.className = "specimen-container";
    containerElement.id = specimenEntry.specimenId;

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

    // Dual Theme + Light/Dark Mode Bar scoped exclusively to this Specimen Stage
    const stageControlsBar = browserDocument.createElement("div");
    stageControlsBar.className = "specimen-mode-bar";
    stageControlsBar.setAttribute("role", "group");
    stageControlsBar.setAttribute(
      "aria-label",
      `Independent theme and light/dark controls for ${specimenEntry.specimenTitle}`
    );

    const previewStage = browserDocument.createElement("div");
    previewStage.className = "specimen-preview-stage";
    previewStage.setAttribute("data-specimen-stage", "");
    previewStage.setAttribute("data-theme", initialThemeKey);
    previewStage.setAttribute("data-mode", initialModeKey);
    previewStage.innerHTML = specimenEntry.previewHtml;

    /* Why showcased links & forms are intercepted:
       Specimen containers demonstrate visuals and local interactive widgets
       purely inside the showcase box—clicking an illustrated link or submitting
       a sample form must never navigate the magazine page, mutate `location.hash`,
       or scroll the viewport away from the active specimen. */
    previewStage.addEventListener("click", (pointerEvent) => {
      const clickedAnchor = pointerEvent.target.closest("a[href]");
      if (clickedAnchor) {
        pointerEvent.preventDefault();
      }
    });

    previewStage.addEventListener("submit", (submitEvent) => {
      submitEvent.preventDefault();
    });

    BROADSHEET_THEME_DEFINITIONS.forEach((themeDefinition) => {
      const themeOptionButton = browserDocument.createElement("button");
      themeOptionButton.type = "button";
      themeOptionButton.className = "specimen-mode-button";
      themeOptionButton.textContent = themeDefinition.displayLabel;
      themeOptionButton.setAttribute(
        "data-specimen-theme-option",
        themeDefinition.themeKey
      );
      themeOptionButton.setAttribute(
        "aria-pressed",
        String(themeDefinition.themeKey === initialThemeKey)
      );

      themeOptionButton.addEventListener("click", () => {
        previewStage.setAttribute("data-theme", themeDefinition.themeKey);
        stageControlsBar
          .querySelectorAll("[data-specimen-theme-option]")
          .forEach((peerButton) => {
            peerButton.setAttribute(
              "aria-pressed",
              String(peerButton === themeOptionButton)
            );
          });
      });

      stageControlsBar.appendChild(themeOptionButton);
    });

    const polarityDivider = browserDocument.createElement("span");
    polarityDivider.className = "specimen-polarity-separator";
    polarityDivider.setAttribute("aria-hidden", "true");
    stageControlsBar.appendChild(polarityDivider);

    const specimenModeToggleButton = browserDocument.createElement("button");
    specimenModeToggleButton.type = "button";
    specimenModeToggleButton.className = "specimen-mode-button";
    specimenModeToggleButton.setAttribute("data-specimen-mode-toggle", "");
    synchronizeModeToggleButtonState(specimenModeToggleButton, initialModeKey);

    specimenModeToggleButton.addEventListener("click", () => {
      const currentStageMode =
        previewStage.getAttribute("data-mode") === "dark" ? "dark" : "light";
      const nextStageMode = currentStageMode === "dark" ? "light" : "dark";
      previewStage.setAttribute("data-mode", nextStageMode);
      synchronizeModeToggleButtonState(specimenModeToggleButton, nextStageMode);
    });

    stageControlsBar.appendChild(specimenModeToggleButton);

    headerBar.appendChild(headerDetails);
    headerBar.appendChild(stageControlsBar);

    // Source Code Toolbar (`HTML`, `CSS`, conditional `JS` + active `Copy`)
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

    const codeDrawerHeaderBar = browserDocument.createElement("div");
    codeDrawerHeaderBar.className = "specimen-code-drawer-bar";
    const drawerLanguageLabel = browserDocument.createElement("span");
    const drawerLineCountLabel = browserDocument.createElement("span");
    codeDrawerHeaderBar.appendChild(drawerLanguageLabel);
    codeDrawerHeaderBar.appendChild(drawerLineCountLabel);

    const preElement = browserDocument.createElement("pre");
    const codeElement = browserDocument.createElement("code");
    preElement.appendChild(codeElement);
    codeDrawer.appendChild(codeDrawerHeaderBar);
    codeDrawer.appendChild(preElement);

    const availableCodeSnippets = [
      {
        languageKey: "html",
        languageLabel: "HTML",
        sourceText: specimenEntry.htmlSnippet,
      },
      {
        languageKey: "css",
        languageLabel: "CSS",
        sourceText: specimenEntry.cssSnippet,
      },
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
    let copyResetTimeoutId = null;

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
        const shouldCollapseDrawer =
          activeLanguageKey === snippetDefinition.languageKey;

        if (shouldCollapseDrawer) {
          activeLanguageKey = null;
          codeDrawer.hidden = true;
          codeTabButton.setAttribute("aria-expanded", "false");
          copyButton.disabled = true;
          copyButton.classList.remove("is-copied");
          copyButton.textContent = "Select Tab to Copy";
          return;
        }

        activeLanguageKey = snippetDefinition.languageKey;
        const lineTotal = snippetDefinition.sourceText.split(/\r?\n/).length;
        drawerLanguageLabel.textContent = `${snippetDefinition.languageLabel} Source`;
        drawerLineCountLabel.textContent = `${lineTotal} ${
          lineTotal === 1 ? "line" : "lines"
        }`;
        codeElement.innerHTML = renderHighlightedCodeMarkup(
          snippetDefinition.sourceText,
          snippetDefinition.languageKey
        );
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
      const targetSnippet = availableCodeSnippets.find(
        (candidate) => candidate.languageKey === activeLanguageKey
      );
      if (!targetSnippet) return;

      await copyCodeSnippetToClipboard(targetSnippet.sourceText);

      if (copyResetTimeoutId) {
        browserWindow.clearTimeout(copyResetTimeoutId);
      }

      copyButton.classList.add("is-copied");
      copyButton.textContent = `Copied ${targetSnippet.languageLabel} ✓`;

      copyResetTimeoutId = browserWindow.setTimeout(() => {
        copyButton.classList.remove("is-copied");
        copyButton.textContent = activeLanguageKey
          ? `Copy ${targetSnippet.languageLabel}`
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

  /* ========================================================================
     5. REUSABLE SECTION WORKBENCH (DESKTOP SPREAD VS. MOBILE STREAM)
     ======================================================================== */
  function mountBroadsheetSectionWorkbench(
    workbenchMountId,
    specimenEntries,
    initialThemeKey,
    initialModeKey
  ) {
    const mountElement = browserDocument.getElementById(workbenchMountId);
    if (
      !mountElement ||
      !Array.isArray(specimenEntries) ||
      specimenEntries.length === 0
    ) {
      return;
    }

    mountElement.innerHTML = "";
    let activeSpecimenIndex = 0;
    let isFullSheetExpanded = false;

    // --- Broadsheet Spread Grid (Left Directory Column + Right Stage) ---
    const spreadWorkbench = browserDocument.createElement("div");
    spreadWorkbench.className = "magazine-spread-workbench";

    const directoryColumn = browserDocument.createElement("aside");
    directoryColumn.className = "magazine-directory-column";
    directoryColumn.setAttribute("aria-label", "Section index");

    const directoryHead = browserDocument.createElement("div");
    directoryHead.className = "magazine-directory-head";

    const directoryCountLabel = browserDocument.createElement("span");
    directoryCountLabel.className = "nrki-eyebrow";
    directoryCountLabel.style.margin = "0";
    directoryCountLabel.textContent = `Index (${specimenEntries.length})`;

    const viewModeToggleButton = browserDocument.createElement("button");
    viewModeToggleButton.type = "button";
    viewModeToggleButton.className = "nrki-button nrki-button-small";
    viewModeToggleButton.textContent = "Full Sheet";
    viewModeToggleButton.setAttribute("aria-pressed", "false");

    directoryHead.appendChild(directoryCountLabel);
    directoryHead.appendChild(viewModeToggleButton);

    const directoryList = browserDocument.createElement("ol");
    directoryList.className = "magazine-directory-list";

    const directoryPager = browserDocument.createElement("div");
    directoryPager.className = "magazine-directory-pager";

    const prevSpecimenButton = browserDocument.createElement("button");
    prevSpecimenButton.type = "button";
    prevSpecimenButton.className = "nrki-button nrki-button-small";
    prevSpecimenButton.textContent = "← Prev";

    const spreadPageCounter = browserDocument.createElement("span");
    spreadPageCounter.className = "magazine-running-folio";

    const nextSpecimenButton = browserDocument.createElement("button");
    nextSpecimenButton.type = "button";
    nextSpecimenButton.className = "nrki-button nrki-button-small nrki-button-primary";
    nextSpecimenButton.textContent = "Next →";

    directoryPager.appendChild(prevSpecimenButton);
    directoryPager.appendChild(spreadPageCounter);
    directoryPager.appendChild(nextSpecimenButton);

    directoryColumn.appendChild(directoryHead);
    directoryColumn.appendChild(directoryList);
    directoryColumn.appendChild(directoryPager);

    const stageColumn = browserDocument.createElement("div");
    stageColumn.className = "specimen-catalog-stack";

    const directoryButtonElements = [];
    const specimenCardElements = [];

    specimenEntries.forEach((specimenEntry, entryIndex) => {
      // Directory Row
      const listRow = browserDocument.createElement("li");
      listRow.className = "magazine-directory-entry";

      const rowButton = browserDocument.createElement("button");
      rowButton.type = "button";
      rowButton.className = "magazine-directory-button";

      const rowTitle = browserDocument.createElement("span");
      rowTitle.textContent = specimenEntry.specimenTitle;
      rowButton.appendChild(rowTitle);

      if (
        typeof specimenEntry.jsSnippet === "string" &&
        specimenEntry.jsSnippet.trim().length > 0
      ) {
        const jsStamp = browserDocument.createElement("span");
        jsStamp.className = "nrki-badge nrki-badge-accent";
        jsStamp.textContent = "JS";
        rowButton.appendChild(jsStamp);
      }

      rowButton.addEventListener("click", () => {
        activeSpecimenIndex = entryIndex;
        synchronizeSpreadState();
        if (isFullSheetExpanded) {
          specimenCardElements[entryIndex].scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });

      listRow.appendChild(rowButton);
      directoryList.appendChild(listRow);
      directoryButtonElements.push(rowButton);

      // Mobile Folio Divider between stacked mobile cards
      if (entryIndex > 0) {
        const mobileDivider = browserDocument.createElement("div");
        mobileDivider.className = "magazine-mobile-folio-divider";
        mobileDivider.textContent = `SPECIMEN ${String(
          entryIndex + 1
        ).padStart(2, "0")} OF ${String(specimenEntries.length).padStart(
          2,
          "0"
        )} · ✦`;
        stageColumn.appendChild(mobileDivider);
      }

      const renderedSpecimenCard = buildBroadsheetSpecimenContainer(
        specimenEntry,
        initialThemeKey,
        initialModeKey
      );
      stageColumn.appendChild(renderedSpecimenCard);
      specimenCardElements.push(renderedSpecimenCard);
    });

    function synchronizeSpreadState() {
      const totalCount = specimenEntries.length;
      spreadWorkbench.classList.toggle("is-full-sheet", isFullSheetExpanded);
      viewModeToggleButton.setAttribute(
        "aria-pressed",
        String(isFullSheetExpanded)
      );
      viewModeToggleButton.textContent = isFullSheetExpanded
        ? "Spread View"
        : "Full Sheet";

      spreadPageCounter.textContent = `${String(
        activeSpecimenIndex + 1
      ).padStart(2, "0")} / ${String(totalCount).padStart(2, "0")}`;

      prevSpecimenButton.disabled = activeSpecimenIndex === 0;
      nextSpecimenButton.disabled = activeSpecimenIndex === totalCount - 1;

      directoryButtonElements.forEach((rowButton, idx) => {
        rowButton.classList.toggle(
          "is-current-specimen",
          idx === activeSpecimenIndex
        );
      });

      specimenCardElements.forEach((cardElement, idx) => {
        cardElement.classList.toggle(
          "magazine-spread-inactive",
          !isFullSheetExpanded && idx !== activeSpecimenIndex
        );
      });
    }

    prevSpecimenButton.addEventListener("click", () => {
      if (activeSpecimenIndex > 0) {
        activeSpecimenIndex -= 1;
        synchronizeSpreadState();
      }
    });

    nextSpecimenButton.addEventListener("click", () => {
      if (activeSpecimenIndex < specimenEntries.length - 1) {
        activeSpecimenIndex += 1;
        synchronizeSpreadState();
      }
    });

    viewModeToggleButton.addEventListener("click", () => {
      isFullSheetExpanded = !isFullSheetExpanded;
      synchronizeSpreadState();
    });

    spreadWorkbench.appendChild(directoryColumn);
    spreadWorkbench.appendChild(stageColumn);

    mountElement.appendChild(spreadWorkbench);

    synchronizeSpreadState();
  }

  /* ========================================================================
     6. MOBILE POCKET NEWSPAPER READING PROGRESS & 1-TAP THEME DRAWER
     ======================================================================== */
  function updateMobileReadingProgress() {
    const progressFill = browserDocument.querySelector(
      "[data-mobile-reading-progress]"
    );
    if (!progressFill) return;

    const scrollableHeight =
      browserDocument.documentElement.scrollHeight - browserWindow.innerHeight;
    if (scrollableHeight <= 0) {
      progressFill.style.transform = "scaleX(0)";
      return;
    }

    const ratio = Math.min(
      1,
      Math.max(0, browserWindow.scrollY / scrollableHeight)
    );
    progressFill.style.transform = `scaleX(${ratio.toFixed(3)})`;
  }

  function bindMobilePocketNewspaperControls() {
    browserWindow.addEventListener("scroll", updateMobileReadingProgress, {
      passive: true,
    });
    browserWindow.addEventListener("resize", updateMobileReadingProgress, {
      passive: true,
    });

    const drawerToggle = browserDocument.querySelector(
      "[data-mobile-theme-drawer-toggle]"
    );
    const themeSheet = browserDocument.querySelector(
      "[data-mobile-theme-sheet]"
    );
    const sheetClose = browserDocument.querySelector(
      "[data-mobile-theme-sheet-close]"
    );
    if (!drawerToggle || !themeSheet) return;

    function setDrawerOpen(shouldOpen) {
      themeSheet.hidden = !shouldOpen;
      drawerToggle.setAttribute("aria-expanded", String(shouldOpen));
    }

    drawerToggle.addEventListener("click", () => {
      setDrawerOpen(themeSheet.hidden);
    });

    if (sheetClose) {
      sheetClose.addEventListener("click", () => setDrawerOpen(false));
    }

    browserDocument.addEventListener("keydown", (keyboardEvent) => {
      if (keyboardEvent.key === "Escape" && !themeSheet.hidden) {
        setDrawerOpen(false);
        drawerToggle.focus();
      }
    });
  }

  /* ========================================================================
     7. LIVE HEADER DATELINE INITIALIZER & ENTRYPOINT
     ======================================================================== */
  function populateMagazineEditionDate() {
    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    browserDocument
      .querySelectorAll("[data-magazine-dateline-date]")
      .forEach((dateElement) => {
        dateElement.textContent = formattedDate;
      });
  }

  browserDocument.addEventListener("DOMContentLoaded", () => {
    const catalogRegistry = browserWindow.NRKIBroadsheetMagazine || {};
    const initialThemeKey =
      browserDocument.documentElement.getAttribute("data-theme") || "classic";
    const initialModeKey =
      browserDocument.documentElement.getAttribute("data-mode") || "light";

    populateMagazineEditionDate();

    mountBroadsheetSectionWorkbench(
      "broadsheet-layouts-workbench-mount",
      catalogRegistry.layoutSpecimens,
      initialThemeKey,
      initialModeKey
    );

    mountBroadsheetSectionWorkbench(
      "broadsheet-simple-elements-workbench-mount",
      catalogRegistry.simpleElementSpecimens,
      initialThemeKey,
      initialModeKey
    );

    mountBroadsheetSectionWorkbench(
      "broadsheet-complex-components-workbench-mount",
      catalogRegistry.complexComponentSpecimens,
      initialThemeKey,
      initialModeKey
    );

    bindNewspaperSectionRouting();
    bindGlobalThemeAndModeControls();
    bindMobilePocketNewspaperControls();
    updateMobileReadingProgress();
  });
})(window, document);
