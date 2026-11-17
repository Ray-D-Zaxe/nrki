/**
 * ============================================================================
 * NRKI — REUSABLE `<Shelf />` REACT COMPONENT (`assets/scripts/components/Shelf.js`)
 * ----------------------------------------------------------------------------
 * Shared across all four collection pages:
 *   1. Gallery (`pages/gallery.html` — Art / Story / Inspiration Pinboard SPA)
 *   2. Projects (`pages/projects.html` — Tagged project cards linking to pages)
 *   3. Works (`pages/works.html` — Tagged writing/art cards linking to pages)
 *   4. Media (`pages/media.html` — Reviews & Watchlist Ledger)
 *
 * Layout Note:
 * Uses `.shelf-section` and `.shelf-header` so the filter controls and card
 * grid extend all the way to the left edge of `.page-shell` with zero wasted
 * horizontal space.
 * ============================================================================
 */

(function (global) {
  const React = global.React;
  const { useState, useMemo, createElement: h } = React;

  /**
   * Reusable `<Shelf />` Component
   *
   * @param {Object} props
   * @param {string} [props.eyebrow="Index / Filter"] - Small uppercase kicker above the heading
   * @param {string} [props.title="The Shelf"]        - Main section heading
   * @param {string} [props.note]                     - Helper description displayed in the header bar
   * @param {Array}  [props.filters=[]]               - Array of filter group configs:
   *                                                    `[{ key: "category", label: "Format", options: [{ value, label }] }]`
   * @param {Array}  props.items                      - Array of data objects to filter and display
   * @param {boolean} [props.enableTagFilter=true]    - Automatically generates a Tag filter bar from `item.tags`
   * @param {string} [props.gridClassName="media-grid"] - Grid container class (`"media-grid"` or `"board-grid"`)
   * @param {Function} props.renderCard               - Function `(item, helpers) => ReactElement` that renders each card
   */
  function Shelf({
    eyebrow = "Index / Filter",
    title = "The Shelf",
    note = "Use the filters below to narrow entries by category or tag.",
    filters = [],
    items = [],
    enableTagFilter = true,
    gridClassName = "media-grid",
    renderCard,
  }) {
    // 1. Initialize state for each primary filter group (defaults to "all")
    const [activeFilters, setActiveFilters] = useState(() => {
      const initial = {};
      filters.forEach((group) => {
        initial[group.key] = "all";
      });
      return initial;
    });

    // 2. State for active tag filter ("all" or a specific tag string)
    const [activeTag, setActiveTag] = useState("all");

    // Collect all unique tags across `items` so users can filter by #tag
    const allTags = useMemo(() => {
      if (!enableTagFilter) return [];
      const tagSet = new Set();
      items.forEach((item) => {
        if (Array.isArray(item.tags)) {
          item.tags.forEach((t) => tagSet.add(t));
        }
      });
      return Array.from(tagSet);
    }, [items, enableTagFilter]);

    // Compute the filtered list of items matching all active filter keys + activeTag
    const visibleItems = useMemo(() => {
      return items.filter((item) => {
        const matchesGroups = Object.entries(activeFilters).every(
          ([key, selectedValue]) => {
            if (!selectedValue || selectedValue === "all") return true;
            return item[key] === selectedValue;
          }
        );

        const matchesTag =
          activeTag === "all" ||
          (Array.isArray(item.tags) && item.tags.includes(activeTag));

        return matchesGroups && matchesTag;
      });
    }, [items, activeFilters, activeTag]);

    const handleSelectFilter = (key, value) => {
      setActiveFilters((prev) => Object.assign({}, prev, { [key]: value }));
    };

    const hasActiveFilter =
      activeTag !== "all" ||
      Object.values(activeFilters).some((val) => val !== "all");

    const handleResetAll = () => {
      const reset = {};
      filters.forEach((g) => {
        reset[g.key] = "all";
      });
      setActiveFilters(reset);
      setActiveTag("all");
    };

    return h(
      "section",
      { className: "shelf-section", "aria-labelledby": "shelf-heading" },
      // Full-Width Shelf Header (Extends all the way from left to right)
      h(
        "div",
        { className: "shelf-header" },
        h(
          "div",
          { className: "shelf-header__titles" },
          h("p", { className: "eyebrow" }, eyebrow),
          h("h2", { id: "shelf-heading" }, title)
        ),
        note ? h("p", { className: "shelf-header__note" }, note) : null
      ),

      // Full-Width Filter Controls Bar
      h(
        "div",
        { className: "media-controls" },
        filters.map((group) =>
          h(
            "div",
            {
              key: group.key,
              className: "filter-bar",
              style: { marginBottom: 0 },
              role: "toolbar",
              "aria-label": `Filter by ${group.label}`,
            },
            h(
              "span",
              { className: "meta-label", style: { marginRight: "0.35rem" } },
              `${group.label}:`
            ),
            group.options.map((opt) => {
              const isActive =
                (activeFilters[group.key] || "all") === opt.value;
              return h(
                "button",
                {
                  key: opt.value,
                  type: "button",
                  className: `filter-btn${isActive ? " is-active" : ""}`,
                  "aria-pressed": String(isActive),
                  onClick: () => handleSelectFilter(group.key, opt.value),
                },
                opt.label
              );
            })
          )
        ),

        // Tag Filter Bar
        enableTagFilter && allTags.length > 0
          ? h(
              "div",
              {
                className: "filter-bar",
                style: { marginBottom: 0, width: "100%" },
                role: "toolbar",
                "aria-label": "Filter by tag",
              },
              h(
                "span",
                { className: "meta-label", style: { marginRight: "0.35rem" } },
                "Tag:"
              ),
              h(
                "button",
                {
                  type: "button",
                  className: `filter-btn${
                    activeTag === "all" ? " is-active" : ""
                  }`,
                  "aria-pressed": String(activeTag === "all"),
                  onClick: () => setActiveTag("all"),
                },
                "All Tags"
              ),
              allTags.map((tag) => {
                const isActive = activeTag === tag;
                return h(
                  "button",
                  {
                    key: tag,
                    type: "button",
                    className: `filter-btn${isActive ? " is-active" : ""}`,
                    "aria-pressed": String(isActive),
                    onClick: () => setActiveTag(isActive ? "all" : tag),
                  },
                  `#${tag}`
                );
              })
            )
          : null
      ),

      // Entry Counter & Filter Reset Bar
      h(
        "div",
        { className: "shelf-status-bar" },
        h(
          "span",
          null,
          `Showing ${visibleItems.length} of ${items.length} ${
            items.length === 1 ? "entry" : "entries"
          }`
        ),
        hasActiveFilter
          ? h(
              "button",
              {
                type: "button",
                className: "filter-btn",
                onClick: handleResetAll,
              },
              "Reset Filters ✕"
            )
          : null
      ),

      // Full-Width Card Grid
      visibleItems.length > 0
        ? h(
            "div",
            { className: gridClassName },
            visibleItems.map((item) =>
              renderCard(item, {
                activeTag,
                onSelectTag: (tag) =>
                  setActiveTag((prev) => (prev === tag ? "all" : tag)),
              })
            )
          )
        : h(
            "p",
            { className: "quiet-note" },
            "No entries match the selected filters."
          )
    );
  }

  global.NRKIShelf = Shelf;
})(window);
