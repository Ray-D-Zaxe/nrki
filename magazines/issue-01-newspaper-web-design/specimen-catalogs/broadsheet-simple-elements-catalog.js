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
   * All 13 atomic/simple element specimens documented in Magazine Issue 01.
   * Each entry supplies `htmlSnippet`, `cssSnippet`, and (only when behavior
   * requires scripting) `jsSnippet` + `initializePreview(previewStageElement)`.
   */
  magazineNamespace.simpleElementSpecimens = [
    /* ----------------------------------------------------------------------
       01. Editorial Typography, Hierarchy & Emphasis
       ---------------------------------------------------------------------- */
    {
      specimenId: "simple-typography-headings",
      specimenTitle: "01. Editorial Typography, Hierarchy & Emphasis",
      categoryLabel: "Typography",
      usageRationale:
        "Demonstrates contextual voice separation across themes: display h1 (UnifrakturCook Old English in Ancient), h2–h3 section heads, small-caps kickers, italic bylines & quotes, drop-caps, and bold/italic prose.",
      previewHtml: `<div class="nrki-stack-sm">
  <p class="nrki-eyebrow">Sec. 01 / Contextual Type Roles</p>
  <h1 style="font-size: clamp(1.95rem, 3.6vw, 2.75rem); margin-bottom: 0.25rem;">The Broadsheet Chronicle (h1)</h1>
  <p class="nrki-byline">By Editorial Staff · An example of italic contextual subtitle voice</p>
  <h2 style="margin-bottom: 0.2rem;">Second-Order Display Heading (h2)</h2>
  <h3 style="margin-bottom: 0.35rem;">Subsection Heading with <em>Italic Accent</em> (h3)</h3>
  <p class="nrki-lead-summary">
    A high-clarity lead summary sets optical hierarchy before the body column begins.
  </p>
  <p class="nrki-drop-cap">
    Drop-caps anchor opening paragraphs in print tradition. Body prose pairs
    <strong>bold emphasis</strong>, <em>expressive italics</em>,
    <span class="nrki-small-caps">Small Caps Lead-In</span>, <mark>highlighted phrases</mark>,
    keyboard cues like <kbd>Esc</kbd>, inline <code>--nrki-font-mono</code>, and
    <abbr title="Cascading Style Sheets">CSS</abbr> abbreviations.
  </p>
  <p class="nrki-quiet-note">Quiet colophon annotation rendered in each theme’s quote font.</p>
</div>`,
      htmlSnippet: `<p class="nrki-eyebrow">Sec. 01 / Contextual Type Roles</p>
<h1>The Broadsheet Chronicle</h1>
<p class="nrki-byline">By Editorial Staff · Contextual subtitle voice</p>
<h2>Section Display Heading</h2>
<p class="nrki-drop-cap">
  Body copy with <strong>bold weight</strong>, <em>italic cadence</em>,
  <span class="nrki-small-caps">Small Caps</span>, <mark>highlights</mark>,
  <kbd>Esc</kbd>, and <code>--nrki-font-mono</code>.
</p>
<p class="nrki-quiet-note">Quiet italic colophon note.</p>`,
      cssSnippet: `h1 {
  font-family: var(--nrki-font-display);
}

[data-theme="ancient"] h1 {
  font-weight: 700;
  letter-spacing: 0.015em;
}

.nrki-byline,
.nrki-quiet-note {
  font-family: var(--nrki-font-quote);
  font-style: italic;
}

.nrki-small-caps {
  font-variant-caps: small-caps;
  letter-spacing: 0.06em;
  font-weight: 600;
}`,
    },

    /* ----------------------------------------------------------------------
       02. Section Headers, Outward Book Corners, Rules & Tufte Sidenote
       ---------------------------------------------------------------------- */
    {
      specimenId: "simple-headers-rules-sidenote",
      specimenTitle: "02. Headers, Outward Book Corners, Rules & Sidenote",
      categoryLabel: "Structure & Borders",
      usageRationale:
        "Showcases each theme's signature framing: Ancient extended outward-curved SVG book corners, Classic double press rules, Minimalistic borderless lift, and UwU dashed pastel sparkles.",
      previewHtml: `<div>
  <div class="nrki-section-heading">
    <p class="nrki-eyebrow">02 / Frame Architecture</p>
    <h2>Headers, Dividers &amp; Corner Ornaments</h2>
    <p class="nrki-section-heading-note">Switch this container to Ancient above to inspect the extended outward-curved corner flourishes.</p>
  </div>
  <div class="nrki-ornate-divider" aria-hidden="true"></div>
  <div class="nrki-framed-panel nrki-corner-frame" style="margin-bottom: 1rem;">
    <div class="nrki-sidenote-layout">
      <p style="margin-bottom: 0;">
        Using 9-slice SVG <code>border-image</code> with outward outset allows <strong>Ancient</strong>
        frames to extend and curl outward at all four corners like old illuminated bindings, while
        <strong>Classic</strong> renders razor double rules, <strong>Minimalistic</strong> stays
        borderless, and <strong>UwU</strong> trims corners with pastel sparkles.
      </p>
      <aside class="nrki-sidenote">
        <strong>Marginal Note:</strong> Inspired by Edward Tufte's sidenote placement for self-contained commentary.
      </aside>
    </div>
  </div>
</div>`,
      htmlSnippet: `<div class="nrki-section-heading">
  <p class="nrki-eyebrow">02 / Frame Architecture</p>
  <h2>Headers &amp; Dividers</h2>
</div>
<div class="nrki-ornate-divider" aria-hidden="true"></div>
<div class="nrki-framed-panel nrki-corner-frame">
  <div class="nrki-sidenote-layout">
    <p>Main broadsheet column prose...</p>
    <aside class="nrki-sidenote">Marginal commentary beside prose.</aside>
  </div>
</div>`,
      cssSnippet: `[data-theme="ancient"] .nrki-corner-frame {
  overflow: visible;
  padding: 1.55rem;
  border-style: solid;
  border-width: 3px;
  border-image-source: var(--nrki-ancient-frame-svg);
  border-image-slice: 30;
  border-image-width: 22px;
  border-image-outset: 5px;
  border-image-repeat: stretch;
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
      <li><a href="#specimen-preview">NRKI Home</a></li>
      <li><a href="#specimen-preview">Magazines</a></li>
      <li aria-current="page">Issue 01</li>
    </ol>
  </nav>
  <div class="nrki-button-group">
    <a class="nrki-back-link" href="#specimen-preview">← Back to Magazines Index</a>
    <a class="nrki-text-link" href="#specimen-preview">Explore Complex Components →</a>
  </div>
  <p style="margin-bottom: 0;">
    Prose hyperlinks use subtle hairlines like <a href="#specimen-preview">the Issue 01 Colophon</a> so
    long-form reading never feels cluttered, and links inside previews stay inert.
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
      <li><a class="nrki-connected-chip" href="#specimen-preview">Connects To: #Pin-02 →</a></li>
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
       06. Lists — Editorial, Ordered, Checklists, Ruled & Definitions
       ---------------------------------------------------------------------- */
    {
      specimenId: "simple-lists-metadata",
      specimenTitle: "06. Lists — Editorial, Ordered, Checklists, Ruled & Definitions",
      categoryLabel: "Lists",
      usageRationale:
        "Covers unordered bullets (adapting marker glyphs per theme), padded ordered steps, task checklists, ruled metadata rows, stacked definition ledgers, and middot metadata strips.",
      previewHtml: `<div class="nrki-stack-md">
  <ul class="nrki-editorial-list" style="margin: 0;">
    <li>Single-purpose CSS <code>@layer</code> buckets eliminate overrides and <code>!important</code>.</li>
    <li>Theme-specific markers adapt cleanly across Classic, Ancient, Minimalistic, and UwU.</li>
  </ul>
  <ol class="nrki-ordered-list" style="margin: 0;">
    <li>Set <code>data-theme</code> on <code>&lt;html&gt;</code> or any scoped container.</li>
    <li>Toggle <code>data-mode="light"</code> or <code>"dark"</code> orthogonally without rewriting rules.</li>
  </ol>
  <ul class="nrki-checklist" style="margin: 0;">
    <li class="nrki-checklist-entry is-checked">Orthogonal 4 Themes × Light/Dark token architecture</li>
    <li class="nrki-checklist-entry">Custom site override layer added cleanly after <code>nrki.utilities</code></li>
  </ul>
  <ul class="nrki-ruled-list" style="margin: 0;">
    <li><strong>Edition</strong><span>Vol. I · Newspaper Web Design</span></li>
    <li><strong>Cascade Mode</strong><span>6 Native Layers · 0 Overrides</span></li>
  </ul>
  <dl class="nrki-definition-list" style="margin: 0;">
    <dt>Theme Portability</dt>
    <dd>Container-scoped tokens support 4 Themes × Light/Dark simultaneously.</dd>
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
<ol class="nrki-ordered-list">
  <li>Set data-theme on any root or section container.</li>
</ol>
<ul class="nrki-checklist">
  <li class="nrki-checklist-entry is-checked">Completed task entry</li>
  <li class="nrki-checklist-entry">Pending task entry</li>
</ul>
<ul class="nrki-ruled-list">
  <li><strong>Edition</strong><span>Vol. I</span></li>
</ul>`,
      cssSnippet: `.nrki-editorial-list {
  list-style-type: "▪  ";
}

[data-theme="ancient"] .nrki-editorial-list {
  list-style-type: "❖  ";
}

.nrki-ordered-list li::before {
  content: counter(nrki-ordered-counter, decimal-leading-zero) ".";
  font-family: var(--nrki-font-mono);
  font-weight: 700;
  color: var(--nrki-accent-primary);
}`,
    },

    /* ----------------------------------------------------------------------
       07. Editorial Blockquotes & Syntax-Framed Code Blocks
       ---------------------------------------------------------------------- */
    {
      specimenId: "simple-quotes-codeblocks",
      specimenTitle: "07. Blockquotes & Syntax-Framed Code Blocks",
      categoryLabel: "Prose & Code",
      usageRationale:
        "Pairs italic pull quotes (set in each theme's contextual quote serif/script) with language-headered code blocks in each theme's readable monospace font.",
      previewHtml: `<div class="nrki-stack-sm">
  <blockquote class="nrki-quote" style="margin: 0;">
    “Typography exists to honor content—and code typography honors clarity.”
    <cite>Robert Bringhurst — The Elements of Typographic Style</cite>
  </blockquote>
  <div class="nrki-code-block" style="margin: 0;">
    <div class="nrki-code-header">
      <span>CSS · Theme Polarity Example</span>
      <span>Monospace: var(--nrki-font-mono)</span>
    </div>
    <pre><code><span class="nrki-tok-comment">/* Container-scoped personality &amp; ink polarity */</span>
<span class="nrki-tok-keyword">@layer</span> nrki.tokens, nrki.elements, nrki.components;
[<span class="nrki-tok-prop">data-theme</span>=<span class="nrki-tok-string">"ancient"</span>][<span class="nrki-tok-prop">data-mode</span>=<span class="nrki-tok-string">"light"</span>] {
  <span class="nrki-tok-prop">--nrki-font-mono</span>: <span class="nrki-tok-string">"Courier Prime"</span>, monospace;
}</code></pre>
  </div>
</div>`,
      htmlSnippet: `<blockquote class="nrki-quote">
  “Typography exists to honor content.”
  <cite>Robert Bringhurst</cite>
</blockquote>
<div class="nrki-code-block">
  <div class="nrki-code-header">
    <span>CSS · Token Layer</span>
    <span>4 lines</span>
  </div>
  <pre><code><span class="nrki-tok-keyword">@layer</span> nrki.tokens, nrki.reset;</code></pre>
</div>`,
      cssSnippet: `code,
pre {
  font-family: var(--nrki-font-mono);
  background-color: var(--nrki-code-surface);
  color: var(--nrki-code-ink);
}

.nrki-code-block pre {
  border-left: 4px solid var(--nrki-accent-primary);
  line-height: 1.6;
  tab-size: 2;
}`,
    },

    /* ----------------------------------------------------------------------
       08. Form Inputs, Selects, Switches, Sliders & Validation States
       ---------------------------------------------------------------------- */
    {
      specimenId: "simple-forms-inputs",
      specimenTitle: "08. Form Inputs, Textareas, Switches & Sliders",
      categoryLabel: "Forms",
      usageRationale:
        "Extends NRKI beyond pure static blogs with full textareas, accessible toggle switches, range sliders, validation styling, and checkboxes across all 8 editions.",
      previewHtml: `<form class="nrki-form-stack">
  <div class="nrki-field">
    <label class="nrki-label" for="specimen-title-input">Dispatch Headline</label>
    <input class="nrki-input" id="specimen-title-input" type="text" placeholder="Notes on Botanical Newsprint">
    <p class="nrki-field-help">Displayed on the front-page index and card header.</p>
  </div>
  <div class="nrki-field">
    <label class="nrki-label" for="specimen-summary-area">Editorial Summary</label>
    <textarea class="nrki-textarea" id="specimen-summary-area" rows="2" placeholder="Two concise lines summarizing the essay..."></textarea>
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
  <div class="nrki-field">
    <label class="nrki-label" for="specimen-density-slider">Column Rule Contrast</label>
    <input class="nrki-range" id="specimen-density-slider" type="range" min="1" max="10" value="7">
  </div>
  <div class="nrki-button-group">
    <label class="nrki-switch"><input type="checkbox" checked><span>Enable Broadsheet Spread</span></label>
    <label class="nrki-checkbox-row"><input type="checkbox" checked> Publish on dev</label>
    <label class="nrki-radio-row"><input type="radio" name="specimen-format" checked> Print Edition</label>
  </div>
</form>`,
      htmlSnippet: `<div class="nrki-field">
  <label class="nrki-label" for="headline">Headline</label>
  <input class="nrki-input" id="headline" type="text" placeholder="Enter title">
</div>
<label class="nrki-switch">
  <input type="checkbox" checked>
  <span>Enable Spread Mode</span>
</label>
<input class="nrki-range" type="range" min="1" max="10" value="7">`,
      cssSnippet: `.nrki-switch input {
  appearance: none;
  width: 2.35rem;
  height: 1.3rem;
  border: 1px solid var(--nrki-border-strong);
  border-radius: var(--nrki-radius-pill);
  background-color: var(--nrki-surface-inset);
}

.nrki-switch input:checked {
  background-color: var(--nrki-accent-primary);
  border-color: var(--nrki-accent-primary);
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
        "Renders crisp column-header dividers, zebra striping, and tabular monospace numeric columns for benchmarks or indexes.",
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
        <td>4-theme × Light/Dark scoped color, typography &amp; corner variables</td>
        <td class="nrki-cell-numeric">0</td>
      </tr>
      <tr>
        <td><code>nrki.elements</code></td>
        <td>Buttons, lists, syntax code, switches, progress meters &amp; callouts</td>
        <td class="nrki-cell-numeric">0</td>
      </tr>
      <tr>
        <td><code>nrki.components</code></td>
        <td>Mastheads, cards, accordions, timelines, dropdowns &amp; resumes</td>
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
  font-variant-numeric: tabular-nums;
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
        "Communicates neutral announcements, info tips, completion notices, warnings, and critical alerts across all 8 Theme × Mode editions.",
      previewHtml: `<div class="nrki-stack-sm">
  <div class="nrki-callout nrki-callout-info" style="margin: 0;">
    <div class="nrki-callout-title">Editorial Note</div>
    <p>Every theme and polarity swaps status surfaces automatically so contrast stays accessible.</p>
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
       11. Media Figure Frame & Captioned Plate (Controlled Externally Only)
       ---------------------------------------------------------------------- */
    {
      specimenId: "simple-media-theme-toggle",
      specimenTitle: "11. Media Figure Frame & Captioned Plate",
      categoryLabel: "Media Framing",
      usageRationale:
        "Pure visual media specimen showcasing tokenized SVG artwork, italic quote-font captions, and theme corner frames—controlled solely from the external specimen switcher above.",
      previewHtml: `<figure class="nrki-media-figure" style="margin: 0;">
  <div class="nrki-media-header">Plate I · Broadsheet Specimen Frame</div>
  <svg viewBox="0 0 640 190" role="img" aria-label="Token-driven specimen illustration">
    <rect width="640" height="190" fill="var(--nrki-surface-inset)" />
    <rect x="20" y="20" width="600" height="150" fill="var(--nrki-surface-elevated)" stroke="var(--nrki-border-strong)" stroke-width="2" />
    <line x1="210" y1="20" x2="210" y2="170" stroke="var(--nrki-border-subtle)" stroke-width="1" />
    <circle cx="115" cy="95" r="38" fill="var(--nrki-accent-primary-tint)" stroke="var(--nrki-accent-primary)" stroke-width="2" />
    <text x="115" y="101" text-anchor="middle" font-family="var(--nrki-font-mono)" font-size="14" font-weight="bold" fill="var(--nrki-accent-primary)">§ 01</text>
    <text x="235" y="80" font-family="var(--nrki-font-heading)" font-size="20" font-weight="bold" fill="var(--nrki-ink-heading)">Token-Driven Plate Artwork</text>
    <text x="235" y="112" font-family="var(--nrki-font-mono)" font-size="12" fill="var(--nrki-ink-muted)">Controlled via outside header switcher (8 editions).</text>
  </svg>
  <figcaption class="nrki-media-caption">Figure 1.1 · Tokenized illustration &amp; italic plate caption inheriting stage personality.</figcaption>
</figure>`,
      htmlSnippet: `<figure class="nrki-media-figure">
  <div class="nrki-media-header">Plate I · Editorial Media Frame</div>
  <img src="specimen-plate.png" alt="Botanical specimen plate">
  <figcaption class="nrki-media-caption">Figure 1.1 · Framed illustration.</figcaption>
</figure>`,
      cssSnippet: `.nrki-media-figure {
  padding: 0.85rem;
  border: var(--nrki-card-border);
  border-radius: var(--nrki-radius-surface);
  background-color: var(--nrki-surface-panel);
  box-shadow: var(--nrki-card-frame-shadow);
}

.nrki-media-caption {
  margin-top: 0.5rem;
  font-family: var(--nrki-font-quote);
  font-style: italic;
}`,
    },

    /* ----------------------------------------------------------------------
       12. Progress Meters, Stat Strip & Author Byline
       ---------------------------------------------------------------------- */
    {
      specimenId: "simple-progress-stats-byline",
      specimenTitle: "12. Progress Bars, Stat Metrics & Author Byline",
      categoryLabel: "Metrics & Profile",
      usageRationale:
        "Combines tracked linear progress bars, tabular newspaper edition figures, and compact author/avatar bylines for essays and project headers.",
      previewHtml: `<div class="nrki-stack-md">
  <div class="nrki-stat-strip">
    <div class="nrki-stat-cell">
      <span class="nrki-stat-value">08</span>
      <span class="nrki-stat-label">Theme Editions</span>
    </div>
    <div class="nrki-stat-cell">
      <span class="nrki-stat-value">31</span>
      <span class="nrki-stat-label">Specimens Shown</span>
    </div>
    <div class="nrki-stat-cell">
      <span class="nrki-stat-value">00</span>
      <span class="nrki-stat-label">!important Rules</span>
    </div>
  </div>
  <div class="nrki-progress" role="progressbar" aria-valuenow="78" aria-valuemin="0" aria-valuemax="100" aria-label="Library completion">
    <div class="nrki-progress-header">
      <span>Issue 01 Token Coverage</span>
      <span>78%</span>
    </div>
    <div class="nrki-progress-track">
      <div class="nrki-progress-fill" style="width: 78%;"></div>
    </div>
  </div>
  <div class="nrki-author-byline">
    <span class="nrki-avatar" aria-hidden="true">RA</span>
    <div>
      <strong style="display: block; color: var(--nrki-ink-heading);">Raj Aryan (NRKI)</strong>
      <span class="nrki-byline" style="margin: 0;">Press Editor · Independent Design Systems</span>
    </div>
  </div>
</div>`,
      htmlSnippet: `<div class="nrki-stat-strip">
  <div class="nrki-stat-cell">
    <span class="nrki-stat-value">08</span>
    <span class="nrki-stat-label">Editions</span>
  </div>
</div>
<div class="nrki-progress">
  <div class="nrki-progress-header"><span>Progress</span><span>78%</span></div>
  <div class="nrki-progress-track"><div class="nrki-progress-fill" style="width: 78%;"></div></div>
</div>
<div class="nrki-author-byline">
  <span class="nrki-avatar">RA</span>
  <div><strong>Raj Aryan</strong><span class="nrki-byline">Press Editor</span></div>
</div>`,
      cssSnippet: `.nrki-stat-strip {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  border: var(--nrki-card-border);
  border-radius: var(--nrki-radius-surface);
  background-color: var(--nrki-surface-elevated);
}

.nrki-progress-track {
  height: 0.65rem;
  border-radius: var(--nrki-radius-pill);
  background-color: var(--nrki-surface-panel);
}`,
    },

    /* ----------------------------------------------------------------------
       13. Tooltips, Empty States & Loading Skeletons
       ---------------------------------------------------------------------- */
    {
      specimenId: "simple-tooltips-empty-skeleton",
      specimenTitle: "13. Tooltips, Empty States & Skeletons",
      categoryLabel: "UI States",
      usageRationale:
        "Provides zero-JS CSS attribute tooltips, calm filtered empty states, and motion-reduced skeleton card placeholders for SPA data fetches.",
      previewHtml: `<div class="nrki-stack-md">
  <p style="margin-bottom: 0;">
    Hover or focus the editorial marker to inspect
    <span class="nrki-tooltip" tabindex="0" data-tooltip="Rendered cleanly using CSS [data-tooltip]::after">inline glossary tooltips</span>
    without loading JavaScript libraries.
  </p>
  <div class="nrki-empty-state">
    <p class="nrki-eyebrow" style="margin-bottom: 0.25rem;">Zero Matches</p>
    <h4 style="margin-bottom: 0.3rem;">No Archive Dispatches Found</h4>
    <p class="nrki-quiet-note" style="margin: 0;">Adjust category filters or clear the active search term.</p>
  </div>
  <div class="nrki-skeleton-card" aria-label="Loading placeholder example">
    <div class="nrki-skeleton-line nrki-skeleton-line-short"></div>
    <div class="nrki-skeleton-line"></div>
    <div class="nrki-skeleton-line nrki-skeleton-line-mid"></div>
  </div>
</div>`,
      htmlSnippet: `<span class="nrki-tooltip" tabindex="0" data-tooltip="Helpful note">Hover term</span>
<div class="nrki-empty-state">
  <h4>No Dispatches Found</h4>
  <p class="nrki-quiet-note">Try another shelf filter.</p>
</div>
<div class="nrki-skeleton-card">
  <div class="nrki-skeleton-line nrki-skeleton-line-short"></div>
  <div class="nrki-skeleton-line"></div>
</div>`,
      cssSnippet: `.nrki-tooltip:hover::after,
.nrki-tooltip:focus-visible::after {
  opacity: 1;
}

.nrki-empty-state {
  padding: 1.5rem 1.25rem;
  text-align: center;
  border: 1px dashed var(--nrki-border-subtle);
  background-color: var(--nrki-surface-panel);
}`,
    },
  ];
})(window);
