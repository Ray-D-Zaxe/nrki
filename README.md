# NRKI — Personal Broadsheet, Portfolio & Standalone CSS System

> **Live Site:** [nrki.in](https://nrki.in) · **Contact:** [raj@nrki.in](mailto:raj@nrki.in)  
> *Pronounced “anarchy” — an independent, newspaper-inspired personal website, publishing archive, and standalone editorial CSS library built with zero build step.*

---

## Overview

**NRKI** combines the visual discipline of a classic printed broadsheet—1px structural hairlines, 3px double masthead rules, and serif/monospace typographic contrast—with modern, zero-bloat web engineering. Instead of hiding behind a heavy framework or boilerplate template, the entire platform runs natively on **semantic HTML5**, **layered CSS custom properties**, **vanilla JavaScript**, and **lightweight React islands**.

### Key Engineering Highlights
- **Standalone 5-Mode Broadsheet CSS Library (`dev`):** [`nrki-broadsheet-library.css`](https://github.com/Ray-D-Zaxe/nrki/blob/dev/magazines/issue-01-newspaper-web-design/nrki-broadsheet-library.css) is an extensible, **zero-`!important`** stylesheet built on 6 native CSS Cascade Layers (`@layer`) and 5 container-scoped `[data-theme]` modes (**Light**, **Dark**, **Accent**, **Faded**, and **UwU**).
- **Interactive Design Magazine (Issue 01):** Replaces the old gallery with a self-contained 4-section specimen book (**Intro & Index**, **11 Simple Elements**, **9 Complex Components**, and **Colophon**) featuring per-specimen 5-mode switching, `HTML` / `CSS` / conditional `JS` code tabs, and one-click active-tab copying.
- **Flat-File `.txt` + `index.json` Publishing:** Projects, Works, and Media entries are authored as plain `.txt` files paired with a JSON index—parsed client-side (`content-loader.js`) into formatted headings, quotes, lists, inline code, links, and media figures.
- **Web & Print-Ready Resumes:** Dedicated General CV (`Raj_CV_General`) and Front-End Engineering (`Raj_CV_Frontend`) web resumes styled with cross-browser `@page` + `@media print` rules alongside direct static PDF downloads.
- **Zero-Flicker Theming & Live Dateline:** A synchronous pre-paint `<head>` script prevents white flashes between page loads in Night Mode, paired with a 5-minute live newspaper clock and edition badge in the masthead.

---

## Site Map

| Section | Entry Path | Architecture | Purpose |
| :--- | :--- | :--- | :--- |
| **Front Page** | `index.html` | Static HTML + Vanilla JS | Lead story, issue directory, and curated section previews. |
| **Magazines** *(v2)* | `pages/magazines-index.html` | Barebones Index + Isolated Issues | Directory of self-contained design magazines; opens **Issue 01 — The Newspaper Web Design Magazine**. |
| **Issue 01 Magazine** | `magazines/issue-01-newspaper-web-design/newspaper-design-magazine.html` | Hash-Routed 4-Page SPA | Live interactive documentation & 5-mode workbench for `nrki-broadsheet-library.css`. |
| **Projects** | `pages/projects.html` → `pages/project-view.html` | React `<Shelf />` + JSON/TXT | Filterable `#tag` project cards linking to dynamic project dossier pages. |
| **Works** | `pages/works.html` → `pages/work-view.html` | React `<Shelf />` + JSON/TXT | Blogs, poems, dev logs, articles, and web art rendered from plain `.txt` files. |
| **Media Ledger** | `pages/media.html` | React `<Shelf />` + JSON/TXT | Reviews, ratings, and watchlist filtered by shelf, medium, and tags. |
| **About & Resumes** | `pages/about.html` → `pages/resumes/*.html` | Static HTML + Print CSS | Colophon, bio, printable web resumes, and static PDF downloads (`assets/resumes/`). |

---

## Project Structure

```text
NRKI/
├── index.html                                      # Front page broadsheet
├── pages/
│   ├── magazines-index.html                        # Magazines directory (Issue 01+)
│   ├── projects.html / project-view.html           # Projects shelf & dynamic reader
│   ├── works.html    / work-view.html              # Works shelf & dynamic reader
│   ├── media.html                                  # Media reviews & watchlist ledger
│   ├── about.html                                  # Bio & resume directory
│   └── resumes/
│       ├── general.html                            # General Software Engineering CV
│       └── resume.html                             # Front-End Engineering Resume
├── magazines/
│   └── issue-01-newspaper-web-design/
│       ├── nrki-broadsheet-library.css             # Standalone 5-mode CSS library (@layer, zero !important)
│       ├── broadsheet-magazine-shell.css           # Isolated magazine chrome & specimen workbench CSS
│       ├── newspaper-design-magazine.html          # Issue 01 SPA shell (#intro, #elements, #components, #colophon)
│       ├── broadsheet-magazine-viewer.js           # Router, 5-mode switcher, code tabs & copy controller
│       └── specimen-catalogs/                      # Simple Elements (11) & Complex Components (9) catalogs
├── content/                                        # Flat-file JSON index + .txt content per section
├── assets/
│   ├── styles/style.css                            # Core site stylesheet (v1)
│   ├── scripts/                                    # Masthead clock, theme toggle, content parser & React <Shelf />
│   └── resumes/                                    # Static PDFs (Raj_CV_General.pdf, Raj_CV_Frontend.pdf)
└── Docs: GEMINI.md · MAGAZINES_SPEC.md · SITE_GUIDE.md · CLOUDFLARE_HOSTING_GUIDE.md
```

---

## Branch Workflow & Deployment

NRKI is hosted on **Cloudflare** with a two-branch workflow:

- **`main` (Production — [nrki.in](https://nrki.in)):** Clean, live public site with your front page, About colophon, and downloadable resumes (`Raj_CV_General.pdf` & `Raj_CV_Frontend.pdf`).
- **`dev` (Development / Staging):** Active development branch for the v2 standalone CSS library, Magazine Issue 01, and full content shelves before promotion to `main`.

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

- [`MAGAZINES_SPEC.md`](https://github.com/Ray-D-Zaxe/nrki/blob/dev/MAGAZINES_SPEC.md) — Architecture, 5-mode token system, inspirations, and component spec for `nrki-broadsheet-library.css` & Magazine Issue 01.
- [`GEMINI.md`](https://github.com/Ray-D-Zaxe/nrki/blob/dev/GEMINI.md) — Engineering standards (zero `!important`, strict descriptive naming, structured rationale comments, and spec synchronization).
- [`SITE_GUIDE.md`](./SITE_GUIDE.md) — Guide to adding new `.txt` + `index.json` entries and formatting syntax.
- [`CLOUDFLARE_HOSTING_GUIDE.md`](./CLOUDFLARE_HOSTING_GUIDE.md) — Deployment guide for Cloudflare, Hostinger DNS (`nrki.in`), future React SPAs, and Cloudflare D1 databases.

---

## Author

**Raj Aryan (NRKI)**  
Software & Front-End Engineer · Himachal Pradesh, India  
[nrki.in](https://nrki.in) · [GitHub](https://github.com/Ray-D-Zaxe) · [LinkedIn](https://www.linkedin.com/in/raj-aryan-zaxe) · [raj@nrki.in](mailto:raj@nrki.in)
