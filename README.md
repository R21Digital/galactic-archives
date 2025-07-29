# Galactic Archives

A unified Star Wars Galaxies knowledge hub combining:
- SWG Restoration Wiki
- SWG Fandom data
- Exclusive in-game intelligence curated by the Eye of the Galactic Beholder

Built using Eleventy (11ty) and maintained by R21 Digital.
This fan-made project is not affiliated with or endorsed by Lucasfilm or Disney.

## Requirements

- Node.js 18 (see `.nvmrc`)

## Setup

Install the Node modules and Python packages before running tests or scripts:

```bash
npm install
pip install -r requirements.txt
```

You can also install the Python packages via `make deps`.

These steps are required prior to using `npm test` or `pytest`.

## Data Import

The `/scripts` folder contains scrapers to pull data from:

- [SWGR Wiki](https://swgr.org/wiki/)
- [SWG Fandom](https://swg.fandom.com/wiki/)
- Internal "Beholder" project exports

Run the import scripts:

```bash
npm run import:swgr
npm run import:fandom
node scripts/import_beholder_data.js <export_directory>
```

## Activity Monitor

Fetch recent edits from the SWGR wiki. By default the monitor runs in **offline**
mode using the bundled `data/sample-activity.html`:

```bash
npm run fetch:activity
```

The parsed results are written to `data/recent-activity.json`.

To download the live activity feed set `USE_OFFLINE_MODE=false` when invoking
the script:

```bash
USE_OFFLINE_MODE=false npm run fetch:activity
```

Environment variables can also be configured in a `.env` file:

```bash
USE_OFFLINE_MODE=false
WIKI_URL=https://swgr.org/wiki/special/activity/
OUTPUT_PATH=./data/recent-activity.json
```

Running `node scripts/fetchActivityLog.js` will then honor these settings.

## Content Classification

Run `npm run classify` to execute the hybrid rule+AI classifier. By default the script reads from `data/sample-hint.md` and writes metadata to `classified/sample-hint.json`. When running it manually you can override these paths with `--input <file>` and `--output <file>`.

## Development

Start a local development server:

```bash
npm start
```

This runs the Eleventy preview server.

Generate a production build with:

```bash
npm run build
```

### Linting

Run ESLint on the source and script files:

```bash
npm run lint
```

### Python dependencies

Install the required Python packages:

```bash
pip install -r requirements.txt
```

## Testing

Run the test suite with:

```bash
pytest
```

Be sure to install dependencies first by running `pip install -r requirements.txt`.

## Internal Routes

The site includes a private `/internal/` section used for team-only resources. Pages in this directory set `eleventyExcludeFromCollections: true`, so they remain hidden from generated indexes. Search engines are also instructed not to crawl these routes via the `Disallow: /internal/` rule in [`public/robots.txt`](public/robots.txt). The search index honors this flag as well.

## Categories

Eleventy scans every Markdown file for a `category` value in its front matter and builds a collection for each unique category. Listing pages like `/professions/` and `/quests/` use the `src/layouts/categories/index.njk` layout to display these collections. When you add `category: MyCategory` to a page, it automatically shows up on `/mycategory/` if that listing page exists.

## JSON API

Use the following endpoints to access the raw Profession and Quest data generated for the site.
See the [JSON API overview](src/api/index.md) for details on each endpoint:

- `/api/professions.json`
- `/api/quests.json`

These files are produced at build time and flagged with `eleventyExcludeFromCollections: true` so they stay off the main navigation and out of the search index.

Example usage with `fetch`:

```javascript
fetch('/api/quests.json')
  .then(res => res.json())
  .then(data => console.log(data));

fetch('/api/professions.json')
  .then(res => res.json())
  .then(data => console.log(data));
```
