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
   * 1. PROJECT CARD RENDERER (Full clickable `<a>` card with tags)
   */
  function renderProjectCard(item) {
    return h(
      "a",
      {
        key: item.id,
        href: `./project-view.html?id=${encodeURIComponent(item.id)}`,
        className: "editorial-card editorial-card--link",
      },
      h(
        "div",
        null,
        h(
          "div",
          { className: "card-meta" },
          h("span", null, item.projectNumber),
          h(
            "span",
            { className: `badge ${item.badgeVariant || ""}`.trim() },
            item.statusLabel
          )
        ),
        h("h3", null, item.title),
        h("p", null, item.summary),
        Array.isArray(item.tags) && item.tags.length > 0
          ? h(
              "ul",
              { className: "tag-pills", "aria-label": "Project tags" },
              item.tags.map((tag) =>
                h("li", { key: tag, className: "tag-pill" }, `#${tag}`)
              )
            )
          : null
      ),
      h(
        "div",
        { className: "card-footer" },
        h("span", null, "Project page & GitHub links"),
        h(
          "span",
          { className: "text-link", style: { margin: 0 } },
          "Explore project →"
        )
      )
    );
  }

  /**
   * 2. WORK CARD RENDERER (Full clickable `<a>` card with tags)
   */
  function renderWorkCard(item) {
    return h(
      "a",
      {
        key: item.id,
        href: `./work-view.html?id=${encodeURIComponent(item.id)}`,
        className: "editorial-card editorial-card--link",
      },
      h(
        "div",
        null,
        h(
          "div",
          { className: "card-meta" },
          h("span", { className: "badge badge--accent" }, item.categoryLabel),
          h("span", null, `${item.date} · ${item.readTime}`)
        ),
        h("h3", null, item.title),
        h("p", null, item.summary),
        Array.isArray(item.tags) && item.tags.length > 0
          ? h(
              "ul",
              { className: "tag-pills", "aria-label": "Work tags" },
              item.tags.map((tag) =>
                h("li", { key: tag, className: "tag-pill" }, `#${tag}`)
              )
            )
          : null
      ),
      h(
        "div",
        { className: "card-footer" },
        h("span", null, `Format: ${item.categoryLabel}`),
        h(
          "span",
          { className: "text-link", style: { margin: 0 } },
          "Read piece →"
        )
      )
    );
  }

  /**
   * 3. MEDIA CARD RENDERER (Review or Watchlist entry with rating/status & tags)
   */
  function renderMediaCard(item) {
    return h(
      "article",
      { key: item.id, className: "media-entry" },
      h(
        "div",
        null,
        h(
          "div",
          { className: "media-entry__header" },
          h(
            "div",
            null,
            h(
              "span",
              { className: `badge ${item.badgeVariant || ""}`.trim() },
              item.badgeLabel
            ),
            h("h3", { className: "media-entry__title" }, item.title)
          ),
          h(
            "span",
            {
              className: item.isRating ? "media-rating" : "badge",
              "aria-label": item.isRating
                ? `Rating: ${item.ratingOrStatus}`
                : `Status: ${item.ratingOrStatus}`,
            },
            item.ratingOrStatus
          )
        ),
        h("p", { className: "media-entry__creator" }, item.creator),
        h("p", { className: "media-entry__notes" }, item.notes),
        Array.isArray(item.tags) && item.tags.length > 0
          ? h(
              "ul",
              { className: "tag-pills", "aria-label": "Media tags" },
              item.tags.map((tag) =>
                h("li", { key: tag, className: "tag-pill" }, `#${tag}`)
              )
            )
          : null
      ),
      h(
        "div",
        { className: "media-entry__footer" },
        h("span", null, item.footerLeft),
        h("span", null, item.footerRight)
      )
    );
  }

  const mountNode = document.getElementById("shelf-root");
  if (mountNode) {
    const pageType = mountNode.getAttribute("data-shelf-page");
    if (
      pageType === "projects" ||
      pageType === "works" ||
      pageType === "media"
    ) {
      loadTabCollection(pageType).then(({ filters, items }) => {
        const root = createRoot(mountNode);

        if (pageType === "projects") {
          root.render(
            h(Shelf, {
              eyebrow: "02 / Build",
              title: "The Projects Shelf",
              note: "Loaded from content/projects/index.json & .txt files. Select any project card to open its dedicated page with repository and live links.",
              filters,
              items,
              enableTagFilter: true,
              gridClassName: "media-grid",
              renderCard: renderProjectCard,
            })
          );
        } else if (pageType === "works") {
          root.render(
            h(Shelf, {
              eyebrow: "03 / Publish",
              title: "The Works Shelf",
              note: "Loaded from content/works/index.json & .txt files. Filter by format or #tag, and select any card to read the full piece.",
              filters,
              items,
              enableTagFilter: true,
              gridClassName: "media-grid",
              renderCard: renderWorkCard,
            })
          );
        } else if (pageType === "media") {
          root.render(
            h(Shelf, {
              eyebrow: "04 / Ledger",
              title: "The Media Shelf",
              note: "Loaded from content/media/index.json & .txt files. Combine shelf status (Reviews vs. Watchlist), medium filters, and tags.",
              filters,
              items,
              enableTagFilter: true,
              gridClassName: "media-grid",
              renderCard: renderMediaCard,
            })
          );
        }
      });
    }
  }
})(window);
