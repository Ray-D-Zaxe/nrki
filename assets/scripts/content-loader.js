/**
 * ============================================================================
 * NRKI — FLAT-FILE JSON + TXT CONTENT LOADER & FORMATTER
 * (`assets/scripts/content-loader.js`)
 * ----------------------------------------------------------------------------
 * Powers the 4 collection tabs from plain `.json` and `.txt` files:
 *   - Gallery  -> `content/gallery/index.json`  + `content/gallery/*.txt`
 *   - Projects -> `content/projects/index.json` + `content/projects/*.txt`
 *   - Works    -> `content/works/index.json`    + `content/works/*.txt`
 *   - Media    -> `content/media/index.json`    + `content/media/*.txt`
 *
 * Supported Formatting in `.txt` Files (works in Project View, Work View &
 * the Gallery Overlay Modal):
 *   - Headings:        `# Heading 1`, `## Heading 2`, `### Heading 3`
 *   - Blockquotes:     `> Quote text`
 *   - Bullet lists:    `- List item` or `* List item`
 *   - Numbered lists:  `1. List item`
 *   - Code blocks:     ``` ... ```
 *   - Bold text:       `**bold text**`
 *   - Italic text:     `*italic text*`
 *   - Inline code:     `` `code text` ``
 *   - Links:           `[Link label](https://example.com)`
 *   - Images:          `![Alt text]("path/or/url.png")` or `[Label](path.png)`
 *   - Audio player:    `[Label for audio]("path/or/url.mp3")` (or .wav/.ogg/.m4a/.flac)
 *   - Video player:    `[Label for video]("path/or/url.mp4")` (or .webm/.mkv/.mov)
 *   - Line breaks:     Single newlines within a paragraph are preserved as `<br>`.
 * ============================================================================
 */

(function (global) {
  const IMAGE_EXT_RE = /\.(png|jpe?g|gif|webp|svg|avif|bmp)$/i;
  const AUDIO_EXT_RE = /\.(mp3|wav|ogg|m4a|flac|aac|opus)$/i;
  const VIDEO_EXT_RE = /\.(mp4|webm|mkv|mov|ogv|m4v)$/i;

  /**
   * Cleans a raw URL or local file path from Markdown syntax:
   * - Strips surrounding quotes (`"..."` or `'...'`)
   * - Converts Windows drive paths (`C:\Users\...`) to `file:///C:/Users/...`
   *
   * @param {string} rawTarget
   * @returns {{ src: string, displayPath: string, isLocalDrivePath: boolean }}
   */
  function normalizeMediaOrLinkTarget(rawTarget) {
    let cleaned = (rawTarget || "").trim();
    if (
      (cleaned.startsWith('"') && cleaned.endsWith('"')) ||
      (cleaned.startsWith("'") && cleaned.endsWith("'"))
    ) {
      cleaned = cleaned.slice(1, -1).trim();
    }

    const displayPath = cleaned;
    const isWindowsDrive = /^[a-zA-Z]:[\\/]/.test(cleaned);

    if (isWindowsDrive) {
      const forwardSlashed = cleaned.replace(/\\/g, "/");
      const encoded = forwardSlashed
        .split("/")
        .map((segment, i) => (i === 0 ? segment : encodeURIComponent(segment)))
        .join("/");
      return {
        src: `file:///${encoded}`,
        displayPath,
        isLocalDrivePath: true,
      };
    }

    return {
      src: cleaned,
      displayPath,
      isLocalDrivePath: false,
    };
  }

  /**
   * Checks if an entire line is a standalone Image, Audio, or Video embed:
   *   - `![Alt text]("path/to/image.png")`
   *   - `[Audio label]("path/to/audio.mp3")`
   *   - `[Video label]("path/to/video (2).mp4")`
   *
   * Note: Supports parentheses inside quoted paths (e.g. `"videoplayback (2).mp4"`)
   * as well as unquoted paths up to the line's closing `)`.
   */
  function matchStandaloneMediaLine(line) {
    const trimmed = line.trim();
    const match = trimmed.match(/^(!?)\[([^\]]*)\]\((.+)\)$/);
    if (!match) return null;

    const isBang = match[1] === "!";
    const label = match[2].trim();
    const rawTarget = match[3].trim();

    // Ensure there isn't a second link on the same line (e.g. `[a](b) and [c](d)`)
    if (
      !rawTarget.startsWith('"') &&
      !rawTarget.startsWith("'") &&
      rawTarget.includes("](")
    ) {
      return null;
    }

    const { src, displayPath, isLocalDrivePath } =
      normalizeMediaOrLinkTarget(rawTarget);

    if (AUDIO_EXT_RE.test(displayPath)) {
      return {
        type: "audio",
        label: label || "Audio clip",
        src,
        displayPath,
        isLocalDrivePath,
      };
    }

    if (VIDEO_EXT_RE.test(displayPath)) {
      return {
        type: "video",
        label: label || "Video clip",
        src,
        displayPath,
        isLocalDrivePath,
      };
    }

    if (isBang || IMAGE_EXT_RE.test(displayPath)) {
      return {
        type: "image",
        label: label || "Image",
        src,
        displayPath,
        isLocalDrivePath,
      };
    }

    return null;
  }

  /**
   * Parses inline Markdown tokens within a single line of text into an array
   * of token objects:
   *   - `{ type: "text", content }`
   *   - `{ type: "bold", children }`      (`**bold**`)
   *   - `{ type: "italic", children }`    (`*italic*`)
   *   - `{ type: "code", content }`       (`` `code` ``)
   *   - `{ type: "link", label, href }`   (`[label](url)`)
   *   - `{ type: "image", label, src, displayPath }` (`![alt](url)`)
   *
   * @param {string} text
   * @returns {Array}
   */
  function parseInlineTokens(text) {
    if (!text) return [];

    const tokens = [];
    // Combined regex matching:
    // 1. Inline code: `([^`]+)`
    // 2. Image or Link: (!?)\[([^\]]+)\]\((?:"([^"]+)"|'([^']+)'|([^)]+))\)
    // 3. Bold+Italic: \*\*\*([^*]+)\*\*\*
    // 4. Bold: \*\*([^*]+)\*\*
    // 5. Italic: \*([^*]+)\*
    const tokenRegex =
      /`([^`]+)`|(!?)\[([^\]]*)\]\((?:"([^"]+)"|'([^']+)'|([^)]+))\)|\*\*\*([^*]+)\*\*\*|\*\*([^*]+)\*\*|\*([^*]+)\*/g;

    let lastIndex = 0;
    let match;

    while ((match = tokenRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        tokens.push({
          type: "text",
          content: text.slice(lastIndex, match.index),
        });
      }

      if (match[1] !== undefined) {
        // `code`
        tokens.push({ type: "code", content: match[1] });
      } else if (match[3] !== undefined) {
        // Link or inline media: (!?)[label](target)
        const isBang = match[2] === "!";
        const label = match[3];
        const rawTarget = match[4] || match[5] || match[6] || "";
        const { src, displayPath, isLocalDrivePath } =
          normalizeMediaOrLinkTarget(rawTarget);

        if (AUDIO_EXT_RE.test(displayPath)) {
          tokens.push({
            type: "audio-inline",
            label: label || "Audio",
            src,
            displayPath,
            isLocalDrivePath,
          });
        } else if (VIDEO_EXT_RE.test(displayPath)) {
          tokens.push({
            type: "video-inline",
            label: label || "Video",
            src,
            displayPath,
            isLocalDrivePath,
          });
        } else if (isBang || IMAGE_EXT_RE.test(displayPath)) {
          tokens.push({
            type: "image-inline",
            label: label || "Image",
            src,
            displayPath,
            isLocalDrivePath,
          });
        } else {
          tokens.push({
            type: "link",
            label: label || displayPath,
            href: src,
          });
        }
      } else if (match[7] !== undefined) {
        // ***bold italic***
        tokens.push({
          type: "bold-italic",
          content: match[7],
        });
      } else if (match[8] !== undefined) {
        // **bold**
        tokens.push({
          type: "bold",
          content: match[8],
        });
      } else if (match[9] !== undefined) {
        // *italic*
        tokens.push({
          type: "italic",
          content: match[9],
        });
      }

      lastIndex = tokenRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      tokens.push({
        type: "text",
        content: text.slice(lastIndex),
      });
    }

    return tokens;
  }

  /**
   * Strips Markdown symbols from a line to produce clean plain text for card
   * summaries on the Shelf.
   */
  function stripMarkdownToPlainText(text) {
    return (text || "")
      .replace(/^#+\s*/, "")
      .replace(/^>\s*/, "")
      .replace(/^[-*]\s+/, "")
      .replace(/!?\[([^\]]*)\]\([^)]+\)/g, "$1")
      .replace(/\*\*\*([^*]+)\*\*\*/g, "$1")
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/\*([^*]+)\*/g, "$1")
      .replace(/`([^`]+)`/g, "$1")
      .trim();
  }

  /**
   * Parses a plain `.txt` file line-by-line into structured blocks (`bodyBlocks`)
   * and extracts a clean `summary` for the Shelf card face.
   *
   * Even if there are NO blank lines between a paragraph, a `> quote`, a
   * `- bullet list`, and `![image]` / `[audio]` / `[video]` lines (as in
   * `dummy-poem.txt`), each construct is recognized and formatted properly!
   *
   * @param {string} rawText
   */
  function parsePlainTextContent(rawText) {
    const normalized = (rawText || "").replace(/\r\n/g, "\n").trim();
    if (!normalized) {
      return {
        summary: "",
        fullText: "",
        articleParagraphs: [],
        bodyBlocks: [],
      };
    }

    const lines = normalized.split("\n");
    const bodyBlocks = [];

    let currentParagraphLines = [];
    let currentQuoteLines = [];
    let currentUlItems = [];
    let currentOlItems = [];
    let inCodeBlock = false;
    let currentCodeLines = [];

    function flushParagraph() {
      if (currentParagraphLines.length > 0) {
        bodyBlocks.push({
          type: "p",
          lines: currentParagraphLines.slice(),
          text: currentParagraphLines.join("\n"),
        });
        currentParagraphLines = [];
      }
    }

    function flushQuote() {
      if (currentQuoteLines.length > 0) {
        bodyBlocks.push({
          type: "quote",
          lines: currentQuoteLines.slice(),
          text: currentQuoteLines.join("\n"),
        });
        currentQuoteLines = [];
      }
    }

    function flushUl() {
      if (currentUlItems.length > 0) {
        bodyBlocks.push({
          type: "ul",
          items: currentUlItems.slice(),
        });
        currentUlItems = [];
      }
    }

    function flushOl() {
      if (currentOlItems.length > 0) {
        bodyBlocks.push({
          type: "ol",
          items: currentOlItems.slice(),
        });
        currentOlItems = [];
      }
    }

    function flushAll() {
      flushParagraph();
      flushQuote();
      flushUl();
      flushOl();
    }

    for (let i = 0; i < lines.length; i++) {
      const rawLine = lines[i];
      const trimmed = rawLine.trim();

      // 1. Fenced code blocks: ```
      if (trimmed.startsWith("```")) {
        flushAll();
        if (inCodeBlock) {
          bodyBlocks.push({
            type: "pre",
            text: currentCodeLines.join("\n"),
          });
          currentCodeLines = [];
          inCodeBlock = false;
        } else {
          inCodeBlock = true;
        }
        continue;
      }

      if (inCodeBlock) {
        currentCodeLines.push(rawLine);
        continue;
      }

      // 2. Blank line flushes any open paragraph/quote/list
      if (!trimmed) {
        flushAll();
        continue;
      }

      // 3. Headings: #, ##, ###
      const headingMatch = trimmed.match(/^(#{1,3})\s+(.+)$/);
      if (headingMatch) {
        flushAll();
        const level = headingMatch[1].length;
        bodyBlocks.push({
          type: level === 3 ? "h3" : "h2",
          text: headingMatch[2].trim(),
        });
        continue;
      }

      // 4. Blockquote: `> ...`
      if (trimmed.startsWith(">")) {
        flushParagraph();
        flushUl();
        flushOl();
        currentQuoteLines.push(trimmed.replace(/^>\s*/, ""));
        continue;
      }

      // 5. Unordered Bullet List: `- ...` or `* ...` (Note: `*italic*` has no space after `*`)
      if (/^[-*]\s+/.test(trimmed)) {
        flushParagraph();
        flushQuote();
        flushOl();
        currentUlItems.push(trimmed.replace(/^[-*]\s+/, ""));
        continue;
      }

      // 6. Ordered Numbered List: `1. ...`
      if (/^\d+\.\s+/.test(trimmed)) {
        flushParagraph();
        flushQuote();
        flushUl();
        currentOlItems.push(trimmed.replace(/^\d+\.\s+/, ""));
        continue;
      }

      // 7. Standalone Image, Audio, or Video embed line
      const mediaBlock = matchStandaloneMediaLine(trimmed);
      if (mediaBlock) {
        flushAll();
        bodyBlocks.push(mediaBlock);
        continue;
      }

      // 8. Standard text line (part of a paragraph)
      flushQuote();
      flushUl();
      flushOl();
      currentParagraphLines.push(trimmed);
    }

    flushAll();
    if (inCodeBlock && currentCodeLines.length > 0) {
      bodyBlocks.push({
        type: "pre",
        text: currentCodeLines.join("\n"),
      });
    }

    // Build a clean plain-text summary for the Shelf card face from the first
    // paragraph block (or first available text block)
    const firstTextBlock = bodyBlocks.find(
      (b) => b.type === "p" || b.type === "quote"
    );
    let summary = "";
    if (firstTextBlock) {
      const firstLines = (firstTextBlock.lines || [firstTextBlock.text]).slice(
        0,
        2
      );
      summary = firstLines.map(stripMarkdownToPlainText).join(" ");
    }

    const articleParagraphs = bodyBlocks
      .filter((b) => b.type === "p" || b.type === "quote")
      .map((b) => b.text);

    return {
      summary,
      fullText: normalized,
      articleParagraphs,
      bodyBlocks,
    };
  }

  /**
   * ==========================================================================
   * DOM RENDERER (Used by `project-view.html` and `work-view.html`)
   * ==========================================================================
   */

  function createMediaDOMElement(block) {
    const figureElement = document.createElement("figure");
    figureElement.className = "nrki-media-figure";

    if (block.type === "image") {
      const imageElement = document.createElement("img");
      imageElement.src = block.src;
      imageElement.alt = block.label || "";
      imageElement.loading = "lazy";
      imageElement.addEventListener("error", () => {
        imageElement.style.display = "none";
        const fallbackBox = document.createElement("div");
        fallbackBox.className = "nrki-media-fallback";
        fallbackBox.textContent = `[Image preview unavailable in browser sandbox: ${block.displayPath}]`;
        figureElement.insertBefore(fallbackBox, figureElement.firstChild);
      });
      figureElement.appendChild(imageElement);
    } else if (block.type === "audio") {
      const headerElement = document.createElement("div");
      headerElement.className = "nrki-media-header";
      headerElement.textContent = `♫ Audio · ${block.label}`;
      figureElement.appendChild(headerElement);

      const audioElement = document.createElement("audio");
      audioElement.controls = true;
      audioElement.preload = "metadata";
      audioElement.src = block.src;
      figureElement.appendChild(audioElement);
    } else if (block.type === "video") {
      const headerElement = document.createElement("div");
      headerElement.className = "nrki-media-header";
      headerElement.textContent = `▶ Video · ${block.label}`;
      figureElement.appendChild(headerElement);

      const videoElement = document.createElement("video");
      videoElement.controls = true;
      videoElement.preload = "metadata";
      videoElement.src = block.src;
      figureElement.appendChild(videoElement);
    }

    const captionElement = document.createElement("figcaption");
    captionElement.className = "nrki-media-caption";
    captionElement.textContent = block.isLocalDrivePath
      ? `${block.label} (${block.displayPath})`
      : block.label;
    figureElement.appendChild(captionElement);

    return figureElement;
  }

  function appendInlineTokensToDOM(parentEl, text) {
    const tokens = parseInlineTokens(text);
    tokens.forEach((tok) => {
      if (tok.type === "text") {
        parentEl.appendChild(document.createTextNode(tok.content));
      } else if (tok.type === "bold") {
        const strong = document.createElement("strong");
        strong.textContent = tok.content;
        parentEl.appendChild(strong);
      } else if (tok.type === "italic") {
        const em = document.createElement("em");
        em.textContent = tok.content;
        parentEl.appendChild(em);
      } else if (tok.type === "bold-italic") {
        const strong = document.createElement("strong");
        const em = document.createElement("em");
        em.textContent = tok.content;
        strong.appendChild(em);
        parentEl.appendChild(strong);
      } else if (tok.type === "code") {
        const code = document.createElement("code");
        code.textContent = tok.content;
        parentEl.appendChild(code);
      } else if (tok.type === "link") {
        const a = document.createElement("a");
        a.href = tok.href;
        if (/^https?:\/\//i.test(tok.href)) {
          a.target = "_blank";
          a.rel = "noopener noreferrer";
        }
        a.textContent = tok.label;
        parentEl.appendChild(a);
      } else if (
        tok.type === "image-inline" ||
        tok.type === "audio-inline" ||
        tok.type === "video-inline"
      ) {
        const mediaType = tok.type.replace("-inline", "");
        parentEl.appendChild(
          createMediaDOMElement({
            type: mediaType,
            label: tok.label,
            src: tok.src,
            displayPath: tok.displayPath,
            isLocalDrivePath: tok.isLocalDrivePath,
          })
        );
      }
    });
  }

  function appendLinesWithBreaksToDOM(parentEl, lines) {
    lines.forEach((line, idx) => {
      if (idx > 0) {
        parentEl.appendChild(document.createElement("br"));
      }
      appendInlineTokensToDOM(parentEl, line);
    });
  }

  /**
   * Renders parsed `bodyBlocks` into a target DOM container (`project-view` & `work-view`).
   *
   * @param {HTMLElement} container
   * @param {Object} item
   */
  function renderBlocksToDOM(container, item) {
    container.innerHTML = "";

    let blocks = item.bodyBlocks || [];
    if (blocks.length === 0 && item.notes) {
      blocks = parsePlainTextContent(item.notes).bodyBlocks;
    } else if (blocks.length === 0 && Array.isArray(item.article)) {
      blocks = parsePlainTextContent(item.article.join("\n\n")).bodyBlocks;
    }

    blocks.forEach((block) => {
      if (block.type === "h2" || block.type === "h3") {
        const heading = document.createElement(block.type);
        appendInlineTokensToDOM(heading, block.text);
        container.appendChild(heading);
      } else if (block.type === "quote") {
        const bq = document.createElement("blockquote");
        appendLinesWithBreaksToDOM(bq, block.lines || [block.text]);
        container.appendChild(bq);
      } else if (block.type === "ul" || block.type === "ol") {
        const listElement = document.createElement(block.type);
        listElement.className =
          block.type === "ol" ? "nrki-ordered-list" : "nrki-editorial-list";
        (block.items || []).forEach((lineText) => {
          const listEntry = document.createElement("li");
          appendInlineTokensToDOM(listEntry, lineText);
          listElement.appendChild(listEntry);
        });
        container.appendChild(listElement);
      } else if (block.type === "pre") {
        const pre = document.createElement("pre");
        const code = document.createElement("code");
        code.textContent = block.text;
        pre.appendChild(code);
        container.appendChild(pre);
      } else if (
        block.type === "image" ||
        block.type === "audio" ||
        block.type === "video"
      ) {
        container.appendChild(createMediaDOMElement(block));
      } else {
        const p = document.createElement("p");
        appendLinesWithBreaksToDOM(p, block.lines || [block.text]);
        container.appendChild(p);
      }
    });
  }

  /**
   * ==========================================================================
   * REACT RENDERER (Used by the Gallery SPA Modal in `gallery-spa.js`)
   * ==========================================================================
   */

  function renderInlineTokensToReact(h, text, keyPrefix) {
    const tokens = parseInlineTokens(text);
    return tokens.map((tok, i) => {
      const key = `${keyPrefix}-tok-${i}`;
      if (tok.type === "text") {
        return tok.content;
      }
      if (tok.type === "bold") {
        return h("strong", { key }, tok.content);
      }
      if (tok.type === "italic") {
        return h("em", { key }, tok.content);
      }
      if (tok.type === "bold-italic") {
        return h("strong", { key }, h("em", null, tok.content));
      }
      if (tok.type === "code") {
        return h("code", { key }, tok.content);
      }
      if (tok.type === "link") {
        const isExt = /^https?:\/\//i.test(tok.href);
        return h(
          "a",
          {
            key,
            href: tok.href,
            target: isExt ? "_blank" : undefined,
            rel: isExt ? "noopener noreferrer" : undefined,
          },
          tok.label
        );
      }
      if (
        tok.type === "image-inline" ||
        tok.type === "audio-inline" ||
        tok.type === "video-inline"
      ) {
        return renderMediaBlockToReact(
          h,
          {
            type: tok.type.replace("-inline", ""),
            label: tok.label,
            src: tok.src,
            displayPath: tok.displayPath,
            isLocalDrivePath: tok.isLocalDrivePath,
          },
          key
        );
      }
      return null;
    });
  }

  function renderLinesWithBreaksToReact(h, lines, keyPrefix) {
    const children = [];
    lines.forEach((line, idx) => {
      if (idx > 0) {
        children.push(h("br", { key: `${keyPrefix}-br-${idx}` }));
      }
      children.push(
        ...renderInlineTokensToReact(h, line, `${keyPrefix}-ln-${idx}`)
      );
    });
    return children;
  }

  function renderMediaBlockToReact(h, block, key) {
    const captionText = block.isLocalDrivePath
      ? `${block.label} (${block.displayPath})`
      : block.label;

    if (block.type === "image") {
      return h(
        "figure",
        { key, className: "nrki-media-figure" },
        h("img", { src: block.src, alt: block.label || "" }),
        h("figcaption", { className: "nrki-media-caption" }, captionText)
      );
    }

    if (block.type === "audio") {
      return h(
        "figure",
        { key, className: "nrki-media-figure" },
        h(
          "div",
          { className: "nrki-media-header" },
          `♫ Audio · ${block.label}`
        ),
        h("audio", { controls: "controls", preload: "metadata", src: block.src }),
        h("figcaption", { className: "nrki-media-caption" }, captionText)
      );
    }

    if (block.type === "video") {
      return h(
        "figure",
        { key, className: "nrki-media-figure" },
        h(
          "div",
          { className: "nrki-media-header" },
          `▶ Video · ${block.label}`
        ),
        h("video", { controls: "controls", preload: "metadata", src: block.src }),
        h("figcaption", { className: "nrki-media-caption" }, captionText)
      );
    }

    return null;
  }

  /**
   * Renders parsed `bodyBlocks` as React elements inside the Gallery SPA modal.
   */
  function renderBlocksToReact(h, item) {
    let blocks = item.bodyBlocks || [];
    if (blocks.length === 0 && Array.isArray(item.article)) {
      blocks = parsePlainTextContent(item.article.join("\n\n")).bodyBlocks;
    } else if (blocks.length === 0 && item.summary) {
      blocks = parsePlainTextContent(item.summary).bodyBlocks;
    }

    return blocks.map((block, idx) => {
      const key = `blk-${idx}`;
      if (block.type === "h2" || block.type === "h3") {
        return h(
          block.type,
          { key },
          renderInlineTokensToReact(h, block.text, key)
        );
      }
      if (block.type === "quote") {
        return h(
          "blockquote",
          { key },
          renderLinesWithBreaksToReact(h, block.lines || [block.text], key)
        );
      }
      if (block.type === "ul" || block.type === "ol") {
        return h(
          block.type,
          {
            key,
            className:
              block.type === "ol" ? "nrki-ordered-list" : "nrki-editorial-list",
          },
          (block.items || []).map((lineText, liIdx) =>
            h(
              "li",
              { key: `${key}-li-${liIdx}` },
              renderInlineTokensToReact(h, lineText, `${key}-li-${liIdx}`)
            )
          )
        );
      }
      if (block.type === "pre") {
        return h("pre", { key }, h("code", null, block.text));
      }
      if (
        block.type === "image" ||
        block.type === "audio" ||
        block.type === "video"
      ) {
        return renderMediaBlockToReact(h, block, key);
      }
      return h(
        "p",
        { key },
        renderLinesWithBreaksToReact(h, block.lines || [block.text], key)
      );
    });
  }

  /**
   * Fetches a text or JSON file relative to the site root.
   */
  async function fetchTextFile(url) {
    const res = await fetch(url, { cache: "no-cache" });
    if (!res.ok) {
      throw new Error(`Failed to load ${url} (${res.status})`);
    }
    return await res.text();
  }

  /**
   * Loads `content/<tab>/index.json` and resolves every item's `.txt` file.
   */
  async function loadTabCollection(tabName, basePath = "../content") {
    try {
      const indexUrl = `${basePath}/${tabName}/index.json`;
      const rawJson = await fetchTextFile(indexUrl);
      const indexData = JSON.parse(rawJson);

      const items = await Promise.all(
        (indexData.items || []).map(async (item) => {
          let parsed = {
            summary: item.summary || "",
            fullText: item.notes || item.summary || "",
            articleParagraphs: item.article || [],
            bodyBlocks: [],
          };

          if (item.textFile) {
            const txtUrl = `${basePath}/${tabName}/${item.textFile}`;
            const rawTxt = await fetchTextFile(txtUrl);
            parsed = parsePlainTextContent(rawTxt);
          }

          return Object.assign({}, item, {
            summary: item.summary || parsed.summary,
            notes: item.notes || parsed.summary || parsed.fullText,
            article:
              parsed.articleParagraphs.length > 0
                ? parsed.articleParagraphs
                : [parsed.summary],
            bodyBlocks: parsed.bodyBlocks,
            href:
              item.href ||
              (tabName === "projects"
                ? `./project-view.html?id=${encodeURIComponent(item.id)}`
                : tabName === "works"
                ? `./work-view.html?id=${encodeURIComponent(item.id)}`
                : undefined),
          });
        })
      );

      return {
        filters: indexData.filters || [],
        items,
      };
    } catch (err) {
      console.info(
        `[NRKI Content Loader] Using embedded fallback data for '${tabName}'.`
      );
      const fallback = global.NRKI_DATA || {};
      const map = {
        gallery: {
          filters: fallback.GALLERY_FILTERS || [],
          items: (fallback.GALLERY_ITEMS || []).map((it) =>
            Object.assign({}, it, {
              bodyBlocks: parsePlainTextContent(
                (it.article || [it.summary]).join("\n\n")
              ).bodyBlocks,
            })
          ),
        },
        projects: {
          filters: fallback.PROJECT_FILTERS || [],
          items: (fallback.PROJECT_ITEMS || []).map((it) =>
            Object.assign({}, it, {
              bodyBlocks: parsePlainTextContent(it.notes || it.summary || "")
                .bodyBlocks,
              href: `./project-view.html?id=${encodeURIComponent(
                it.id.replace(/^proj-/, "")
              )}`,
            })
          ),
        },
        works: {
          filters: fallback.WORK_FILTERS || [],
          items: (fallback.WORK_ITEMS || []).map((it) =>
            Object.assign({}, it, {
              bodyBlocks: parsePlainTextContent(it.notes || it.summary || "")
                .bodyBlocks,
              href: `./work-view.html?id=${encodeURIComponent(it.id)}`,
            })
          ),
        },
        media: {
          filters: fallback.MEDIA_FILTERS || [],
          items: fallback.MEDIA_ITEMS || [],
        },
      };
      return map[tabName] || { filters: [], items: [] };
    }
  }

  global.NRKIContentLoader = {
    loadTabCollection,
    parsePlainTextContent,
    renderBlocksToDOM,
    renderBlocksToReact,
  };
})(window);
