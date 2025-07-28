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

The script writes updates to `data/recent-activity.json`. Install its dependencies with:

```bash
npm install axios cheerio dotenv
```

You can also override the default wiki URL or output location. Copy `.env.example` to `.env` and update the values:

```bash
WIKI_URL=https://swgr.org/wiki/special/activity/
OUTPUT_PATH=./data/recent-activity.json
```

These values are loaded automatically when running the script.

Parsed data is stored in `/data/raw`, to be transformed later by custom loaders.

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

Install the required Python packages (the list includes `pytest`):

```bash
pip install -r requirements.txt
```

After installation, run the test suite:

```bash
pytest
```

## Internal Routes

The site includes a private `/internal/` section used for team-only resources. Pages in this directory set `eleventyExcludeFromCollections: true`, so they remain hidden from generated indexes. Search engines are also instructed not to crawl these routes via the `Disallow: /internal/` rule in [`public/robots.txt`](public/robots.txt).
