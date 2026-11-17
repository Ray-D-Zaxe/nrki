/**
 * ============================================================================
 * NRKI — CENTRAL SITE DATA STORE (`assets/scripts/data/site-data.js`)
 * ----------------------------------------------------------------------------
 * Production (`main`) branch fallback dataset with empty item collections.
 * ============================================================================
 */

(function (global) {
  const GALLERY_FILTERS = [
    {
      key: "category",
      label: "Board Section",
      options: [
        { value: "all", label: "All Pins" },
        { value: "art", label: "Art & Visuals" },
        { value: "story", label: "Story & Lore" },
        { value: "motif", label: "Motifs & Spaces" },
        { value: "sound", label: "Sound & Mood" },
      ],
    },
  ];

  const GALLERY_ITEMS = [];

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

  const PROJECT_ITEMS = [];

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

  const WORK_ITEMS = [];

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
        { value: "books", label: "Books" },
        { value: "music", label: "Music" },
        { value: "games", label: "Games" },
      ],
    },
  ];

  const MEDIA_ITEMS = [];

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
