# Galactic Archives

A unified Star Wars Galaxies knowledge hub combining:
- SWG Restoration Wiki
- SWG Fandom data
- Exclusive in-game intelligence curated by the Eye of the Galactic Beholder

Built using Eleventy (11ty) and maintained by R21 Digital.
This fan-made project is not affiliated with or endorsed by Lucasfilm or Disney.

## Requirements

- Node.js 18 (see `.nvmrc`)
- `cheerio` pinned to `1.0.0-rc.12` for Node 18 compatibility

## Setup

Install the Node modules and Python packages before running tests or scripts:

```bash
npm install
pip install -r requirements.txt
```

You can also install the Python packages via `make deps`.

These steps are required prior to using `npm test` or `pytest`. You can also
run `make test` to install dependencies and execute all tests in one command.

## Environment File

Copy `.env.example` to `.env` and adjust the values as needed. The file
defines environment variables used by scripts and the site itself. For
instance, `DISCORD_INVITE_CODE` controls the invite link shown on
`/community/`:

```bash
DISCORD_INVITE_CODE=YOUR-DISCORD-CODE
```

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

Install dependencies if you haven't already:

```bash
npm install
pip install -r requirements.txt
```

Run the test suites:

```bash
npm test
pytest
```

Alternatively run `make test` to perform all of the above in one step.

## Internal Routes

The site includes a private `/internal/` section used for team-only resources. Pages in this directory set `eleventyExcludeFromCollections: true`, so they remain hidden from generated indexes. Search engines are also instructed not to crawl these routes via the `Disallow: /internal/` rule in [`public/robots.txt`](public/robots.txt). The search index honors this flag as well.

## Help & Community Routes

- `/help/` - Overview of site features and resources for new players.
- `/community/` - Invitation page for joining our Discord and sharing tips.
- `/community-standards/` - Guidelines for respectful participation.
- `/blog/` - News posts and project updates.
- `/patch-notes/` - Archive of recent changes and fixes.

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

## SEO & Sitemap

Global site details like the name, base URL and description live in
`src/_data/metadata.js`. These values populate the `seo.njk` partial which
generates meta tags for each page. A sitemap is built from `collections.all`
and written to `/sitemap.xml` during the Eleventy build.

Run the validation script to confirm these files exist:

```bash
python scripts/codex_validation_batch_016.py
```
