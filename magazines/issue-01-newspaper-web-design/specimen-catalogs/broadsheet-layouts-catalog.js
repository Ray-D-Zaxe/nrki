/**
 * ============================================================================
 * ISSUE 01 — REUSABLE BROADSHEET LAYOUTS SPECIMEN CATALOG
 * (`specimen-catalogs/broadsheet-layouts-catalog.js`)
 * ----------------------------------------------------------------------------
 * Page 02 of Magazine Issue 01 documents 6 reusable newspaper & editorial page
 * layouts from `nrki-broadsheet-library.css`. Every layout collapses cleanly on
 * mobile viewports while preserving authentic multi-column hierarchy on desktop
 * and tablet screens.
 * ============================================================================
 */

(function attachBroadsheetLayoutsCatalog(browserWindow) {
  "use strict";

  const magazineNamespace = (browserWindow.NRKIBroadsheetMagazine =
    browserWindow.NRKIBroadsheetMagazine || {});

  magazineNamespace.layoutSpecimens = [
    /* ----------------------------------------------------------------------
       01. Classic 3-Column Broadsheet Front Page
       ---------------------------------------------------------------------- */
    {
      specimenId: "layout-frontpage-columns",
      specimenTitle: "01. Classic 3-Column Broadsheet Front Page",
      categoryLabel: "Front Page Grid",
      usageRationale:
        "Pairs a wide primary lead dispatch, a mid-weight secondary column, and a ruled right-hand index rail—collapsing to one stream on mobile.",
      previewHtml: `<div class="nrki-layout-frontpage">
  <article>
    <p class="nrki-eyebrow">Lead Story</p>
    <h3 style="font-size: 1.45rem; margin-bottom: 0.5rem;">Layered Broadsheet Architecture</h3>
    <p class="nrki-drop-cap" style="margin-bottom: 0;">
      Three structural columns separated by vertical 1px hairlines give desktop readers immediate
      newspaper orientation without card clutter.
    </p>
  </article>
  <article>
    <p class="nrki-eyebrow">Dispatch Note</p>
    <h4 style="margin-bottom: 0.45rem;">Orthogonal Theme + Mode</h4>
    <p style="margin-bottom: 0; font-size: 0.92rem;">
      Fonts and border personalities belong to <code>data-theme</code>; Light/Dark inks belong to
      <code>data-mode</code>.
    </p>
  </article>
  <aside>
    <p class="nrki-aside-label">Briefs &amp; Wire</p>
    <ul class="nrki-editorial-list" style="margin: 0; font-size: 0.88rem;">
      <li>Zero <code>!important</code></li>
      <li>4 Themes × 2 Modes</li>
      <li>Pocket Mobile Layout</li>
    </ul>
  </aside>
</div>`,
      htmlSnippet: `<section class="nrki-layout-frontpage">
  <article>
    <p class="nrki-eyebrow">Lead Story</p>
    <h2>Primary Headline</h2>
    <p class="nrki-drop-cap">Lead column prose...</p>
  </article>
  <article>
    <p class="nrki-eyebrow">Dispatch</p>
    <h3>Secondary Column</h3>
    <p>Supporting analysis...</p>
  </article>
  <aside>
    <p class="nrki-aside-label">Wire Briefs</p>
    <ul class="nrki-editorial-list"><li>Bulletin one</li></ul>
  </aside>
</section>`,
      cssSnippet: `.nrki-layout-frontpage {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(0, 1.1fr) minmax(13rem, 0.85fr);
  gap: 1.5rem;
  align-items: start;
}

.nrki-layout-frontpage > * + * {
  border-left: 1px solid var(--nrki-border-subtle);
  padding-left: 1.35rem;
}`,
    },

    /* ----------------------------------------------------------------------
       02. Asymmetric Lead Feature + Contents Rail
       ---------------------------------------------------------------------- */
    {
      specimenId: "layout-asymmetric-lead",
      specimenTitle: "02. Asymmetric Lead Feature & Contents Rail",
      categoryLabel: "Hero Split",
      usageRationale:
        "1.7fr display manifesto anchored beside an ordered table-of-contents column—ideal for landing pages and issue covers.",
      previewHtml: `<section class="nrki-lead-story" style="padding-block: 0.75rem 1.25rem;">
  <div>
    <p class="nrki-eyebrow">Front Page Cover</p>
    <h3 style="font-size: 1.75rem; margin-bottom: 0.65rem;">A Quiet Corner for Systems &amp; Prose.</h3>
    <p class="nrki-lead-summary" style="margin-bottom: 0; font-size: 0.98rem;">
      High visual weight on the left leads the eye directly to the numbered navigation index on the right.
    </p>
  </div>
  <aside class="nrki-lead-aside">
    <p class="nrki-aside-label">In This Edition</p>
    <ol>
      <li><a href="#layouts">Broadsheet Layouts</a></li>
      <li><a href="#elements">Simple Elements</a></li>
      <li><a href="#components">Complex Components</a></li>
    </ol>
  </aside>
</section>`,
      htmlSnippet: `<section class="nrki-lead-story">
  <div>
    <p class="nrki-eyebrow">Cover Story</p>
    <h1>Asymmetric Editorial Hero</h1>
    <p class="nrki-lead-summary">Concise summary copy...</p>
  </div>
  <aside class="nrki-lead-aside">
    <p class="nrki-aside-label">In This Edition</p>
    <ol><li><a href="#section">Section One</a></li></ol>
  </aside>
</section>`,
      cssSnippet: `.nrki-lead-story {
  display: grid;
  grid-template-columns: minmax(0, 1.7fr) minmax(14rem, 0.85fr);
  gap: clamp(1.5rem, 5vw, 4rem);
  align-items: center;
  border-bottom: var(--nrki-section-rule-major);
}`,
    },

    /* ----------------------------------------------------------------------
       03. Editorial Reading Measure + Tufte Marginalia Rail
       ---------------------------------------------------------------------- */
    {
      specimenId: "layout-marginalia-prose",
      specimenTitle: "03. Reading Measure & Tufte Marginalia Rail",
      categoryLabel: "Long-Form Prose",
      usageRationale:
        "Constrains article lines to a comfortable 43rem reading measure on the left while keeping commentary pinned beside paragraphs.",
      previewHtml: `<div class="nrki-layout-marginalia">
  <article>
    <p class="nrki-eyebrow">Essay Grid</p>
    <h3 style="margin-bottom: 0.5rem;">Keeping Lines Between 60 and 75 Characters</h3>
    <p style="margin-bottom: 0;">
      Wide screens strain eye-tracking when paragraphs stretch edge to edge. Dedicated marginalia tracks
      preserve optimal prose measure while letting footnotes, citations, and code annotations live side-by-side.
    </p>
  </article>
  <aside class="nrki-sidenote">
    <strong>Sidenote:</strong> On mobile screens (&lt; 768px), this marginalia rail stacks right below the essay.
  </aside>
</div>`,
      htmlSnippet: `<div class="nrki-layout-marginalia">
  <article>
    <h2>Essay Headline</h2>
    <p>Prose constrained to 43rem measure...</p>
  </article>
  <aside class="nrki-sidenote">
    <strong>Marginalia:</strong> Contextual annotation beside prose.
  </aside>
</div>`,
      cssSnippet: `.nrki-layout-marginalia {
  display: grid;
  grid-template-columns: minmax(0, var(--nrki-reading-max-width)) minmax(12rem, 1fr);
  gap: 2rem;
  align-items: start;
}`,
    },

    /* ----------------------------------------------------------------------
       04. Flowing Multi-Column Newspaper Prose & Spanning Quote
       ---------------------------------------------------------------------- */
    {
      specimenId: "layout-multicolumn-prose",
      specimenTitle: "04. Flowing Multi-Column Newsprint & Spanning Quote",
      categoryLabel: "Multi-Column",
      usageRationale:
        "Native CSS multi-column text flow with vertical hairlines and a full-width spanning pull-quote breaking across column boundaries.",
      previewHtml: `<div class="nrki-columns-prose">
  <p>
    Native CSS multi-column layouts let continuous prose balance itself automatically across newspaper columns
    without JavaScript measurement loops.
  </p>
  <blockquote class="nrki-quote nrki-column-span-all">
    “A pull-quote with column-span: all anchors the eye across multiple narrow newspaper tracks.”
  </blockquote>
  <p style="margin-bottom: 0;">
    When viewed inside a narrow mobile pocket edition, the layout collapses cleanly back to a single continuous column.
  </p>
</div>`,
      htmlSnippet: `<div class="nrki-columns-prose">
  <p>Opening column paragraph...</p>
  <blockquote class="nrki-quote nrki-column-span-all">
    “Full-width spanning editorial pull-quote.”
  </blockquote>
  <p>Continuing newspaper copy...</p>
</div>`,
      cssSnippet: `.nrki-columns-prose {
  columns: 2 16rem;
  column-gap: 2rem;
  column-rule: 1px solid var(--nrki-border-faint);
}

.nrki-column-span-all {
  column-span: all;
  margin-block: 1rem;
}`,
    },

    /* ----------------------------------------------------------------------
       05. Collection Shelf with Sticky Filter Sidebar (HTML + CSS + JS)
       ---------------------------------------------------------------------- */
    {
      specimenId: "layout-shelf-sidebar",
      specimenTitle: "05. Collection Shelf with Sticky Filter Sidebar",
      categoryLabel: "Interactive Layout",
      usageRationale:
        "Two-column directory layout pinning facet controls beside a responsive multi-column card shelf—complete with working category JS.",
      previewHtml: `<div class="nrki-layout-shelf-sidebar" data-layout-shelf-root>
  <aside class="nrki-layout-shelf-sidebar-rail">
    <p class="nrki-aside-label" style="margin-bottom: 0.6rem;">Filter Shelf</p>
    <div class="nrki-stack-sm">
      <button type="button" class="nrki-filter-button is-active" aria-pressed="true" data-layout-filter="all">All Dispatches</button>
      <button type="button" class="nrki-filter-button" aria-pressed="false" data-layout-filter="css">CSS System</button>
      <button type="button" class="nrki-filter-button" aria-pressed="false" data-layout-filter="spa">React SPA</button>
    </div>
  </aside>
  <div class="nrki-card-grid">
    <article class="nrki-card" data-layout-entry="css">
      <div class="nrki-card-meta"><span>CSS</span><span>Layer</span></div>
      <h4>Token Architecture</h4>
      <p style="margin-bottom: 0;">4 themes × Light/Dark polarity.</p>
    </article>
    <article class="nrki-card" data-layout-entry="spa">
      <div class="nrki-card-meta"><span>SPA</span><span>Shelf</span></div>
      <h4>Magazine Viewer</h4>
      <p style="margin-bottom: 0;">Spread on desktop, pocket scroll on mobile.</p>
    </article>
  </div>
</div>`,
      htmlSnippet: `<div class="nrki-layout-shelf-sidebar" data-shelf-root>
  <aside class="nrki-layout-shelf-sidebar-rail">
    <button type="button" class="nrki-filter-button" aria-pressed="true" data-shelf-filter="all">All</button>
    <button type="button" class="nrki-filter-button" aria-pressed="false" data-shelf-filter="css">CSS</button>
  </aside>
  <div class="nrki-card-grid">
    <article class="nrki-card" data-shelf-category="css">...</article>
  </div>
</div>`,
      cssSnippet: `.nrki-layout-shelf-sidebar {
  display: grid;
  grid-template-columns: minmax(12rem, 15rem) minmax(0, 1fr);
  gap: 1.5rem;
  align-items: start;
}

.nrki-layout-shelf-sidebar-rail {
  position: sticky;
  top: 1rem;
  padding: 1rem;
  border: var(--nrki-panel-border);
  background-color: var(--nrki-surface-panel);
}`,
      jsSnippet: `function attachSidebarShelfFilters(layoutRootElement) {
  const sidebarButtons = layoutRootElement.querySelectorAll("[data-shelf-filter]");
  const cardEntries = layoutRootElement.querySelectorAll("[data-shelf-category]");

  sidebarButtons.forEach((selectedFilterButton) => {
    selectedFilterButton.addEventListener("click", () => {
      const requestedCategory = selectedFilterButton.getAttribute("data-shelf-filter");
      sidebarButtons.forEach((peerButton) => {
        const isCurrent = peerButton === selectedFilterButton;
        peerButton.setAttribute("aria-pressed", String(isCurrent));
        peerButton.classList.toggle("is-active", isCurrent);
      });
      cardEntries.forEach((cardElement) => {
        const matches = requestedCategory === "all" || cardElement.getAttribute("data-shelf-category") === requestedCategory;
        cardElement.classList.toggle("nrki-hidden", !matches);
      });
    });
  });
}`,
      initializePreview(previewStageElement) {
        const layoutRoot = previewStageElement.querySelector(
          "[data-layout-shelf-root]"
        );
        if (!layoutRoot) return;

        const sidebarButtons = layoutRoot.querySelectorAll(
          "[data-layout-filter]"
        );
        const shelfEntries = layoutRoot.querySelectorAll(
          "[data-layout-entry]"
        );

        sidebarButtons.forEach((clickedFilterButton) => {
          clickedFilterButton.addEventListener("click", () => {
            const targetGroup = clickedFilterButton.getAttribute(
              "data-layout-filter"
            );
            sidebarButtons.forEach((peerButton) => {
              const isSelected = peerButton === clickedFilterButton;
              peerButton.setAttribute("aria-pressed", String(isSelected));
              peerButton.classList.toggle("is-active", isSelected);
            });
            shelfEntries.forEach((entryElement) => {
              const shouldShow =
                targetGroup === "all" ||
                entryElement.getAttribute("data-layout-entry") === targetGroup;
              entryElement.classList.toggle("nrki-hidden", !shouldShow);
            });
          });
        });
      },
    },

    /* ----------------------------------------------------------------------
       06. Two-Page Open Newspaper Spread & Mobile Folio Stack
       ---------------------------------------------------------------------- */
    {
      specimenId: "layout-open-spread",
      specimenTitle: "06. Two-Page Open Broadsheet Spread",
      categoryLabel: "Double Spread",
      usageRationale:
        "Models left/right open newspaper pages separated by a subtle central fold shadow on desktop, stacking cleanly on mobile.",
      previewHtml: `<div class="nrki-spread-grid">
  <section class="nrki-spread-page">
    <p class="nrki-eyebrow">Page Left (Recto)</p>
    <h4 style="margin-bottom: 0.45rem;">Primary Feature Dispatch</h4>
    <p style="margin-bottom: 0; font-size: 0.92rem;">
      Desktop and tablet readers scan across facing pages naturally without losing context.
    </p>
  </section>
  <section class="nrki-spread-page">
    <p class="nrki-eyebrow">Page Right (Verso)</p>
    <h4 style="margin-bottom: 0.45rem;">Companion Index &amp; Notes</h4>
    <p style="margin-bottom: 0; font-size: 0.92rem;">
      Mobile viewports collapse the gutter shadow and stack verso cleanly under recto for pocket scrolling.
    </p>
  </section>
</div>`,
      htmlSnippet: `<div class="nrki-spread-grid">
  <section class="nrki-spread-page">
    <p class="nrki-eyebrow">Page Left</p>
    <h2>Primary Dispatch</h2>
  </section>
  <section class="nrki-spread-page">
    <p class="nrki-eyebrow">Page Right</p>
    <h2>Companion Column</h2>
  </section>
</div>`,
      cssSnippet: `.nrki-spread-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  border: var(--nrki-panel-border);
  background-color: var(--nrki-surface-elevated);
}

.nrki-spread-page {
  padding: 1.35rem;
}

.nrki-spread-page + .nrki-spread-page {
  border-left: 1px solid var(--nrki-border-subtle);
  box-shadow: inset 12px 0 18px -14px rgba(0, 0, 0, 0.22);
}`,
    },
  ];
})(window);
