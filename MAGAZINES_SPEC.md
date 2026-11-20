# NRKI Broadsheet CSS Library & Design Magazine Spec (`MAGAZINES_SPEC.md`)

This document defines the **standalone NRKI Broadsheet CSS Library** (the primary focus of the v2 rework) and **Magazine Issue 01**, which serves as its live interactive documentation and specimen showcase.

---

## 1. Core Vision & Scope

- **Primary Focus:** Build a **standalone, extensible, zero-dependency Editorial/Newspaper CSS Library** (`magazines/issue-01-newspaper-web-design/nrki-broadsheet-library.css`).
- **Use Cases:**
  1. Powers **NRKI** (`nrki.in`) and all future NRKI pages/SPAs.
  2. Works as a **drop-in standalone CSS library** for external websites, blogs, portfolios, and documentation sites—structured cleanly enough to extend in the future.
- **Role of Magazine Issue 01:** Acts as the library's interactive Storybook / showcase (replacing `Gallery` with a barebones `Magazines` index at `pages/magazines-index.html` containing Issue 01 for now). Every element and component supported by the library is rendered live inside Issue 01 with 5-mode switching, HTML/CSS/JS inspection, and one-click copy.
- **Safety:** For now, this CSS library lives independently for the Magazine on `dev` and does **not** overwrite the existing `assets/styles/style.css` until we are ready to migrate NRKI over to it.

---

## 1B. Research & Online Inspirations

To combine editorial polish with modern standalone CSS ergonomics, `nrki-broadsheet-library.css` adapts five proven ideas from open-source editorial and classless CSS systems:

| Inspiration | What We Borrow & Adapt | Why It Fits NRKI |
| :--- | :--- | :--- |
| **Tufte CSS** | Book-grade reading measure (`43rem`), disciplined visual hierarchy, and native `.nrki-sidenote` marginalia | Keeps long-form essays and poems scholarly and legible while letting side commentary sit next to prose on wide screens. |
| **Pico CSS** | Semantic-first element defaults (`blockquote`, `table`, `details`, form controls) styled cleanly without "div soup" | Allows dropping `nrki-broadsheet-library.css` onto plain semantic HTML pages while offering explicit `.nrki-*` classes where needed. |
| **PaperCSS** | Tactile print/paper border character (`1px` solid hairlines, `3px double` masthead dividers, pinned brass accents) | Reinforces the physical broadsheet feel without heavy drop-shadow clutter. |
| **Matcha CSS** | Zero-build drop-in stylesheet usability across blogs and personal sites | Works directly via `<link rel="stylesheet">` with zero bundler, preprocessor, or JavaScript requirement for base styling. |
| **Open Props** | Multi-tier CSS custom properties paired with native `@layer` cascade isolation | Lets external consumers override tokens or extend rules cleanly without `!important` or specificity wars. |

---

## 2. Upgraded Token System & 5 Theme Modes

### Why Upgrade the Existing Token System?
NRKI's existing semantic variables (`--bg-primary`, `--ink-primary`, `--border-strong`, `--accent-primary`, etc.) are already a strong foundation. To turn them into a **reusable 5-mode CSS library**, we upgrade them in 3 ways:

1. **Container-Scoped Themes (`[data-theme="..."]`):**
   - Theme tokens attach to `:root, [data-theme="light"]`, `[data-theme="dark"]`, `[data-theme="accent"]`, `[data-theme="faded"]`, and `[data-theme="uwu"]`.
   - Because themes work on **any element** (not just `<html>`), every **Specimen Container** in the Magazine can toggle between all 5 modes independently—*and* any site using the library can theme either the whole page or a single section/card!
2. **Native CSS Cascade Layers (`@layer`) — Zero `!important`:**
   ```css
   @layer nrki.tokens, nrki.reset, nrki.elements, nrki.components, nrki.utilities, nrki.print;
   ```
   - Allows future projects to override or extend any rule cleanly without `!important` or specificity battles.
3. **Extended Semantic Tokens (`--nrki-*`):**
   - **Surfaces:** `--nrki-surface-canvas`, `--nrki-surface-panel`, `--nrki-surface-inset`, `--nrki-surface-elevated`
   - **Inks:** `--nrki-ink-heading`, `--nrki-ink-body`, `--nrki-ink-muted`, `--nrki-ink-faint`, `--nrki-ink-on-accent`
   - **Accents:** `--nrki-accent-primary`, `--nrki-accent-primary-hover`, `--nrki-accent-primary-tint`, `--nrki-accent-secondary`, `--nrki-accent-secondary-hover`, `--nrki-accent-secondary-tint`, `--nrki-accent-highlight`, `--nrki-accent-highlight-hover`, `--nrki-accent-highlight-tint`
   - **Borders:** `--nrki-border-strong`, `--nrki-border-subtle`, `--nrki-border-faint`
   - **Status:** `--nrki-status-info-*`, `--nrki-status-success-*`, `--nrki-status-warning-*`, `--nrki-status-danger-*` (`-ink`, `-surface`, `-border`)
   - **Geometry, Depth & Interactive:** `--nrki-radius-control`, `--nrki-radius-surface`, `--nrki-radius-pill`, `--nrki-shadow-surface`, `--nrki-shadow-overlay`, `--nrki-focus-ring`, `--nrki-selection-surface`, `--nrki-selection-ink`, `--nrki-code-surface`, `--nrki-code-ink`
   - **Typography & Spacing:** `--nrki-font-serif`, `--nrki-font-sans`, `--nrki-font-mono`, `--nrki-shell-max-width`, `--nrki-reading-max-width`, `--nrki-space-1`..`--nrki-space-6`, `--nrki-transition-fast`

### The 5 Supported Modes (`data-theme`)

| Mode Value | Display Name | Visual Character |
| :--- | :--- | :--- |
| `light` | **Light / Day** *(Default)* | Warm dried-sage botanical newsprint (`#f2efe7`), deep pine-carbon ink (`#171b16`), forest-ledger green accent (`#2d4f36`). |
| `dark` | **Dark / Night** | Reversed pine-charcoal ink (`#141815`), warm parchment-cream text (`#ebe8dc`), luminous sage accent (`#8db596`). |
| `accent` | **Accent / Highlighted** | High-impact editorial feature band—deep botanical forest surface (`#1f3725`) with crisp cream ink (`#f8f7f2`) and oxidized brass/gold highlights (`#d4c77e`). |
| `faded` | **Faded / Low-Contrast** | Soft, sun-bleached archival paper (`#eae7df`) with muted charcoal-moss ink (`#434840`) and gentle hairlines for low-glare, quiet reading. |
| `uwu` | **UwU / OwO** | Playful sakura-cream paper (`#fff5f8`), plum-berry ink (`#3b2338`), rose-magenta & lavender accents (`#d14d8b`, `#9b72cf`), and softly rounded corners (`--radius-sm: 6px`). |

---

## 3. Complete CSS Library Coverage (Elements & Components)

The standalone library (`nrki-broadsheet-library.css`) covers **everything in NRKI's current `main` & `dev` CSS** plus extensible library primitives using semantic defaults and `.nrki-*` classes:

### A. 11 Simple Elements (Magazine Page 2: `#elements`)
1. **Editorial Typography & Headings:** `h1`–`h6`, `.nrki-eyebrow`, `.nrki-lead-summary`, `.nrki-quiet-note`, `.nrki-drop-cap`, `<mark>`, `<kbd>`, `<code>`, `<abbr>`.
2. **Section Headers, Rules & Tufte Sidenote:** `.nrki-page-hero`, `.nrki-section-heading`, `.nrki-rule-single`, `.nrki-rule-double`, `.nrki-rule-dashed`, `.nrki-sidenote`.
3. **Buttons (Variants, Sizes & Groups):** `.nrki-button`, `.nrki-button-primary`, `.nrki-button-secondary`, `.nrki-button-ghost`, `.nrki-button-danger`, `.nrki-button-small`, `.nrki-button-large`, `:disabled`, `.nrki-button-group`.
4. **Links & Breadcrumbs:** `.nrki-text-link`, `.nrki-back-link`, `.nrki-skip-link`, `.nrki-breadcrumb`.
5. **Badges, Stamps & Tag Pills:** `.nrki-badge`, `.nrki-badge-accent`, `.nrki-badge-highlight`, `.nrki-badge-success`, `.nrki-badge-warning`, `.nrki-badge-danger`, `.nrki-rating-stamp`, `.nrki-tag-pill`, `.nrki-tag-pills`, `.nrki-connected-chip`.
6. **Lists & Metadata:** Editorial `ul`/`ol`, `.nrki-editorial-list`, `<dl>`/`<dt>`/`<dd>`, `.nrki-inline-meta-list`.
7. **Editorial Blockquotes & Code Blocks:** `blockquote` + `<cite>`, `<pre><code>`.
8. **Forms & Validation States:** `.nrki-field`, `.nrki-label`, `.nrki-input`, `.nrki-textarea`, `.nrki-select`, `.nrki-checkbox-row`, `.nrki-radio-row`, `.nrki-field-help`, `.nrki-field-error`, `.nrki-input-invalid`.
9. **Tables & Data Ledgers:** `.nrki-table-wrap`, `.nrki-table`, `.nrki-table-compact`, `.nrki-table-striped`, `.nrki-cell-numeric`.
10. **Editorial Callouts & Notices:** `.nrki-callout`, `.nrki-callout-info`, `.nrki-callout-success`, `.nrki-callout-warning`, `.nrki-callout-danger`.
11. **Media Figure Frame & Theme Toggle:** `.nrki-media-figure`, `.nrki-media-header`, `.nrki-media-caption`, `.nrki-theme-toggle` *(includes interactive `JS` tab)*.

### B. 9 Complex Components (Magazine Page 3: `#components`)
1. **Newspaper Masthead Bar, Wordmark, Live Clock & Nav:** `.nrki-site-header`, `.nrki-masthead-bar`, `.nrki-wordmark`, `.nrki-wordmark-compact`, `.nrki-site-nav` *(includes `JS` clock & edition updater)*.
2. **Editorial & Interactive Link Cards:** `.nrki-card`, `.nrki-card-link`, `.nrki-card-meta`, `.nrki-card-footer`.
3. **Pinboard Card & Media Ledger Card:** `.nrki-pin-card`, `.nrki-card-media`, `.nrki-motif-row`, `.nrki-connected-row`, `.nrki-media-card`.
4. **Broadsheet Lead Story, Section Grid & Prose Columns:** `.nrki-page-shell`, `.nrki-lead-story`, `.nrki-lead-aside`, `.nrki-section-block`, `.nrki-card-grid`, `.nrki-shelf-grid`, `.nrki-columns-prose`.
5. **Interactive Filter Bar & Shelf Controls:** `.nrki-shelf-section`, `.nrki-shelf-header`, `.nrki-filter-controls`, `.nrki-filter-bar`, `.nrki-filter-button`, `.nrki-shelf-status-bar` *(includes interactive filter `JS`)*.
6. **Works Ledger & Resume Dossier Rows:** `.nrki-works-ledger`, `.nrki-work-row`, `.nrki-resume-row`.
7. **Accessible Modal / Article Overlay:** `.nrki-modal-backdrop`, `.nrki-modal-dialog`, `.nrki-modal-topbar`, `.nrki-modal-motifs-box` *(includes open/Escape/close `JS`)*.
8. **Newspaper Tabs & Expandable Accordions:** `.nrki-tabs`, `.nrki-tab-list`, `.nrki-tab-trigger`, `.nrki-tab-panel`, `.nrki-accordion`, `.nrki-accordion-item` *(includes tab switching `JS`)*.
9. **Print-Ready Resume Sheet & Site Footer:** `.nrki-resume-toolbar`, `.nrki-resume-sheet`, `.nrki-resume-header`, `.nrki-resume-section`, `.nrki-skills-grid`, `.nrki-site-footer`, and cross-browser `@page` + `@media print`.

---

## 4. Specimen Container Behavior (Inside Magazine Issue 01)

Every Simple Element and Complex Component in Issue 01 is rendered inside a standardized **Specimen Container**:

```text
+-------------------------------------------------------------------------+
| [Specimen Title]               Mode: [Light][Dark][Accent][Faded][UwU]  |
| Short description of the element or component.                          |
+-------------------------------------------------------------------------+
|  (Preview area styled with `data-theme="<selected-mode>"`)              |
|                                                                         |
|                       LIVE RENDERED PREVIEW                             |
|                                                                         |
+-------------------------------------------------------------------------+
|  [ HTML ]   [ CSS ]   [ JS* ]                           [ Copy <Tab> ]  |
+-------------------------------------------------------------------------+
|  /* Code drawer showing ONLY the active tab (HTML, CSS, or JS) */       |
+-------------------------------------------------------------------------+
```

- **Main Mode Toggle (5 Modes):** Switches `data-theme` (`light` | `dark` | `accent` | `faded` | `uwu`) directly on that specimen's preview stage (plus an optional global page toggle in the magazine header).
- **Code Toggles:** `HTML`, `CSS`, and conditional `JS` *(only rendered if the specimen uses JS)*.
- **Copy Button:** Copies **only** the code currently displayed in the active tab (`Copy HTML` / `Copy CSS` / `Copy JS`) with `Copied! ✓` feedback.

---

## 5. Proposed File Structure (Descriptive Naming Standard)

Per [`GEMINI.md`](./GEMINI.md), every file, folder, variable, and class uses an explicit, context-specific name (no generic names like `data`, `style.css`, or `elements.js`):

```text
NRKI AG/
├── GEMINI.md                                               # Always-on coding, CSS (no !important) & naming rules
├── pages/
│   └── magazines-index.html                                # Barebones Magazines index (replaces gallery.html)
└── magazines/
    └── issue-01-newspaper-web-design/
        ├── nrki-broadsheet-library.css                     # THE standalone, extensible CSS library (5 modes + @layer)
        ├── broadsheet-magazine-shell.css                   # Dedicated CSS solely for magazine chrome & specimen box
        ├── newspaper-design-magazine.html                  # Issue 01 SPA shell (#intro, #elements, #components, #colophon)
        ├── broadsheet-magazine-viewer.js                   # View router, 5-mode specimen switcher, code tabs & copy logic
        └── specimen-catalogs/
            ├── broadsheet-simple-elements-catalog.js       # Simple Elements specimens (html, css, optional js)
            └── broadsheet-complex-components-catalog.js    # Complex Components specimens (html, css, optional js)
```

---

## 6. Simplified Workflow Going Forward

1. **Build on `dev` only** (`main` stays live at `nrki.in` with your resumes, clean front page, and Under Construction placeholders—including `pages/magazines-index.html` replacing `pages/gallery.html`—while Issue 01 & the full library stay on `dev`).
2. **Build Order:**
   - **Step 1:** Write `magazines/issue-01-newspaper-web-design/nrki-broadsheet-library.css` (5-mode token system + `@layer` architecture + zero `!important` + all elements & components).
   - **Step 2:** Create the barebones `pages/magazines-index.html` (replacing `pages/gallery.html`) and the Issue 01 viewer (`newspaper-design-magazine.html`, `broadsheet-magazine-shell.css`, `broadsheet-magazine-viewer.js`) with the 5-mode Specimen Container.
   - **Step 3:** Populate `specimen-catalogs/broadsheet-simple-elements-catalog.js` and `specimen-catalogs/broadsheet-complex-components-catalog.js` + the Colophon (GitHub stylesheet link, credits & inspirations).
   - **Step 4:** Visually inspect and refine `nrki-broadsheet-library.css` inside Issue 01 across all 5 modes (`light`, `dark`, `accent`, `faded`, `uwu`).
   - **Step 5 (Later):** Once satisfied with the library, migrate the main NRKI pages onto `nrki-broadsheet-library.css` (and publish it as a standalone repo/package if desired).
