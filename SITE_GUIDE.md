# NRKI — Complete Site Owner's Guide (`SITE_GUIDE.md`)

Welcome to the handbook for **NRKI**. This guide explains how every file in your website connects and shows you how to add new entries to **Gallery**, **Projects**, **Works**, and **Media** by simply adding a `.txt` file and updating its `.json` index.

---

## 1. Site Map & File Tree

```text
NRKI AG/
├── index.html                           # Front Page (Masthead, Lead Story, section previews)
├── SITE_GUIDE.md                        # Complete guide to editing & extending the site (this file)
├── README.md                            # Quick project overview
│
├── content/                             # FLAT-FILE CONTENT DATABASE (JSON Index + .txt Files)
│   ├── gallery/
│   │   ├── index.json                   # Metadata & motif index for the Gallery Pinboard
│   │   ├── board-01.txt                 # Summary + overlay article for Pin #01
│   │   ├── board-02.txt                 # Summary + overlay article for Pin #02
│   │   └── ...                          # (board-03.txt through board-06.txt)
│   ├── projects/
│   │   ├── index.json                   # Metadata & repo links for Projects
│   │   ├── nrki-engine.txt              # Summary + full project write-up for Project 01
│   │   └── react-shelf-system.txt       # Summary + full project write-up for Project 02
│   ├── works/
│   │   ├── index.json                   # Metadata for Works (Blogs, Poems, Dev Logs, Articles)
│   │   ├── sample-post.txt              # Summary + full dev log post
│   │   ├── broadsheet-typography.txt    # Summary + full typography article
│   │   └── static-before-signal.txt     # Summary + full poem stanzas
│   └── media/
│       ├── index.json                   # Metadata & ratings for Media Reviews & Watchlist
│       ├── media-stalker.txt            # Review notes for Stalker
│       └── ...                          # (One .txt file per media item)
│
├── assets/
│   ├── styles/
│   │   └── style.css                    # All CSS: Light/Dark tokens, full-width shelf, pinboard & print rules
│   ├── scripts/
│   │   ├── main.js                      # Live 5-min masthead clock, theme toggle & Print-to-PDF
│   │   ├── content-loader.js            # Loads `content/<tab>/index.json` + `.txt` files & parses text blocks
│   │   ├── entry-view.js                # Renders individual Project & Work pages from JSON + TXT
│   │   ├── vendor/
│   │   │   └── react-local.js           # Lightweight local React runtime
│   │   ├── components/
│   │   │   └── Shelf.js                 # Full-width React <Shelf /> component (filters, tags & grid)
│   │   ├── gallery-spa.js               # Gallery Pinboard SPA (mounts <Shelf /> + Connected-Idea Overlay)
│   │   └── shelf-pages.js               # Mounts <Shelf /> onto Projects, Works & Media pages
│   └── resumes/
│       └── README.md                    # Folder where you place downloadable static PDF resumes
│
└── pages/
    ├── gallery.html                     # 01 / Gallery (Art, Story & Connected-Idea Board — React SPA)
    ├── projects.html                    # 02 / Projects (Full-width Shelf of tagged cards)
    ├── project-view.html                # Dynamic reader page for any Project (`?id=<project-id>`)
    ├── works.html                       # 03 / Works (Full-width Shelf of tagged cards)
    ├── work-view.html                   # Dynamic reader page for any Work (`?id=<work-id>`)
    ├── media.html                       # 04 / Media Ledger (Full-width Shelf of Reviews & Watchlist)
    ├── about.html                       # 05 / About & Resume Directory (Web & PDF resume links)
    └── resumes/                         # Printable Web Resume Pages
        ├── general.html                 # 01: General CV
        └── resume.html                  # 02: Front-End Engineering Resume
```

---

## 2. How the JSON + TXT Content System Works

Each of the four tabs (`gallery`, `projects`, `works`, and `media`) has its own folder inside `content/` containing:
1. **`index.json`**: Holds the filter options and an `"items"` array with the card's metadata (`id`, `title`, `tags`, etc.) and `"textFile": "your-file.txt"`.
2. **`your-file.txt`**: A plain text file containing the prose for that entry.

### How Plain `.txt` Files Are Formatted (`assets/scripts/content-loader.js`)
When you write a `.txt` file inside `content/gallery/`, `content/projects/`, or `content/works/`, `parsePlainTextContent()` formats both block-level structures and inline Markdown/media embeds automatically across **`project-view.html`**, **`work-view.html`**, and the **Gallery Pinboard modal overlay**:

- **Card Summary**: The first 1–2 lines of the opening paragraph (stripped of Markdown syntax) automatically become the summary teaser on the Shelf card!
- **Line Breaks & Paragraphs**:
  - Single newline (`Enter` / `Shift+Enter`) inside a paragraph or stanza is preserved as a line break (`<br>`).
  - A blank line starts a new paragraph (`<p>`).
- **Block Formatting** (works even without blank lines separating them):
  - `# Heading`, `## Heading` → Section heading (`<h2>`)
  - `### Subheading` → Subsection heading (`<h3>`)
  - `> Here is a quote` → Inset editorial pull-quote (`<blockquote>`)
  - `- Here is a bullet list` (or `* item`) → Bulleted list (`<ul><li>`)
  - `1. Numbered item` → Ordered list (`<ol><li>`)
  - Triple backticks (` ``` `) → Preformatted code block (`<pre><code>`)
- **Inline Formatting** (works inside paragraphs, quotes, lists, and headings):
  - `**bold text**` → **bold text** (`<strong>`)
  - `*italic text*` → *italic text* (`<em>`)
  - `` `code or is it?` `` → `inline code` (`<code>`)
  - `[Link Label](https://example.com)` → Clickable hyperlink (`<a target="_blank">`)
- **Media Embeds** (standalone line; supports web URLs, relative paths, and quoted Windows paths with spaces or parentheses):
  - **Image**: `![Alt text for the image]("C:\path\to\image.png")` (or `[Label]("path.jpg")`) → Framed figure (`<figure><img /><figcaption /></figure>`)
  - **Audio**: `[label for the audio]("C:\path\to\track.mp3")` (supports `.mp3`, `.wav`, `.ogg`, `.flac`, `.m4a`, `.aac`) → Audio player (`<audio controls>`) + caption
  - **Video**: `[label for video]("C:\path\to\video (2).mp4")` (supports `.mp4`, `.webm`, `.mkv`, `.mov`, `.ogv`) → Video player (`<video controls>`) + caption
- For `content/media/*.txt`, the `.txt` file is displayed as the review or watchlist note on the Media card.

> **Note on Local Previewing**: To let the browser fetch `.json` and `.txt` files dynamically, open the project using **VS Code Live Server** (or `npx serve .` / `python -m http.server`).

---

## 3. Adding New Entries (Only 2 Steps: Add `.txt` + Update `index.json`)

### A. Adding a New Gallery Pin (`content/gallery/`)
1. **Create `content/gallery/board-07.txt`**:
   ```text
   Brief 1-2 sentence summary shown on the front of the pinned card.

   First paragraph of the overlay article exploring the artwork, story fragment, or idea in depth.

   Second paragraph explaining how this motif connects to other pins on your board.
   ```
2. **Add an entry to `"items"` in `content/gallery/index.json`**:
   ```json
   {
     "id": "board-07",
     "boardNumber": "Pin #07",
     "category": "story",
     "categoryLabel": "Story & Lore",
     "date": "Winter Note",
     "title": "Title of Your Art, Story, or Idea",
     "textFile": "board-07.txt",
     "image": "../assets/images/my-art.jpg",
     "caption": "Plate VII · Short image caption",
     "mainMotif": {
       "label": "Name of Primary Inspiration",
       "url": "https://example.com"
     },
     "relatedIds": ["board-02", "board-05"],
     "tags": ["worldbuilding", "sketch", "lore"],
     "inspirations": [
       {
         "title": "Primary Source or Motif",
         "url": "https://example.com",
         "note": "Why this reference inspired the piece."
       }
     ]
   }
   ```

---

### B. Adding a New Project (`content/projects/`)
You do **not** need to create a new HTML file—`pages/project-view.html?id=<id>` renders the full project page automatically!

1. **Create `content/projects/my-synth.txt`**:
   ```text
   One-paragraph summary shown on the Projects Shelf card and at the top of the project page.

   ## 1. Overview & Motivation
   Explain what the project does and why you built it.

   ## 2. Technical Architecture
   - Built with Web Audio API and TypeScript
   - Zero external runtime dependencies
   ```
2. **Add an entry to `"items"` in `content/projects/index.json`**:
   ```json
   {
     "id": "my-synth",
     "projectNumber": "Project 03",
     "status": "active",
     "statusLabel": "Active",
     "badgeVariant": "badge--accent",
     "title": "Modular Web Audio Synthesizer",
     "textFile": "my-synth.txt",
     "tags": ["web-audio", "typescript", "dsp"],
     "links": [
       { "label": "GitHub Repository ↗", "url": "https://github.com/your-handle/my-synth", "primary": true },
       { "label": "Live Demo ↗", "url": "https://example.com/demo", "primary": false }
     ]
   }
   ```

---

### C. Adding a New Work — Blog, Poem, Dev Log, Article, or Web Art (`content/works/`)
Just like Projects, `pages/work-view.html?id=<id>` renders the dedicated reading page automatically from your `.txt` file!

1. **Create `content/works/my-new-essay.txt`**:
   ```text
   One-sentence summary teaser shown on the Works Shelf card.

   > “An optional pull-quote at the start of the essay.”

   ## 1. First Section Heading
   Write your paragraphs naturally separated by blank lines.
   ```
2. **Add an entry to `"items"` in `content/works/index.json`**:
   ```json
   {
     "id": "my-new-essay",
     "category": "blog",
     "categoryLabel": "Blog",
     "date": "Nov 12, 2026",
     "readTime": "5 min read",
     "title": "Title of Your Blog Post, Poem, or Article",
     "textFile": "my-new-essay.txt",
     "tags": ["essay", "notes", "design"]
   }
   ```
   *(Tip: If you set `"category": "poem"`, stanza line breaks inside your `.txt` file are automatically preserved in italic verse styling!)*

---

### D. Adding a New Media Review or Watchlist Item (`content/media/`)
1. **Create `content/media/media-blade-runner.txt`**:
   ```text
   Your review thoughts, rating breakdown, or watchlist notes for this title.
   ```
2. **Add an entry to `"items"` in `content/media/index.json`**:
   ```json
   {
     "id": "media-blade-runner",
     "shelf": "review",
     "medium": "screen",
     "badgeLabel": "Review · Film",
     "badgeVariant": "badge--accent",
     "title": "Blade Runner (1982)",
     "creator": "Dir. Ridley Scott",
     "ratingOrStatus": "9.4 / 10",
     "isRating": true,
     "textFile": "media-blade-runner.txt",
     "tags": ["cinema", "sci-fi", "vangelis"],
     "footerLeft": "Status: Completed",
     "footerRight": "Final Cut"
   }
   ```
   *(For a Watchlist item, set `"shelf": "watchlist"`, `"badgeVariant": "badge--gold"`, `"ratingOrStatus": "Up Next"`, and `"isRating": false`.)*

---

## 4. How Flicker-Free Night Mode & Masthead Time Work

- **Zero-Flicker Night Mode**: Every HTML page includes a tiny synchronous `<script>` at the top of `<head>` before `style.css` loads. It reads `localStorage.getItem("nrki-theme")` and sets `data-theme="dark"` on `<html>` before the browser paints a single pixel, eliminating any white flash when navigating between pages.
- **5-Minute Newspaper Clock**: `initMastheadDateline()` in `assets/scripts/main.js` populates the current date, local 24h time, time zone (`UTC±HH:MM`), and edition badge (`Morning` / `Afternoon` / `Evening` / `Late Night`), refreshing automatically every 5 minutes.

---

## 5. Hosting, Custom Domain, Future SPAs & Databases

See [`CLOUDFLARE_HOSTING_GUIDE.md`](./CLOUDFLARE_HOSTING_GUIDE.md) for the complete step-by-step walkthrough on:
1. Pushing NRKI to GitHub and deploying for free on **Cloudflare Pages**.
2. Connecting your **GoDaddy domain** (`yourdomain.com`) to Cloudflare DNS.
3. Adding **future React SPAs** on free custom subdomains (`app.yourdomain.com`) or subpaths.
4. Creating and querying free serverless SQLite databases using **Cloudflare D1** and **Pages Functions**.
