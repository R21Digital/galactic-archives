import fs from 'fs';
import fetch from 'node-fetch';
import path from 'path';

const fandomBase = 'https://swg.fandom.com/wiki/';

const fandomPages = [
  'Legacy_Quest',
  'Professions',
  'Star_Wars_Galaxies',
  'Quest'
];

async function fetchAndSave(page) {
  const res = await fetch(fandomBase + page);
  const html = await res.text();
  const filePath = path.join('data/raw/swg_fandom', `${page}.html`);
  fs.writeFileSync(filePath, html);
  console.log(`Saved ${page}`);
}

async function run() {
  for (const page of fandomPages) {
    await fetchAndSave(page);
  }
}

run();
