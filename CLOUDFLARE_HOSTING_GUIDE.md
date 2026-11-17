# NRKI — Cloudflare Hosting, Custom Domain, SPA & Database Guide

This guide walks through how to host **NRKI** for free on **Cloudflare Pages**, connect your **GoDaddy domain**, deploy **multiple future React SPAs** (on subdomains or subpaths), and set up **Cloudflare D1 (SQLite) databases** for your personal database-backed projects.

---

## Why This Architecture Works Best for NRKI

- **100% Free Tier (No Credit Card Required):** Cloudflare Pages, Cloudflare DNS, Cloudflare Workers, and Cloudflare D1 all work on the free plan without requiring a credit card upfront.
- **Unlimited Static & SPA Bandwidth:** Your main site, `.txt`/`.json` content files, resumes, and future React SPAs get unlimited bandwidth on Cloudflare's global edge network.
- **Unlimited Free Subdomains on 1 GoDaddy Domain:** Once your GoDaddy domain points to Cloudflare DNS, you only ever pay GoDaddy for the single base domain (`yourdomain.com`), while creating as many project subdomains as you like (`synth.yourdomain.com`, `notes.yourdomain.com`, `game.yourdomain.com`) for ₹0.
- **Serverless SQLite Database (Cloudflare D1):** Ideal for personal databases (catalogs, project logs, tools, trackers) with 5 GB free storage and no database sleep/pausing after 7 days of inactivity.

---

## Step 1: Push the NRKI Project to GitHub

Cloudflare Pages connects to your GitHub repository and automatically deploys your site every time you run `git push`.

1. Go to [github.com/new](https://github.com/new) and create a new repository (for example, `nrki-site`). It can be **Public** or **Private**.
2. Open PowerShell / Terminal inside your project folder (`c:\Users\raydr\Projects\NRKI AG`) and run:

```powershell
git init
git add .
git commit -m "Initial NRKI broadsheet site"
git branch -M main
git remote add origin https://github.com/<your-github-username>/nrki-site.git
git push -u origin main
```

> **Tip for Routine Content Updates:** Later, whenever you add a new `.txt` file and update `index.json` inside `content/`, just run:
> ```powershell
> git add .
> git commit -m "Add new entry"
> git push
> ```
> Cloudflare will automatically rebuild and publish your changes within ~20 seconds.

---

## Step 2: Deploy NRKI on Cloudflare Pages

1. Sign up or log in at [dash.cloudflare.com](https://dash.cloudflare.com/).
2. In the left sidebar, click **Compute (Workers & Pages)** → click **Create**.
3. Select the **Pages** tab at the top → click **Connect to Git**.
4. Connect your GitHub account and choose your **`nrki-site`** repository.
5. On the **Set up builds and deployments** screen, fill in:
   - **Project name:** `nrki` *(gives you a free `https://nrki.pages.dev` preview URL)*
   - **Production branch:** `main`
   - **Framework preset:** `None`
   - **Build command:** *(Leave completely empty — NRKI uses plain HTML, CSS, and JS with no build step)*
   - **Build output directory:** `/` *(or leave empty so Cloudflare serves the root directory)*
6. Click **Save and Deploy**.
7. Wait ~30 seconds. Your site is now live at `https://nrki.pages.dev`!

---

## Step 3: Connect Your GoDaddy Domain to Cloudflare

To use your own domain (e.g., `nrki.in` or `nrki.com`) and unlock free SSL + unlimited project subdomains:

### 3A. Add the Domain in Cloudflare
1. In the Cloudflare dashboard sidebar, click **Websites** → **Add a domain**.
2. Enter your GoDaddy domain name (e.g., `yourdomain.com`) and click **Continue**.
3. Scroll down, select the **Free ($0)** plan, and click **Continue**.
4. Cloudflare will scan existing DNS records and then display **2 Cloudflare Nameservers**, which look like:
   - `ada.ns.cloudflare.com`
   - `bob.ns.cloudflare.com`
   *(Keep this tab open so you can copy them).*

### 3B. Point GoDaddy Nameservers to Cloudflare
1. Log in to your [GoDaddy Portfolio](https://dcc.godaddy.com/).
2. Click your domain → go to the **DNS** tab → click **Nameservers**.
3. Click **Change Nameservers** → select **"I'll use my own nameservers"**.
4. Paste the **2 Cloudflare Nameservers** from Step 3A and click **Save** / **Continue**.
5. Go back to Cloudflare and click **Check nameservers now**.
   - *Note:* Nameserver propagation typically takes **10 to 30 minutes** (occasionally up to a few hours). Cloudflare will email you as soon as the domain status turns **Active**.

### 3C. Attach the Domain to Your NRKI Pages Site
1. In Cloudflare, go to **Compute (Workers & Pages)** → click your **`nrki`** project.
2. Open the **Custom domains** tab → click **Set up a custom domain**.
3. Enter `yourdomain.com` → click **Continue** → click **Activate domain**.
4. *(Optional)* Repeat for `www.yourdomain.com` so both `yourdomain.com` and `www.yourdomain.com` open NRKI with automatic HTTPS.

---

## Step 4: Hosting Future React SPAs

As you build more projects and React SPAs, you have **two clean ways** to host them under your domain:

### Method A: Separate Repo + Free Subdomain (`project.yourdomain.com`) — *Recommended for Full SPAs*
Use this when you build a full React/TypeScript SPA using **Vite**, **Next.js (Static Export)**, or **Create React App**.

1. Create a new GitHub repository for the project (e.g., `audio-synth-spa`) and push your React code.
2. In Cloudflare, go to **Compute (Workers & Pages)** → **Create** → **Pages** → **Connect to Git** and select `audio-synth-spa`.
3. Configure the build settings (for a standard Vite + React app):
   - **Framework preset:** `Vite`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. Click **Save and Deploy**.
   - *SPA Routing Note:* Cloudflare Pages automatically serves `index.html` for client-side routes (`React Router`) when there is no top-level `404.html` file.
5. Open the project's **Custom domains** tab → click **Set up a custom domain** → type `synth.yourdomain.com`.
6. Cloudflare automatically adds the `CNAME` DNS record and SSL certificate!
7. Finally, add the project to NRKI's Projects Shelf:
   - Create `content/projects/audio-synth.txt` with your project write-up.
   - Add an entry in `content/projects/index.json` with a link to `https://synth.yourdomain.com`.

---

### Method B: Subfolder Inside the NRKI Repo (`yourdomain.com/pages/my-app.html`) — *Best for Mini Web-Art & Small React Islands*
Use this for smaller single-page experiments, interactive poems, or web-art pieces that don't need their own separate repository:

1. Create an HTML file inside `pages/` or a subfolder like `pages/webart/my-piece.html`.
2. Mount React either using the included lightweight runtime (`assets/scripts/vendor/react-local.js`, just like `pages/gallery.html` does) or bundle a Vite app with `base: '/pages/webart/my-piece/'` in `vite.config.js` and copy its `dist/` output into that folder.
3. Commit and `git push`—it will immediately be live at `https://yourdomain.com/pages/webart/my-piece/`.

---

## Step 5: Adding a Personal Database Later (Cloudflare D1 + Pages Functions)

When you build a project that needs a database for your own data (e.g., a custom tracker, archive, or dynamic project):

### 5A. Create a Free Serverless SQLite Database (D1)
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

### 5B. Create Tables & Seed Your Data
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

### 5C. Query the Database from Your Project (Pages Functions)
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
3. Push to GitHub—Cloudflare deploys both your React frontend and your `/api/entries` database endpoint together under the same subdomain (`https://my-project.yourdomain.com`).

---

## Quick Reference Summary

| What You Are Doing | Where You Do It | Cost |
| :--- | :--- | :--- |
| **Buying / Renewing Base Domain** (`yourdomain.com`) | GoDaddy (supports UPI / Google Pay) | Domain renewal only |
| **Publishing New NRKI Works / Projects / Pins** | Edit `content/<tab>/*.txt` + `index.json` → `git push` | Free |
| **Adding a New Standalone React SPA** | New GitHub Repo → Cloudflare Pages → Custom Domain `app.yourdomain.com` | Free |
| **Adding a Personal SQL Database** | `npx wrangler d1 create <name>` + `functions/api/...` | Free (up to 5 GB & 5M reads/day) |

