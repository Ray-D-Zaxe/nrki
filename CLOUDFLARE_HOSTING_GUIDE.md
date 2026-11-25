# NRKI — Cloudflare Hosting, Custom Domain, SPA & Database Guide

This guide walks through how to host **NRKI** for free on **Cloudflare Pages**, connect your **Hostinger domain** (`nrki.in`), deploy **multiple future React SPAs** (on subdomains or subpaths), and set up **Cloudflare D1 (SQLite) databases** for your personal database-backed projects.

---

## Why This Architecture Works Best for NRKI

- **100% Free Tier (No Credit Card Required):** Cloudflare Pages, Cloudflare DNS, Cloudflare Workers, and Cloudflare D1 all work on the free plan without requiring a credit card upfront.
- **Unlimited Static & SPA Bandwidth:** Your main site, `.txt`/`.json` content files, resumes, and future React SPAs get unlimited bandwidth on Cloudflare's global edge network.
- **Unlimited Free Subdomains on 1 Hostinger Domain:** Once your Hostinger domain (`nrki.in`) points to Cloudflare DNS, you only ever pay Hostinger for the single base domain (`nrki.in`), while creating as many project subdomains as you like (`synth.nrki.in`, `notes.nrki.in`, `game.nrki.in`) for ₹0.
- **Serverless SQLite Database (Cloudflare D1):** Ideal for personal databases (catalogs, project logs, tools, trackers) with 5 GB free storage and no database sleep/pausing after 7 days of inactivity.

---

## Step 1: Your Git Branch Setup (`main` vs `dev`)

Your repository (`https://github.com/Ray-D-Zaxe/nrki.git`) is already initialized and organized into two separate branches:

| Branch | Purpose | What Lives Here | Cloudflare Pages URL |
| :--- | :--- | :--- | :--- |
| **`main`** *(Production)* | Public live site | Clean general front page, **About & Resumes** live (`general.html` & `resume.html`), while **Gallery, Projects, Works, and Media** display an *"Under Construction"* page until you are ready to launch them. | `https://nrki.in` & `https://nrki.pages.dev` |
| **`dev`** *(Development / Staging)* | Full working build & content drafting | All interactive React `<Shelf />` pages, the Gallery Pinboard SPA (`gallery-spa.js`), `project-view.html` / `work-view.html`, and all `.txt` + `index.json` content files. | `https://dev.nrki.pages.dev` *(automatic preview URL!)* |

### Initial Push to GitHub (If Not Already Done)
```powershell
git remote add origin https://github.com/Ray-D-Zaxe/nrki.git
git push -u origin dev
git push -u origin main --force
```

---

## Step 2: How to Work on `dev` and Promote Sections to `main` (Prod)

Because `main` and `dev` are independent branches, you can safely write drafts, test formatting, and build sections on `dev` without affecting your public `main` site.

### A. Day-to-Day Editing on `dev`
Whenever you want to write new `.txt` posts, add projects, or tweak the full shelves:
```powershell
# 1. Switch to the dev branch
git checkout dev

# 2. Edit your files (e.g. content/projects/index.json + .txt), then commit & push
git add .
git commit -m "Add new project entry on dev"
git push origin dev
```
*(Every push to `dev` updates your live staging preview at `https://dev.nrki.pages.dev` automatically without touching `main`!)*

### B. Publishing ONLY ONE Section from `dev` to `main` (While Others Stay "Under Construction")
Suppose you finish adding your real **Projects** on `dev`, and want **Projects** to go live on `main` while keeping Gallery, Works, and Media under construction:
```powershell
# 1. Switch to the production branch
git checkout main

# 2. Pull ONLY the Projects page and its content folder from dev into main
git checkout dev -- pages/projects.html pages/project-view.html content/projects/

# 3. Commit and push to main (Cloudflare deploys this to your live domain in ~20s)
git add .
git commit -m "Publish Projects section to production"
git push origin main
```
You can do the exact same thing later for **Works** (`git checkout dev -- pages/works.html pages/work-view.html content/works/`), **Gallery** (`git checkout dev -- pages/gallery.html content/gallery/`), or **Media** (`git checkout dev -- pages/media.html content/media/`).

### C. Publishing EVERYTHING from `dev` to `main` at Once
Once all four sections on `dev` are ready to replace the "Under Construction" pages on `main`:
```powershell
git checkout main
git merge dev
git push origin main
```
*(Note: `git merge dev` **never** deletes the `dev` branch—you can switch right back with `git checkout dev` anytime).*

---

## Step 3: Deploy NRKI on Cloudflare Pages

1. Sign up or log in at [dash.cloudflare.com](https://dash.cloudflare.com/).
2. In the left sidebar, click **Compute (Workers & Pages)** → click **Create**.
3. Select the **Pages** tab at the top → click **Connect to Git**.
4. Connect your GitHub account and choose your **`Ray-D-Zaxe/nrki`** repository.
5. On the **Set up builds and deployments** screen, fill in:
   - **Project name:** `nrki` *(gives you `https://nrki.pages.dev` for `main` and `https://dev.nrki.pages.dev` for `dev`)*
   - **Production branch:** `main`
   - **Framework preset:** `None`
   - **Build command:** *(Leave completely empty — NRKI uses plain HTML, CSS, and JS with no build step)*
   - **Build output directory:** `/` *(or leave empty so Cloudflare serves the root directory)*
6. Click **Save and Deploy**.
7. Wait ~30 seconds:
   - Your production **`main`** branch is now live at `https://nrki.pages.dev`.
   - Whenever you push to **`dev`**, Cloudflare Pages also builds a separate preview at `https://dev.nrki.pages.dev`.

---

## Step 4: Connect Your Hostinger Domain (`nrki.in`) to Cloudflare

To use your Hostinger domain (`nrki.in`) and unlock free SSL + unlimited project subdomains:

### 4A. Add the Domain in Cloudflare
1. In the Cloudflare dashboard sidebar, click **Websites** → **Add a domain**.
2. Enter your Hostinger domain name (`nrki.in`) and click **Continue**.
3. Scroll down, select the **Free ($0)** plan, and click **Continue**.
4. Cloudflare will scan existing DNS records and then display **2 Cloudflare Nameservers**, which look like:
   - `ada.ns.cloudflare.com`
   - `bob.ns.cloudflare.com`
   *(Keep this tab open so you can copy them).*

### 4B. Point Hostinger Nameservers to Cloudflare
1. Log in to your [Hostinger hPanel](https://hpanel.hostinger.com/).
2. In the top navigation bar, go to **Domains** → click **Manage** next to **`nrki.in`**.
3. In the left sidebar under **Domain Overview** (or **DNS / Nameservers**), click **Change** next to **Nameservers**.
4. Select **"Change nameservers"** (instead of "Use Hostinger nameservers").
5. Delete the existing `ns1.dns-parking.com` / `ns2.dns-parking.com` entries, paste the **2 Cloudflare Nameservers** from Step 4A into the first two boxes, and click **Save**.
6. Go back to Cloudflare and click **Check nameservers now**.
   - *Note:* Nameserver propagation typically takes **10 to 30 minutes** (occasionally up to a few hours). Cloudflare will email you as soon as the domain status turns **Active**.

### 4C. Attach `nrki.in` to Your NRKI Pages Site
1. In Cloudflare, go to **Compute (Workers & Pages)** → click your **`nrki`** project.
2. Open the **Custom domains** tab → click **Set up a custom domain**.
3. Enter `nrki.in` → click **Continue** → click **Activate domain**.
4. *(Optional)* Repeat for `www.nrki.in` so both `nrki.in` and `www.nrki.in` open NRKI with automatic HTTPS.

---

## Step 5: Hosting Future React SPAs

As you build more projects and React SPAs, you have **two clean ways** to host them under `nrki.in`:

### Method A: Separate Repo + Free Subdomain (`project.nrki.in`) — *Recommended for Full SPAs*
Use this when you build a full React/TypeScript SPA using **Vite**, **Next.js (Static Export)**, or **Create React App**.

1. Create a new GitHub repository for the project (e.g., `audio-synth-spa`) and push your React code.
2. In Cloudflare, go to **Compute (Workers & Pages)** → **Create** → **Pages** → **Connect to Git** and select `audio-synth-spa`.
3. Configure the build settings (for a standard Vite + React app):
   - **Framework preset:** `Vite`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. Click **Save and Deploy**.
   - *SPA Routing Note:* Cloudflare Pages automatically serves `index.html` for client-side routes (`React Router`) when there is no top-level `404.html` file.
5. Open the project's **Custom domains** tab → click **Set up a custom domain** → type `synth.nrki.in`.
6. Cloudflare automatically adds the `CNAME` DNS record and SSL certificate!
7. Finally, add the project to NRKI's Projects Shelf:
   - Create `content/projects/audio-synth.txt` with your project write-up.
   - Add an entry in `content/projects/index.json` with a link to `https://synth.nrki.in`.

---

### Method B: Subfolder Inside the NRKI Repo (`nrki.in/pages/my-app.html`) — *Best for Mini Web-Art & Small React Islands*
Use this for smaller single-page experiments, interactive poems, or web-art pieces that don't need their own separate repository:

1. Create an HTML file inside `pages/` or a subfolder like `pages/webart/my-piece.html`.
2. Mount React either using the included lightweight runtime (`assets/scripts/vendor/react-local.js`, just like `pages/gallery.html` does) or bundle a Vite app with `base: '/pages/webart/my-piece/'` in `vite.config.js` and copy its `dist/` output into that folder.
3. Commit and `git push`—it will immediately be live at `https://nrki.in/pages/webart/my-piece/`.

---

## Step 6: Adding a Personal Database Later (Cloudflare D1 + Pages Functions)

When you build a project that needs a database for your own data (e.g., a custom tracker, archive, or dynamic project):

### 6A. Create a Free Serverless SQLite Database (D1)
1. Inside your new project's folder, open the terminal and log in to Cloudflare's Wrangler CLI:
   ```powershell
   npx wrangler login
   ```
2. Create a new D1 SQLite database:
   ```powershell
   npx wrangler d1 create my-project-db
   ```
3. Wrangler will print a `[[d1_databases]]` configuration block. Paste it into a `wrangler.toml` file at the root of that project:
   ```toml
   name = "my-spa-project"
   pages_build_output_dir = "dist"
   compatibility_date = "2026-11-01"

   [[d1_databases]]
   binding = "DB"
   database_name = "my-project-db"
   database_id = "<your-database-id-from-terminal>"
   ```

### 6B. Create Tables & Seed Your Data
1. Create a `schema.sql` file in your project:
   ```sql
   CREATE TABLE IF NOT EXISTS entries (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     title TEXT NOT NULL,
     body TEXT NOT NULL,
     created_at DATETIME DEFAULT CURRENT_TIMESTAMP
   );

   INSERT INTO entries (title, body) VALUES ('First DB Entry', 'Stored in Cloudflare D1 SQLite.');
   ```
2. Apply it to your remote Cloudflare database:
   ```powershell
   npx wrangler d1 execute my-project-db --remote --file=./schema.sql
   ```

### 6C. Query the Database from Your Project (Pages Functions)
Inside your Cloudflare Pages project, any file placed in a `functions/` folder becomes a serverless API endpoint automatically!

1. Create `functions/api/entries.js`:
   ```javascript
   export async function onRequestGet(context) {
     // `context.env.DB` is your bound Cloudflare D1 database
     const { results } = await context.env.DB.prepare(
       "SELECT * FROM entries ORDER BY created_at DESC"
     ).all();

     return Response.json(results);
   }
   ```
2. In your React frontend, simply fetch `/api/entries`:
   ```javascript
   useEffect(() => {
     fetch("/api/entries")
       .then((res) => res.json())
       .then((data) => setEntries(data));
   }, []);
   ```
3. Push to GitHub—Cloudflare deploys both your React frontend and your `/api/entries` database endpoint together under the same subdomain (`https://my-project.nrki.in`).

---

## Quick Reference Summary

| What You Are Doing | Where / How You Do It | Cost |
| :--- | :--- | :--- |
| **Buying / Renewing Base Domain** (`nrki.in`) | Hostinger (`hostinger.in` — supports UPI / Google Pay) | Domain renewal only |
| **Drafting & Previewing Content on `dev`** | `git checkout dev` → edit `content/<tab>/*.txt` + `index.json` → `git push origin dev` (`https://dev.nrki.pages.dev`) | Free |
| **Promoting 1 Section from `dev` to `main`** | `git checkout main` → `git checkout dev -- pages/<page>.html content/<tab>/` → `git push origin main` | Free |
| **Promoting All of `dev` to `main`** | `git checkout main` → `git merge dev` → `git push origin main` | Free |
| **Adding a New Standalone React SPA** | New GitHub Repo → Cloudflare Pages → Custom Domain `app.nrki.in` | Free |
| **Adding a Personal SQL Database** | `npx wrangler d1 create <name>` + `functions/api/...` | Free (up to 5 GB & 5M reads/day) |

---

## Step 7: Getting `nrki.in` Indexed on Google Search Console & Bing Webmaster Tools

Your repository includes everything search engines need out of the box:
- **`https://nrki.in/robots.txt`** — Grants crawlers full indexing access and points automatically to `https://nrki.in/sitemap.xml`.
- **`https://nrki.in/sitemap.xml`** — Lists all canonical URLs (Front Page, Master Index, Magazines, Issue 01, About, Web & PDF Resumes, Projects, Works, and Media).
- **`https://nrki.in/pages/site-index.html`** — On-site Master Broadsheet Index with semantic crawlable HTML links to every page and all 32 Issue 01 specimens.
- **Canonical, OpenGraph, Twitter Card & JSON-LD Schema** — Embedded in `<head>` across all pages so search results display rich titles, descriptions, and author/site metadata.

### 7A. Verify `nrki.in` in Google Search Console (1-Click via Cloudflare DNS)
1. Open [Google Search Console](https://search.google.com/search-console/) and sign in with your Google account.
2. In the **Domain** property box on the left, enter **`nrki.in`** (without `https://`) and click **Continue**.
3. Google will detect that `nrki.in` uses **Cloudflare DNS**:
   - Click **Start verification** → sign in to Cloudflare when prompted → click **Authorize** to let Google add the `TXT` verification record automatically.
   - *(Alternative manual method)* Copy the `google-site-verification=...` TXT string shown by Google → in Cloudflare dashboard go to **Websites** → **`nrki.in`** → **DNS** → **Records** → **Add record** (`Type: TXT`, `Name: @`, `Content: <paste token>`) → Save → click **Verify** in Google Search Console.
4. In the Google Search Console left sidebar, click **Sitemaps**:
   - Under **Add a new sitemap**, type **`sitemap.xml`** (`https://nrki.in/sitemap.xml`) and click **Submit**.
5. Optional fast-track: Paste `https://nrki.in/` and `https://nrki.in/pages/site-index.html` into the top **Inspect any URL** bar in Google Search Console and click **Request Indexing**.

### 7B. Import into Bing Webmaster Tools (Covers Bing, DuckDuckGo, Yahoo & Ecosia)
1. Open [Bing Webmaster Tools](https://www.bing.com/webmasters/) and sign in.
2. Choose **Import from Google Search Console** → click **Import** (this verifies `nrki.in` and imports `https://nrki.in/sitemap.xml` in one click without adding another DNS record!).

