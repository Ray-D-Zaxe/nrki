/**
 * ============================================================================
 * NRKI — SHELF ISLAND MOUNTER (`assets/scripts/shelf-pages.js`)
 * ----------------------------------------------------------------------------
 * Loads `content/<tab>/index.json` + plain `.txt` files via `NRKIContentLoader`
 * and mounts the shared React `<Shelf />` component onto:
 *   - `pages/projects.html` (`data-shelf-page="projects"`)
 *   - `pages/works.html`    (`data-shelf-page="works"`)
 *   - `pages/media.html`    (`data-shelf-page="media"`)
 * ============================================================================
 */

(function (global) {
  const React = global.React;
  const { createElement: h } = React;
  const { createRoot } = global.ReactDOMClient;
  const Shelf = global.NRKIShelf;
  const { loadTabCollection } = global.NRKIContentLoader;

  /**
   * Normalizes legacy badge tokens (`badge--accent`, `badge--gold`) and v2
   * tokens (`nrki-badge-*`) into broadsheet `.nrki-badge` class names so
   * existing content files render seamlessly alongside new entries.
   *
   * @param {string} rawBadgeVariant
   * @returns {string}
   */
  function resolveBadgeClassName(rawBadgeVariant) {
    if (!rawBadgeVariant) return "nrki-badge";
    if (
      rawBadgeVariant === "badge--accent" ||
      rawBadgeVariant === "nrki-badge-accent"
    ) {
      return "nrki-badge nrki-badge-accent";
    }
    if (
      rawBadgeVariant === "badge--gold" ||
      rawBadgeVariant === "nrki-badge-highlight"
    ) {
      return "nrki-badge nrki-badge-highlight";
    }
    if (rawBadgeVariant.startsWith("nrki-badge-")) {
      return `nrki-badge ${rawBadgeVariant}`;
    }
    return "nrki-badge";
  }

  /**
   * 1. PROJECT CARD RENDERER (Full clickable `<a>` card with tags)
   */
  function renderProjectCard(projectRecord) {
    return h(
      "a",
      {
        key: projectRecord.id,
        href: `./project-view.html?id=${encodeURIComponent(projectRecord.id)}`,
        className: "nrki-card nrki-card-link",
      },
      h(
        "div",
        null,
        h(
          "div",
          { className: "nrki-card-meta" },
          h("span", null, projectRecord.projectNumber),
          h(
            "span",
            { className: resolveBadgeClassName(projectRecord.badgeVariant) },
            projectRecord.statusLabel
          )
        ),
        h("h3", null, projectRecord.title),
        h("p", null, projectRecord.summary),
        Array.isArray(projectRecord.tags) && projectRecord.tags.length > 0
          ? h(
              "ul",
              { className: "nrki-tag-pills", "aria-label": "Project tags" },
              projectRecord.tags.map((tagLabel) =>
                h(
                  "li",
                  { key: tagLabel, className: "nrki-tag-pill" },
                  `#${tagLabel}`
                )
              )
            )
          : null
      ),
      h(
        "div",
        { className: "nrki-card-footer" },
        h("span", null, "Project page & GitHub links"),
        h(
          "span",
          { className: "nrki-text-link", style: { margin: 0 } },
          "Explore project →"
        )
      )
    );
  }

  /**
   * 2. WORK CARD RENDERER (Full clickable `<a>` card with tags)
   */
  function renderWorkCard(workRecord) {
    return h(
      "a",
      {
        key: workRecord.id,
        href: `./work-view.html?id=${encodeURIComponent(workRecord.id)}`,
        className: "nrki-card nrki-card-link",
      },
      h(
        "div",
        null,
        h(
          "div",
          { className: "nrki-card-meta" },
          h(
            "span",
            { className: "nrki-badge nrki-badge-accent" },
            workRecord.categoryLabel
          ),
          h("span", null, `${workRecord.date} · ${workRecord.readTime}`)
        ),
        h("h3", null, workRecord.title),
        h("p", null, workRecord.summary),
        Array.isArray(workRecord.tags) && workRecord.tags.length > 0
          ? h(
              "ul",
              { className: "nrki-tag-pills", "aria-label": "Work tags" },
              workRecord.tags.map((tagLabel) =>
                h(
                  "li",
                  { key: tagLabel, className: "nrki-tag-pill" },
                  `#${tagLabel}`
                )
              )
            )
          : null
      ),
      h(
        "div",
        { className: "nrki-card-footer" },
        h("span", null, `Format: ${workRecord.categoryLabel}`),
        h(
          "span",
          { className: "nrki-text-link", style: { margin: 0 } },
          "Read piece →"
        )
      )
    );
  }

  /**
   * 3. MEDIA CARD RENDERER (Review or Watchlist entry with rating/status & tags)
   */
  function renderMediaCard(mediaRecord) {
    return h(
      "article",
      { key: mediaRecord.id, className: "nrki-media-card" },
      h(
        "div",
        null,
        h(
          "div",
          { className: "nrki-media-card-header" },
          h(
            "div",
            null,
            h(
              "span",
              { className: resolveBadgeClassName(mediaRecord.badgeVariant) },
              mediaRecord.badgeLabel
            ),
            h("h3", { className: "nrki-media-card-title" }, mediaRecord.title)
          ),
          h(
            "span",
            {
              className: mediaRecord.isRating
                ? "nrki-rating-stamp"
                : "nrki-badge",
              "aria-label": mediaRecord.isRating
                ? `Rating: ${mediaRecord.ratingOrStatus}`
                : `Status: ${mediaRecord.ratingOrStatus}`,
            },
            mediaRecord.ratingOrStatus
          )
        ),
        h("p", { className: "nrki-media-card-creator" }, mediaRecord.creator),
        h("p", { className: "nrki-media-card-notes" }, mediaRecord.notes),
        Array.isArray(mediaRecord.tags) && mediaRecord.tags.length > 0
          ? h(
              "ul",
              { className: "nrki-tag-pills", "aria-label": "Media tags" },
              mediaRecord.tags.map((tagLabel) =>
                h(
                  "li",
                  { key: tagLabel, className: "nrki-tag-pill" },
                  `#${tagLabel}`
                )
              )
            )
          : null
      ),
      h(
        "div",
        { className: "nrki-card-footer" },
        h("span", null, mediaRecord.footerLeft),
        h("span", null, mediaRecord.footerRight)
      )
    );
  }

  const mountContainer = document.getElementById("shelf-root");
  if (mountContainer) {
    const shelfPageType = mountContainer.getAttribute("data-shelf-page");
    if (
      shelfPageType === "projects" ||
      shelfPageType === "works" ||
      shelfPageType === "media"
    ) {
      loadTabCollection(shelfPageType).then(({ filters, items }) => {
        const reactRoot = createRoot(mountContainer);

        if (shelfPageType === "projects") {
          reactRoot.render(
            h(Shelf, {
              eyebrow: "02 / Build",
              title: "The Projects Shelf",
              note: "Loaded from content/projects/index.json & .txt files. Select any project card to open its dedicated page with repository and live links.",
              filters,
              items,
              enableTagFilter: true,
              gridClassName: "nrki-shelf-grid",
              renderCard: renderProjectCard,
            })
          );
        } else if (shelfPageType === "works") {
          reactRoot.render(
            h(Shelf, {
              eyebrow: "03 / Publish",
              title: "The Works Shelf",
              note: "Loaded from content/works/index.json & .txt files. Filter by format or #tag, and select any card to read the full piece.",
              filters,
              items,
              enableTagFilter: true,
              gridClassName: "nrki-shelf-grid",
              renderCard: renderWorkCard,
            })
          );
        } else if (shelfPageType === "media") {
          reactRoot.render(
            h(Shelf, {
              eyebrow: "04 / Ledger",
              title: "The Media Shelf",
              note: "Loaded from content/media/index.json & .txt files. Combine shelf status (Reviews vs. Watchlist), medium filters, and tags.",
              filters,
              items,
              enableTagFilter: true,
              gridClassName: "nrki-shelf-grid",
              renderCard: renderMediaCard,
            })
          );
        }
      });
    }
  }
})(window);
