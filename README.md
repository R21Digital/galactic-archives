# Galactic Archives

A unified Star Wars Galaxies knowledge hub combining:
- SWG Restoration Wiki
- SWG Fandom data
- Exclusive in-game intelligence curated by the Eye of the Galactic Beholder

Built using Eleventy (11ty) and maintained by R21 Digital.
This fan-made project is not affiliated with or endorsed by Lucasfilm or Disney.

## Requirements

- Node.js 18 (see `.nvmrc`)

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
npm install axios cheerio
```

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

Install the required Python packages:

```bash
pip install -r requirements.txt
```

After installation, run the test suite:

```bash
pytest
```
