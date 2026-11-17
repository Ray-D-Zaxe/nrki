/**
 * ============================================================================
 * NRKI — GALLERY ART / STORY / INSPIRATION BOARD SPA (`assets/scripts/gallery-spa.js`)
 * ----------------------------------------------------------------------------
 * Powers the Single-Page Application (SPA) on `pages/gallery.html`.
 *
 * Data Source:
 * Reads board metadata from `content/gallery/index.json` and each board's
 * summary + overlay article from `content/gallery/<textFile>.txt` via
 * `window.NRKIContentLoader.loadTabCollection("gallery")`.
 * ============================================================================
 */

(function (global) {
  const React = global.React;
  const { useState, useEffect, createElement: h, Fragment } = React;
  const { createRoot } = global.ReactDOMClient;
  const Shelf = global.NRKIShelf;
  const { loadTabCollection, renderBlocksToReact } = global.NRKIContentLoader;

  /**
   * Overlay Modal displaying the full story/art article from the `.txt` file,
   * connected board pins, and external inspiration/motif links from `index.json`.
   */
  function GalleryOverlayModal({ board, allItems, onClose, onSelectBoard }) {
    useEffect(() => {
      if (!board) return;
      const handleKeyDown = (e) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleKeyDown);
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        document.body.style.overflow = prevOverflow;
      };
    }, [board, onClose]);

    if (!board) return null;

    const findById = (id) => allItems.find((it) => it.id === id) || null;
    const relatedBoards = (board.relatedIds || [])
      .map(findById)
      .filter(Boolean);

    return h(
      "div",
      {
        className: "modal-backdrop",
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": "modal-board-title",
        onClick: (e) => {
          if (e.target === e.currentTarget) onClose();
        },
      },
      h(
        "article",
        { className: "modal-dialog" },
        // 1. Top Bar: Pin Metadata + Close Button
        h(
          "div",
          { className: "modal-topbar" },
          h(
            "div",
            { className: "card-meta", style: { marginBottom: 0 } },
            h("span", null, `${board.boardNumber} · ${board.date}`),
            h(
              "span",
              {
                className: "badge badge--accent",
                style: { marginLeft: "0.6rem" },
              },
              board.categoryLabel
            )
          ),
          h(
            "button",
            {
              type: "button",
              className: "btn-editorial",
              onClick: onClose,
              "aria-label": "Close article overlay",
            },
            "Close [Esc] ✕"
          )
        ),

        // 2. Full Artwork / Visual Media Frame
        h(
          "div",
          { className: "modal-media" },
          h("img", { src: board.image, alt: board.title })
        ),

        // 3. Title & Tags
        h("h2", { id: "modal-board-title" }, board.title),
        Array.isArray(board.tags) && board.tags.length > 0
          ? h(
              "ul",
              { className: "tag-pills", "aria-label": "Board tags" },
              board.tags.map((tag) =>
                h("li", { key: tag, className: "tag-pill" }, `#${tag}`)
              )
            )
          : null,

        // 4. Short Article / Story Notes (Loaded & formatted from `content/gallery/<id>.txt`)
        h(
          "div",
          { className: "modal-article" },
          renderBlocksToReact(h, board)
        ),

        // 5. Connected Ideas on This Board
        relatedBoards.length > 0
          ? h(
              "div",
              { className: "connected-row", style: { marginTop: "1.25rem" } },
              h("strong", null, "Connected Ideas on This Board (Click to jump):"),
              h(
                "div",
                { className: "connected-links" },
                relatedBoards.map((rel) =>
                  h(
                    "button",
                    {
                      key: rel.id,
                      type: "button",
                      className: "connected-chip",
                      onClick: () => onSelectBoard(rel.id),
                    },
                    `${rel.boardNumber}: ${rel.title} →`
                  )
                )
              )
            )
          : null,

        // 6. Boxed Index of All External Inspirations & Motifs
        h(
          "aside",
          {
            className: "modal-motifs-box",
            "aria-label": "Inspirations and motifs",
          },
          h(
            "p",
            { className: "aside-label" },
            "Inspirations, Motifs & Source Links"
          ),
          h(
            "ul",
            { className: "modal-motifs-list" },
            (board.inspirations || []).map((insp, idx) =>
              h(
                "li",
                { key: idx },
                h(
                  "a",
                  {
                    href: insp.url,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    style: { fontWeight: 700 },
                  },
                  `${insp.title} ↗`
                ),
                insp.note
                  ? h(
                      "div",
                      {
                        style: {
                          color: "var(--ink-tertiary)",
                          fontSize: "0.86rem",
                          marginTop: "0.15rem",
                        },
                      },
                      insp.note
                    )
                  : null
              )
            )
          )
        )
      )
    );
  }

  /**
   * Main Gallery Pinboard SPA Component
   */
  function GallerySPA({ filters, items }) {
    const findById = (id) => items.find((it) => it.id === id) || null;

    const [selectedBoardId, setSelectedBoardId] = useState(() => {
      const hash = window.location.hash.replace("#", "");
      return findById(hash) ? hash : null;
    });

    useEffect(() => {
      const onHashChange = () => {
        const hash = window.location.hash.replace("#", "");
        setSelectedBoardId(findById(hash) ? hash : null);
      };
      window.addEventListener("hashchange", onHashChange);
      return () => window.removeEventListener("hashchange", onHashChange);
    }, [items]);

    const openBoard = (id) => {
      setSelectedBoardId(id);
      if (history.pushState) {
        history.pushState(null, "", `#${id}`);
      } else {
        window.location.hash = id;
      }
    };

    const closeBoard = () => {
      setSelectedBoardId(null);
      if (history.pushState) {
        history.pushState(
          null,
          "",
          window.location.pathname + window.location.search
        );
      } else {
        window.location.hash = "";
      }
    };

    const activeBoard = findById(selectedBoardId);

    return h(
      Fragment,
      null,
      h(Shelf, {
        eyebrow: "01 / Collect · Art, Story & Inspiration Wall",
        title: "The Pinboard Shelf",
        note: "Loaded from content/gallery/index.json & .txt files. Click any pinned card to open its short article and motif links.",
        filters,
        items,
        enableTagFilter: true,
        gridClassName: "board-grid",
        renderCard: (item) => {
          const relatedBoards = (item.relatedIds || [])
            .map(findById)
            .filter(Boolean);

          return h(
            "article",
            {
              key: item.id,
              className: "pin-card",
              role: "button",
              tabIndex: 0,
              "aria-label": `Open story and motif notes for ${item.title}`,
              onClick: () => openBoard(item.id),
              onKeyDown: (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openBoard(item.id);
                }
              },
            },
            h(
              "div",
              null,
              h(
                "div",
                { className: "card-media" },
                h("img", { src: item.image, alt: item.title }),
                item.caption
                  ? h("span", { className: "card-media__caption" }, item.caption)
                  : null
              ),
              h(
                "div",
                { className: "card-meta" },
                h("span", null, `${item.boardNumber} · ${item.date}`),
                h("span", { className: "badge" }, item.categoryLabel)
              ),
              h("h3", null, item.title),
              h("p", null, item.summary),

              item.mainMotif
                ? h(
                    "div",
                    {
                      className: "motif-row",
                      onClick: (e) => e.stopPropagation(),
                    },
                    h("strong", null, "Main Motif:"),
                    h(
                      "a",
                      {
                        href: item.mainMotif.url,
                        target: "_blank",
                        rel: "noopener noreferrer",
                      },
                      `${item.mainMotif.label} ↗`
                    )
                  )
                : null,

              relatedBoards.length > 0
                ? h(
                    "div",
                    {
                      className: "connected-row",
                      onClick: (e) => e.stopPropagation(),
                    },
                    h("strong", null, "Connects to:"),
                    h(
                      "div",
                      { className: "connected-links" },
                      relatedBoards.map((rel) =>
                        h(
                          "button",
                          {
                            key: rel.id,
                            type: "button",
                            className: "connected-chip",
                            title: `Open connected idea: ${rel.title}`,
                            onClick: () => openBoard(rel.id),
                          },
                          `${rel.boardNumber} · ${rel.title}`
                        )
                      )
                    )
                  )
                : null,

              Array.isArray(item.tags) && item.tags.length > 0
                ? h(
                    "ul",
                    { className: "tag-pills", "aria-label": "Tags" },
                    item.tags.map((t) =>
                      h("li", { key: t, className: "tag-pill" }, `#${t}`)
                    )
                  )
                : null
            ),
            h(
              "div",
              { className: "card-footer" },
              h(
                "span",
                null,
                `${(item.inspirations || []).length} source motifs`
              ),
              h(
                "span",
                { className: "text-link", style: { margin: 0 } },
                "Open article & links ↗"
              )
            )
          );
        },
      }),

      h(GalleryOverlayModal, {
        board: activeBoard,
        allItems: items,
        onClose: closeBoard,
        onSelectBoard: openBoard,
      })
    );
  }

  const container = document.getElementById("gallery-spa-root");
  if (container) {
    loadTabCollection("gallery").then(({ filters, items }) => {
      const root = createRoot(container);
      root.render(h(GallerySPA, { filters, items }));
    });
  }
})(window);
