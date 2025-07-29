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

Fetch recent edits from the SWGR wiki:

```bash
npm run fetch:activity
```

The script writes updates to `data/recent-activity.json`. It defaults to offline mode and
parses `data/sample-activity.html`. Run the script directly with:

```bash
node scripts/fetchActivityLog.js
```

Set `USE_OFFLINE_MODE=false` to fetch live data from the wiki instead.

You can also override the default wiki URL or output location. Copy `.env.example` to `.env` and update the values:

```bash
WIKI_URL=https://swgr.org/wiki/special/activity/
OUTPUT_PATH=./data/recent-activity.json
```

These values are loaded automatically when running the script.

Parsed data is stored in `/data/raw`, to be transformed later by custom loaders.

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
