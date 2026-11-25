/**
 * ============================================================================
 * NRKI — BROADSHEET MASTER SITE INDEX CONTROLLER (`assets/scripts/broadsheet-site-index.js`)
 * ----------------------------------------------------------------------------
 * Powers the interactive on-site directory at `pages/site-index.html`:
 *
 * 1. mountDynamicShelfDirectoryEntries() — Reads `window.NRKI_DATA` (when
 *    populated on `dev` or future production launches) and appends searchable
 *    ledger rows for Projects, Works, and Media entries into `#dynamic-shelf-index-list`.
 * 2. initializeBroadsheetSiteIndex()     — Binds instant keyword filtering
 *    (`[data-site-index-search-input]`), category pills
 *    (`[data-site-index-category-button]`), URL `?q=` query prefill, section
 *    auto-hiding when a section has 0 matching rows, and live result counts.
 *
 * Why a static HTML ledger + progressive enhancement from `window.NRKI_DATA`
 * was chosen over a pure JS-rendered page:
 * Keeping all core pages, resumes, and Issue 01 specimens directly in semantic
 * HTML guarantees search engine crawlers (Googlebot, Bingbot) can index every
 * link without executing JavaScript, while readers get instant live filtering.
 * ============================================================================
 */

(function initializeBroadsheetSiteIndexModule() {
  /**
   * Appends dynamic Projects, Works, and Media rows from `window.NRKI_DATA`
   * into `#dynamic-shelf-index-list` when shelf entries exist.
   */
  function mountDynamicShelfDirectoryEntries() {
    const dynamicLedgerContainer = document.getElementById(
      "dynamic-shelf-index-list"
    );
    const emptyShelfCallout = document.getElementById(
      "dynamic-shelf-empty-callout"
    );
    if (!dynamicLedgerContainer) return;

    const globalSiteCatalog = window.NRKI_DATA || {};
    const projectEntries = Array.isArray(globalSiteCatalog.PROJECT_ITEMS)
      ? globalSiteCatalog.PROJECT_ITEMS
      : [];
    const workEntries = Array.isArray(globalSiteCatalog.WORK_ITEMS)
      ? globalSiteCatalog.WORK_ITEMS
      : [];
    const mediaEntries = Array.isArray(globalSiteCatalog.MEDIA_ITEMS)
      ? globalSiteCatalog.MEDIA_ITEMS
      : [];

    const combinedShelfDescriptors = [];

    projectEntries.forEach((projectRecord) => {
      combinedShelfDescriptors.push({
        categorySlug: "projects",
        badgeLabel: "Project",
        titleText: projectRecord.title || "Untitled Project",
        summaryText: projectRecord.summary || "",
        tagList: Array.isArray(projectRecord.tags) ? projectRecord.tags : [],
        metaStamp: projectRecord.statusLabel || "Project Dossier",
        targetHref: `./project-view.html?id=${encodeURIComponent(
          projectRecord.id || ""
        )}`,
      });
    });

    workEntries.forEach((workRecord) => {
      combinedShelfDescriptors.push({
        categorySlug: "works",
        badgeLabel: workRecord.categoryLabel || "Work",
        titleText: workRecord.title || "Untitled Work",
        summaryText: workRecord.summary || "",
        tagList: Array.isArray(workRecord.tags) ? workRecord.tags : [],
        metaStamp: workRecord.date || "Archive Dispatch",
        targetHref: `./work-view.html?id=${encodeURIComponent(
          workRecord.id || ""
        )}`,
      });
    });

    mediaEntries.forEach((mediaRecord) => {
      combinedShelfDescriptors.push({
        categorySlug: "media",
        badgeLabel: mediaRecord.badgeLabel || "Media Ledger",
        titleText: mediaRecord.title || "Untitled Media",
        summaryText: `${mediaRecord.creator ? `${mediaRecord.creator} — ` : ""}${
          mediaRecord.notes || ""
        }`,
        tagList: Array.isArray(mediaRecord.tags) ? mediaRecord.tags : [],
        metaStamp: mediaRecord.ratingOrStatus || "Ledger Entry",
        targetHref: "./media.html",
      });
    });

    if (combinedShelfDescriptors.length === 0) {
      if (emptyShelfCallout) {
        emptyShelfCallout.classList.remove("nrki-hidden");
      }
      return;
    }

    if (emptyShelfCallout) {
      emptyShelfCallout.classList.add("nrki-hidden");
    }

    combinedShelfDescriptors.forEach((shelfDescriptor) => {
      const ledgerAnchor = document.createElement("a");
      ledgerAnchor.className = "nrki-work-row";
      ledgerAnchor.href = shelfDescriptor.targetHref;
      ledgerAnchor.setAttribute("data-site-index-entry", "");
      ledgerAnchor.setAttribute(
        "data-index-category",
        shelfDescriptor.categorySlug
      );

      const searchableKeywords = [
        shelfDescriptor.badgeLabel,
        shelfDescriptor.titleText,
        shelfDescriptor.summaryText,
        shelfDescriptor.metaStamp,
        shelfDescriptor.tagList.join(" "),
      ]
        .join(" ")
        .toLowerCase();
      ledgerAnchor.setAttribute("data-index-keywords", searchableKeywords);

      const categorySpan = document.createElement("span");
      categorySpan.className = "nrki-work-category";
      categorySpan.textContent = shelfDescriptor.badgeLabel;

      const mainColumnSpan = document.createElement("span");
      mainColumnSpan.className = "nrki-work-main";

      const titleStrong = document.createElement("strong");
      titleStrong.textContent = shelfDescriptor.titleText;

      const summarySpan = document.createElement("span");
      const formattedTags =
        shelfDescriptor.tagList.length > 0
          ? ` (${shelfDescriptor.tagList
              .map((tagToken) =>
                tagToken.startsWith("#") ? tagToken : `#${tagToken}`
              )
              .join(" ")})`
          : "";
      summarySpan.textContent = `${shelfDescriptor.summaryText}${formattedTags}`;

      mainColumnSpan.appendChild(titleStrong);
      mainColumnSpan.appendChild(summarySpan);

      const stampSpan = document.createElement("span");
      stampSpan.className = "nrki-work-date";
      stampSpan.textContent = `${shelfDescriptor.metaStamp} →`;

      ledgerAnchor.appendChild(categorySpan);
      ledgerAnchor.appendChild(mainColumnSpan);
      ledgerAnchor.appendChild(stampSpan);
      dynamicLedgerContainer.appendChild(ledgerAnchor);
    });
  }

  /**
   * Wires the live search input, category filter pills, reset trigger, and
   * section visibility toggles on `pages/site-index.html`.
   */
  function initializeBroadsheetSiteIndex() {
    const indexRootScope = document.querySelector("[data-site-index-root]");
    if (!indexRootScope) return;

    mountDynamicShelfDirectoryEntries();

    const searchQueryInput = indexRootScope.querySelector(
      "[data-site-index-search-input]"
    );
    const clearSearchButton = indexRootScope.querySelector(
      "[data-site-index-reset-button]"
    );
    const categoryFilterButtons = Array.from(
      indexRootScope.querySelectorAll("[data-site-index-category-button]")
    );
    const countDisplayElement = indexRootScope.querySelector(
      "[data-site-index-count-display]"
    );
    const emptySearchState = indexRootScope.querySelector(
      "[data-site-index-empty]"
    );
    const indexSectionBlocks = Array.from(
      indexRootScope.querySelectorAll("[data-site-index-section]")
    );
    const directoryEntryElements = Array.from(
      indexRootScope.querySelectorAll("[data-site-index-entry]")
    );

    let activeCategorySlug = "all";

    function applySiteIndexSearchAndCategoryFilter() {
      const rawQueryText = searchQueryInput ? searchQueryInput.value : "";
      const normalizedSearchTokens = rawQueryText
        .toLowerCase()
        .trim()
        .split(/\s+/)
        .filter(Boolean);

      let visibleDirectoryEntryCount = 0;

      directoryEntryElements.forEach((directoryEntryElement) => {
        const entryCategorySlug =
          directoryEntryElement.getAttribute("data-index-category") || "";
        const entryKeywords = (
          directoryEntryElement.getAttribute("data-index-keywords") ||
          directoryEntryElement.textContent ||
          ""
        ).toLowerCase();

        const matchesCategory =
          activeCategorySlug === "all" ||
          entryCategorySlug.split(/\s+/).includes(activeCategorySlug);

        const matchesSearchQuery =
          normalizedSearchTokens.length === 0 ||
          normalizedSearchTokens.every((queryToken) =>
            entryKeywords.includes(queryToken)
          );

        const shouldShowEntry = matchesCategory && matchesSearchQuery;
        directoryEntryElement.classList.toggle("nrki-hidden", !shouldShowEntry);

        if (shouldShowEntry) {
          visibleDirectoryEntryCount += 1;
        }
      });

      indexSectionBlocks.forEach((sectionBlockElement) => {
        const visibleEntriesInSection = sectionBlockElement.querySelectorAll(
          "[data-site-index-entry]:not(.nrki-hidden)"
        );
        sectionBlockElement.classList.toggle(
          "nrki-hidden",
          visibleEntriesInSection.length === 0
        );
      });

      if (countDisplayElement) {
        countDisplayElement.textContent = `Showing ${visibleDirectoryEntryCount} of ${directoryEntryElements.length} indexed entries`;
      }

      if (emptySearchState) {
        emptySearchState.classList.toggle(
          "nrki-hidden",
          visibleDirectoryEntryCount > 0
        );
      }
    }

    categoryFilterButtons.forEach((categoryButton) => {
      categoryButton.addEventListener("click", () => {
        activeCategorySlug =
          categoryButton.getAttribute("data-site-index-category-button") ||
          "all";

        categoryFilterButtons.forEach((peerButton) => {
          const isSelectedButton =
            peerButton.getAttribute("data-site-index-category-button") ===
            activeCategorySlug;
          peerButton.classList.toggle("is-active", isSelectedButton);
          peerButton.setAttribute("aria-pressed", String(isSelectedButton));
        });

        applySiteIndexSearchAndCategoryFilter();
      });
    });

    if (searchQueryInput) {
      const urlSearchParameters = new URLSearchParams(window.location.search);
      const initialUrlQuery = urlSearchParameters.get("q");
      if (initialUrlQuery) {
        searchQueryInput.value = initialUrlQuery;
      }

      searchQueryInput.addEventListener("input", () => {
        applySiteIndexSearchAndCategoryFilter();
      });
    }

    if (clearSearchButton) {
      clearSearchButton.addEventListener("click", () => {
        if (searchQueryInput) {
          searchQueryInput.value = "";
          searchQueryInput.focus();
        }
        activeCategorySlug = "all";
        categoryFilterButtons.forEach((peerButton) => {
          const isAllButton =
            peerButton.getAttribute("data-site-index-category-button") ===
            "all";
          peerButton.classList.toggle("is-active", isAllButton);
          peerButton.setAttribute("aria-pressed", String(isAllButton));
        });
        applySiteIndexSearchAndCategoryFilter();
      });
    }

    applySiteIndexSearchAndCategoryFilter();
  }

  document.addEventListener("DOMContentLoaded", initializeBroadsheetSiteIndex);
})();
