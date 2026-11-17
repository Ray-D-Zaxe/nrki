# NRKI — Personal Broadsheet & Portfolio

**NRKI** (pronounced *anarchy*) is a minimalist, newspaper-inspired personal website built with semantic **HTML5**, **CSS Custom Properties**, **ES Modules**, and **React 18** (`<Shelf />` component & Gallery SPA).


---
## Quick Overview of Pages

| Page | Path | Architecture | Description |
| :--- | :--- | :--- | :--- |
| **Front Page** | `index.html` | Static HTML + ES Module | Lead story, "In this issue" index, and previews of Gallery, Projects, and Works |
| **Gallery** | `pages/gallery.html` | **React SPA** (`gallery-spa.js` + `Shelf.js`) | Cards show media, brief summary, tags & main motif link; clicking a card opens an overlay article with all inspirations & motifs |
| **Projects** | `pages/projects.html` | Static HTML + **React `<Shelf />`** | Filterable tagged project cards that link to dedicated project dossier pages (`pages/projects/*.html`) with GitHub & demo links |
| **Works** | `pages/works.html` | Static HTML + **React `<Shelf />`** | Filterable tagged cards for Blogs, Poems, Dev Logs, Articles & Web Art linking to full reading pages (`pages/works/*.html`) |
| **Media Ledger** | `pages/media.html` | Static HTML + **React `<Shelf />`** | Reviews, ratings, and Watchlist filtered by Shelf, Medium, and Tags |
| **About & CV** | `pages/about.html` | Static HTML + Print CSS | Bio & multi-track Resume Directory with both Web Views (`pages/resumes/*.html`) and static PDF downloads (`assets/resumes/`) |
