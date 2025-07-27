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
