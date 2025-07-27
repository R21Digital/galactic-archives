# Galactic Archives

A unified Star Wars Galaxies knowledge hub combining:
- SWG Restoration Wiki
- SWG Fandom data
- Exclusive in-game intelligence curated by the Eye of the Galactic Beholder

Built using Eleventy (11ty) and maintained by R21 Digital.
This fan-made project is not affiliated with or endorsed by Lucasfilm or Disney.

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

Parsed data is stored in `/data/raw`, to be transformed later by custom loaders.
