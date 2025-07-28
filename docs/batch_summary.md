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
