/**
 * ============================================================================
 * NRKI — GALLERY ART / STORY / INSPIRATION BOARD SPA (`assets/scripts/gallery-spa.js`)
 * ----------------------------------------------------------------------------
 * Powers the Single-Page Application (SPA) when mounted onto a gallery shelf
 * container (`#gallery-spa-root`).
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
      const handleKeyDown = (keyboardEvent) => {
        if (keyboardEvent.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleKeyDown);
      const previousBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        document.body.style.overflow = previousBodyOverflow;
      };
    }, [board, onClose]);

    if (!board) return null;

    const findBoardById = (boardId) =>
      allItems.find((candidateBoard) => candidateBoard.id === boardId) || null;
    const relatedBoards = (board.relatedIds || [])
      .map(findBoardById)
      .filter(Boolean);

    return h(
      "div",
      {
        className: "nrki-modal-backdrop",
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": "modal-board-title",
        onClick: (clickEvent) => {
          if (clickEvent.target === clickEvent.currentTarget) onClose();
        },
      },
      h(
        "article",
        { className: "nrki-modal-dialog" },
        // 1. Top Bar: Pin Metadata + Close Button
        h(
          "div",
          { className: "nrki-modal-topbar" },
          h(
            "div",
            { className: "nrki-card-meta", style: { marginBottom: 0 } },
            h("span", null, `${board.boardNumber} · ${board.date}`),
            h(
              "span",
              {
                className: "nrki-badge nrki-badge-accent",
                style: { marginLeft: "0.6rem" },
              },
              board.categoryLabel
            )
          ),
          h(
            "button",
            {
              type: "button",
              className: "nrki-button",
              onClick: onClose,
              "aria-label": "Close article overlay",
            },
            "Close [Esc] ✕"
          )
        ),

        // 2. Full Artwork / Visual Media Frame
        h(
          "div",
          { className: "nrki-modal-media" },
          h("img", { src: board.image, alt: board.title })
        ),

        // 3. Title & Tags
        h("h2", { id: "modal-board-title" }, board.title),
        Array.isArray(board.tags) && board.tags.length > 0
          ? h(
              "ul",
              { className: "nrki-tag-pills", "aria-label": "Board tags" },
              board.tags.map((tagLabel) =>
                h(
                  "li",
                  { key: tagLabel, className: "nrki-tag-pill" },
                  `#${tagLabel}`
                )
              )
            )
          : null,

        // 4. Short Article / Story Notes (Loaded & formatted from `content/gallery/<id>.txt`)
        h(
          "div",
          { className: "nrki-modal-article" },
          renderBlocksToReact(h, board)
        ),

        // 5. Connected Ideas on This Board
        relatedBoards.length > 0
          ? h(
              "div",
              { className: "nrki-connected-row", style: { marginTop: "1.25rem" } },
              h("strong", null, "Connected Ideas on This Board (Click to jump):"),
              h(
                "div",
                { className: "nrki-connected-links" },
                relatedBoards.map((relatedBoard) =>
                  h(
                    "button",
                    {
                      key: relatedBoard.id,
                      type: "button",
                      className: "nrki-connected-chip",
                      onClick: () => onSelectBoard(relatedBoard.id),
                    },
                    `${relatedBoard.boardNumber}: ${relatedBoard.title} →`
                  )
                )
              )
            )
          : null,

        // 6. Boxed Index of All External Inspirations & Motifs
        h(
          "aside",
          {
            className: "nrki-modal-motifs-box",
            "aria-label": "Inspirations and motifs",
          },
          h(
            "p",
            { className: "nrki-aside-label" },
            "Inspirations, Motifs & Source Links"
          ),
          h(
            "ul",
            { className: "nrki-modal-motifs-list" },
            (board.inspirations || []).map((inspirationEntry, entryIndex) =>
              h(
                "li",
                { key: entryIndex },
                h(
                  "a",
                  {
                    href: inspirationEntry.url,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    style: { fontWeight: 700 },
                  },
                  `${inspirationEntry.title} ↗`
                ),
                inspirationEntry.note
                  ? h(
                      "div",
                      {
                        style: {
                          color: "var(--nrki-ink-muted)",
                          fontSize: "0.86rem",
                          marginTop: "0.15rem",
                        },
                      },
                      inspirationEntry.note
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
    const findBoardById = (boardId) =>
      items.find((candidateBoard) => candidateBoard.id === boardId) || null;

    const [selectedBoardId, setSelectedBoardId] = useState(() => {
      const hashId = window.location.hash.replace("#", "");
      return findBoardById(hashId) ? hashId : null;
    });

    useEffect(() => {
      const handleHashChange = () => {
        const hashId = window.location.hash.replace("#", "");
        setSelectedBoardId(findBoardById(hashId) ? hashId : null);
      };
      window.addEventListener("hashchange", handleHashChange);
      return () => window.removeEventListener("hashchange", handleHashChange);
    }, [items]);

    const openBoard = (boardId) => {
      setSelectedBoardId(boardId);
      if (history.pushState) {
        history.pushState(null, "", `#${boardId}`);
      } else {
        window.location.hash = boardId;
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

    const activeBoard = findBoardById(selectedBoardId);

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
        gridClassName: "nrki-shelf-grid",
        renderCard: (boardEntry) => {
          const relatedBoards = (boardEntry.relatedIds || [])
            .map(findBoardById)
            .filter(Boolean);

          return h(
            "article",
            {
              key: boardEntry.id,
              className: "nrki-pin-card",
              role: "button",
              tabIndex: 0,
              "aria-label": `Open story and motif notes for ${boardEntry.title}`,
              onClick: () => openBoard(boardEntry.id),
              onKeyDown: (keyboardEvent) => {
                if (keyboardEvent.key === "Enter" || keyboardEvent.key === " ") {
                  keyboardEvent.preventDefault();
                  openBoard(boardEntry.id);
                }
              },
            },
            h(
              "div",
              null,
              h(
                "div",
                { className: "nrki-card-media" },
                h("img", { src: boardEntry.image, alt: boardEntry.title }),
                boardEntry.caption
                  ? h(
                      "span",
                      { className: "nrki-card-media-caption" },
                      boardEntry.caption
                    )
                  : null
              ),
              h(
                "div",
                { className: "nrki-card-meta" },
                h("span", null, `${boardEntry.boardNumber} · ${boardEntry.date}`),
                h("span", { className: "nrki-badge" }, boardEntry.categoryLabel)
              ),
              h("h3", null, boardEntry.title),
              h("p", null, boardEntry.summary),

              boardEntry.mainMotif
                ? h(
                    "div",
                    {
                      className: "nrki-motif-row",
                      onClick: (clickEvent) => clickEvent.stopPropagation(),
                    },
                    h("strong", null, "Main Motif:"),
                    h(
                      "a",
                      {
                        href: boardEntry.mainMotif.url,
                        target: "_blank",
                        rel: "noopener noreferrer",
                      },
                      `${boardEntry.mainMotif.label} ↗`
                    )
                  )
                : null,

              relatedBoards.length > 0
                ? h(
                    "div",
                    {
                      className: "nrki-connected-row",
                      onClick: (clickEvent) => clickEvent.stopPropagation(),
                    },
                    h("strong", null, "Connects to:"),
                    h(
                      "div",
                      { className: "nrki-connected-links" },
                      relatedBoards.map((relatedBoard) =>
                        h(
                          "button",
                          {
                            key: relatedBoard.id,
                            type: "button",
                            className: "nrki-connected-chip",
                            title: `Open connected idea: ${relatedBoard.title}`,
                            onClick: () => openBoard(relatedBoard.id),
                          },
                          `${relatedBoard.boardNumber} · ${relatedBoard.title}`
                        )
                      )
                    )
                  )
                : null,

              Array.isArray(boardEntry.tags) && boardEntry.tags.length > 0
                ? h(
                    "ul",
                    { className: "nrki-tag-pills", "aria-label": "Tags" },
                    boardEntry.tags.map((tagLabel) =>
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
              h(
                "span",
                null,
                `${(boardEntry.inspirations || []).length} source motifs`
              ),
              h(
                "span",
                { className: "nrki-text-link", style: { margin: 0 } },
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

  const mountContainer = document.getElementById("gallery-spa-root");
  if (mountContainer) {
    loadTabCollection("gallery").then(({ filters, items }) => {
      const reactRoot = createRoot(mountContainer);
      reactRoot.render(h(GallerySPA, { filters, items }));
    });
  }
})(window);
