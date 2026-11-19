# Static PDF Resumes (`assets/resumes/`)

Place your static, downloadable PDF resume files in this directory so the **PDF ↓** buttons on `pages/about.html` and the individual resume pages resolve directly:

- `Raj_CV_General.pdf` — Linked from the General CV card & `pages/resumes/general.html`
- `Raj_CV_Frontend.pdf` — Linked from the Front-End Resume card & `pages/resumes/resume.html`

## Generating a PDF Directly from the Web Resume

Every web resume page (`pages/resumes/*.html`) includes a dedicated `@media print` stylesheet inside `assets/styles/style.css`:

1. Open `pages/resumes/general.html` or `pages/resumes/resume.html` in your browser.
2. Click the **Print / Save as PDF ⎙** button (or press `Ctrl+P` / `Cmd+P`).
3. Choose **Save as PDF** (disable browser "Headers and footers" in the print dialog for the cleanest look).
4. Save the output right into this `assets/resumes/` folder!

