# NRKI Broadsheet CSS Library & Design Magazine Spec (`MAGAZINES_SPEC.md`)

This document defines the **standalone NRKI Broadsheet CSS Library** (the primary focus of the v2 rework) and **Magazine Issue 01 — The NRKI Broadsheet**, which serves as its newspaper-styled live interactive documentation and specimen workbench.

---

## 1. Core Vision & Scope

- **Primary Focus:** Build a **standalone, extensible, zero-dependency Newspaper & Editorial CSS Library** (`magazines/issue-01-newspaper-web-design/nrki-broadsheet-library.css`).
- **Use Cases:**
  1. Powers **NRKI** (`nrki.in`) and all future NRKI pages/SPAs.
  2. Works as a **drop-in standalone CSS library** for external websites, blogs, portfolios, and documentation sites—reusable anywhere with zero build step and **zero `!important`**.
- **Newspaper Role of Magazine Issue 01:** Replaces `Gallery` with a barebones `Magazines` index at `pages/magazines-index.html`. Issue 01 looks and reads like an authentic multi-edition newspaper—featuring a classic **Broadsheet Spread** on desktop/tablet (`min-width: 768px`) and a vertical **Pocket Newspaper** edition on mobile (`max-width: 767px`).
- **Safety:** For now, this CSS library lives independently inside `magazines/issue-01-newspaper-web-design/` on `dev` and does **not** overwrite `assets/styles/style.css`. `main` keeps `pages/magazines-index.html` Under Construction until ready to launch.

---

## 1B. Research & Online Inspirations

To combine editorial polish with modern standalone CSS ergonomics, `nrki-broadsheet-library.css` adapts five proven ideas from open-source editorial and classless CSS systems:

| Inspiration | What We Borrow & Adapt | Why It Fits NRKI |
| :--- | :--- | :--- |
| **Tufte CSS** | Book-grade reading measure (`43rem`), disciplined visual hierarchy, and native `.nrki-sidenote` marginalia | Keeps long-form essays and poems scholarly and legible while letting side commentary sit next to prose on wide screens. |
| **Pico CSS** | Semantic-first element defaults (`blockquote`, `table`, `details`, form controls) styled cleanly without "div soup" | Allows dropping `nrki-broadsheet-library.css` onto plain semantic HTML pages while offering explicit `.nrki-*` classes where needed. |
| **PaperCSS** | Tactile print/paper border character (`1px` solid hairlines, `3px double` masthead dividers, pinned brass accents) | Reinforces the physical broadsheet feel without heavy drop-shadow clutter. |
| **Matcha CSS** | Zero-build drop-in stylesheet usability across blogs and personal sites | Works directly via `<link rel="stylesheet">` with zero bundler, preprocessor, or JavaScript requirement for base styling. |
| **Open Props** | Multi-tier CSS custom properties paired with native `@layer` cascade control | Lets external consumers override tokens or extend rules cleanly without `!important` or specificity wars. |

---

## 2. Upgraded 2-Axis Token Architecture (`data-theme` × `data-mode`)

### Why Orthogonal `data-theme` + `data-mode` Replaces Flat Mode Names?
Instead of hardcoding 8 separate flat theme stylesheets, **NRKI Broadsheet** splits visual personality (**`data-theme`**) from ink brightness (**`data-mode`**):
1. **`data-theme`** defines each personality's **default typography stack**, **border grammar** (hairline/double vs. ornate scrollwork vs. near-borderless vs. chunky pastel), **corner radii**, **ornament masks**, and **shadow depth**.
2. **`data-mode`** flips **color polarity (`light` vs. `dark`)** inside *each* of those 4 themes—producing **8 cohesive, high-contrast editions** (`4 × 2`).
3. **Container-Scoped Isolation:** Every theme × mode combination is scoped cleanly to attribute selectors (`[data-theme="..."]` + `[data-mode="..."]`), so both `<html>` and any nested preview container (`.nrki-theme-surface`, `.specimen-preview-stage`) can switch independently without leaking fonts, paper textures, or borders to parent containers.

### The 4 Themes × 2 Modes = 8 Editions

| Theme (`data-theme`) | Personality & Border Grammar | Default Font Pairing (with Native Fallbacks) | Light Mode (`data-mode="light"`) | Dark Mode (`data-mode="dark"`) |
| :--- | :--- | :--- | :--- | :--- |
| **`classic`** *(Default)* | Metropolitan broadsheet: `1px solid` column hairlines, `3px double` major rules, razor `0px` corners. | **Playfair Display** (masthead), **Newsreader / Georgia** (body), **Libre Franklin** (UI), **JetBrains Mono** (code). | Dried-sage botanical newsprint (`#f2efe7`), deep pine-carbon ink (`#171b16`), forest green (`#2d4f36`). | Pine-charcoal ink (`#121613`), linen parchment text (`#e6e8df`), luminous sage (`#7ea383`). |
| **`ancient`** | Old Fantasy Kingdom Chronicle: ornate `4px double` frames + inset outline, CSS `mask-image` SVG corner/divider scrollwork filigree, subtle aged vignette texture. | **UnifrakturMaguntia** (blackletter nameplate), **Cinzel** (royal small-caps headings/UI), **IM Fell English / Palatino** (prose). | Aged royal vellum (`#efe3c6`), deep walnut-sepia ink (`#2a1c11`), crimson wax seal (`#7d1f1a`), antique gold (`#8c6821`). | Candlelit obsidian leather (`#16120d`), warm ivory vellum (`#efe1c4`), gilded gold (`#d6ae55`), ember crimson (`#d45d54`). |
| **`minimalistic`** | Swiss Neo-Editorial: **barely any borders** (`0px` card borders, soft tonal surface elevation instead of outlines, single whisper `1px` section dividers). | **Space Grotesk** (display/headings), **Inter / system-ui** (body/UI), **IBM Plex Mono** (code). | Pure gallery alabaster (`#fafaf9`), stone panel (`#f1f1ef`), pure carbon ink (`#111213`). | Deep matte obsidian (`#0d0e10`), elevated graphite (`#15171a`), crisp chalk (`#f3f4f6`). |
| **`uwu`** | Kawaii Pastel Zine: chunky `2px solid` / `2px dashed` pastel frames, offset candy shadows (`3px 3px 0`), rounded `12px–999px` pill geometry, floral divider ornaments (`✿ ✧ ✿`). | **Fredoka** (display/UI), **Nunito / Trebuchet MS** (body), **Fira Code** (code). | Sakura milk (`#fff4f9`), strawberry cream (`#fce4ef`), plum-berry ink (`#3f1d38`), sakura magenta (`#cf3581`). | Velvet midnight plum (`#1a101d`), berry dusk (`#25172b`), cotton-candy white (`#fdf2f8`), neon sakura (`#f472b6`). |

### Cascade Layer Order (Zero `!important`)
```css
@layer nrki.tokens, nrki.reset, nrki.elements, nrki.components, nrki.utilities, nrki.print;
```
*(In Magazine Issue 01, `magazine.shell` slots cleanly between `nrki.components` and `nrki.utilities` so utility states and print rules always win cleanly without `!important`.)*

---

## 3. Complete Library Coverage & The 5 Magazine Pages

Issue 01 is structured as a **5-Page Newspaper Monograph**:

### Page 01: Front Page — Intro, Manifesto & Interactive Index (`#intro`)
- Authentic 3-part Newspaper Masthead (Left Edition Ear + centered `THE NRKI BROADSHEET` nameplate + Right Folio Ear), double-ruled 5-section ribbon, 3-column broadsheet Front Page grid (Lead Story + Multi-column copy | Interactive Magazine Index & Live 8-Token Swatch Ledger).

### Page 02: Broadsheet Layouts (`#layouts` — 6 Reusable Specimens)
1. **Classic 3-Column Broadsheet Front Page** (`.nrki-layout-frontpage`)
2. **Asymmetric Lead Feature + Contents Rail** (`.nrki-lead-story` + `.nrki-lead-aside`)
3. **Editorial Reading Measure + Tufte Marginalia Rail** (`.nrki-layout-marginalia`)
4. **Flowing Multi-Column Newspaper Prose & Spanning Quote** (`.nrki-columns-prose` + `.nrki-column-span-all`)
5. **Collection Shelf with Sticky Filter Sidebar** (`.nrki-layout-shelf-sidebar` — includes interactive filter `JS`)
6. **Two-Page Newspaper Spread & Mobile Folio Stack** (`.nrki-spread-grid`)

### Page 03: Simple Elements (`#elements` — 11 Specimens)
1. **Editorial Typography & Headings** (`h1`–`h6`, `.nrki-eyebrow`, `.nrki-lead-summary`, `.nrki-drop-cap`, `<mark>`, `<kbd>`, `<code>`, `<abbr>`)
2. **Headers, Structural Rules & Tufte Sidenote** (`.nrki-page-hero`, `.nrki-section-heading`, `.nrki-ornate-divider`, `.nrki-rule-double`, `.nrki-sidenote`)
3. **Buttons — Variants, Sizes & Button Groups** (`.nrki-button`, `-primary`, `-secondary`, `-ghost`, `-danger`, `-small`, `-large`, `:disabled`)
4. **Links, Back-Links & Breadcrumbs** (`.nrki-text-link`, `.nrki-back-link`, `.nrki-skip-link`, `.nrki-breadcrumb`)
5. **Badges, Status Stamps, Rating Seal & Tag Pills** (`.nrki-badge-*`, `.nrki-rating-stamp`, `.nrki-tag-pill`, `.nrki-connected-chip`)
6. **Lists, Definition Lists & Inline Metadata** (`.nrki-editorial-list`, `.nrki-definition-list`, `.nrki-inline-meta-list`)
7. **Editorial Blockquotes & Preformatted Code** (`blockquote` / `.nrki-quote`, `<pre><code>`)
8. **Form Inputs, Selects, Checkboxes & Validation** (`.nrki-field`, `.nrki-input`, `.nrki-textarea`, `.nrki-select`, `.nrki-input-invalid`, `.nrki-field-error`)
9. **Newspaper Tables & Structured Ledgers** (`.nrki-table`, `.nrki-table-compact`, `.nrki-table-striped`, `.nrki-cell-numeric`)
10. **Editorial Callouts & Status Notices** (`.nrki-callout`, `-info`, `-success`, `-warning`, `-danger`)
11. **Media Figure Frame & Theme/Mode Cycle** (`.nrki-media-figure`, `.nrki-theme-toggle` — includes `JS` tab cycling themes + light/dark mode)

### Page 04: Complex Components (`#components` — 9 Specimens)
1. **Newspaper Masthead Bar, Wordmark, Live Clock & Nav** *(includes `JS`)*
2. **Editorial & Interactive Link Cards** (`.nrki-card`, `.nrki-card-link`, `.nrki-framed-panel`)
3. **Pinboard Card & Media Ledger Card** (`.nrki-pin-card`, `.nrki-media-card`)
4. **Lead Story Split, Section Grid & Prose Columns** (`.nrki-lead-story`, `.nrki-section-block`)
5. **Interactive Filter Bar & Shelf Controls** *(includes `JS`)*
6. **Works Newspaper Index & Resume Dossier Rows** (`.nrki-works-ledger`, `.nrki-resume-row`)
7. **Accessible Modal & Article Overlay** *(includes `JS`)*
8. **Newspaper Tabs & Expandable Accordions (`<details>`)** *(includes `JS`)*
9. **Print-Ready Resume Sheet & Site Footer** (cross-browser `@page` + `@media print`)

### Page 05: Colophon — GitHub Stylesheet, Reusability & Credits (`#colophon`)
- Direct GitHub links to `nrki-broadsheet-library.css`, `@layer` extension snippets, and full lineage/inspirations list.

---

## 4. Responsive Broadsheet Architecture (Desktop Spread vs. Mobile Pocket Newspaper)

### Desktop & Tablet (`min-width: 768px`) — Non-Scrolling Broadsheet Spread
- **Why not a long vertical scroll on desktop?** A real newspaper gives you a table of contents column alongside the active story page rather than one endless scroll.
- On `#layouts`, `#elements`, and `#components`, desktop renders a **2-column Broadsheet Spread**:
  - **Left Ruled Index Column:** Numbered newspaper directory of all specimens in that section, category/`JS` badges, `← Prev` / `Next →` specimen turn controls, and a **`Spread View` / `Full Sheet`** toggle button (defaulting to `Spread View`, showing one specimen cleanly inside the viewport).
  - **Right Specimen Broadsheet Stage:** Active Specimen Container + bottom **Running Folio Bar** (`Specimen X of Y · ← Previous | Next →`, keyboard shortcuts `Alt+←` / `Alt+→`).

### Mobile (`max-width: 767px`) — Pocket Newspaper Edition
- On mobile, natural vertical scrolling **is** ergonomic—so Issue 01 shifts into a dedicated mobile newspaper layout:
  1. **Edge-to-Edge Scrollable Stream:** All specimens in the active section stack cleanly with minimal side gutters (`0.75rem`) and tactile print dividers (`ARTICLE 02 OF 11 · ✦`) so zero horizontal space is wasted.
  2. **Top Reading Progress Ink Rule:** 3px fixed top indicator bar tracking scroll progress through the section.
  3. **Horizontal Scroll-Snap Quick-Jump Strip:** Swipeable pill index at the top of each catalog section (`01`, `02`, `03`…).
  4. **Sticky Bottom Pocket Folio Bar + 1-Tap Theme Drawer:** Fixed bottom navigation (`Front`, `Layouts`, `Elem`, `Comp`, `Info`) paired with a compact theme trigger (`Classic ☀`) that opens an accessible bottom sheet to switch Themes (`Classic / Ancient / Minimalistic / UwU`) & Modes (`Light / Dark`) seamlessly one-handed.

---

## 5. Specimen Container Specification

Every specimen on `#layouts`, `#elements`, and `#components` renders inside the reusable `.specimen-container`:
- **Per-Specimen Dual Controls:** Independent **Theme (`Classic | Ancient | Minimalistic | UwU`)** + **Mode (`☀ | ☾`)** buttons controlling `data-theme` and `data-mode` directly on `.specimen-preview-stage`.
- **Code Inspection & Copy:** `HTML`, `CSS`, and conditional `JS` *(shown strictly when `jsSnippet` exists)* toggles + context-aware `Copy <LANG>` button (with `file://` clipboard fallback).

---

## 6. File System Structure (Descriptive Naming Standard)

Per [`GEMINI.md`](./GEMINI.md), every file, folder, variable, and class uses explicit domain-specific naming:

```text
NRKI AG/
├── GEMINI.md                                               # Always-on CSS, naming, rationale & spec-sync rules
├── pages/
│   └── magazines-index.html                                # Barebones Magazines index (Under Construction on main)
└── magazines/
    └── issue-01-newspaper-web-design/
        ├── nrki-broadsheet-library.css                     # Standalone reusable 4-theme × 2-mode CSS library (@layer)
        ├── broadsheet-magazine-shell.css                   # Issue 01 desktop spread + mobile pocket newspaper chrome
        ├── newspaper-design-magazine.html                  # Issue 01 5-page hash-routed SPA (#intro..#colophon)
        ├── broadsheet-magazine-viewer.js                   # Spread/Mobile router, dual theme controller, copy engine
        └── specimen-catalogs/
            ├── broadsheet-layouts-catalog.js               # Page 02: 6 Reusable Broadsheet Layouts
            ├── broadsheet-simple-elements-catalog.js       # Page 03: 11 Simple Element specimens
            └── broadsheet-complex-components-catalog.js    # Page 04: 9 Complex Component specimens
```

---

## 7. Solo-Dev Workflow

1. **Build on `dev` only** (`main` keeps `nrki.in` live with resumes, general front page, and Under Construction placeholders—including `pages/magazines-index.html`—while Issue 01 & the CSS library evolve on `dev`).
2. Refine `nrki-broadsheet-library.css` visually across all 8 Theme × Mode editions inside Issue 01 on `dev.nrki.pages.dev` before migrating main NRKI pages or publishing standalone.
