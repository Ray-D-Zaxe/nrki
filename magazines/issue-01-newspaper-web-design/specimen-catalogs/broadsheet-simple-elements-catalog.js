/**
 * ============================================================================
 * ISSUE 01 — SIMPLE ELEMENTS SPECIMEN CATALOG
 * (`specimen-catalogs/broadsheet-simple-elements-catalog.js`)
 * ----------------------------------------------------------------------------
 * Why this uses a global namespace instead of ES `import`/`export`:
 * NRKI supports direct local previewing over `file://` without running a dev
 * server. Browsers block `<script type="module">` over `file://` due to CORS,
 * so attaching the catalog array to `window.NRKIBroadsheetMagazine` keeps
 * Issue 01 working identically on both `file://` and Cloudflare Pages.
 * ============================================================================
 */

(function attachSimpleElementsCatalog(browserWindow) {
  "use strict";

  const magazineNamespace = (browserWindow.NRKIBroadsheetMagazine =
    browserWindow.NRKIBroadsheetMagazine || {});

  /**
   * All 11 atomic/simple element specimens documented in Magazine Issue 01.
   * Each entry supplies `htmlSnippet`, `cssSnippet`, and (only when behavior
   * requires scripting) `jsSnippet` + `initializePreview(previewStageElement)`.
   */
  magazineNamespace.simpleElementSpecimens = [
    /* ----------------------------------------------------------------------
       01. Editorial Typography & Headings
       ---------------------------------------------------------------------- */
    {
      specimenId: "simple-typography-headings",
      specimenTitle: "01. Editorial Typography & Headings",
      categoryLabel: "Typography",
      usageRationale:
        "Pairs crisp editorial serif headlines and drop-caps with small-caps sans eyebrows, keyboard keys, and monospace code spans.",
      previewHtml: `<div class="nrki-stack-sm">
  <p class="nrki-eyebrow">Sec. 01 / Editorial Type Scale</p>
  <h2>Minimalist Broadsheet Headline (h2)</h2>
  <h3>Subsection Dispatch Heading (h3)</h3>
  <p class="nrki-lead-summary">
    A high-clarity lead summary introduces essays or features at a slightly larger optical size.
  </p>
  <p class="nrki-drop-cap">
    Drop-caps anchor opening paragraphs in print style. Inside body copy, you can combine
    <strong>strong emphasis</strong>, <em>italic cadence</em>, <mark>highlighted phrases</mark>,
    keyboard cues like <kbd>Esc</kbd>, inline <code>--nrki-ink-heading</code>, and
    <abbr title="Cascading Style Sheets">CSS</abbr> abbreviations.
  </p>
  <p class="nrki-quiet-note">Quiet editorial colophon or margin annotation.</p>
</div>`,
      htmlSnippet: `<p class="nrki-eyebrow">Sec. 01 / Editorial Type Scale</p>
<h2>Minimalist Broadsheet Headline</h2>
<p class="nrki-lead-summary">Lead summary introducing the dispatch.</p>
<p class="nrki-drop-cap">
  Opening paragraph with <mark>highlighted text</mark>, <kbd>Esc</kbd>,
  and <code>--nrki-ink-heading</code>.
</p>
<p class="nrki-quiet-note">Quiet editorial annotation.</p>`,
      cssSnippet: `.nrki-eyebrow {
  margin-bottom: 0.6rem;
  color: var(--nrki-accent-primary);
  font-family: var(--nrki-font-sans);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.nrki-drop-cap::first-letter {
  float: left;
  margin-right: 0.5rem;
  padding: 0.18rem 0.5rem;
  border: 1px solid var(--nrki-border-strong);
  background-color: var(--nrki-surface-elevated);
  font-size: 2.55rem;
  font-weight: 700;
  line-height: 0.92;
}`,
    },

    /* ----------------------------------------------------------------------
       02. Section Headers, Structural Rules & Tufte Sidenote
       ---------------------------------------------------------------------- */
    {
      specimenId: "simple-headers-rules-sidenote",
      specimenTitle: "02. Headers, Structural Rules & Tufte Sidenote",
      categoryLabel: "Structure",
      usageRationale:
        "Replaces blurry drop shadows with 1px hairlines, 3px double masthead borders, and Tufte-inspired marginalia sidenotes.",
      previewHtml: `<div>
  <div class="nrki-section-heading">
    <p class="nrki-eyebrow">02 / Architecture</p>
    <h2>Section Heading Block</h2>
    <p class="nrki-section-heading-note">Short editorial note summarizing the section below.</p>
  </div>
  <hr class="nrki-rule-double">
  <div class="nrki-sidenote-layout">
    <p style="margin-bottom: 0;">
      Print newspapers divide competing dispatches using deliberate structural rules rather than
      floating boxes. On wide viewports, marginal commentary sits peacefully alongside body prose.
    </p>
    <aside class="nrki-sidenote">
      <strong>Marginal Note:</strong> Inspired by Edward Tufte's sidenote placement for self-contained context.
    </aside>
  </div>
  <hr class="nrki-rule-dashed">
</div>`,
      htmlSnippet: `<div class="nrki-section-heading">
  <p class="nrki-eyebrow">02 / Architecture</p>
  <h2>Section Heading Block</h2>
  <p class="nrki-section-heading-note">Short section note.</p>
</div>
<hr class="nrki-rule-double">
<div class="nrki-sidenote-layout">
  <p>Main broadsheet column prose...</p>
  <aside class="nrki-sidenote">Marginal commentary beside prose.</aside>
</div>`,
      cssSnippet: `.nrki-rule-double {
  border: 0;
  border-top: 3px double var(--nrki-border-strong);
  margin-block: 1.75rem;
}

.nrki-sidenote-layout {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(12rem, 1fr);
  gap: 1.5rem;
}

.nrki-sidenote {
  padding: 0.6rem 0.85rem;
  border-left: 2px solid var(--nrki-accent-primary);
  background-color: var(--nrki-surface-panel);
  font-family: var(--nrki-font-sans);
  font-size: 0.8rem;
}`,
    },

    /* ----------------------------------------------------------------------
       03. Buttons — Variants, Sizes & Groups
       ---------------------------------------------------------------------- */
    {
      specimenId: "simple-buttons-variants",
      specimenTitle: "03. Buttons — Variants, Sizes & Button Groups",
      categoryLabel: "Controls",
      usageRationale:
        "Provides all button hierarchy levels (default, primary, secondary, ghost, danger), compact/large sizing, and disabled feedback.",
      previewHtml: `<div class="nrki-stack-md">
  <div class="nrki-button-group">
    <button type="button" class="nrki-button nrki-button-primary">Primary Action</button>
    <button type="button" class="nrki-button">Default Outline</button>
    <button type="button" class="nrki-button nrki-button-secondary">Secondary</button>
    <button type="button" class="nrki-button nrki-button-ghost">Ghost Link</button>
    <button type="button" class="nrki-button nrki-button-danger">Danger</button>
  </div>
  <div class="nrki-button-group">
    <button type="button" class="nrki-button nrki-button-small nrki-button-primary">Small</button>
    <button type="button" class="nrki-button">Medium</button>
    <button type="button" class="nrki-button nrki-button-large nrki-button-primary">Large CTA →</button>
    <button type="button" class="nrki-button" disabled>Disabled</button>
  </div>
</div>`,
      htmlSnippet: `<div class="nrki-button-group">
  <button type="button" class="nrki-button nrki-button-primary">Primary Action</button>
  <button type="button" class="nrki-button">Default Outline</button>
  <button type="button" class="nrki-button nrki-button-secondary">Secondary</button>
  <button type="button" class="nrki-button nrki-button-ghost">Ghost</button>
  <button type="button" class="nrki-button nrki-button-danger">Danger</button>
  <button type="button" class="nrki-button" disabled>Disabled</button>
</div>`,
      cssSnippet: `.nrki-button {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.48rem 0.9rem;
  border: 1px solid var(--nrki-border-strong);
  border-radius: var(--nrki-radius-control);
  background-color: transparent;
  color: var(--nrki-ink-heading);
  font-family: var(--nrki-font-sans);
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
}

.nrki-button-primary {
  background-color: var(--nrki-accent-primary);
  border-color: var(--nrki-accent-primary);
  color: var(--nrki-ink-on-accent);
}`,
    },

    /* ----------------------------------------------------------------------
       04. Links, Back-Links & Breadcrumbs
       ---------------------------------------------------------------------- */
    {
      specimenId: "simple-links-breadcrumbs",
      specimenTitle: "04. Links, Back-Links & Breadcrumbs",
      categoryLabel: "Navigation",
      usageRationale:
        "Clear directional links for navigating between shelves, individual dossier views, and magazine sub-sections.",
      previewHtml: `<div class="nrki-stack-md">
  <nav aria-label="Example breadcrumb">
    <ol class="nrki-breadcrumb">
      <li><a href="#intro">NRKI Home</a></li>
      <li><a href="#intro">Magazines</a></li>
      <li aria-current="page">Issue 01</li>
    </ol>
  </nav>
  <div class="nrki-button-group">
    <a class="nrki-back-link" href="#intro">← Back to Magazines Index</a>
    <a class="nrki-text-link" href="#components">Explore Complex Components →</a>
  </div>
  <p style="margin-bottom: 0;">
    Prose hyperlinks use subtle hairlines like <a href="#colophon">the Issue 01 Colophon</a> so
    long-form reading never feels cluttered.
  </p>
</div>`,
      htmlSnippet: `<ol class="nrki-breadcrumb">
  <li><a href="/">NRKI Home</a></li>
  <li><a href="/magazines">Magazines</a></li>
  <li aria-current="page">Issue 01</li>
</ol>
<a class="nrki-back-link" href="/magazines">← Back to Index</a>
<a class="nrki-text-link" href="/next">Read Full Dispatch →</a>`,
      cssSnippet: `.nrki-breadcrumb {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  list-style: none;
  padding: 0;
  font-family: var(--nrki-font-sans);
  font-size: 0.74rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.nrki-breadcrumb li + li::before {
  content: "/";
  margin-right: 0.45rem;
  color: var(--nrki-ink-faint);
}`,
    },

    /* ----------------------------------------------------------------------
       05. Badges, Status Stamps, Rating Seal & Tag Pills
       ---------------------------------------------------------------------- */
    {
      specimenId: "simple-badges-stamps-tags",
      specimenTitle: "05. Badges, Status Stamps, Rating Seal & Tag Pills",
      categoryLabel: "Metadata",
      usageRationale:
        "Small typographic markers for project status, review ratings, semantic notices, #tag categorization, and Zettelkasten links.",
      previewHtml: `<div class="nrki-stack-md">
  <div class="nrki-button-group">
    <span class="nrki-badge">Neutral Stamp</span>
    <span class="nrki-badge nrki-badge-accent">Active</span>
    <span class="nrki-badge nrki-badge-highlight">Featured</span>
    <span class="nrki-badge nrki-badge-success">Shipped</span>
    <span class="nrki-badge nrki-badge-warning">Drafting</span>
    <span class="nrki-badge nrki-badge-danger">Deprecated</span>
    <span class="nrki-rating-stamp">9.4 / 10</span>
  </div>
  <div>
    <ul class="nrki-tag-pills" style="margin: 0;">
      <li class="nrki-tag-pill">#design-tokens</li>
      <li class="nrki-tag-pill">#broadsheet</li>
      <li class="nrki-tag-pill">#zero-important</li>
      <li><a class="nrki-connected-chip" href="#components">Connects To: #Pin-02 →</a></li>
    </ul>
  </div>
</div>`,
      htmlSnippet: `<span class="nrki-badge nrki-badge-accent">Active</span>
<span class="nrki-badge nrki-badge-highlight">Featured</span>
<span class="nrki-rating-stamp">9.4 / 10</span>
<ul class="nrki-tag-pills">
  <li class="nrki-tag-pill">#design-tokens</li>
  <li><a class="nrki-connected-chip" href="#pin-02">Connects To: #Pin-02 →</a></li>
</ul>`,
      cssSnippet: `.nrki-badge {
  display: inline-block;
  padding: 0.16rem 0.5rem;
  border: 1px solid var(--nrki-border-subtle);
  border-radius: var(--nrki-radius-pill);
  background-color: var(--nrki-surface-panel);
  font-family: var(--nrki-font-sans);
  font-size: 0.64rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.nrki-rating-stamp {
  padding: 0.22rem 0.55rem;
  border: 1px solid var(--nrki-accent-highlight);
  background-color: var(--nrki-accent-highlight-tint);
  color: var(--nrki-accent-highlight);
  font-family: var(--nrki-font-mono);
  font-weight: 700;
}`,
    },

    /* ----------------------------------------------------------------------
       06. Lists, Definition Lists & Inline Metadata
       ---------------------------------------------------------------------- */
    {
      specimenId: "simple-lists-metadata",
      specimenTitle: "06. Lists, Definition Lists & Inline Metadata",
      categoryLabel: "Lists",
      usageRationale:
        "Structured editorial lists, stacked key-value definition ledgers, and middot-separated inline metadata lists.",
      previewHtml: `<div class="nrki-stack-md">
  <ul class="nrki-editorial-list" style="margin: 0;">
    <li>Single-purpose CSS layers eliminate cascade overrides and <code>!important</code>.</li>
    <li>Descriptive naming enforces clarity across standalone library modules.</li>
  </ul>
  <dl class="nrki-definition-list" style="margin: 0;">
    <dt>Cascade Architecture</dt>
    <dd>6 ordered <code>@layer</code> buckets from tokens to print stylesheet.</dd>
    <dt>Theme Portability</dt>
    <dd>Container-scoped <code>[data-theme]</code> supports 5 visual modes simultaneously.</dd>
  </dl>
  <ul class="nrki-inline-meta-list">
    <li>Vol. I</li>
    <li>Edition 01</li>
    <li>Zero Build Step</li>
  </ul>
</div>`,
      htmlSnippet: `<ul class="nrki-editorial-list">
  <li>Layered cascade architecture with zero !important.</li>
</ul>
<dl class="nrki-definition-list">
  <dt>Theme Portability</dt>
  <dd>Container-scoped [data-theme] supports 5 modes.</dd>
</dl>
<ul class="nrki-inline-meta-list">
  <li>Vol. I</li>
  <li>Edition 01</li>
</ul>`,
      cssSnippet: `.nrki-editorial-list li::marker {
  color: var(--nrki-accent-primary);
  font-weight: 700;
}

.nrki-inline-meta-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  list-style: none;
  padding: 0;
}

.nrki-inline-meta-list li:not(:last-child)::after {
  content: "·";
  margin-left: 0.35rem;
}`,
    },

    /* ----------------------------------------------------------------------
       07. Editorial Blockquotes & Preformatted Code Blocks
       ---------------------------------------------------------------------- */
    {
      specimenId: "simple-quotes-codeblocks",
      specimenTitle: "07. Editorial Blockquotes & Preformatted Code",
      categoryLabel: "Prose Blocks",
      usageRationale:
        "Accent-bordered pull quotes with uppercase citations alongside scrollable monospace code excerpts.",
      previewHtml: `<div>
  <blockquote class="nrki-quote" style="margin-top: 0;">
    “Typography exists to honor content.”
    <cite>Robert Bringhurst — The Elements of Typographic Style</cite>
  </blockquote>
  <pre style="margin-bottom: 0;"><code>@layer nrki.tokens, nrki.reset, nrki.elements, nrki.components;
[data-theme="accent"] { --nrki-accent-primary: #d8ca7c; }</code></pre>
</div>`,
      htmlSnippet: `<blockquote class="nrki-quote">
  “Typography exists to honor content.”
  <cite>Robert Bringhurst</cite>
</blockquote>
<pre><code>@layer nrki.tokens, nrki.reset, nrki.elements, nrki.components;</code></pre>`,
      cssSnippet: `.nrki-quote {
  padding: 0.85rem 1.25rem;
  border-left: 3px solid var(--nrki-accent-primary);
  background-color: var(--nrki-surface-panel);
  color: var(--nrki-ink-heading);
  font-style: italic;
}

pre {
  padding: 1rem 1.25rem;
  overflow-x: auto;
  border-left: 3px solid var(--nrki-accent-primary);
  background-color: var(--nrki-code-surface);
  color: var(--nrki-code-ink);
}`,
    },

    /* ----------------------------------------------------------------------
       08. Form Inputs, Selects, Checkboxes & Validation States
       ---------------------------------------------------------------------- */
    {
      specimenId: "simple-forms-inputs",
      specimenTitle: "08. Form Inputs, Selects, Checkboxes & Validation",
      categoryLabel: "Forms",
      usageRationale:
        "Extends NRKI beyond pure static blogs so SPAs and interactive tools can render accessible forms in any of the 5 modes.",
      previewHtml: `<form class="nrki-form-stack" onsubmit="return false;">
  <div class="nrki-field">
    <label class="nrki-label" for="specimen-title-input">Dispatch Headline</label>
    <input class="nrki-input" id="specimen-title-input" type="text" placeholder="Notes on Botanical Newsprint">
    <p class="nrki-field-help">Displayed on the front-page index and card header.</p>
  </div>
  <div class="nrki-field">
    <label class="nrki-label" for="specimen-track-select">Publication Shelf</label>
    <select class="nrki-select" id="specimen-track-select">
      <option>Magazines — Design Systems</option>
      <option>Projects — Software Builds</option>
      <option>Works — Essays &amp; Verse</option>
    </select>
  </div>
  <div class="nrki-field">
    <label class="nrki-label" for="specimen-slug-error">Slug Identifier (Validation Example)</label>
    <input class="nrki-input nrki-input-invalid" id="specimen-slug-error" type="text" value="Invalid Spaces!">
    <p class="nrki-field-error">Use lowercase kebab-case characters only.</p>
  </div>
  <div class="nrki-button-group">
    <label class="nrki-checkbox-row"><input type="checkbox" checked> Publish on dev staging</label>
    <label class="nrki-radio-row"><input type="radio" name="specimen-format" checked> Standard Edition</label>
  </div>
</form>`,
      htmlSnippet: `<div class="nrki-field">
  <label class="nrki-label" for="headline">Headline</label>
  <input class="nrki-input" id="headline" type="text" placeholder="Enter title">
  <p class="nrki-field-help">Short helper note.</p>
</div>
<div class="nrki-field">
  <label class="nrki-label" for="slug">Slug</label>
  <input class="nrki-input nrki-input-invalid" id="slug" type="text" value="Bad!">
  <p class="nrki-field-error">Validation error description.</p>
</div>`,
      cssSnippet: `.nrki-input,
.nrki-textarea,
.nrki-select {
  width: 100%;
  padding: 0.55rem 0.75rem;
  border: 1px solid var(--nrki-border-subtle);
  border-radius: var(--nrki-radius-control);
  background-color: var(--nrki-surface-elevated);
  color: var(--nrki-ink-heading);
  font-family: var(--nrki-font-sans);
}

.nrki-input-invalid {
  border-color: var(--nrki-status-danger-border);
  background-color: var(--nrki-status-danger-surface);
}`,
    },

    /* ----------------------------------------------------------------------
       09. Newspaper Tables & Data Ledgers
       ---------------------------------------------------------------------- */
    {
      specimenId: "simple-tables-ledgers",
      specimenTitle: "09. Newspaper Tables & Structured Ledgers",
      categoryLabel: "Data Display",
      usageRationale:
        "Renders crisp column-header dividers, zebra striping, and right-aligned monospace numeric columns for benchmarks or indexes.",
      previewHtml: `<div class="nrki-table-wrap">
  <table class="nrki-table nrki-table-striped">
    <thead>
      <tr>
        <th>Layer Order</th>
        <th>Responsibility</th>
        <th class="nrki-cell-numeric">!important Count</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>nrki.tokens</code></td>
        <td>5-mode scoped color, typography &amp; geometry variables</td>
        <td class="nrki-cell-numeric">0</td>
      </tr>
      <tr>
        <td><code>nrki.elements</code></td>
        <td>Buttons, badges, forms, tables &amp; callouts</td>
        <td class="nrki-cell-numeric">0</td>
      </tr>
      <tr>
        <td><code>nrki.components</code></td>
        <td>Mastheads, cards, filters, modals &amp; print resumes</td>
        <td class="nrki-cell-numeric">0</td>
      </tr>
    </tbody>
  </table>
</div>`,
      htmlSnippet: `<div class="nrki-table-wrap">
  <table class="nrki-table nrki-table-striped">
    <thead>
      <tr>
        <th>Layer</th>
        <th class="nrki-cell-numeric">Priority</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>nrki.tokens</code></td>
        <td class="nrki-cell-numeric">1</td>
      </tr>
    </tbody>
  </table>
</div>`,
      cssSnippet: `.nrki-table {
  width: 100%;
  border-collapse: collapse;
}

.nrki-table th {
  border-bottom: 2px solid var(--nrki-border-strong);
  background-color: var(--nrki-surface-panel);
  font-family: var(--nrki-font-sans);
  font-size: 0.72rem;
  text-transform: uppercase;
}

.nrki-cell-numeric {
  text-align: right;
  font-family: var(--nrki-font-mono);
}`,
    },

    /* ----------------------------------------------------------------------
       10. Editorial Callouts & Notices
       ---------------------------------------------------------------------- */
    {
      specimenId: "simple-callouts-notices",
      specimenTitle: "10. Editorial Callouts & Status Notices",
      categoryLabel: "Feedback",
      usageRationale:
        "Communicates neutral announcements, info tips, completion notices, warnings, and critical alerts across all 5 theme modes.",
      previewHtml: `<div class="nrki-stack-sm">
  <div class="nrki-callout nrki-callout-info" style="margin: 0;">
    <div class="nrki-callout-title">Editorial Note</div>
    <p>Every theme mode swaps status surfaces automatically so contrast stays accessible.</p>
  </div>
  <div class="nrki-callout nrki-callout-success" style="margin: 0;">
    <div class="nrki-callout-title">Deployment Ready</div>
    <p>Zero build step required—ship directly to Cloudflare Pages or any static CDN.</p>
  </div>
  <div class="nrki-callout nrki-callout-warning" style="margin: 0;">
    <div class="nrki-callout-title">Staging Preview</div>
    <p>Experimental layouts live on the dev branch before promotion to production.</p>
  </div>
  <div class="nrki-callout nrki-callout-danger" style="margin: 0;">
    <div class="nrki-callout-title">Cascade Rule</div>
    <p>Never override layers with !important; extend cleanly via @layer rules.</p>
  </div>
</div>`,
      htmlSnippet: `<div class="nrki-callout nrki-callout-info">
  <div class="nrki-callout-title">Editorial Note</div>
  <p>Accessible status callout styled by mode tokens.</p>
</div>`,
      cssSnippet: `.nrki-callout {
  padding: 0.9rem 1.15rem;
  border: 1px solid var(--nrki-border-subtle);
  border-left-width: 4px;
  border-radius: var(--nrki-radius-surface);
  background-color: var(--nrki-surface-panel);
}

.nrki-callout-info {
  border-color: var(--nrki-status-info-border);
  background-color: var(--nrki-status-info-surface);
  color: var(--nrki-status-info-ink);
}`,
    },

    /* ----------------------------------------------------------------------
       11. Media Figure Frame & Interactive Theme Toggle (Includes JS)
       ---------------------------------------------------------------------- */
    {
      specimenId: "simple-media-theme-toggle",
      specimenTitle: "11. Media Figure Frame & Scoped Theme Cycle",
      categoryLabel: "Interactive Element",
      usageRationale:
        "Pairs an editorial plate figure with a JavaScript theme-cycle button showing how `[data-theme]` works on any container.",
      previewHtml: `<div class="nrki-stack-md">
  <div class="nrki-button-group">
    <button type="button" class="nrki-theme-toggle" data-specimen-cycle-theme>
      Stage Mode: Inherited (Click to Cycle)
    </button>
    <span class="nrki-badge nrki-badge-accent" data-specimen-current-mode-badge>Active: sync</span>
  </div>
  <figure class="nrki-media-figure" style="margin: 0;">
    <div class="nrki-media-header">Plate I · Herbarium Broadsheet Geometry</div>
    <svg viewBox="0 0 640 180" role="img" aria-label="Botanical grid specimen graphic">
      <rect width="640" height="180" fill="var(--nrki-surface-inset)" />
      <rect x="20" y="20" width="600" height="140" fill="var(--nrki-surface-elevated)" stroke="var(--nrki-border-strong)" stroke-width="2" />
      <line x1="210" y1="20" x2="210" y2="160" stroke="var(--nrki-border-subtle)" stroke-width="1" />
      <circle cx="115" cy="90" r="36" fill="var(--nrki-accent-primary-tint)" stroke="var(--nrki-accent-primary)" stroke-width="2" />
      <text x="235" y="75" font-family="Georgia, serif" font-size="18" font-weight="bold" fill="var(--nrki-ink-heading)">Token-Driven SVG Illustration</text>
      <text x="235" y="105" font-family="Courier New, monospace" font-size="13" fill="var(--nrki-ink-muted)">Responds automatically to all 5 data-theme modes.</text>
    </svg>
    <figcaption class="nrki-media-caption">Figure 1.1 · Tokenized figure frame inside scoped stage.</figcaption>
  </figure>
</div>`,
      htmlSnippet: `<button type="button" class="nrki-theme-toggle" data-theme-cycle-trigger>
  Cycle Theme Mode
</button>
<figure class="nrki-media-figure">
  <div class="nrki-media-header">Plate I · Editorial Media Frame</div>
  <img src="specimen-plate.png" alt="Botanical specimen plate">
  <figcaption class="nrki-media-caption">Figure 1.1 · Framed illustration.</figcaption>
</figure>`,
      cssSnippet: `.nrki-media-figure {
  padding: 0.85rem;
  border: 1px solid var(--nrki-border-subtle);
  border-radius: var(--nrki-radius-surface);
  background-color: var(--nrki-surface-panel);
}

.nrki-theme-toggle {
  padding: 0.48rem 0.9rem;
  border: 1px solid var(--nrki-border-strong);
  font-family: var(--nrki-font-sans);
  font-size: 0.74rem;
  font-weight: 700;
  text-transform: uppercase;
}`,
      jsSnippet: `const themeRotationSequence = ["light", "dark", "accent", "faded", "uwu"];

function cycleContainerThemeMode(stageContainer, toggleTrigger) {
  let currentModeIndex = themeRotationSequence.indexOf(
    stageContainer.getAttribute("data-theme") || "light"
  );

  toggleTrigger.addEventListener("click", () => {
    currentModeIndex = (currentModeIndex + 1) % themeRotationSequence.length;
    const nextThemeMode = themeRotationSequence[currentModeIndex];
    stageContainer.setAttribute("data-theme", nextThemeMode);
    toggleTrigger.textContent = "Stage Mode: " + nextThemeMode.toUpperCase();
  });
}`,
      initializePreview(previewStageElement) {
        const themeRotationSequence = ["light", "dark", "accent", "faded", "uwu"];
        const cycleButton = previewStageElement.querySelector(
          "[data-specimen-cycle-theme]"
        );
        const modeBadge = previewStageElement.querySelector(
          "[data-specimen-current-mode-badge]"
        );
        if (!cycleButton || !modeBadge) return;

        cycleButton.addEventListener("click", () => {
          const activeTheme =
            previewStageElement.getAttribute("data-theme") || "light";
          const currentIndex = themeRotationSequence.indexOf(activeTheme);
          const nextIndex = (currentIndex + 1) % themeRotationSequence.length;
          const nextMode = themeRotationSequence[nextIndex];

          previewStageElement.setAttribute("data-theme", nextMode);
          modeBadge.textContent = `Active: ${nextMode}`;
          cycleButton.textContent = `Stage Mode: ${nextMode.toUpperCase()} (Cycle)`;

          // Keep the parent Specimen Container's 5-mode pill bar synchronized
          const parentContainer = previewStageElement.closest(
            ".specimen-container"
          );
          if (parentContainer) {
            parentContainer
              .querySelectorAll("[data-specimen-mode-option]")
              .forEach((modeOptionButton) => {
                const isSelected =
                  modeOptionButton.getAttribute("data-specimen-mode-option") ===
                  nextMode;
                modeOptionButton.setAttribute(
                  "aria-pressed",
                  String(isSelected)
                );
              });
          }
        });
      },
    },
  ];
})(window);
