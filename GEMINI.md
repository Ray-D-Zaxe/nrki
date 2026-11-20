# NRKI — Project Engineering Rules & Coding Standards (`GEMINI.md`)

These rules apply **always** to all new code, stylesheets, scripts, files, and folders created or refactored in the NRKI repository.

---

## 1. CSS Best Practices (Zero `!important`)
- **Never use `!important`.** Resolve cascade order cleanly using **CSS Cascade Layers** (`@layer`) and well-structured, low-specificity selectors instead of overriding specificity with `!important`.
- **Use `@layer` for standalone libraries:**
  ```css
  @layer nrki.tokens, nrki.reset, nrki.elements, nrki.components, nrki.utilities, nrki.print;
  ```
- **Container-Scoped Theming:** Scope theme custom properties using `[data-theme="light" | "dark" | "accent" | "faded" | "uwu"]` so themes work on `<html>` *and* on individual preview containers/sections independently.
- **Accessibility & Print:** Always include visible `:focus-visible` rings, semantic landmarks, `prefers-reduced-motion` support, and clean `@page` / `@media print` rules.

---

## 2. Strict Descriptive Naming Scheme (Files, Folders, Variables, Classes)
- **Never use vague or abstract names:** Do **not** name files, folders, variables, parameters, or CSS classes with generic terms like `data`, `info`, `item`, `items`, `thing`, `obj`, `val`, `temp`, `misc`, `utils`, `helper`, `script`, or `style` when a descriptive, domain-specific name exists.
  - **Bad:** `data.js`, `elements.js`, `const data = ...`, `items.map(item => ...)`
  - **Good:** `broadsheet-simple-elements-catalog.js`, `const broadsheetElementSpecimens = ...`, `specimenEntries.map((specimenEntry) => ...)`
- **No Unjustified Duplicate Names:** Avoid giving two files, folders, variables, or classes the same name unless there is a clear contextual reason (for example, two completely separate page stylesheets may define the same component class name, but the CSS files themselves must have distinct, context-specific filenames).
- **Prefer Explicit, Self-Documenting Names:**
  - **Files & Folders:** Describe *what* the file belongs to and *what* it does (e.g., `nrki-broadsheet-library.css`, `broadsheet-magazine-shell.css`, `broadsheet-magazine-viewer.js`).
  - **CSS Custom Properties:** Use clear semantic names that communicate surface/ink/border/accent/geometry role (e.g., `--nrki-surface-paper`, `--nrki-ink-primary`, `--nrki-border-strong`).
  - **CSS Classes:** Use clear, descriptive component-prefixed names (e.g., `.nrki-button`, `.nrki-specimen-card`, `.nrki-masthead-bar`).
  - **JavaScript Identifiers:** Name functions after the exact action + target (e.g., `renderBroadsheetSpecimenCard`, `copyActiveCodeSnippetToClipboard`, `applyThemeModeToSpecimenStage`).

---

## 3. Readability, Rationale & Structured Commenting
- **Divide every file into clear, labeled sections** using consistent banner comments (e.g., `/* ========================================================================== */` in CSS/JS and `<!-- ======== ... ======== -->` in HTML) so anyone reading the file can scan its architecture immediately.
- **Explain *both* the code and the *reason* for the approach:** In either the documentation (`MAGAZINES_SPEC.md` / `ARCHITECTURE.md`) or directly in code comments, always explain *what* a non-obvious block does **and *why* that specific approach was chosen** over alternatives (e.g., why `@layer` was chosen over `!important`, why `[data-theme]` is container-scoped, why a DOM pattern or state shape was chosen).
- **Favor clarity over cleverness:** Write straightforward, readable HTML, CSS, and JavaScript that is easy for a solo developer to understand and extend months later.

---

## 4. Mandatory Spec Synchronization & Branch Workflow
- **Always update the spec `.md` file on every change:** Whenever **any** structural, visual, token, component, or workflow change is made, update `MAGAZINES_SPEC.md` (and later `ARCHITECTURE.md`) in the **same turn/commit** so the spec never drifts out of sync with the code.
- **`main` (Production — `nrki.in`):** Keep clean and live; do not push experimental rework directly to `main`.
- **`dev` (Development — `dev.nrki.pages.dev`):** Perform all v2 CSS library, Magazine Issue 01, and feature development on `dev` first.
