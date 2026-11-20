/**
 * ============================================================================
 * NRKI — DEDICATED PROJECT & WORK PAGE RENDERER (`assets/scripts/entry-view.js`)
 * ----------------------------------------------------------------------------
 * Renders an individual Project page (`pages/project-view.html?id=<id>`) or
 * an individual Work page (`pages/work-view.html?id=<id>`) directly from:
 *   - `content/projects/index.json` + `content/projects/<textFile>.txt`
 *   - `content/works/index.json`    + `content/works/<textFile>.txt`
 *
 * Uses `window.NRKIContentLoader.renderBlocksToDOM` so headings, quotes,
 * bullet lists, bold/italic/code, links, images, audio, and video are all
 * formatted properly before displaying.
 * ============================================================================
 */

(function (global) {
  const { loadTabCollection, renderBlocksToDOM } = global.NRKIContentLoader;

  document.addEventListener("DOMContentLoaded", () => {
    const viewRoot = document.querySelector("[data-entry-view]");
    if (!viewRoot) return;

    const tabName = viewRoot.getAttribute("data-entry-view"); // "projects" | "works"
    const params = new URLSearchParams(window.location.search);
    const requestedId = params.get("id");

    loadTabCollection(tabName).then(({ items }) => {
      const selectedEntry =
        items.find(
          (entryRecord) =>
            entryRecord.id === requestedId ||
            entryRecord.id.replace(/^proj-/, "") === requestedId
        ) || items[0];

      if (!selectedEntry) return;

      document.title = `${selectedEntry.title} — NRKI`;

      const eyebrowElement = viewRoot.querySelector("[data-entry-eyebrow]");
      const titleElement = viewRoot.querySelector("[data-entry-title]");
      const bylineElement = viewRoot.querySelector("[data-entry-byline]");
      const tagsElement = viewRoot.querySelector("[data-entry-tags]");
      const linksElement = viewRoot.querySelector("[data-entry-links]");
      const bodyElement = viewRoot.querySelector("[data-entry-body]");

      if (eyebrowElement) {
        eyebrowElement.textContent =
          tabName === "projects"
            ? `${selectedEntry.projectNumber || "Project"} · ${
                selectedEntry.statusLabel || "Build"
              }`
            : `${selectedEntry.categoryLabel || "Work"} · ${
                selectedEntry.date || ""
              }`;
      }

      if (titleElement) {
        titleElement.textContent = selectedEntry.title;
      }

      if (bylineElement && tabName === "works") {
        bylineElement.innerHTML = `<span>By NRKI</span><span>·</span><span>${
          selectedEntry.date || ""
        }</span><span>·</span><span>${selectedEntry.readTime || ""}</span>`;
      }

      if (tagsElement) {
        tagsElement.innerHTML = "";
        (selectedEntry.tags || []).forEach((tagLabel) => {
          const tagListItem = document.createElement("li");
          tagListItem.className = "nrki-tag-pill";
          tagListItem.textContent = `#${tagLabel}`;
          tagsElement.appendChild(tagListItem);
        });
      }

      if (linksElement && tabName === "projects") {
        linksElement.innerHTML = "";
        const entryLinks = selectedEntry.links || [
          ...(selectedEntry.githubUrl
            ? [
                {
                  label: "GitHub Repository ↗",
                  url: selectedEntry.githubUrl,
                  primary: true,
                },
              ]
            : []),
        ];
        entryLinks.forEach((entryLink) => {
          const anchorElement = document.createElement("a");
          anchorElement.className = `nrki-button${
            entryLink.primary ? " nrki-button-primary" : ""
          }`;
          anchorElement.href = entryLink.url;
          if (/^https?:\/\//.test(entryLink.url)) {
            anchorElement.target = "_blank";
            anchorElement.rel = "noopener noreferrer";
          }
          anchorElement.textContent = entryLink.label;
          linksElement.appendChild(anchorElement);
        });
      }

      if (bodyElement) {
        renderBlocksToDOM(bodyElement, selectedEntry);
      }
    });
  });
})(window);
