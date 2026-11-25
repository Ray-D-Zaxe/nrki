# NRKI — Personal Broadsheet, Portfolio & Standalone CSS System

> **Live Site:** [nrki.in](https://nrki.in) · **Contact:** [raj@nrki.in](mailto:raj@nrki.in)  
> *Pronounced “anarchy” — an independent, newspaper-inspired personal website, publishing archive, and standalone editorial CSS library built with zero build step.*

---

## Overview

**NRKI** combines the visual discipline of a classic printed broadsheet—1px structural hairlines, 3px double masthead rules, and serif/monospace typographic contrast—with modern, zero-bloat web engineering. Instead of hiding behind a heavy framework or boilerplate template, the entire platform runs natively on **semantic HTML5**, **layered CSS custom properties**, **vanilla JavaScript**, and **lightweight React islands**.

### Key Engineering Highlights
- **Standalone 4-Theme × 2-Mode Broadsheet CSS Library:** [`assets/styles/nrki-broadsheet-library.css`](https://github.com/Ray-D-Zaxe/nrki/blob/main/assets/styles/nrki-broadsheet-library.css) (identical to Issue 01's [`nrki-broadsheet-library.css`](https://github.com/Ray-D-Zaxe/nrki/blob/main/magazines/issue-01-newspaper-web-design/nrki-broadsheet-library.css), v2.3.0) is an extensible, **zero-`!important`** stylesheet built on 6 native CSS Cascade Layers (`@layer`), zero-specificity `:where([data-theme="..."])` base rules, and orthogonal `[data-theme]` (**Classic**, **Ancient**, **Minimalistic**, **UwU**) × `[data-mode]` (**Light Paper** / **Dark Night**) axes—producing 8 editions selectable globally via the masthead dropdown/toggle or mobile/tablet bottom bar drawer.
- **Interactive Design Magazine (Issue 01):** Self-contained 5-page newspaper specimen book (**Front Page**, **6 Layouts**, **13 Simple Elements**, **13 Complex Components** including Notifications & Floating Toasts, and **Colophon**) with desktop Broadsheet Spread vs. mobile Pocket Newspaper UX, per-specimen dual Theme × Mode switching, `HTML` / `CSS` / conditional `JS` code tabs, and one-click active-tab copying.
- **Flat-File `.txt` + `index.json` Publishing:** Projects, Works, and Media entries are authored as plain `.txt` files paired with a JSON index—parsed client-side (`content-loader.js`) into formatted headings, quotes, lists, inline code, links, and media figures.
- **Web & Print-Ready Resumes:** Dedicated General CV (`Raj_CV_General`) and Front-End Engineering (`Raj_CV_Frontend`) web resumes styled with cross-browser `@page` + `@media print` rules alongside direct static PDF downloads.
- **Zero-Flicker Theming & Live Dateline:** A synchronous pre-paint `<head>` script prevents white flashes between page loads across all 8 Theme × Mode combinations, paired with a 5-minute live newspaper clock and edition badge in the masthead.

---

## Site Map

| Section | Entry Path | Architecture | Purpose |
| :--- | :--- | :--- | :--- |
| **Front Page** | `index.html` | Static HTML + Vanilla JS | Lead story, site directory, and section overview (`Projects`, `Works`, `Media` Under Construction on `main`). |
| **Magazines** *(v2)* | `pages/magazines-index.html` | Barebones Index + Isolated Issues | Directory of self-contained design magazines; opens **Issue 01 — The Newspaper Web Design Magazine**. |
| **Issue 01 Magazine** | `magazines/issue-01-newspaper-web-design/newspaper-design-magazine.html` | Hash-Routed 5-Page SPA | Live interactive documentation & 4-theme × Light/Dark workbench for `nrki-broadsheet-library.css`. |
| **Projects** | `pages/projects.html` → `pages/project-view.html` | Under Construction on `main` / React `<Shelf />` on `dev` | Software builds & interactive tools with dedicated dossier pages. |
| **Works** | `pages/works.html` → `pages/work-view.html` | Under Construction on `main` / React `<Shelf />` on `dev` | Blogs, poems, dev logs, articles, and web art rendered from plain `.txt` files. |
| **Media Ledger** | `pages/media.html` | Under Construction on `main` / React `<Shelf />` on `dev` | Reviews, ratings, and watchlist filtered by shelf, medium, and tags. |
| **About & Resumes** | `pages/about.html` → `pages/resumes/*.html` | Static HTML + Print CSS | Colophon, bio, printable web resumes, and static PDF downloads (`assets/resumes/`). |
| **Master Index & SEO** | `pages/site-index.html` · `sitemap.xml` · `robots.txt` | Searchable HTML Ledger + XML Sitemap | Live keyword/category directory of all pages, resumes, and 32 Issue 01 CSS specimens, paired with canonical/OpenGraph/JSON-LD metadata and XML sitemap for search engines. |

---

## Project Structure

```text
NRKI/
├── index.html                                      # Front page broadsheet
├── pages/
│   ├── magazines-index.html                        # Magazines directory (Issue 01+)
│   ├── projects.html / project-view.html           # Projects page & dynamic reader
│   ├── works.html    / work-view.html              # Works page & dynamic reader
│   ├── media.html                                  # Media reviews & watchlist page
│   ├── about.html                                  # Bio & resume directory
│   └── resumes/
│       ├── general.html                            # General Software Engineering CV
│       └── resume.html                             # Front-End Engineering Resume
├── magazines/
│   └── issue-01-newspaper-web-design/
│       ├── nrki-broadsheet-library.css             # Standalone 4-theme × 2-mode CSS library (@layer, zero !important)
│       ├── broadsheet-magazine-shell.css           # Isolated magazine chrome & specimen workbench CSS
│       ├── newspaper-design-magazine.html          # Issue 01 SPA shell (#intro, #layouts, #elements, #components, #colophon)
│       ├── broadsheet-magazine-viewer.js           # Router, Theme/Mode switchers, code tabs & copy controller
│       └── specimen-catalogs/                      # Layouts (6), Simple Elements (13) & Complex Components (13) catalogs
├── content/                                        # Flat-file JSON index (+ .txt content on `dev`)
├── assets/
│   ├── styles/nrki-broadsheet-library.css          # Core site stylesheet (v2.3.0; mirrors Issue 01 library)
│   ├── scripts/                                    # Masthead clock, 2-axis theme/mode controls, mobile bottom bar & React <Shelf />
│   └── resumes/                                    # Static PDFs (Raj_CV_General.pdf, Raj_CV_Frontend.pdf)
└── Docs: GEMINI.md · MAGAZINES_SPEC.md · SITE_GUIDE.md · CLOUDFLARE_HOSTING_GUIDE.md
```

---

## Branch Workflow & Deployment

NRKI is hosted on **Cloudflare** with a two-branch workflow:

- **`main` (Production — [nrki.in](https://nrki.in)):** Live public site running the v2 `nrki-broadsheet-library.css` token/UI system, **Magazine Issue 01**, generic Home overview, About colophon, and Web/PDF resumes (`Raj_CV_General.pdf` & `Raj_CV_Frontend.pdf`), while `Projects`, `Works`, and `Media` remain Under Construction.
- **`dev` (Development / Staging):** Active development branch housing upcoming features and sample/populated content shelves (`Projects`, `Works`, `Media`) before promotion to `main`.

---

## Running Locally

Zero build tools or `npm install` are required.

- **Recommended (for dynamic `.json` + `.txt` loading):** Open the folder with **VS Code Live Server**, or run:
  ```powershell
  npx serve .
  ```
- **Offline Preview:** Magazine Issue 01 and all resume pages also work directly when opened via `file://` in Chrome, Edge, or Firefox.

---

## Further Documentation

- [`MAGAZINES_SPEC.md`](https://github.com/Ray-D-Zaxe/nrki/blob/main/MAGAZINES_SPEC.md) — Architecture, 4-theme × 2-mode token system, inspirations, and component spec for `nrki-broadsheet-library.css` & Magazine Issue 01.
- [`GEMINI.md`](https://github.com/Ray-D-Zaxe/nrki/blob/main/GEMINI.md) — Engineering standards (zero `!important`, strict descriptive naming, structured rationale comments, and spec synchronization).
- [`SITE_GUIDE.md`](./SITE_GUIDE.md) — Guide to adding new `.txt` + `index.json` entries and formatting syntax.
- [`CLOUDFLARE_HOSTING_GUIDE.md`](./CLOUDFLARE_HOSTING_GUIDE.md) — Deployment guide for Cloudflare, Hostinger DNS (`nrki.in`), future React SPAs, and Cloudflare D1 databases.

---

## Author

**Raj Aryan (NRKI)**  
Software & Front-End Engineer · Himachal Pradesh, India  
[nrki.in](https://nrki.in) · [GitHub](https://github.com/Ray-D-Zaxe) · [LinkedIn](https://www.linkedin.com/in/raj-aryan-zaxe) · [raj@nrki.in](mailto:raj@nrki.in)
