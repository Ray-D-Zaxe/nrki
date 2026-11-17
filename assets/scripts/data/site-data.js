/**
 * ============================================================================
 * NRKI — CENTRAL SITE CONTENT & SHELF DATA (`assets/scripts/data/site-data.js`)
 * ----------------------------------------------------------------------------
 * This file is the single source of truth for all card collections rendered by
 * the React `<Shelf />` component across:
 *   1. Gallery SPA (`pages/gallery.html`) — Art / Story / Inspiration Board
 *   2. Projects Page (`pages/projects.html`) — Tagged cards linking to project pages
 *   3. Works Page (`pages/works.html`) — Tagged cards linking to writing/art pages
 *   4. Media Ledger Page (`pages/media.html`) — Reviews & Watchlist
 *
 * Notice how this file attaches `window.NRKI_DATA = { ... }` so it runs cleanly
 * even if you open the HTML files directly from your computer (`file://`)
 * without needing a web server or bundler!
 * ============================================================================
 */

(function (global) {
  /* ==========================================================================
     1. GALLERY DATA — ART, STORY & INSPIRATION BOARD (`pages/gallery.html`)
     --------------------------------------------------------------------------
     The Gallery is your personal pinboard for art studies, story fragments,
     worldbuilding lore, visual motifs, and ideas that connect to other ideas.
     
     Fields on each Gallery item:
     - `id`: Unique ID (also used in the URL hash, e.g. `#board-01`)
     - `boardNumber`: Pin label shown at the top-left of the card
     - `category` & `categoryLabel`: Filter category (`"art"`, `"story"`, `"motif"`, `"sound"`)
     - `date`: Date or status stamp
     - `title`: Title of the artwork, story concept, or idea
     - `summary`: Brief summary displayed right on the card face
     - `image`: Path to an image (`../assets/...`) or an inline SVG illustration
     - `caption`: Small figure label shown in the corner of the artwork
     - `mainMotif`: `{ label, url }` — Direct external link on the card face
     - `relatedIds`: Array of other board `id`s that connect to this idea!
     - `tags`: Array of `#tag` strings
     - `article`: Array of paragraphs shown in the overlay modal when clicked
     - `inspirations`: Array of `{ title, url, note }` shown inside the overlay
     ========================================================================== */

  const GALLERY_FILTERS = [
    {
      key: "category",
      label: "Board Thread",
      options: [
        { value: "all", label: "All Pins" },
        { value: "story", label: "Story & Lore" },
        { value: "art", label: "Art & Visuals" },
        { value: "motif", label: "Motifs & Spaces" },
        { value: "sound", label: "Sound & Mood" },
      ],
    },
  ];

  const GALLERY_ITEMS = [
    {
      id: "board-01",
      boardNumber: "Pin #01",
      category: "art",
      categoryLabel: "Art & Visuals",
      date: "Autumn Note",
      title: "Herbarium Plates & Pressed Botanical Ink",
      summary:
        "How 19th-century botanical specimen books pair faded Latin marginalia, oxidized brass stamps, and pressed leaves on warm rag paper.",
      image:
        "data:image/svg+xml;utf8," +
        encodeURIComponent(`
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360">
            <rect width="640" height="360" fill="#e8e6dc"/>
            <rect x="28" y="24" width="584" height="312" fill="#f2efe7" stroke="#171b16" stroke-width="2"/>
            <line x1="320" y1="24" x2="320" y2="336" stroke="#848c7e" stroke-width="1" stroke-dasharray="4 4"/>
            <path d="M 170 290 C 170 200, 165 130, 180 70" fill="none" stroke="#2d4f36" stroke-width="3"/>
            <ellipse cx="145" cy="180" rx="34" ry="14" transform="rotate(-28 145 180)" fill="#475e4e" opacity="0.85"/>
            <ellipse cx="205" cy="150" rx="34" ry="14" transform="rotate(25 205 150)" fill="#2d4f36" opacity="0.85"/>
            <ellipse cx="148" cy="120" rx="28" ry="12" transform="rotate(-22 148 120)" fill="#2d4f36" opacity="0.85"/>
            <ellipse cx="180" cy="72" rx="18" ry="28" fill="#6d673b" opacity="0.75"/>
            <rect x="135" y="235" width="75" height="16" transform="rotate(-6 135 235)" fill="#edeacf" stroke="#6d673b"/>
            <text x="52" y="56" font-family="Courier New, monospace" font-size="13" fill="#5d6359">SPECIMEN NO. 14 · ARTEMISIA</text>
            <text x="352" y="78" font-family="Georgia, serif" font-size="22" font-weight="bold" fill="#171b16">Field Notes on Ink</text>
            <line x1="352" y1="96" x2="572" y2="96" stroke="#171b16" stroke-width="1.5"/>
            <line x1="352" y1="124" x2="560" y2="124" stroke="#5d6359" stroke-width="5"/>
            <line x1="352" y1="142" x2="540" y2="142" stroke="#5d6359" stroke-width="5"/>
            <line x1="352" y1="160" x2="552" y2="160" stroke="#5d6359" stroke-width="5"/>
            <rect x="352" y="196" width="216" height="98" fill="#deebe0" stroke="#2d4f36"/>
            <text x="368" y="230" font-family="Georgia, serif" font-style="italic" font-size="14" fill="#171b16">“Paper remembers the weight</text>
            <text x="368" y="252" font-family="Georgia, serif" font-style="italic" font-size="14" fill="#171b16">of whatever was pressed inside.”</text>
          </svg>
        `),
      caption: "Plate I · Pressed specimen & marginalia layout",
      mainMotif: {
        label: "Linnean Society Herbarium Archive",
        url: "https://linnean-online.org/",
      },
      relatedIds: ["board-02", "board-04"],
      tags: ["herbarium", "illustration", "color-study", "archival"],
      article: [
        "Whenever I look at 19th-century botanical herbarium sheets, what strikes me first isn’t just the dried plant specimen—it’s the way the page becomes a collage of time. A single sheet often holds the original collector’s ink label from 1840, a second taxonomist’s pencil correction from 1912, and small strips of linen tape holding the stem in place.",
        "This board collects visual references for that exact feeling: warm fibrous paper (#f2efe7), forest-soot ink, and small stamped index labels. It directly inspired both the color palette of NRKI and the way cards on this Gallery board are pinned together.",
        "In my story notes (see Pin #02 and Pin #05), archivists use these same specimen-mounting habits to catalog found letters and fragments of city lore.",
      ],
      inspirations: [
        {
          title: "The Linnean Society Digital Herbarium",
          url: "https://linnean-online.org/",
          note: "Primary visual motif for paper grain, tape strips, and handwritten taxonomy labels.",
        },
        {
          title: "Ernst Haeckel — Kunstformen der Natur (1904)",
          url: "https://en.wikipedia.org/wiki/Kunstformen_der_Natur",
          note: "Symmetry and fine line-engraving composition studies.",
        },
        {
          title: "The Elements of Typographic Style — Robert Bringhurst",
          url: "https://en.wikipedia.org/wiki/The_Elements_of_Typographic_Style",
          note: "Notes on classical page proportions and marginalia.",
        },
      ],
    },
    {
      id: "board-02",
      boardNumber: "Pin #02",
      category: "story",
      categoryLabel: "Story & Lore",
      date: "Worldbuilding",
      title: "The Sunken Telegraph & Paper Cities",
      summary:
        "A worldbuilding concept: a coastal fog-bound city where digital networks failed decades ago, replaced by pneumatic brass tubes, relay towers, and midnight print editions.",
      image:
        "data:image/svg+xml;utf8," +
        encodeURIComponent(`
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360">
            <rect width="640" height="360" fill="#181d19"/>
            <circle cx="490" cy="88" r="42" fill="#c4b574" opacity="0.22"/>
            <circle cx="490" cy="88" r="24" fill="#c4b574" opacity="0.55"/>
            <rect x="60" y="150" width="75" height="170" fill="#222923" stroke="#7ea383" stroke-width="1.5"/>
            <rect x="155" y="110" width="90" height="210" fill="#222923" stroke="#7ea383" stroke-width="1.5"/>
            <rect x="270" y="175" width="85" height="145" fill="#222923" stroke="#7ea383" stroke-width="1.5"/>
            <polygon points="430,60 405,320 455,320" fill="none" stroke="#c4b574" stroke-width="2"/>
            <line x1="412" y1="140" x2="448" y2="140" stroke="#c4b574" stroke-width="1.5"/>
            <line x1="408" y1="210" x2="452" y2="210" stroke="#c4b574" stroke-width="1.5"/>
            <path d="M 95 150 Q 200 90, 430 65" fill="none" stroke="#8b9484" stroke-width="1.5" stroke-dasharray="5 3"/>
            <path d="M 200 110 Q 315 120, 430 65" fill="none" stroke="#8b9484" stroke-width="1.5" stroke-dasharray="5 3"/>
            <text x="48" y="48" font-family="Courier New, monospace" font-size="14" fill="#c4b574">LORE FRAGMENT 02 · SECTOR IV RELAY</text>
            <line x1="0" y1="320" x2="640" y2="320" stroke="#7ea383" stroke-width="2"/>
          </svg>
        `),
      caption: "Plate II · Relay tower & overhead cable silhouette",
      mainMotif: {
        label: "Italo Calvino — Invisible Cities",
        url: "https://en.wikipedia.org/wiki/Invisible_Cities",
      },
      relatedIds: ["board-01", "board-03", "board-05"],
      tags: ["worldbuilding", "fiction", "retro-futurism", "telegraph"],
      article: [
        "What happens to a modern metropolis if high-frequency wireless spectrum becomes permanently unusable due to atmospheric interference, forcing the city back onto physical wire, pneumatic canisters, and printed broadsheets?",
        "In this story setting, rooftop signalmen string copper lines between brutalist apartment blocks (see Pin #04), while underground presses print four editions a day. Rumors, poems, and encrypted personal messages travel in the margins of the evening shipping forecast.",
        "This world connects directly to the character study in Pin #05 (The Archivist of Unsent Letters) and the shortwave soundscapes in Pin #03.",
      ],
      inspirations: [
        {
          title: "Invisible Cities — Italo Calvino (1972)",
          url: "https://en.wikipedia.org/wiki/Invisible_Cities",
          note: "Poetic vignette structure for describing imaginary urban architecture and memory.",
        },
        {
          title: "Disco Elysium — Revachol Worldbuilding (ZA/UM)",
          url: "https://en.wikipedia.org/wiki/Disco_Elysium",
          note: "Weathered mid-century technology, radiocomputers, and oil-painted coastal fog.",
        },
        {
          title: "19th-Century Paris Pneumatic Post Network",
          url: "https://en.wikipedia.org/wiki/Paris_pneumatic_post",
          note: "Real-world engineering history of pressurized underground message tubes.",
        },
      ],
    },
    {
      id: "board-03",
      boardNumber: "Pin #03",
      category: "sound",
      categoryLabel: "Sound & Mood",
      date: "Audio Study",
      title: "Tape Loops, Rain & Shortwave Number Stations",
      summary:
        "Collecting the sonic textures that fuel my writing and coding sessions: degraded reel-to-reel tape loops, vinyl crackle, and distant shortwave radio chimes.",
      image:
        "data:image/svg+xml;utf8," +
        encodeURIComponent(`
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360">
            <rect width="640" height="360" fill="#dcdecf"/>
            <rect x="36" y="32" width="568" height="296" fill="#f8f7f2" stroke="#171b16" stroke-width="2"/>
            <circle cx="195" cy="175" r="72" fill="#e8e6dc" stroke="#171b16" stroke-width="2.5"/>
            <circle cx="195" cy="175" r="22" fill="#2d4f36"/>
            <circle cx="445" cy="175" r="72" fill="#e8e6dc" stroke="#171b16" stroke-width="2.5"/>
            <circle cx="445" cy="175" r="22" fill="#6d673b"/>
            <line x1="195" y1="103" x2="445" y2="103" stroke="#171b16" stroke-width="2"/>
            <path d="M 195 247 Q 320 295, 445 247" fill="none" stroke="#2d4f36" stroke-width="2.5"/>
            <text x="64" y="68" font-family="Courier New, monospace" font-size="14" font-weight="bold" fill="#171b16">TAPE STUDY 03 · 3.75 IPS SATURATION</text>
            <text x="255" y="180" font-family="Courier New, monospace" font-size="13" fill="#5d6359">LOOP LENGTH: 6.4s</text>
          </svg>
        `),
      caption: "Plate III · Physical tape loop path & splice diagram",
      mainMotif: {
        label: "The Conet Project (Shortwave Recordings)",
        url: "https://en.wikipedia.org/wiki/The_Conet_Project",
      },
      relatedIds: ["board-02", "board-06"],
      tags: ["soundscape", "tape-loops", "ambient", "shortwave"],
      article: [
        "Sound is often the fastest way into a visual or narrative mood. A four-second melody recorded onto worn magnetic tape—slowed down to half speed until the high frequencies dissolve into warm hiss—immediately conjures a sense of half-remembered places.",
        "I keep this board as a reference shelf for both my music production experiments and the atmosphere behind my poems (like 'Static Before the Signal' on the Works page). The recurring motif is imperfect transmission: voices or melodies heard through rain, copper wire, or old paper cones.",
      ],
      inspirations: [
        {
          title: "The Conet Project — Recordings of Shortwave Number Stations",
          url: "https://en.wikipedia.org/wiki/The_Conet_Project",
          note: "Haunting 4-note interval signals and radio static textures.",
        },
        {
          title: "William Basinski — The Disintegration Loops",
          url: "https://en.wikipedia.org/wiki/The_Disintegration_Loops",
          note: "How physical decay on magnetic tape creates evolving rhythmic space.",
        },
        {
          title: "Burial — Untrue (2007)",
          url: "https://en.wikipedia.org/wiki/Untrue_(album)",
          note: "Rain, vinyl noise, and nocturnal urban solitude (see full review on the Media page).",
        },
      ],
    },
    {
      id: "board-04",
      boardNumber: "Pin #04",
      category: "motif",
      categoryLabel: "Motifs & Spaces",
      date: "Visual Motif",
      title: "Monoliths & Moss: Reclaimed Brutalist Geometry",
      summary:
        "The visual contrast between stark, poured-concrete architectural geometry and wild creeping moss, ferns, and lichen.",
      image:
        "data:image/svg+xml;utf8," +
        encodeURIComponent(`
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360">
            <rect width="640" height="360" fill="#e4ebe5"/>
            <polygon points="140,320 190,60 330,60 330,320" fill="#848c7e" stroke="#171b16" stroke-width="2"/>
            <polygon points="330,320 330,110 490,110 520,320" fill="#5d6359" stroke="#171b16" stroke-width="2"/>
            <circle cx="310" cy="210" r="48" fill="#2d4f36" opacity="0.85"/>
            <circle cx="355" cy="245" r="38" fill="#475e4e" opacity="0.9"/>
            <circle cx="265" cy="260" r="32" fill="#2d4f36" opacity="0.9"/>
            <line x1="60" y1="320" x2="580" y2="320" stroke="#171b16" stroke-width="3"/>
            <text x="60" y="48" font-family="Courier New, monospace" font-size="14" fill="#171b16">MOTIF 04 · CONCRETE &amp; BRYOPHYTES</text>
          </svg>
        `),
      caption: "Plate IV · Angular concrete massing vs. organic canopy",
      mainMotif: {
        label: "Tarkovsky's 'The Zone' (Stalker, 1979)",
        url: "https://en.wikipedia.org/wiki/Stalker_(1979_film)",
      },
      relatedIds: ["board-01", "board-02"],
      tags: ["brutalism", "architecture", "botany", "contrast"],
      article: [
        "One of my favorite visual tensions in art, photography, and level design is the meeting point between rigid human-made geometry and unruly plant life. Raw board-formed concrete is cold and mathematical on its own, and forest foliage can feel shapeless on its own—but together, each sharpens the other.",
        "That exact contrast is why NRKI uses sharp, uncompromising 1px newspaper grid lines paired with warm organic moss, sage, and parchment tones.",
      ],
      inspirations: [
        {
          title: "Andrei Tarkovsky — Stalker (1979)",
          url: "https://en.wikipedia.org/wiki/Stalker_(1979_film)",
          note: "Industrial ruins reclaimed by waist-high grass, water, and mist.",
        },
        {
          title: "Spomenik Monument Database (Former Yugoslavia)",
          url: "https://www.spomenikdatabase.org/",
          note: "Sculptural concrete memorials set deep inside mountain forests.",
        },
      ],
    },
    {
      id: "board-05",
      boardNumber: "Pin #05",
      category: "story",
      categoryLabel: "Story & Lore",
      date: "Character Sketch",
      title: "The Archivist of Unsent Letters",
      summary:
        "A story seed about a night-shift postal clerk in the Dead Letter Office who begins noticing that strangers' undeliverable letters are accidentally answering one another.",
      image:
        "data:image/svg+xml;utf8," +
        encodeURIComponent(`
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360">
            <rect width="640" height="360" fill="#f2efe7"/>
            <rect x="80" y="64" width="220" height="140" transform="rotate(-4 190 134)" fill="#f8f7f2" stroke="#171b16" stroke-width="2"/>
            <polyline points="80,64 190,144 300,64" transform="rotate(-4 190 134)" fill="none" stroke="#848c7e" stroke-width="1.5"/>
            <rect x="330" y="130" width="230" height="145" transform="rotate(5 445 202)" fill="#edeacf" stroke="#171b16" stroke-width="2"/>
            <circle cx="445" cy="202" r="18" fill="#6f221b" opacity="0.85"/>
            <line x1="285" y1="135" x2="345" y2="195" stroke="#6f221b" stroke-width="2" stroke-dasharray="4 3"/>
            <text x="64" y="46" font-family="Courier New, monospace" font-size="14" fill="#5d6359">STORY SEED 05 · DEAD LETTER FOLIO</text>
          </svg>
        `),
      caption: "Plate V · Cross-referenced correspondence thread",
      mainMotif: {
        label: "Herman Melville — Bartleby, the Scrivener",
        url: "https://en.wikipedia.org/wiki/Bartleby,_the_Scrivener",
      },
      relatedIds: ["board-01", "board-02", "board-06"],
      tags: ["character", "short-story", "epistolary", "mystery"],
      article: [
        "Every year, thousands of envelopes end up in the Dead Letter Office because the street no longer exists or the ink was washed away by rain. In this short-story outline, an archivist tasked with cataloging unclaimed mail starts pinning them to a wall using herbarium tape (see Pin #01).",
        "Over months, he realizes a question asked in a 1994 postcard from a lighthouse keeper is answered verbatim in an unaddressed 2019 letter found inside a secondhand coat. He begins secretly routing the letters to each other across the city’s pneumatic tubes (Pin #02).",
      ],
      inspirations: [
        {
          title: "Bartleby, the Scrivener — Herman Melville",
          url: "https://en.wikipedia.org/wiki/Bartleby,_the_Scrivener",
          note: "The closing rumor of the Dead Letter Office as a literary motif.",
        },
        {
          title: "Griffin & Sabine — Nick Bantock",
          url: "https://en.wikipedia.org/wiki/Griffin_and_Sabine",
          note: "Tactile epistolary storytelling told through removable postcards and envelopes.",
        },
      ],
    },
    {
      id: "board-06",
      boardNumber: "Pin #06",
      category: "motif",
      categoryLabel: "Motifs & Spaces",
      date: "System Note",
      title: "Zettelkasten & Why Ideas Need Visible Threads",
      summary:
        "Notes on Niklas Luhmann’s slip-box method: why a creative board works better when every note points explicitly to the other notes it argues with or builds upon.",
      image:
        "data:image/svg+xml;utf8," +
        encodeURIComponent(`
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360">
            <rect width="640" height="360" fill="#e8e6dc"/>
            <line x1="160" y1="120" x2="330" y2="95" stroke="#2d4f36" stroke-width="2"/>
            <line x1="330" y1="95" x2="490" y2="160" stroke="#2d4f36" stroke-width="2"/>
            <line x1="160" y1="120" x2="250" y2="250" stroke="#6d673b" stroke-width="2"/>
            <line x1="250" y1="250" x2="490" y2="160" stroke="#6d673b" stroke-width="2" stroke-dasharray="5 3"/>
            <rect x="95" y="85" width="130" height="70" fill="#f8f7f2" stroke="#171b16" stroke-width="2"/>
            <text x="115" y="125" font-family="Courier New, monospace" font-size="13" font-weight="bold" fill="#171b16">PIN #01 · INK</text>
            <rect x="265" y="60" width="130" height="70" fill="#f8f7f2" stroke="#171b16" stroke-width="2"/>
            <text x="285" y="100" font-family="Courier New, monospace" font-size="13" font-weight="bold" fill="#171b16">PIN #02 · CITY</text>
            <rect x="425" y="125" width="130" height="70" fill="#deebe0" stroke="#2d4f36" stroke-width="2"/>
            <text x="445" y="165" font-family="Courier New, monospace" font-size="13" font-weight="bold" fill="#2d4f36">PIN #05 · MAIL</text>
            <rect x="185" y="215" width="130" height="70" fill="#edeacf" stroke="#6d673b" stroke-width="2"/>
            <text x="205" y="255" font-family="Courier New, monospace" font-size="13" font-weight="bold" fill="#6d673b">PIN #03 · TAPE</text>
          </svg>
        `),
      caption: "Plate VI · Cross-linked index cards (Zettelkasten graph)",
      mainMotif: {
        label: "Niklas Luhmann's Zettelkasten Archive",
        url: "https://en.wikipedia.org/wiki/Zettelkasten",
      },
      relatedIds: ["board-03", "board-05"],
      tags: ["zettelkasten", "knowledge-graph", "process", "notes"],
      article: [
        "When we store ideas in strict hierarchical folders, an architectural photo never bumps into a poem or a synthesizer schematic. In a traditional slip-box (Zettelkasten) or an investigation pinboard, the magic is in the cross-references.",
        "That’s why every card on this Gallery board includes a 'Connects To' row (`relatedIds` in `site-data.js`). Clicking any connected chip jumps straight to that sister idea so you can trace a creative thread across art, story lore, and sound.",
      ],
      inspirations: [
        {
          title: "Niklas Luhmann — Communicating with Slip Boxes",
          url: "https://en.wikipedia.org/wiki/Zettelkasten",
          note: "Numbered index cards linked by explicit branching IDs.",
        },
        {
          title: "Aby Warburg — Mnemosyne Atlas",
          url: "https://warburg.sas.ac.uk/archive/bilderatlas-mnemosyne",
          note: "Black-cloth pinboards arranging art-history motifs by visual resonance rather than chronology.",
        },
      ],
    },
  ];

  /* ==========================================================================
     2. PROJECTS DATA (`pages/projects.html` — Non-SPA Card Links)
     ========================================================================== */

  const PROJECT_FILTERS = [
    {
      key: "status",
      label: "Status",
      options: [
        { value: "all", label: "All Projects" },
        { value: "active", label: "Active" },
        { value: "shipped", label: "Shipped" },
        { value: "prototype", label: "Prototype" },
      ],
    },
  ];

  const PROJECT_ITEMS = [
    {
      id: "nrki-engine",
      projectNumber: "Project 01",
      status: "active",
      statusLabel: "Active",
      badgeVariant: "badge--accent",
      title: "NRKI Broadsheet & Publishing Engine",
      summary:
        "The source architecture behind this personal site: a botanical newsprint CSS token system, printable web resumes, and a flat-file JSON + TXT content workflow running with zero build step.",
      notes: `The source architecture behind this personal site: a botanical newsprint CSS token system, printable web resumes, and a flat-file JSON + TXT content workflow running with zero build step.

NRKI is a personal publishing system designed around a simple premise: a personal website should feel as durable, legible, and self-contained as a printed broadsheet newspaper, while remaining flexible enough to host interactive React micro-apps where needed.

## 1. Design Goals & Philosophy
- Zero-bloat foundation: Semantic HTML5 landmarks, fluid CSS Grid typography, and plain JavaScript + local React that run without requiring a complex bundler.
- Flat-file JSON + TXT Content: Every collection tab (Gallery, Projects, Works, Media) reads its metadata from a single index.json file and its body copy from plain .txt files.
- Botanical Newsprint Palette: Custom CSS variables in assets/styles/style.css model warm dried-sage newsprint in light mode and reversed pine-charcoal ink in dark mode, with an inline head script that eliminates any white flicker between page loads.
- Web + Print/PDF Resumes: Dedicated resume pages include a custom @media print stylesheet so clicking Print / Save as PDF outputs a crisp A4/Letter CV.

## 2. How New Content Is Added
To publish a new project, work, gallery pin, or media review, you never have to touch an HTML or JS file. Simply drop a new .txt file into the corresponding content/ folder and register its metadata in that folder's index.json.`,
      tags: ["html5", "css-tokens", "javascript", "print-css"],
      href: "./project-view.html?id=nrki-engine",
      links: [
        { label: "GitHub Repository ↗", url: "https://github.com/your-handle/nrki", primary: true },
        { label: "Live Front Page ↗", url: "../index.html", primary: false },
        { label: "Printable CV Demo ↗", url: "./about.html#resumes", primary: false },
      ],
    },
    {
      id: "react-shelf-system",
      projectNumber: "Project 02",
      status: "shipped",
      statusLabel: "Shipped",
      badgeVariant: "badge--gold",
      title: "Declarative React <Shelf /> & Pinboard SPA",
      summary:
        "A reusable collection & multi-facet filter component in React that powers the Gallery Pinboard SPA, Projects index, Works archive, and Media Ledger from plain .json and .txt files.",
      notes: `A reusable collection & multi-facet filter component in React that powers the Gallery Pinboard SPA, Projects index, Works archive, and Media Ledger from plain .json and .txt files.

Originally designed for the Media Ledger page, <Shelf /> (assets/scripts/components/Shelf.js) was extracted into a reusable React component that now powers all four collection pages across NRKI: Gallery, Projects, Works, and Media.

## 1. How <Shelf /> Works
The component accepts a declarative filters configuration array, an items dataset loaded from index.json + .txt files, and a custom renderCard function. It automatically extracts every unique #tag from the items to build an interactive tag filter bar alongside the primary category/status filters.

## 2. The Gallery Pinboard SPA Overlay
On pages/gallery.html, assets/scripts/gallery-spa.js wraps the <Shelf /> component inside a stateful Single-Page Application. Each card renders its visual study, the opening summary paragraph from its .txt file, connected board pins, and an external link to the primary motif. Clicking the card opens an accessible modal overlay containing the full essay from the .txt file and a curated list of all inspirations and motifs.`,
      tags: ["react", "spa", "zettelkasten", "json-txt-cms"],
      href: "./project-view.html?id=react-shelf-system",
      links: [
        { label: "GitHub Source ↗", url: "https://github.com/your-handle/nrki", primary: true },
        { label: "Open Gallery Pinboard SPA ↗", url: "./gallery.html", primary: false },
        { label: "View Media Shelf ↗", url: "./media.html", primary: false },
      ],
    },
  ];

  /* ==========================================================================
     3. WORKS DATA (`pages/works.html` — Non-SPA Card Links)
     ========================================================================== */

  const WORK_FILTERS = [
    {
      key: "category",
      label: "Format",
      options: [
        { value: "all", label: "All Works" },
        { value: "blog", label: "Blogs" },
        { value: "poem", label: "Poems" },
        { value: "devlog", label: "Dev Logs" },
        { value: "article", label: "Articles" },
        { value: "webart", label: "Web Art" },
      ],
    },
  ];

  const WORK_ITEMS = [
    {
      id: "sample-post",
      category: "devlog",
      categoryLabel: "Dev Log",
      date: "Nov 5, 2026",
      readTime: "4 min read",
      title: "Building NRKI: Plain HTML, CSS, React Islands & Flat-File TXT",
      summary:
        "Notes on designing a newspaper-inspired personal site where every entry is stored as a simple plain-text file paired with a JSON index.",
      notes: `Notes on designing a newspaper-inspired personal site where every entry is stored as a simple plain-text file paired with a JSON index.

> “Keep the foundation as simple and durable as newsprint; add interactivity only where it earns its place.”

## 1. Why Plain Text + JSON Index?
Writing a new blog post, poem, project log, or media review shouldn't require copying HTML boilerplate or fighting a database. In NRKI, each of the four main shelves (Gallery, Projects, Works, and Media) has its own subfolder inside content/ containing an index.json lookup file and one .txt file per entry.

## 2. How the Text Parser Formats Your Writing
The first paragraph of any .txt file automatically serves as the summary teaser on the Shelf card! When a reader opens the full piece, the remaining paragraphs are formatted into clean broadsheet typography:
- Blank lines separate standard paragraphs.
- Lines starting with ## become section subheadings.
- Lines starting with > become inset editorial pull-quotes.
- Lines starting with - become bulleted lists.`,
      tags: ["architecture", "flat-file", "react-islands", "devlog"],
      href: "./work-view.html?id=sample-post",
    },
    {
      id: "broadsheet-typography",
      category: "article",
      categoryLabel: "Article",
      date: "Nov 1, 2026",
      readTime: "6 min read",
      title: "On Minimalist Web Typography & Newsprint Grids",
      summary:
        "How classical broadsheet rules, serif proportions, and botanical ink contrast make long-form technical and creative writing a pleasure to read.",
      notes: `How classical broadsheet rules, serif proportions, and botanical ink contrast make long-form technical and creative writing a pleasure to read.

> “Typography exists to honor content.” — Robert Bringhurst

## 1. Structural Rules Over Drop Shadows
Print newspapers evolved over centuries to solve one problem exceptionally well: guiding a reader’s eye across dozens of competing stories, notes, and indexes without exhausting their attention. Instead of floating cards with heavy blurred shadows, a broadsheet grid uses crisp 1px solid hairlines and 3px double section dividers.

## 2. Pairing Serif Prose with Monospace Datelines
Long-form essays and poems read comfortably in a traditional serif (Georgia, Baskerville) constrained to roughly 60–70 characters per line (43rem). Meanwhile, metadata—dates, time zones, category stamps, filter buttons, and navigation—stays crisp when set in small, tracked-out uppercase sans-serif or monospace type.`,
      tags: ["typography", "editorial", "design-systems", "css"],
      href: "./work-view.html?id=broadsheet-typography",
    },
    {
      id: "static-before-signal",
      category: "poem",
      categoryLabel: "Poem",
      date: "Oct 18, 2026",
      readTime: "2 min read",
      title: "Static Before the Signal",
      summary:
        "A short poem on late-night terminals, warm paper margins, copper wire, and the quiet hours before a build compiles.",
      notes: `A short poem on late-night terminals, warm paper margins, copper wire, and the quiet hours before a build compiles.

Between the keystroke and the rendered line,
a quiet hum of copper in the wall—
the cursor blinks like lighthouse pine
against the paper’s margin call.

We file our notes in folders named for rain,
we tune the dial past midnight’s amber hiss;
whatever breaks the pattern of the grain
begins inside a silence small as this.`,
      tags: ["poetry", "verse", "nocturne", "signal"],
      href: "./work-view.html?id=static-before-signal",
    },
    {
      id: "dummy-poem",
      category: "poem",
      categoryLabel: "Poem",
      date: "Nov 5, 2026",
      readTime: "5 min read",
      title: "Dummy Poem",
      summary: "This is a duumy poem, and this is on a new line.",
      notes: `This is a duumy poem,
and this is on a new line.
For this line I used shift.
> Here is a quote
- Here is a bullet list
**bold text**
*italic text*
\`code or is it?\`
[Lil Peep Link](https://music.youtube.com/search?q=lil+peep)
![Alt text for the image]("C:\\Users\\raydr\\OneDrive\\Pictures\\trsh1.png")
[label for the audio]("C:\\Users\\raydr\\Data\\AData\\AudioBooks\\The Beginning After The End Vol 1-2\\1-2.mp3")
[label for video]("C:\\Users\\raydr\\Data\\Desktop_prev\\Downloads_fold\\videoplayback (2).mp4")`,
      tags: ["poem", "dummy"],
      href: "./work-view.html?id=dummy-poem",
    },
  ];

  /* ==========================================================================
     4. MEDIA LEDGER DATA (`pages/media.html`)
     ========================================================================== */

  const MEDIA_FILTERS = [
    {
      key: "shelf",
      label: "Shelf",
      options: [
        { value: "all", label: "All Entries" },
        { value: "review", label: "Reviews" },
        { value: "watchlist", label: "Watchlist & Queue" },
      ],
    },
    {
      key: "medium",
      label: "Medium",
      options: [
        { value: "all", label: "All" },
        { value: "screen", label: "Film & TV" },
        { value: "book", label: "Books" },
        { value: "music", label: "Music" },
        { value: "game", label: "Games" },
      ],
    },
  ];

  const MEDIA_ITEMS = [
    {
      id: "media-stalker",
      shelf: "review",
      medium: "screen",
      badgeLabel: "Review · Film",
      badgeVariant: "badge--accent",
      title: "Stalker (1979)",
      creator: "Dir. Andrei Tarkovsky",
      ratingOrStatus: "9.5 / 10",
      isRating: true,
      notes:
        "Slow, tactile, and hypnotic. Every frame feels weathered like old newsprint and moss—a masterclass in atmosphere, pacing, and philosophical tension.",
      tags: ["cinema", "sci-fi", "tarkovsky", "essential"],
      footerLeft: "Status: Completed",
      footerRight: "Rewatch worthy",
    },
    {
      id: "media-untrue",
      shelf: "review",
      medium: "music",
      badgeLabel: "Review · Album",
      badgeVariant: "badge--accent",
      title: "Untrue (2007)",
      creator: "Burial",
      ratingOrStatus: "10 / 10",
      isRating: true,
      notes:
        "Vinyl crackle, distant two-step percussion, and nocturnal London rain. Still the gold standard for texture and emotional minimalism in electronic music.",
      tags: ["electronic", "uk-garage", "ambient", "album"],
      footerLeft: "Status: Heavy Rotation",
      footerRight: "Essential",
    },
    {
      id: "media-disco",
      shelf: "review",
      medium: "game",
      badgeLabel: "Review · Game",
      badgeVariant: "badge--accent",
      title: "Disco Elysium",
      creator: "ZA/UM",
      ratingOrStatus: "9.8 / 10",
      isRating: true,
      notes:
        "Proof that typography, sharp prose, and tabletop roleplay mechanics can hit harder than any high-budget action spectacle.",
      tags: ["crpg", "narrative", "art-direction", "pc"],
      footerLeft: "Status: Completed",
      footerRight: "CRPG / Narrative",
    },
    {
      id: "media-lain",
      shelf: "watchlist",
      medium: "screen",
      badgeLabel: "Watchlist · Series",
      badgeVariant: "badge--gold",
      title: "Serial Experiments Lain",
      creator: "Dir. Ryutaro Nakamura (1998)",
      ratingOrStatus: "Up Next",
      isRating: false,
      notes:
        "Early-web paranoia, CRT hum, and identity on the Wired. Queued up for a weekend watch-through.",
      tags: ["anime", "cyberpunk", "1990s", "queue"],
      footerLeft: "Queue: High Priority",
      footerRight: "13 Episodes",
    },
    {
      id: "media-bringhurst",
      shelf: "watchlist",
      medium: "book",
      badgeLabel: "Reading List · Book",
      badgeVariant: "badge--gold",
      title: "The Elements of Typographic Style",
      creator: "Robert Bringhurst",
      ratingOrStatus: "Reading Now",
      isRating: false,
      notes:
        "Working through the chapters on page proportions, rhythm, and historical letterpress conventions to refine this site’s layout.",
      tags: ["typography", "design", "non-fiction", "reading"],
      footerLeft: "Queue: In Progress",
      footerRight: "Design & Print",
    },
    {
      id: "media-perfect-days",
      shelf: "watchlist",
      medium: "screen",
      badgeLabel: "Watchlist · Film",
      badgeVariant: "badge--gold",
      title: "Perfect Days (2023)",
      creator: "Dir. Wim Wenders",
      ratingOrStatus: "Queued",
      isRating: false,
      notes:
        "Recommended for its quiet attention to daily ritual, analog cassettes, and sunlight filtering through trees.",
      tags: ["cinema", "slice-of-life", "tokyo", "queue"],
      footerLeft: "Queue: Watchlist",
      footerRight: "124 min",
    },
  ];

  // Expose globally so scripts work on both `file://` and `http://`
  global.NRKI_DATA = {
    GALLERY_FILTERS,
    GALLERY_ITEMS,
    PROJECT_FILTERS,
    PROJECT_ITEMS,
    WORK_FILTERS,
    WORK_ITEMS,
    MEDIA_FILTERS,
    MEDIA_ITEMS,
  };
})(window);
