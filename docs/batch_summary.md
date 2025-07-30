### Batch 065 – Hybrid Input Intelligence Foundations

Added vision/capture_screen.py for screenshot capture.

Added vision/ocr_engine.py for Tesseract OCR wrapper.

Added vision/ocr_utils.py for basic text cleanup.

Introduced network/chat_listener.py for basic simulated chat listening.

Created tests for OCR and chat.

Created scripts/codex_validation_batch_065.py.

### Batch 002 – Sidebar Layout Enhancements

Introduced `base.njk` layout featuring a sidebar navigation area.

Added `sidebar.njk` partial that lists pages grouped by category.

Updated `main.css` with flexbox-based `.layout`, `.sidebar`, and `.content` classes for responsive page layout.

Added category front matter to markdown files to populate the sidebar menu.

### Batch 003 – Breadcrumb and Template Improvements

Created `breadcrumbs.njk` to show a simple navigation trail.

Updated `base.njk` to include the breadcrumbs and page metadata section.

Enhanced `head.njk` with a dynamic meta description for each page.

Extended `main.css` with styles for breadcrumbs, headers, and meta info.

### Batch 004 – Search Integration

Added client-side search powered by Fuse.js for fuzzy matching across titles, categories, and tags.

- New `searchbox.njk` partial inserts a search bar on every page.
- `head.njk` now loads Fuse.js and a custom search script.
- `base.njk` includes the search box above breadcrumbs and displays metadata in a single block.
- `search.js` initializes Fuse and renders results live as the user types.
- Generated `search-index.json` lists title, category, tags, and URL for each page.
- Added basic styling for the search components.

### Batch 005 – Special:Activity Monitor

Added `scripts/fetchActivityLog.js` to pull recent changes from the SWGR wiki and save them to `data/recent-activity.json`.

The script uses `axios` and `cheerio` to parse titles and links from the activity page.

### Batch 006 – Internal Documentation Framework

Created an `/internal/` route for private pages.

Introduced `internal.njk` layout that mirrors the main site but displays an `access-warning.njk` banner.

Added `src/internal/ms11-status.md` to track MS11 progress; these pages use `eleventyExcludeFromCollections: true` so they stay out of the sidebar and search results.

### Batch 007 – Category Listing Pages

Added the `src/layouts/categories/index.njk` layout to display lists of items within a category.

Created `professions.md` and `quests.md` in `src/content` to show the Professions and Quests collections using pagination.

Updated `.eleventy.js` to automatically discover categories from front matter and generate collections for each one.
Created scripts/codex_validation_batch_007.py.

### Batch 008 – Home Page & Category Directory

Added a new landing page at `src/index.md` that uses the `homepage.njk` layout.

Introduced `src/layouts/homepage.njk` to display a grid of category links.

Extended `main.css` with `.category-grid` styles.

The landing page now automatically links to every discovered category.
Created scripts/codex_validation_batch_008.py.

### Batch 009 – JSON API Endpoints

Added `/api/quests.json` and `/api/professions.json` to expose the processed quest and profession data. A new section in the README explains how to `fetch` these endpoints. Both routes are hidden from navigation and search results via `eleventyExcludeFromCollections`.

### Batch 010 – Codex Compatibility Updates

Introduced offline fetching using `data/sample-activity.html` to allow Codex compatibility testing without internet access.
Replaced `axios` with the native `fetch` API and added `USE_OFFLINE_MODE` and `WIKI_URL` toggles in `fetchActivityLog.js`.
New `npm run fetch:activity` command supports offline and online modes via environment variables.

### Batch 014 – Blog System + Patch Notes

Created a `/blog/` route to host news posts. Each entry is written in Markdown and rendered with the `blog-post.njk` layout.

Introduced a `/patch-notes/` route for release notes. These Markdown files use the `patch-note.njk` layout.

### Batch 013 – Community & Help Pages

Added /help/, /community-standards/, and /community/ pages for site guidance and community engagement. Updated the footer with new links and improved styling.
