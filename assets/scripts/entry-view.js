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
      const item =
        items.find(
          (it) =>
            it.id === requestedId ||
            it.id.replace(/^proj-/, "") === requestedId
        ) || items[0];

      if (!item) return;

      document.title = `${item.title} — NRKI`;

      const eyebrowEl = viewRoot.querySelector("[data-entry-eyebrow]");
      const titleEl = viewRoot.querySelector("[data-entry-title]");
      const bylineEl = viewRoot.querySelector("[data-entry-byline]");
      const tagsEl = viewRoot.querySelector("[data-entry-tags]");
      const linksEl = viewRoot.querySelector("[data-entry-links]");
      const bodyEl = viewRoot.querySelector("[data-entry-body]");

      if (eyebrowEl) {
        eyebrowEl.textContent =
          tabName === "projects"
            ? `${item.projectNumber || "Project"} · ${
                item.statusLabel || "Build"
              }`
            : `${item.categoryLabel || "Work"} · ${item.date || ""}`;
      }

      if (titleEl) {
        titleEl.textContent = item.title;
      }

      if (bylineEl && tabName === "works") {
        bylineEl.innerHTML = `<span>By NRKI</span><span>·</span><span>${
          item.date || ""
        }</span><span>·</span><span>${item.readTime || ""}</span>`;
      }

      if (tagsEl) {
        tagsEl.innerHTML = "";
        (item.tags || []).forEach((tag) => {
          const li = document.createElement("li");
          li.className = "tag-pill";
          li.textContent = `#${tag}`;
          tagsEl.appendChild(li);
        });
      }

      if (linksEl && tabName === "projects") {
        linksEl.innerHTML = "";
        const links = item.links || [
          ...(item.githubUrl
            ? [
                {
                  label: "GitHub Repository ↗",
                  url: item.githubUrl,
                  primary: true,
                },
              ]
            : []),
        ];
        links.forEach((lnk) => {
          const a = document.createElement("a");
          a.className = `btn-editorial${
            lnk.primary ? " btn-editorial--primary" : ""
          }`;
          a.href = lnk.url;
          if (/^https?:\/\//.test(lnk.url)) {
            a.target = "_blank";
            a.rel = "noopener noreferrer";
          }
          a.textContent = lnk.label;
          linksEl.appendChild(a);
        });
      }

      if (bodyEl) {
        renderBlocksToDOM(bodyEl, item);
      }
    });
  });
})(window);
