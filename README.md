# Venkata Sai — Data Analyst Portfolio

This repository contains the static, built version of the portfolio website. It is designed to run on GitHub Pages and does not require Supabase, a database, environment variables, or a backend service.

## Files

- `index.html` — website entry point
- `assets/` — compiled site JavaScript/CSS, project images, and hero videos
- `favicon.svg`, `icons.svg` — site icons
- `fallback.js`, `content.js` — static content data and loader helpers retained for reference/future source integration
- `.github/workflows/deploy.yml` — deploys the static site to GitHub Pages when changes are pushed to `main`

## Deploy with GitHub Pages

1. Commit and push these files to the repository's `main` branch.
2. In GitHub, open **Settings → Pages**.
3. Set **Build and deployment → Source** to **GitHub Actions**.
4. Open the **Actions** tab and confirm that **Deploy portfolio to GitHub Pages** completes successfully.

The workflow publishes `index.html`, `assets/`, `favicon.svg`, and `icons.svg`. No Supabase secrets or repository secrets are required.

## Editing portfolio content

The uploaded repository is a compiled site and does not include the original React `src/` folder or `package.json`. The public website therefore continues to use the content embedded in its existing compiled JavaScript bundle. `fallback.js` contains the static content data retained in this package, but changing it alone will not change the already-compiled public bundle. For full source-level content changes, keep the original React source project separately and rebuild the site before deployment.

## Local preview

From this folder, start a simple static server (for example, `python3 -m http.server 8000`) and open `http://localhost:8000`.
