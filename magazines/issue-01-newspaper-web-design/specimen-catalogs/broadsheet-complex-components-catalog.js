/**
 * ============================================================================
 * ISSUE 01 — COMPLEX COMPONENTS SPECIMEN CATALOG
 * (`specimen-catalogs/broadsheet-complex-components-catalog.js`)
 * ----------------------------------------------------------------------------
 * Documents every multi-part layout and stateful interactive component from
 * Components work cleanly across all 4 themes × Light/Dark (8 editions)
 * without overwriting global page state.
 * ============================================================================
 */

(function attachComplexComponentsCatalog(browserWindow) {
  "use strict";

  const magazineNamespace = (browserWindow.NRKIBroadsheetMagazine =
    browserWindow.NRKIBroadsheetMagazine || {});

  magazineNamespace.complexComponentSpecimens = [
    /* ----------------------------------------------------------------------
       01. Newspaper Masthead Bar, Wordmark, Live Clock & Navigation (HTML+CSS+JS)
       ---------------------------------------------------------------------- */
    {
      specimenId: "complex-newspaper-masthead",
      specimenTitle: "01. Newspaper Masthead, Wordmark & Live Dateline",
      categoryLabel: "Interactive Header",
      usageRationale:
        "Full broadsheet header uniting edition line, live JavaScript dateline/edition badge, display wordmark, and double-ruled navigation.",
      previewHtml: `<header class="nrki-site-header" style="padding-top: 0;">
  <div class="nrki-masthead-bar">
    <p class="nrki-edition-line nrki-eyebrow" style="margin: 0; color: var(--nrki-ink-body);">
      Vol. II · No. 01 — Independent Press
    </p>
    <div class="nrki-masthead-meta">
      <p class="nrki-masthead-dateline">
        <time data-preview-masthead-date>Nov 20, 2026</time>
        <span aria-hidden="true">·</span>
        <span data-preview-masthead-time>17:15</span>
        <span data-preview-masthead-tz>IST</span>
      </p>
      <span class="nrki-dateline-edition" data-preview-masthead-edition>Evening Edition</span>
    </div>
  </div>
  <a class="nrki-wordmark nrki-wordmark-compact" href="#specimen-preview">NRKI</a>
  <p class="nrki-masthead-tagline">Dispatches on code, design systems, and quiet archives.</p>
  <nav class="nrki-site-nav" aria-label="Sample broadsheet navigation">
    <a href="#specimen-preview">Home</a>
    <a href="#specimen-preview">Magazines</a>
    <a href="#specimen-preview" aria-current="page">Projects</a>
    <a href="#specimen-preview">Works</a>
  </nav>
</header>`,
      htmlSnippet: `<header class="nrki-site-header">
  <div class="nrki-masthead-bar">
    <p class="nrki-edition-line">Vol. II · No. 01 — Independent Press</p>
    <div class="nrki-masthead-meta">
      <p class="nrki-masthead-dateline">
        <time data-masthead-date></time> · <span data-masthead-time></span>
      </p>
      <span class="nrki-dateline-edition" data-masthead-edition>Edition</span>
    </div>
  </div>
  <a class="nrki-wordmark" href="/">NRKI</a>
  <nav class="nrki-site-nav" aria-label="Primary navigation">
    <a href="/" aria-current="page">Home</a>
    <a href="/magazines">Magazines</a>
  </nav>
</header>`,
      cssSnippet: `.nrki-masthead-bar {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding-block: 0.55rem;
  border-top: 2px solid var(--nrki-border-strong);
  border-bottom: 1px solid var(--nrki-border-subtle);
}

.nrki-site-nav {
  display: flex;
  justify-content: center;
  gap: 0.65rem 2.25rem;
  border-top: 3px double var(--nrki-border-strong);
  border-bottom: 1px solid var(--nrki-border-strong);
  background-color: var(--nrki-surface-elevated);
  padding: 0.65rem 0.85rem;
  font-family: var(--nrki-font-sans);
  font-size: 0.75rem;
  text-transform: uppercase;
}`,
      jsSnippet: `function updateNewspaperDateline(headerScopeElement) {
  const currentMoment = new Date();
  const dateDisplay = currentMoment.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const timeDisplay = currentMoment.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const dateNode = headerScopeElement.querySelector("[data-masthead-date]");
  const timeNode = headerScopeElement.querySelector("[data-masthead-time]");
  if (dateNode) dateNode.textContent = dateDisplay;
  if (timeNode) timeNode.textContent = timeDisplay;
}`,
      initializePreview(previewStageElement) {
        const currentMoment = new Date();
        const dateNode = previewStageElement.querySelector(
          "[data-preview-masthead-date]"
        );
        const timeNode = previewStageElement.querySelector(
          "[data-preview-masthead-time]"
        );
        const editionNode = previewStageElement.querySelector(
          "[data-preview-masthead-edition]"
        );

        if (dateNode) {
          dateNode.textContent = currentMoment.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
          });
        }
        if (timeNode) {
          timeNode.textContent = currentMoment.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          });
        }
        if (editionNode) {
          const currentHour = currentMoment.getHours();
          editionNode.textContent =
            currentHour < 12
              ? "Morning Edition"
              : currentHour < 17
              ? "Afternoon Edition"
              : "Evening Edition";
        }
      },
    },

    /* ----------------------------------------------------------------------
       02. Editorial & Interactive Link Cards
       ---------------------------------------------------------------------- */
    {
      specimenId: "complex-editorial-cards",
      specimenTitle: "02. Editorial & Interactive Link Cards",
      categoryLabel: "Cards",
      usageRationale:
        "Powers Projects and Works shelves with metadata header rows, clickable hover elevation, #tag pills, and action footers.",
      previewHtml: `<div class="nrki-card-grid">
  <article class="nrki-card">
    <div>
      <div class="nrki-card-meta">
        <span>Dispatch 01</span>
        <span class="nrki-badge">Static Surface</span>
      </div>
      <h3>Static Editorial Card</h3>
      <p>Framed broadsheet panel ideal for summaries, system notes, or status snapshots.</p>
    </div>
    <div class="nrki-card-footer">
      <span>Plain <code>.nrki-card</code></span>
      <span>Read-only</span>
    </div>
  </article>
  <a class="nrki-card nrki-card-link" href="#specimen-preview">
    <div>
      <div class="nrki-card-meta">
        <span>Project 02</span>
        <span class="nrki-badge nrki-badge-accent">Active</span>
      </div>
      <h3>Interactive Link Card</h3>
      <p>Full-card hover target used on Projects and Works directories with integrated tags.</p>
      <ul class="nrki-tag-pills">
        <li class="nrki-tag-pill">#css-library</li>
        <li class="nrki-tag-pill">#broadsheet</li>
      </ul>
    </div>
    <div class="nrki-card-footer">
      <span>Project Dossier</span>
      <span class="nrki-text-link">Explore →</span>
    </div>
  </a>
</div>`,
      htmlSnippet: `<a class="nrki-card nrki-card-link" href="/projects/broadsheet">
  <div>
    <div class="nrki-card-meta">
      <span>Project 01</span>
      <span class="nrki-badge nrki-badge-accent">Active</span>
    </div>
    <h3>Broadsheet Design System</h3>
    <p>Card summary copy explaining scope and architecture.</p>
    <ul class="nrki-tag-pills">
      <li class="nrki-tag-pill">#css-tokens</li>
    </ul>
  </div>
  <div class="nrki-card-footer">
    <span>GitHub &amp; Notes</span>
    <span class="nrki-text-link">Explore →</span>
  </div>
</a>`,
      cssSnippet: `.nrki-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1.25rem;
  border: 1px solid var(--nrki-border-subtle);
  border-radius: var(--nrki-radius-surface);
  background-color: var(--nrki-surface-elevated);
}

.nrki-card-link:hover {
  transform: translateY(-2px);
  background-color: var(--nrki-surface-panel);
  border-color: var(--nrki-border-strong);
  box-shadow: var(--nrki-shadow-surface);
}`,
    },

    /* ----------------------------------------------------------------------
       03. Pinboard Card & Media Ledger Card
       ---------------------------------------------------------------------- */
    {
      specimenId: "complex-pinboard-media-cards",
      specimenTitle: "03. Pinboard Card & Media Ledger Card",
      categoryLabel: "Specialized Cards",
      usageRationale:
        "Extends the base card pattern with brass-pin visual framing, Zettelkasten cross-reference chips, and media score stamps.",
      previewHtml: `<div class="nrki-card-grid">
  <article class="nrki-pin-card">
    <div>
      <div class="nrki-card-media">
        <svg viewBox="0 0 320 180" role="img" aria-label="Pinned motif diagram">
          <rect width="320" height="180" fill="var(--nrki-surface-panel)" />
          <rect x="28" y="24" width="264" height="132" fill="var(--nrki-surface-canvas)" stroke="var(--nrki-border-strong)" stroke-width="2" />
          <line x1="50" y1="60" x2="270" y2="60" stroke="var(--nrki-accent-primary)" stroke-width="3" />
          <text x="50" y="102" font-family="Georgia, serif" font-size="16" font-weight="bold" fill="var(--nrki-ink-heading)">Plate II · Brass Pin Motif</text>
        </svg>
      </div>
      <h3>Herbarium Folio Study</h3>
      <div class="nrki-motif-row">
        <strong>Motif:</strong> <a href="#specimen-preview">19th-C Botanical Prints ↗</a>
      </div>
      <div class="nrki-connected-row">
        <strong>Connects To</strong>
        <div class="nrki-connected-links">
          <a class="nrki-connected-chip" href="#specimen-preview">#Pin-01</a>
          <a class="nrki-connected-chip" href="#specimen-preview">#Pin-04</a>
        </div>
      </div>
    </div>
    <div class="nrki-card-footer">
      <span>Pin #02</span>
      <span class="nrki-text-link">Inspect Plate →</span>
    </div>
  </article>

  <article class="nrki-media-card">
    <div>
      <div class="nrki-media-card-header">
        <div>
          <span class="nrki-badge nrki-badge-accent">Review · Film</span>
          <h3 style="margin-top: 0.45rem;">Stalker (1979)</h3>
        </div>
        <span class="nrki-rating-stamp">9.6 / 10</span>
      </div>
      <p class="nrki-media-card-creator">Dir. Andrei Tarkovsky</p>
      <p class="nrki-media-card-notes">
        Poured concrete ruins overtaken by moss, rainwater, and unhurried camera choreography.
      </p>
    </div>
    <div class="nrki-card-footer">
      <span>Status: Completed</span>
      <span>Rewatch #2</span>
    </div>
  </article>
</div>`,
      htmlSnippet: `<article class="nrki-pin-card">
  <div class="nrki-card-media">...</div>
  <h3>Herbarium Folio Study</h3>
  <div class="nrki-motif-row"><strong>Motif:</strong> <a href="#">Botanical Prints</a></div>
  <div class="nrki-connected-row">
    <strong>Connects To</strong>
    <div class="nrki-connected-links"><a class="nrki-connected-chip" href="#">#Pin-01</a></div>
  </div>
</article>`,
      cssSnippet: `.nrki-pin-card::before {
  content: "";
  position: absolute;
  top: -5px;
  left: 50%;
  transform: translateX(-50%);
  width: 2.75rem;
  height: 9px;
  background-color: var(--nrki-accent-highlight-tint);
  border: 1px solid var(--nrki-accent-highlight);
}

.nrki-motif-row {
  padding: 0.45rem 0.65rem;
  border-left: 2px solid var(--nrki-accent-highlight);
  background-color: var(--nrki-surface-canvas);
}`,
    },

    /* ----------------------------------------------------------------------
       04. Broadsheet Lead Story, Section Grid & Multi-Column Prose
       ---------------------------------------------------------------------- */
    {
      specimenId: "complex-broadsheet-grids",
      specimenTitle: "04. Lead Story Split, Section Grid & News Columns",
      categoryLabel: "Layouts",
      usageRationale:
        "Demonstrates NRKI's asymmetric Lead Story hero + Contents Aside alongside multi-column CSS newspaper prose.",
      previewHtml: `<div>
  <section class="nrki-lead-story" style="padding-block: 1rem 1.75rem; margin-bottom: 1.5rem;">
    <div>
      <p class="nrki-eyebrow">Lead Feature</p>
      <h2 style="font-size: clamp(1.8rem, 3.5vw, 2.75rem); margin-bottom: 0.75rem;">
        Front Page Asymmetric Grid
      </h2>
      <p class="nrki-lead-summary" style="margin-bottom: 0;">
        Primary headline &amp; narrative occupy 1.7fr on the left while an editorial table of contents
        anchors the right column.
      </p>
    </div>
    <aside class="nrki-lead-aside">
      <p class="nrki-aside-label">In This Dispatch</p>
      <ol>
        <li><a href="#specimen-preview">Manifesto &amp; Layer Order</a></li>
        <li><a href="#specimen-preview">Atomic Elements Catalog</a></li>
        <li><a href="#specimen-preview">Interactive Components</a></li>
      </ol>
    </aside>
  </section>
  <div class="nrki-columns-prose">
    <p>
      Multi-column CSS splits long essays naturally with hairline vertical rules between columns,
      creating classic print readability when horizontal space allows.
    </p>
    <p style="margin-bottom: 0;">
      When a viewport narrows, columns collapse seamlessly down to one readable stream without extra media queries.
    </p>
  </div>
</div>`,
      htmlSnippet: `<section class="nrki-lead-story">
  <div>
    <p class="nrki-eyebrow">Lead Feature</p>
    <h1>Front Page Headline</h1>
    <p class="nrki-lead-summary">Summary copy...</p>
  </div>
  <aside class="nrki-lead-aside">
    <p class="nrki-aside-label">In This Issue</p>
    <ol><li><a href="#">Section One</a></li></ol>
  </aside>
</section>
<div class="nrki-columns-prose"><p>Multi-column prose...</p></div>`,
      cssSnippet: `.nrki-lead-story {
  display: grid;
  grid-template-columns: minmax(0, 1.7fr) minmax(14rem, 0.85fr);
  gap: clamp(1.5rem, 5vw, 4.5rem);
  border-bottom: 3px double var(--nrki-border-strong);
}

.nrki-columns-prose {
  columns: 2 17rem;
  column-gap: 2rem;
  column-rule: 1px solid var(--nrki-border-faint);
}`,
    },

    /* ----------------------------------------------------------------------
       05. Interactive Filter Bar & Shelf Controls (HTML + CSS + JS)
       ---------------------------------------------------------------------- */
    {
      specimenId: "complex-filter-shelf",
      specimenTitle: "05. Interactive Filter Bar & Collection Shelf",
      categoryLabel: "Interactive Shelf",
      usageRationale:
        "Powers Projects, Works, and Media filtering using plain ARIA attributes (aria-pressed) and .nrki-hidden without !important.",
      previewHtml: `<div data-preview-filter-scope>
  <div class="nrki-filter-controls">
    <div class="nrki-filter-bar" role="group" aria-label="Filter specimen cards">
      <button type="button" class="nrki-filter-button is-active" aria-pressed="true" data-preview-filter-trigger="all">All</button>
      <button type="button" class="nrki-filter-button" aria-pressed="false" data-preview-filter-trigger="essay">Essays</button>
      <button type="button" class="nrki-filter-button" aria-pressed="false" data-preview-filter-trigger="build">Builds</button>
    </div>
    <span class="nrki-shelf-status-bar" style="margin: 0;" data-preview-filter-count>Showing 3 entries</span>
  </div>
  <div class="nrki-card-grid">
    <article class="nrki-card" data-preview-filter-card="essay">
      <div class="nrki-card-meta"><span>Essay</span><span>#type</span></div>
      <h3>On Broadsheet Grids</h3>
      <p style="margin-bottom: 0;">Why structural rules age better than blurred cards.</p>
    </article>
    <article class="nrki-card" data-preview-filter-card="build">
      <div class="nrki-card-meta"><span>Build</span><span>#css</span></div>
      <h3>NRKI Token Engine</h3>
      <p style="margin-bottom: 0;">4 themes × Light/Dark powered by @layer.</p>
    </article>
    <article class="nrki-card" data-preview-filter-card="essay">
      <div class="nrki-card-meta"><span>Essay</span><span>#notes</span></div>
      <h3>Flat-File Publishing</h3>
      <p style="margin-bottom: 0;">Plain text prose paired with minimal JSON manifests.</p>
    </article>
  </div>
</div>`,
      htmlSnippet: `<div class="nrki-filter-controls">
  <div class="nrki-filter-bar" role="group" aria-label="Category filter">
    <button type="button" class="nrki-filter-button is-active" aria-pressed="true" data-filter-category="all">All</button>
    <button type="button" class="nrki-filter-button" aria-pressed="false" data-filter-category="essay">Essays</button>
  </div>
  <span class="nrki-shelf-status-bar" data-filter-status>Showing 2 entries</span>
</div>`,
      cssSnippet: `.nrki-filter-button {
  padding: 0.35rem 0.75rem;
  border: 1px solid var(--nrki-border-subtle);
  border-radius: var(--nrki-radius-pill);
  background-color: transparent;
  color: var(--nrki-ink-muted);
  font-family: var(--nrki-font-sans);
  font-size: 0.72rem;
  text-transform: uppercase;
  cursor: pointer;
}

.nrki-filter-button[aria-pressed="true"] {
  background-color: var(--nrki-ink-heading);
  border-color: var(--nrki-ink-heading);
  color: var(--nrki-surface-canvas);
  font-weight: 700;
}`,
      jsSnippet: `function attachCategoryFilterControls(shelfContainer) {
  const filterButtons = shelfContainer.querySelectorAll("[data-filter-category]");
  const cardElements = shelfContainer.querySelectorAll("[data-card-category]");
  const countLabel = shelfContainer.querySelector("[data-filter-status]");

  filterButtons.forEach((clickedButton) => {
    clickedButton.addEventListener("click", () => {
      const selectedCategory = clickedButton.getAttribute("data-filter-category");
      let visibleCardTotal = 0;

      filterButtons.forEach((peerButton) => {
        const isCurrentMatch = peerButton === clickedButton;
        peerButton.setAttribute("aria-pressed", String(isCurrentMatch));
        peerButton.classList.toggle("is-active", isCurrentMatch);
      });

      cardElements.forEach((cardElement) => {
        const matchesCategory =
          selectedCategory === "all" ||
          cardElement.getAttribute("data-card-category") === selectedCategory;
        cardElement.classList.toggle("nrki-hidden", !matchesCategory);
        if (matchesCategory) visibleCardTotal += 1;
      });

      if (countLabel) {
        countLabel.textContent = "Showing " + visibleCardTotal + " entries";
      }
    });
  });
}`,
      initializePreview(previewStageElement) {
        const filterButtons = previewStageElement.querySelectorAll(
          "[data-preview-filter-trigger]"
        );
        const shelfCards = previewStageElement.querySelectorAll(
          "[data-preview-filter-card]"
        );
        const countDisplay = previewStageElement.querySelector(
          "[data-preview-filter-count]"
        );

        filterButtons.forEach((filterButton) => {
          filterButton.addEventListener("click", () => {
            const targetCategory = filterButton.getAttribute(
              "data-preview-filter-trigger"
            );
            let matchingCardCount = 0;

            filterButtons.forEach((peerButton) => {
              const isSelected = peerButton === filterButton;
              peerButton.classList.toggle("is-active", isSelected);
              peerButton.setAttribute("aria-pressed", String(isSelected));
            });

            shelfCards.forEach((shelfCard) => {
              const matches =
                targetCategory === "all" ||
                shelfCard.getAttribute("data-preview-filter-card") ===
                  targetCategory;
              shelfCard.classList.toggle("nrki-hidden", !matches);
              if (matches) matchingCardCount += 1;
            });

            if (countDisplay) {
              countDisplay.textContent = `Showing ${matchingCardCount} ${
                matchingCardCount === 1 ? "entry" : "entries"
              }`;
            }
          });
        });
      },
    },

    /* ----------------------------------------------------------------------
       06. Works Ledger & Resume Dossier Rows
       ---------------------------------------------------------------------- */
    {
      specimenId: "complex-ledger-resume-rows",
      specimenTitle: "06. Works Newspaper Index & Resume Directory Rows",
      categoryLabel: "Ledgers",
      usageRationale:
        "3-column horizontal ledger rows for scannable chronologies (Works index) and Web + PDF resume directories.",
      previewHtml: `<div class="nrki-stack-md">
  <div class="nrki-works-ledger">
    <a class="nrki-work-row" href="#specimen-preview">
      <span class="nrki-work-category">Dev Log</span>
      <span class="nrki-work-main">
        <strong>Building NRKI v2 Around Cascade Layers</strong>
        <span>Documenting primitives in Magazine Issue 01 before site migration.</span>
      </span>
      <time class="nrki-work-date">Nov 2026 →</time>
    </a>
    <a class="nrki-work-row" href="#specimen-preview">
      <span class="nrki-work-category">Article</span>
      <span class="nrki-work-main">
        <strong>Typography &amp; Hairline Rules Over Drop Shadows</strong>
        <span>Practical CSS grid discipline inspired by print broadsheets.</span>
      </span>
      <time class="nrki-work-date">Oct 2026 →</time>
    </a>
  </div>
  <div class="nrki-resume-list">
    <div class="nrki-resume-row">
      <span class="nrki-eyebrow" style="margin: 0;">01</span>
      <div>
        <strong style="display: block; color: var(--nrki-ink-heading);">Front-End Engineering Resume</strong>
        <span style="font-size: 0.88rem; color: var(--nrki-ink-muted);">Focused on CSS systems, TypeScript &amp; React architecture.</span>
      </div>
      <div class="nrki-button-group">
        <a class="nrki-button nrki-button-small nrki-button-primary" href="#specimen-preview">Web View ↗</a>
        <a class="nrki-button nrki-button-small" href="#specimen-preview">PDF ↓</a>
      </div>
    </div>
  </div>
</div>`,
      htmlSnippet: `<div class="nrki-works-ledger">
  <a class="nrki-work-row" href="/work-view">
    <span class="nrki-work-category">Dev Log</span>
    <span class="nrki-work-main">
      <strong>Building NRKI v2</strong>
      <span>One-sentence editorial teaser.</span>
    </span>
    <time class="nrki-work-date">Nov 2026 →</time>
  </a>
</div>`,
      cssSnippet: `.nrki-work-row {
  display: grid;
  grid-template-columns: 7rem minmax(0, 1fr) auto;
  align-items: baseline;
  gap: 1rem;
  padding: 1.05rem 0.5rem;
  border-bottom: 1px solid var(--nrki-border-faint);
  text-decoration: none;
}`,
    },

    /* ----------------------------------------------------------------------
       07. Accessible Modal / Article Overlay (HTML + CSS + JS)
       ---------------------------------------------------------------------- */
    {
      specimenId: "complex-accessible-modal",
      specimenTitle: "07. Accessible Modal & Article Overlay",
      categoryLabel: "Interactive Overlay",
      usageRationale:
        "Full-screen dialog inheriting the specimen stage's active theme, supporting backdrop click and Escape key dismissal.",
      previewHtml: `<div>
  <p style="margin-bottom: 0.85rem;">
    Click below to launch the live <code>role="dialog"</code> modal styled in this specimen's active
    theme mode. Dismiss with <kbd>Esc</kbd>, the Close button, or clicking the backdrop.
  </p>
  <button type="button" class="nrki-button nrki-button-primary" data-preview-modal-open>
    Open Article Overlay Modal ↗
  </button>

  <div class="nrki-modal-backdrop nrki-hidden" role="dialog" aria-modal="true" aria-labelledby="specimen-modal-heading" data-preview-modal-backdrop>
    <div class="nrki-modal-dialog">
      <div class="nrki-modal-topbar">
        <span class="nrki-eyebrow" style="margin: 0;">Magazine Overlay Specimen</span>
        <button type="button" class="nrki-button nrki-button-small" data-preview-modal-close>Close (Esc) ×</button>
      </div>
      <h2 id="specimen-modal-heading" style="margin-bottom: 0.75rem;">Editorial Reading Modal</h2>
      <p>
        Because tokens cascade from the specimen wrapper, this dialog automatically honors
        <strong>Classic</strong>, <strong>Ancient</strong>, <strong>Minimalistic</strong>, and
        <strong>UwU</strong> in both <strong>Light</strong> and <strong>Dark</strong> modes.
      </p>
      <div class="nrki-modal-motifs-box">
        <p class="nrki-eyebrow" style="margin-bottom: 0.35rem;">Connected References</p>
        <p style="margin-bottom: 0;">Press <kbd>Esc</kbd> or click Close to return to Magazine Issue 01.</p>
      </div>
    </div>
  </div>
</div>`,
      htmlSnippet: `<button type="button" class="nrki-button nrki-button-primary" data-modal-open>
  Open Overlay Modal
</button>
<div class="nrki-modal-backdrop nrki-hidden" role="dialog" aria-modal="true" data-modal-backdrop>
  <div class="nrki-modal-dialog">
    <div class="nrki-modal-topbar">
      <span class="nrki-eyebrow">Editorial Overlay</span>
      <button type="button" class="nrki-button nrki-button-small" data-modal-close>Close ×</button>
    </div>
    <h2>Article Overlay Title</h2>
    <p>Modal essay body copy...</p>
  </div>
</div>`,
      cssSnippet: `.nrki-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 300;
  background-color: rgba(18, 22, 19, 0.72);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(1rem, 4vw, 2.5rem);
}

.nrki-modal-dialog {
  width: min(100%, 48rem);
  background-color: var(--nrki-surface-elevated);
  border: 2px solid var(--nrki-border-strong);
  border-radius: var(--nrki-radius-surface);
  padding: clamp(1.5rem, 3.5vw, 2.5rem);
  box-shadow: var(--nrki-shadow-overlay);
}`,
      jsSnippet: `function bindModalOverlayControls(openTrigger, backdropElement, closeTrigger) {
  function closeModalOverlay() {
    backdropElement.classList.add("nrki-hidden");
    openTrigger.focus();
  }

  openTrigger.addEventListener("click", () => {
    backdropElement.classList.remove("nrki-hidden");
    closeTrigger.focus();
  });

  closeTrigger.addEventListener("click", closeModalOverlay);

  backdropElement.addEventListener("click", (pointerEvent) => {
    if (pointerEvent.target === backdropElement) closeModalOverlay();
  });

  document.addEventListener("keydown", (keyboardEvent) => {
    if (keyboardEvent.key === "Escape" && !backdropElement.classList.contains("nrki-hidden")) {
      closeModalOverlay();
    }
  });
}`,
      initializePreview(previewStageElement) {
        const openButton = previewStageElement.querySelector(
          "[data-preview-modal-open]"
        );
        const modalBackdrop = previewStageElement.querySelector(
          "[data-preview-modal-backdrop]"
        );
        const closeButton = previewStageElement.querySelector(
          "[data-preview-modal-close]"
        );
        if (!openButton || !modalBackdrop || !closeButton) return;

        function closeModalOverlay() {
          modalBackdrop.classList.add("nrki-hidden");
          openButton.focus({ preventScroll: true });
        }

        openButton.addEventListener("click", () => {
          modalBackdrop.classList.remove("nrki-hidden");
          closeButton.focus({ preventScroll: true });
        });

        closeButton.addEventListener("click", closeModalOverlay);

        modalBackdrop.addEventListener("click", (pointerEvent) => {
          if (pointerEvent.target === modalBackdrop) {
            closeModalOverlay();
          }
        });

        previewStageElement.ownerDocument.addEventListener(
          "keydown",
          (keyboardEvent) => {
            if (
              keyboardEvent.key === "Escape" &&
              !modalBackdrop.classList.contains("nrki-hidden")
            ) {
              closeModalOverlay();
            }
          }
        );
      },
    },

    /* ----------------------------------------------------------------------
       08. Expandable Accordions — Flush Hairline & Boxed Exclusive Variants
       ---------------------------------------------------------------------- */
    {
      specimenId: "complex-expandable-accordions",
      specimenTitle: "08. Accordions — Flush Hairline & Boxed Exclusive",
      categoryLabel: "Disclosure",
      usageRationale:
        "Showcases flush editorial FAQs (.nrki-accordion) beside framed, single-open accordion cards (.nrki-accordion-boxed) styled with each theme's borders.",
      previewHtml: `<div class="nrki-stack-md">
  <div>
    <p class="nrki-eyebrow" style="margin-bottom: 0.35rem;">Variant A · Flush Broadsheet Hairlines</p>
    <div class="nrki-accordion">
      <details class="nrki-accordion-item" open>
        <summary class="nrki-accordion-summary">Why native &lt;details&gt; for accordions?</summary>
        <div class="nrki-accordion-body">
          Native disclosure elements deliver built-in keyboard navigation and screen-reader state cleanly.
        </div>
      </details>
      <details class="nrki-accordion-item">
        <summary class="nrki-accordion-summary">Can multiple flush panels stay open?</summary>
        <div class="nrki-accordion-body">
          Yes—omit the shared <code>name</code> attribute when readers may want to compare sections side by side.
        </div>
      </details>
    </div>
  </div>

  <div>
    <p class="nrki-eyebrow" style="margin-bottom: 0.45rem;">Variant B · Boxed Exclusive Accordion (One Open At A Time)</p>
    <div class="nrki-accordion-boxed" data-preview-exclusive-accordion>
      <details class="nrki-accordion-item" name="nrki-exclusive-faq" open>
        <summary class="nrki-accordion-summary">01 · How does @layer replace !important?</summary>
        <div class="nrki-accordion-body">
          Cascade layers declare explicit precedence upfront so token and component overrides never depend on selector hacks.
        </div>
      </details>
      <details class="nrki-accordion-item" name="nrki-exclusive-faq">
        <summary class="nrki-accordion-summary">02 · How do Ancient corners extend outward?</summary>
        <div class="nrki-accordion-body">
          A 9-slice SVG border-image uses <code>border-image-outset: 5px</code> so baroque flourishes curl past the card frame.
        </div>
      </details>
      <details class="nrki-accordion-item" name="nrki-exclusive-faq">
        <summary class="nrki-accordion-summary">03 · Does it work over local file:// URLs?</summary>
        <div class="nrki-accordion-body">
          Yes—both static HTML/CSS and vanilla scripts run cleanly offline with zero build step.
        </div>
      </details>
    </div>
  </div>
</div>`,
      htmlSnippet: `<div class="nrki-accordion-boxed" data-exclusive-accordion>
  <details class="nrki-accordion-item" name="faq-group" open>
    <summary class="nrki-accordion-summary">Question heading</summary>
    <div class="nrki-accordion-body">Expanded answer panel...</div>
  </details>
  <details class="nrki-accordion-item" name="faq-group">
    <summary class="nrki-accordion-summary">Second question</summary>
    <div class="nrki-accordion-body">Second answer...</div>
  </details>
</div>`,
      cssSnippet: `.nrki-accordion-boxed .nrki-accordion-item {
  border: var(--nrki-card-border);
  border-radius: var(--nrki-radius-surface);
  background-color: var(--nrki-surface-elevated);
  box-shadow: var(--nrki-card-frame-shadow);
}

.nrki-accordion-boxed .nrki-accordion-item[open] {
  border-left: 4px solid var(--nrki-accent-primary);
}`,
      jsSnippet: `function enforceExclusiveAccordion(accordionContainer) {
  const detailPanels = accordionContainer.querySelectorAll("details.nrki-accordion-item");
  detailPanels.forEach((panelNode) => {
    panelNode.addEventListener("toggle", () => {
      if (!panelNode.open) return;
      detailPanels.forEach((peerPanel) => {
        if (peerPanel !== panelNode && peerPanel.open) {
          peerPanel.open = false;
        }
      });
    });
  });
}`,
      initializePreview(previewStageElement) {
        const exclusiveGroup = previewStageElement.querySelector(
          "[data-preview-exclusive-accordion]"
        );
        if (!exclusiveGroup) return;

        const detailPanels = exclusiveGroup.querySelectorAll(
          "details.nrki-accordion-item"
        );
        detailPanels.forEach((panelNode) => {
          panelNode.addEventListener("toggle", () => {
            if (!panelNode.open) return;
            detailPanels.forEach((peerPanel) => {
              if (peerPanel !== panelNode && peerPanel.open) {
                peerPanel.open = false;
              }
            });
          });
        });
      },
    },

    /* ----------------------------------------------------------------------
       09. Newspaper Tabs & Segmented Controls (HTML + CSS + JS)
       ---------------------------------------------------------------------- */
    {
      specimenId: "complex-tabs-segmented",
      specimenTitle: "09. Newspaper Tabs & Segmented Controls",
      categoryLabel: "Navigation & Toggles",
      usageRationale:
        "Combines ARIA tab panels (.nrki-tabs) with compact inline segmented switchers (.nrki-segmented-control) for filtering views or density.",
      previewHtml: `<div class="nrki-stack-md">
  <div class="nrki-tabs" data-preview-tabs-root>
    <div class="nrki-tab-list" role="tablist" aria-label="Sample edition tabs">
      <button type="button" class="nrki-tab-trigger" role="tab" aria-selected="true" data-preview-tab-target="panel-architecture">Architecture</button>
      <button type="button" class="nrki-tab-trigger" role="tab" aria-selected="false" data-preview-tab-target="panel-theming">4 × 2 Tokens</button>
      <button type="button" class="nrki-tab-trigger" role="tab" aria-selected="false" data-preview-tab-target="panel-portability">Portability</button>
    </div>
    <div class="nrki-tab-panel" role="tabpanel" data-preview-tab-panel="panel-architecture">
      Cascade layers keep tokens, resets, elements, components, and print completely ordered with zero !important rules.
    </div>
    <div class="nrki-tab-panel nrki-hidden" role="tabpanel" data-preview-tab-panel="panel-theming">
      Switch any parent or section independently across Classic, Ancient, Minimalistic, and UwU in Light or Dark mode.
    </div>
    <div class="nrki-tab-panel nrki-hidden" role="tabpanel" data-preview-tab-panel="panel-portability">
      Drop nrki-broadsheet-library.css into external static sites, SPAs, or documentation portals with zero bundler.
    </div>
  </div>

  <div class="nrki-stack-sm">
    <div class="nrki-segmented-control" role="group" aria-label="View density" data-preview-segmented-root>
      <button type="button" class="nrki-segmented-option" aria-pressed="true" data-preview-segment-label="Spread Edition">Spread</button>
      <button type="button" class="nrki-segmented-option" aria-pressed="false" data-preview-segment-label="Compact Index">Compact</button>
      <button type="button" class="nrki-segmented-option" aria-pressed="false" data-preview-segment-label="Reader Stream">Reader</button>
    </div>
    <p class="nrki-quiet-note" style="margin: 0;" data-preview-segment-status>Active segment: Spread Edition</p>
  </div>
</div>`,
      htmlSnippet: `<div class="nrki-tabs" data-tabs-root>
  <div class="nrki-tab-list" role="tablist">
    <button type="button" class="nrki-tab-trigger" role="tab" aria-selected="true" data-tab-target="tab-a">Tab A</button>
    <button type="button" class="nrki-tab-trigger" role="tab" aria-selected="false" data-tab-target="tab-b">Tab B</button>
  </div>
  <div class="nrki-tab-panel" role="tabpanel" data-tab-panel="tab-a">Panel A content</div>
  <div class="nrki-tab-panel nrki-hidden" role="tabpanel" data-tab-panel="tab-b">Panel B content</div>
</div>
<div class="nrki-segmented-control" role="group">
  <button type="button" class="nrki-segmented-option" aria-pressed="true">Spread</button>
  <button type="button" class="nrki-segmented-option" aria-pressed="false">Compact</button>
</div>`,
      cssSnippet: `.nrki-segmented-control {
  display: inline-flex;
  padding: 0.22rem;
  gap: 0.22rem;
  border: var(--nrki-card-border);
  border-radius: var(--nrki-radius-pill);
  background-color: var(--nrki-surface-panel);
}

.nrki-segmented-option[aria-pressed="true"] {
  background-color: var(--nrki-surface-elevated);
  color: var(--nrki-accent-primary);
}`,
      jsSnippet: `function attachAccessibleTabGroup(tabsContainer) {
  const tabButtons = tabsContainer.querySelectorAll("[data-tab-target]");
  const tabPanels = tabsContainer.querySelectorAll("[data-tab-panel]");

  tabButtons.forEach((selectedButton) => {
    selectedButton.addEventListener("click", () => {
      const targetPanelId = selectedButton.getAttribute("data-tab-target");
      tabButtons.forEach((peerButton) => {
        peerButton.setAttribute("aria-selected", String(peerButton === selectedButton));
      });
      tabPanels.forEach((panelElement) => {
        panelElement.classList.toggle("nrki-hidden", panelElement.getAttribute("data-tab-panel") !== targetPanelId);
      });
    });
  });
}`,
      initializePreview(previewStageElement) {
        const tabsRoot = previewStageElement.querySelector(
          "[data-preview-tabs-root]"
        );
        if (tabsRoot) {
          const tabTriggers = tabsRoot.querySelectorAll(
            "[data-preview-tab-target]"
          );
          const tabPanels = tabsRoot.querySelectorAll("[data-preview-tab-panel]");

          tabTriggers.forEach((clickedTrigger) => {
            clickedTrigger.addEventListener("click", () => {
              const targetPanelName = clickedTrigger.getAttribute(
                "data-preview-tab-target"
              );
              tabTriggers.forEach((peerTrigger) => {
                peerTrigger.setAttribute(
                  "aria-selected",
                  String(peerTrigger === clickedTrigger)
                );
              });
              tabPanels.forEach((tabPanel) => {
                const isMatch =
                  tabPanel.getAttribute("data-preview-tab-panel") ===
                  targetPanelName;
                tabPanel.classList.toggle("nrki-hidden", !isMatch);
              });
            });
          });
        }

        const segmentedRoot = previewStageElement.querySelector(
          "[data-preview-segmented-root]"
        );
        const segmentStatus = previewStageElement.querySelector(
          "[data-preview-segment-status]"
        );
        if (segmentedRoot && segmentStatus) {
          const segmentOptions = segmentedRoot.querySelectorAll(
            ".nrki-segmented-option"
          );
          segmentOptions.forEach((clickedOption) => {
            clickedOption.addEventListener("click", () => {
              segmentOptions.forEach((peerOption) => {
                peerOption.setAttribute(
                  "aria-pressed",
                  String(peerOption === clickedOption)
                );
              });
              segmentStatus.textContent = `Active segment: ${clickedOption.getAttribute(
                "data-preview-segment-label"
              )}`;
            });
          });
        }
      },
    },

    /* ----------------------------------------------------------------------
       10. Print-Ready Resume Sheet & Site Footer
       ---------------------------------------------------------------------- */
    {
      specimenId: "complex-resume-sheet-footer",
      specimenTitle: "10. Print-Ready Resume Sheet & Site Footer",
      categoryLabel: "Print & Shell",
      usageRationale:
        "Showcases the structured CV document sheet (built for @page + @media print) paired with the double-ruled site footer.",
      previewHtml: `<div>
  <div class="nrki-resume-sheet">
    <div class="nrki-resume-header">
      <div>
        <p class="nrki-eyebrow" style="margin-bottom: 0.3rem;">Curriculum Vitae</p>
        <h3 style="font-size: 1.65rem; margin-bottom: 0.25rem;">Raj Aryan (NRKI)</h3>
        <p class="nrki-resume-role">Front-End Engineer · Design Systems</p>
      </div>
      <ul class="nrki-resume-contact">
        <li>raj@nrki.in</li>
        <li>nrki.in</li>
      </ul>
    </div>
    <section class="nrki-resume-section">
      <h4 class="nrki-resume-section-title">Stack</h4>
      <div class="nrki-skills-grid">
        <div>
          <strong style="font-size: 0.85rem;">Core Web</strong>
          <p style="margin: 0; font-size: 0.86rem; color: var(--nrki-ink-muted);">Semantic HTML5, CSS @layer, TS</p>
        </div>
        <div>
          <strong style="font-size: 0.85rem;">Systems</strong>
          <p style="margin: 0; font-size: 0.86rem; color: var(--nrki-ink-muted);">React, Design Tokens, Print CSS</p>
        </div>
      </div>
    </section>
  </div>
  <footer class="nrki-site-footer">
    <a class="nrki-footer-mark" href="#specimen-preview">NRKI</a>
    <span>A personal broadsheet, made one issue at a time.</span>
    <a href="#specimen-preview">Credits →</a>
  </footer>
</div>`,
      htmlSnippet: `<article class="nrki-resume-sheet">
  <header class="nrki-resume-header">
    <div>
      <p class="nrki-eyebrow">Curriculum Vitae</p>
      <h1>Raj Aryan (NRKI)</h1>
      <p class="nrki-resume-role">Front-End Engineer</p>
    </div>
    <ul class="nrki-resume-contact">
      <li>raj@nrki.in</li>
      <li>nrki.in</li>
    </ul>
  </header>
  <section class="nrki-resume-section">
    <h2 class="nrki-resume-section-title">Stack</h2>
    <div class="nrki-skills-grid">...</div>
  </section>
</article>`,
      cssSnippet: `@page {
  size: auto;
  margin: 0;
}

@layer nrki.print {
  @media print {
    .nrki-resume-sheet {
      padding: 0;
      border: 0;
      background-color: transparent;
    }

    .nrki-resume-section {
      grid-template-columns: 8.5rem minmax(0, 1fr);
      break-inside: avoid;
    }
  }
}`,
    },

    /* ----------------------------------------------------------------------
       11. Archive Pagination & Editorial Timeline (HTML + CSS + JS)
       ---------------------------------------------------------------------- */
    {
      specimenId: "complex-pagination-timeline",
      specimenTitle: "11. Archive Pagination & Editorial Timeline",
      categoryLabel: "Chronology",
      usageRationale:
        "Combines interactive folio page-number controls (preview clicks stay strictly local without changing URL or scroll) with a vertical chronological timeline.",
      previewHtml: `<div class="nrki-stack-md">
  <nav aria-label="Archive pagination example">
    <ul class="nrki-pagination" data-preview-pagination-root>
      <li><a class="nrki-page-link" href="#specimen-preview" data-preview-page-num="prev">← Prev</a></li>
      <li><a class="nrki-page-link" href="#specimen-preview" aria-current="page" data-preview-page-num="1">01</a></li>
      <li><a class="nrki-page-link" href="#specimen-preview" data-preview-page-num="2">02</a></li>
      <li><a class="nrki-page-link" href="#specimen-preview" data-preview-page-num="3">03</a></li>
      <li><a class="nrki-page-link" href="#specimen-preview" data-preview-page-num="next">Next →</a></li>
    </ul>
  </nav>
  <p class="nrki-quiet-note" style="margin: 0;" data-preview-pagination-status>Inspecting Folio Sheet 01</p>

  <ol class="nrki-timeline">
    <li class="nrki-timeline-entry">
      <time class="nrki-timeline-date">Edition v2.2 · Nov 2026</time>
      <strong style="display: block; color: var(--nrki-ink-heading);">Contextual Fonts &amp; Book Corners</strong>
      <span style="font-size: 0.92rem;">Old English headings, syntax-framed code, accordions, lists &amp; inert specimen links.</span>
    </li>
    <li class="nrki-timeline-entry">
      <time class="nrki-timeline-date">Edition v2.1 · Nov 2026</time>
      <strong style="display: block; color: var(--nrki-ink-heading);">4 Themes × Light/Dark Split</strong>
      <span style="font-size: 0.92rem;">Separated <code>data-theme</code> personality from <code>data-mode</code> brightness.</span>
    </li>
  </ol>
</div>`,
      htmlSnippet: `<nav aria-label="Archive pagination">
  <ul class="nrki-pagination">
    <li><a class="nrki-page-link" href="#p1" aria-current="page">01</a></li>
    <li><a class="nrki-page-link" href="#p2">02</a></li>
  </ul>
</nav>
<ol class="nrki-timeline">
  <li class="nrki-timeline-entry">
    <time class="nrki-timeline-date">Nov 2026</time>
    <strong>Release Milestone</strong>
  </li>
</ol>`,
      cssSnippet: `.nrki-timeline {
  border-left: 2px solid var(--nrki-border-subtle);
  padding-left: 1.5rem;
  display: grid;
  gap: 1.15rem;
}

.nrki-page-link[aria-current="page"] {
  background-color: var(--nrki-accent-primary);
  border-color: var(--nrki-accent-primary);
  color: var(--nrki-ink-on-accent);
}`,
      jsSnippet: `function attachPreviewPagination(paginationListElement, statusTextElement) {
  const numberLinks = paginationListElement.querySelectorAll("[data-page-number]");
  numberLinks.forEach((pageAnchor) => {
    pageAnchor.addEventListener("click", (clickEvent) => {
      clickEvent.preventDefault();
      numberLinks.forEach((peerAnchor) => peerAnchor.removeAttribute("aria-current"));
      pageAnchor.setAttribute("aria-current", "page");
      statusTextElement.textContent = "Sheet 0" + pageAnchor.getAttribute("data-page-number");
    });
  });
}`,
      initializePreview(previewStageElement) {
        const paginationRoot = previewStageElement.querySelector(
          "[data-preview-pagination-root]"
        );
        const statusElement = previewStageElement.querySelector(
          "[data-preview-pagination-status]"
        );
        if (!paginationRoot || !statusElement) return;

        let activePage = 1;
        const pageLinks = paginationRoot.querySelectorAll("[data-preview-page-num]");

        function syncPageDisplay() {
          pageLinks.forEach((pageLink) => {
            const token = pageLink.getAttribute("data-preview-page-num");
            if (token === String(activePage)) {
              pageLink.setAttribute("aria-current", "page");
            } else {
              pageLink.removeAttribute("aria-current");
            }
          });
          statusElement.textContent = `Inspecting Folio Sheet 0${activePage}`;
        }

        pageLinks.forEach((pageLink) => {
          pageLink.addEventListener("click", (pointerEvent) => {
            pointerEvent.preventDefault();
            const token = pageLink.getAttribute("data-preview-page-num");
            if (token === "prev") {
              activePage = Math.max(1, activePage - 1);
            } else if (token === "next") {
              activePage = Math.min(3, activePage + 1);
            } else {
              activePage = Number(token) || 1;
            }
            syncPageDisplay();
          });
        });
      },
    },

    /* ----------------------------------------------------------------------
       12. Action Dropdown Menu & Dismissible Editorial Toast (HTML + CSS + JS)
       ---------------------------------------------------------------------- */
    {
      specimenId: "complex-dropdown-toast",
      specimenTitle: "12. Dropdown Menu & Dismissible Editorial Toast",
      categoryLabel: "Interactive Popover",
      usageRationale:
        "Pairs a keyboard-friendly menu button (.nrki-dropdown) with an in-flow dismissible status banner (.nrki-toast-banner) adapting to all 8 editions.",
      previewHtml: `<div class="nrki-stack-md" style="min-height: 11.5rem;">
  <div class="nrki-button-group">
    <div class="nrki-dropdown" data-preview-dropdown-root>
      <button type="button" class="nrki-button nrki-button-secondary" aria-expanded="false" data-preview-dropdown-trigger>
        Edition Actions ▾
      </button>
      <div class="nrki-dropdown-menu nrki-hidden" role="menu" data-preview-dropdown-menu>
        <button type="button" class="nrki-dropdown-action" role="menuitem" data-preview-menu-action="Export Print Sheet">Export Print Sheet</button>
        <button type="button" class="nrki-dropdown-action" role="menuitem" data-preview-menu-action="Inspect Token Diff">Inspect Token Diff</button>
        <button type="button" class="nrki-dropdown-action" role="menuitem" data-preview-menu-action="Reset Specimen Frame">Reset Specimen Frame</button>
      </div>
    </div>
    <button type="button" class="nrki-button nrki-button-primary" data-preview-toast-trigger>
      Show Toast Notice
    </button>
  </div>

  <div class="nrki-toast-banner" role="status" data-preview-toast-banner>
    <div>
      <strong style="display: block; font-size: 0.85rem;" data-preview-toast-title>Edition Ready</strong>
      <span style="font-size: 0.84rem; color: var(--nrki-ink-muted);" data-preview-toast-copy>Choose an action above or dismiss this notice cleanly.</span>
    </div>
    <button type="button" class="nrki-button nrki-button-small" data-preview-toast-dismiss>Dismiss ×</button>
  </div>
</div>`,
      htmlSnippet: `<div class="nrki-dropdown" data-dropdown-root>
  <button type="button" class="nrki-button" aria-expanded="false" data-dropdown-trigger>Actions ▾</button>
  <div class="nrki-dropdown-menu nrki-hidden" role="menu" data-dropdown-menu>
    <button type="button" class="nrki-dropdown-action" role="menuitem">Export Sheet</button>
  </div>
</div>
<div class="nrki-toast-banner" role="status">
  <span><strong>Saved:</strong> Edition stylesheet updated.</span>
  <button type="button" class="nrki-button nrki-button-small">Dismiss ×</button>
</div>`,
      cssSnippet: `.nrki-dropdown-menu {
  position: absolute;
  top: calc(100% + 0.35rem);
  left: 0;
  border: var(--nrki-card-border);
  border-radius: var(--nrki-radius-surface);
  background-color: var(--nrki-surface-elevated);
}

.nrki-toast-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-left: 4px solid var(--nrki-status-success-border);
  background-color: var(--nrki-surface-elevated);
}`,
      jsSnippet: `function attachDropdownAndToast(scopeElement) {
  const triggerBtn = scopeElement.querySelector("[data-dropdown-trigger]");
  const menuPanel = scopeElement.querySelector("[data-dropdown-menu]");
  triggerBtn.addEventListener("click", () => {
    const isOpen = !menuPanel.classList.toggle("nrki-hidden");
    triggerBtn.setAttribute("aria-expanded", String(isOpen));
  });
}`,
      initializePreview(previewStageElement) {
        const dropdownRoot = previewStageElement.querySelector(
          "[data-preview-dropdown-root]"
        );
        const dropdownTrigger = previewStageElement.querySelector(
          "[data-preview-dropdown-trigger]"
        );
        const dropdownMenu = previewStageElement.querySelector(
          "[data-preview-dropdown-menu]"
        );
        const toastTrigger = previewStageElement.querySelector(
          "[data-preview-toast-trigger]"
        );
        const toastBanner = previewStageElement.querySelector(
          "[data-preview-toast-banner]"
        );
        const toastTitle = previewStageElement.querySelector(
          "[data-preview-toast-title]"
        );
        const toastCopy = previewStageElement.querySelector(
          "[data-preview-toast-copy]"
        );
        const toastDismiss = previewStageElement.querySelector(
          "[data-preview-toast-dismiss]"
        );
        if (!dropdownRoot || !dropdownTrigger || !dropdownMenu || !toastBanner) {
          return;
        }

        function setMenuVisible(shouldShow) {
          dropdownMenu.classList.toggle("nrki-hidden", !shouldShow);
          dropdownTrigger.setAttribute("aria-expanded", String(shouldShow));
        }

        dropdownTrigger.addEventListener("click", () => {
          setMenuVisible(dropdownMenu.classList.contains("nrki-hidden"));
        });

        dropdownMenu
          .querySelectorAll("[data-preview-menu-action]")
          .forEach((menuButton) => {
            menuButton.addEventListener("click", () => {
              const selectedAction = menuButton.getAttribute(
                "data-preview-menu-action"
              );
              setMenuVisible(false);
              if (toastTitle && toastCopy) {
                toastTitle.textContent = `Selected: ${selectedAction}`;
                toastCopy.textContent =
                  "Preview dropdown callback executed strictly inside this showcase.";
              }
              toastBanner.classList.remove("nrki-hidden");
            });
          });

        if (toastTrigger) {
          toastTrigger.addEventListener("click", () => {
            if (toastTitle && toastCopy) {
              toastTitle.textContent = "Broadsheet Dispatch Pinned";
              toastCopy.textContent =
                "Status banner triggered locally inside the specimen stage.";
            }
            toastBanner.classList.remove("nrki-hidden");
          });
        }

        if (toastDismiss) {
          toastDismiss.addEventListener("click", () => {
            toastBanner.classList.add("nrki-hidden");
          });
        }

        previewStageElement.ownerDocument.addEventListener(
          "click",
          (pointerEvent) => {
            if (!dropdownRoot.contains(pointerEvent.target)) {
              setMenuVisible(false);
            }
          }
        );

        previewStageElement.ownerDocument.addEventListener(
          "keydown",
          (keyboardEvent) => {
            if (keyboardEvent.key === "Escape") {
              setMenuVisible(false);
            }
          }
        );
      },
    },
  ];
})(window);
