# NRKI Broadsheet CSS Library & Design Magazine Spec (`MAGAZINES_SPEC.md`)

This document defines the **standalone NRKI Broadsheet CSS Library** (the primary focus of the v2 rework) and **Magazine Issue 01 — The NRKI Broadsheet**, which serves as its newspaper-styled live interactive documentation and specimen workbench.

---

## 1. Core Vision & Scope

- **Primary Focus:** Build a **standalone, extensible, zero-dependency Newspaper & Editorial CSS Library** (`nrki-broadsheet-library.css` v2.3.0).
- **Use Cases:**
  1. Powers **NRKI** ([nrki.in](https://nrki.in) on `main` and staging on `dev` via `assets/styles/nrki-broadsheet-library.css`, replacing legacy `style.css`) and all future NRKI pages/SPAs.
  2. Works as a **drop-in standalone CSS library** for external websites, blogs, portfolios, and documentation sites—reusable anywhere with zero build step and **zero `!important`**.
- **Newspaper Role of Magazine Issue 01:** Replaces `Gallery` with a barebones `Magazines` index at `pages/magazines-index.html`. Issue 01 looks and reads like an authentic multi-edition newspaper—featuring a classic **Broadsheet Spread** on desktop/tablet (`min-width: 768px`) and a vertical **Pocket Newspaper** edition on mobile (`max-width: 767px`).
- **Production Rollout (`main` & `dev`):** `nrki-broadsheet-library.css` has graduated to become the primary site stylesheet (`assets/styles/nrki-broadsheet-library.css`) on both `main` and `dev`, complete with the global 2-axis header controls (`.nrki-masthead-subbar`), mobile/tablet sticky bottom nav bar (`.nrki-mobile-bottom-bar`), and Magazine Issue 01. On `main`, Home keeps its generic overview while `Projects`, `Works`, and `Media` remain Under Construction with empty production manifests; `dev` hosts staging sample shelves.

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

| Theme (`data-theme`) | Personality & Border Grammar | Contextual Font Pairing (with Native Fallbacks) | Light Mode (`data-mode="light"`) | Dark Mode (`data-mode="dark"`) |
| :--- | :--- | :--- | :--- | :--- |
| **`classic`** *(Default)* | Metropolitan broadsheet: `1px solid` column hairlines, `3px double` major rules & `.nrki-corner-frame` press trim, razor `0px` corners. | **Playfair Display** (h1/headings/italic quotes), **Newsreader / Georgia** (body), **Libre Franklin** (UI), **JetBrains Mono** (code). | Dried-sage botanical newsprint (`#f2efe7`), deep pine-carbon ink (`#171b16`), forest green (`#2d4f36`). | Pine-charcoal ink (`#121613`), linen parchment text (`#e6e8df`), luminous sage (`#7ea383`). |
| **`ancient`** | Old Fantasy Kingdom Chronicle: extended outward-curved 9-slice SVG book corners (`border-image-outset: 5px`), double gold/walnut rails, SVG scrollwork dividers. | **UnifrakturCook** (`h1` Old English blackletter), **Cinzel** (subheadings/UI), **Cormorant Garamond** (body), **IM Fell English** (italic quotes/bylines), **Courier Prime** (code). | Aged royal vellum (`#efe3c6`), deep walnut-sepia ink (`#2a1c11`), crimson wax seal (`#7d1f1a`), antique gold (`#8c6821`). | Candlelit obsidian leather (`#16120d`), warm ivory vellum (`#efe1c4`), gilded gold (`#d6ae55`), ember crimson (`#d45d54`). |
| **`minimalistic`** | Swiss Neo-Editorial: **barely any borders** (`0px` card borders, soft gallery shadow & tonal elevation, subtle hairline dividers). | **Space Grotesk** (`h1`/headings), **Inter / system-ui** (body/UI), **Newsreader** (italic quotes/notes), **IBM Plex Mono** (code). | Pure gallery alabaster (`#fafaf9`), stone panel (`#f1f1ef`), pure carbon ink (`#111213`). | Deep matte obsidian (`#0d0e10`), elevated graphite (`#15171a`), crisp chalk (`#f3f4f6`). |
| **`uwu`** | Kawaii Pastel Zine: chunky `2px solid` / `2px dashed` pastel frames, offset candy shadows (`3px 3px 0`), rounded `12px–999px` pill geometry, corner sparkles `✦` & floral dividers. | **Fredoka** (display/headings/UI), **Nunito** (body), **Mali** (quotes/captions), **DM Mono** (code). | Sakura milk (`#fff4f9`), strawberry cream (`#fce4ef`), plum-berry ink (`#3f1d38`), sakura magenta (`#cf3581`). | Velvet midnight plum (`#1a101d`), berry dusk (`#25172b`), cotton-candy white (`#fdf2f8`), neon sakura (`#f472b6`). |

### Cascade Layer Order & Specificity Hygiene (Zero `!important`)
```css
@layer nrki.tokens, nrki.reset, nrki.elements, nrki.components, nrki.utilities, nrki.print;
```
*(In Magazine Issue 01, `magazine.shell` slots cleanly between `nrki.components` and `nrki.utilities` so utility states and print rules always win cleanly without `!important`.)*

- **Zero-Specificity Theme Base Selectors (`:where()`):** Base theme overrides on shared UI classes (e.g., `:where([data-theme="minimalistic"]) .nrki-button`, `.nrki-theme-toggle`, `.nrki-theme-select`, `.nrki-badge`, `.nrki-callout`, `.nrki-filter-button`) use `:where(...)` so the selector stays at `(0, 1, 0)` specificity instead of `(0, 2, 0)`. Variant modifiers like `.nrki-button-primary`, `.nrki-button-small`, `.nrki-button-large`, and `.nrki-button-danger` always override base background and ink colors without hover or `!important`.
- **Site Header Theme + Mode Controls (`.nrki-masthead-subbar`) & Mobile/Tablet Bottom Bar (`.nrki-mobile-bottom-bar`):** On desktop (`min-width: 1025px`), every NRKI site page positions `<select class="nrki-theme-select" data-theme-select>` on the left and `<button class="nrki-theme-toggle" data-theme-toggle>` on the right directly below the `.nrki-wordmark` (`NRKI` title) inside `.nrki-masthead-subbar` (flanking `.nrki-masthead-tagline`). On mobile and tablet displays (`max-width: 1024px`), the top `.nrki-site-nav` and header theme/mode selectors hide, replaced by a sticky bottom bar (`.nrki-mobile-bottom-bar`) containing the site navigation links and a 1-tap theme/mode trigger (`[data-mobile-theme-drawer-toggle]`) that opens `.nrki-mobile-theme-sheet`.

---

## 3. Complete Library Coverage & The 5 Magazine Pages

Issue 01 is structured as a **5-Page Newspaper Monograph**:

### Page 01: Front Page — Intro, Manifesto & Interactive Index (`#intro`)
- Centered Newspaper Masthead (`THE NRKI BROADSHEET` nameplate without ear boxes), double-ruled 5-section ribbon, 3-column broadsheet Front Page grid (Lead Story + Multi-column copy | Interactive Magazine Index & Live 8-Token Swatch Ledger).

### Page 02: Broadsheet Layouts (`#layouts` — 6 Reusable Specimens)
1. **Classic 3-Column Broadsheet Front Page** (`.nrki-layout-frontpage`)
2. **Asymmetric Lead Feature + Contents Rail** (`.nrki-lead-story` + `.nrki-lead-aside`)
3. **Editorial Reading Measure + Tufte Marginalia Rail** (`.nrki-layout-marginalia`)
4. **Flowing Multi-Column Newspaper Prose & Spanning Quote** (`.nrki-columns-prose` + `.nrki-column-span-all`)
5. **Collection Shelf with Sticky Filter Sidebar** (`.nrki-layout-shelf-sidebar` — includes interactive filter `JS`)
6. **Two-Page Newspaper Spread & Mobile Folio Stack** (`.nrki-spread-grid`)

### Page 03: Simple Elements (`#elements` — 13 Specimens)
1. **Editorial Typography, Hierarchy & Emphasis** (`h1` Old English display in Ancient, `h2`–`h3`, `.nrki-byline`, `.nrki-small-caps`, `.nrki-drop-cap`, bold/italic styling, `<mark>`, `<kbd>`, `<code>`, `<abbr>`)
2. **Headers, Outward Book Corners, Rules & Sidenote** (`.nrki-corner-frame`, `.nrki-framed-panel`, `.nrki-ornate-divider`, `.nrki-sidenote`)
3. **Buttons — Variants, Sizes & Button Groups** (`.nrki-button`, `-primary`, `-secondary`, `-ghost`, `-danger`, `-small`, `-large`, `:disabled`)
4. **Links, Back-Links & Breadcrumbs** (`.nrki-text-link`, `.nrki-back-link`, `.nrki-skip-link`, `.nrki-breadcrumb`)
5. **Badges, Status Stamps, Rating Seal & Tag Pills** (`.nrki-badge-*`, `.nrki-rating-stamp`, `.nrki-tag-pill`, `.nrki-connected-chip`)
6. **Lists — Editorial, Ordered, Checklists, Ruled & Definitions** (theme-specific list markers, `.nrki-ordered-list`, `.nrki-checklist`, `.nrki-ruled-list`, `.nrki-definition-list`, `.nrki-inline-meta-list`)
7. **Blockquotes & Syntax-Framed Code Blocks** (`blockquote` / `.nrki-quote`, `.nrki-code-block`, `.nrki-code-header`, `.nrki-tok-*`)
8. **Form Inputs, Textareas, Switches & Sliders** (`.nrki-field`, `.nrki-input`, `.nrki-textarea`, `.nrki-select`, `.nrki-switch`, `.nrki-range`, `.nrki-input-invalid`, `.nrki-field-error`)
9. **Newspaper Tables & Structured Ledgers** (`.nrki-table`, `.nrki-table-compact`, `.nrki-table-striped`, `.nrki-cell-numeric`)
10. **Editorial Callouts & Status Notices** (`.nrki-callout`, `-info`, `-success`, `-warning`, `-danger`)
11. **Media Figure Frame & Captioned Plate** (`.nrki-media-figure`, controlled exclusively from outside specimen controls)
12. **Progress Bars, Stat Metrics & Author Byline** (`.nrki-progress`, `.nrki-stat-strip`, `.nrki-author-byline`, `.nrki-avatar`)
13. **Tooltips, Empty States & Skeletons** (`.nrki-tooltip`, `.nrki-empty-state`, `.nrki-skeleton-card`)

### Page 04: Complex Components (`#components` — 13 Specimens)
1. **Newspaper Masthead Bar, Wordmark, Live Clock & Nav** *(includes `JS`)*
2. **Editorial & Interactive Link Cards** (`.nrki-card`, `.nrki-card-link`, `.nrki-framed-panel`)
3. **Pinboard Card & Media Ledger Card** (`.nrki-pin-card`, `.nrki-media-card`)
4. **Lead Story Split, Section Grid & Prose Columns** (`.nrki-lead-story`, `.nrki-section-block`)
5. **Interactive Filter Bar & Shelf Controls** *(includes `JS`)*
6. **Works Newspaper Index & Resume Dossier Rows** (`.nrki-works-ledger`, `.nrki-resume-row`)
7. **Accessible Modal & Article Overlay** *(includes `JS`, `{ preventScroll: true }`)*
8. **Accordions — Flush Hairline & Boxed Exclusive Variants** (`.nrki-accordion`, `.nrki-accordion-boxed`, `<details name="...">` *(includes `JS`)*)
9. **Newspaper Tabs & Segmented Controls** (`.nrki-tabs`, `.nrki-segmented-control` *(includes `JS`)*)
10. **Print-Ready Resume Sheet & Site Footer** (cross-browser `@page` + `@media print`)
11. **Archive Pagination & Editorial Timeline** (`.nrki-pagination`, `.nrki-timeline` *(includes `JS`)*)
12. **Dropdown Menu & Dismissible Editorial Toast** (`.nrki-dropdown`, `.nrki-toast-banner` *(includes `JS`)*)
13. **Notifications & Floating Toast Stack** (`.nrki-notification`, `-info`/`-success`/`-warning`/`-danger` + `.nrki-toast-stack`, `.nrki-toast`, interactive spawn/dismiss & countdown bar `@keyframes nrki-toast-countdown` *(includes `JS`)*)

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
  1. **Edge-to-Edge Scrollable Stream:** All specimens in the active section stack cleanly with minimal side gutters (`0.75rem`) and tactile print dividers (`SPECIMEN 02 OF 13 · ✦`) so zero horizontal space is wasted and no redundant mobile quick-jump strip clutters the top of the section.
  2. **Top Reading Progress Ink Rule:** 3px fixed top indicator bar tracking scroll progress through the section.
  3. **Mobile Flow & Inline-Child Safeguards:** Ordered list items (`.nrki-ordered-list li`), checklist entries (`.nrki-checklist-entry`), and accordion summaries (`.nrki-accordion-summary`) keep normal block text flow (`position: relative` with absolutely positioned `::before`/`::after` markers) rather than applying `display: grid` or `display: flex` to text containers, ensuring inline `<code>`, `<strong>`, `<em>`, and `<a>` elements flow naturally inline inside sentences on narrow viewports. Multi-column grids (`.nrki-card-grid`, `.nrki-shelf-grid`, `.nrki-about-columns`, `.nrki-skills-grid`, `.magazine-colophon-grid`, `.magazine-token-swatch-grid`) collapse cleanly to `1fr` with `min-width: 0` on mobile (`max-width: 767px`), and `.nrki-card` / `.magazine-colophon-grid` enforce `min-width: 0` overflow containment so `<pre>` blocks scroll internally inside cards on narrow screens.
  4. **Sticky Bottom Pocket Folio Bar + 1-Tap Theme Drawer:** Fixed bottom navigation (`Front`, `Layouts`, `Elem`, `Comp`, `Info`) paired with a compact theme trigger (`Classic ☀`) that opens an accessible bottom sheet to switch Themes (`Classic / Ancient / Minimalistic / UwU`) & Modes (`Light / Dark`) seamlessly one-handed.

---

## 5. Specimen Container Specification

Every specimen on `#layouts`, `#elements`, and `#components` renders inside the reusable `.specimen-container`:
- **Per-Specimen Dual Controls:** Independent **Theme (`Classic | Ancient | Minimalistic | UwU`)** buttons + a **single Light/Dark Mode toggle button (`☀ Light` / `☾ Dark`, `[data-specimen-mode-toggle]`)** controlling `data-theme` and `data-mode` directly on `.specimen-preview-stage` (matching the single global mode toggle `[data-global-mode-toggle]` in the Issue 01 masthead and mobile drawer; all specimens—including #11 Media Figure Frame—are controlled strictly from these external header controls).
- **Inert Preview Guard:** Links (`a[href]`) and forms inside `.specimen-preview-stage` have default navigation and submission prevented so users can inspect visuals and local widget interactions without changing URL hash, active magazine page, or scroll position.
- **Syntax-Highlighted Code Inspection & Copy:** `HTML`, `CSS`, and conditional `JS` *(shown strictly when `jsSnippet` exists)* toggles with a single-pass tokenizer (`.nrki-tok-*`) rendered in each theme's readable `--nrki-font-mono`, paired with a language header bar and context-aware `Copy <LANG>` button.

---

## 6. File System Structure (Descriptive Naming Standard)

Per [`GEMINI.md`](./GEMINI.md), every file, folder, variable, and class uses explicit domain-specific naming:

```text
NRKI AG/
├── GEMINI.md                                               # Always-on CSS, naming, rationale & spec-sync rules
├── assets/
│   ├── styles/nrki-broadsheet-library.css                  # Production broadsheet library on `main` & `dev` (identical v2.3.0 copy)
│   └── scripts/main.js                                     # 2-axis theme dropdown + Light/Dark toggle + mobile bottom bar + dateline + filters
├── pages/
│   └── magazines-index.html                                # Barebones Magazines index linking to Issue 01
└── magazines/
    └── issue-01-newspaper-web-design/
        ├── nrki-broadsheet-library.css                     # Standalone reusable 4-theme × 2-mode CSS library (@layer)
        ├── broadsheet-magazine-shell.css                   # Issue 01 desktop spread + mobile pocket newspaper chrome
        ├── newspaper-design-magazine.html                  # Issue 01 5-page hash-routed SPA (#intro..#colophon)
        ├── broadsheet-magazine-viewer.js                   # Spread/Mobile router, inert guard, syntax highlighter, copy
        └── specimen-catalogs/
            ├── broadsheet-layouts-catalog.js               # Page 02: 6 Reusable Broadsheet Layouts
            ├── broadsheet-simple-elements-catalog.js       # Page 03: 13 Simple Element specimens
            └── broadsheet-complex-components-catalog.js    # Page 04: 13 Complex Component specimens
```

---

## 7. Solo-Dev Workflow

1. **Build & stage on `dev`, promote cleanly to `main`:** New stylesheets, Magazine Issue updates, and visual architecture changes are staged on `dev` first and selectively promoted to `main` (`nrki.in`), while `main` keeps generic Home copy and Under Construction placeholders for `Projects`, `Works`, and `Media` until those content shelves are ready for public launch.
2. **Keep Library & Site Identical:** Both `magazines/issue-01-newspaper-web-design/nrki-broadsheet-library.css` and `assets/styles/nrki-broadsheet-library.css` stay byte-identical (v2.3.0) so improvements documented in Issue 01 immediately power every site page across `main` and `dev`.
