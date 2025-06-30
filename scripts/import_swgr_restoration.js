import fs from 'fs';
import fetch from 'node-fetch';
import path from 'path';

const baseURL = 'https://swgr.org/wiki/';

const pages = [
  'Legacy_Quest',
  'Professions',
  'Kashyyyk',
  'Heroics'
];

async function fetchAndSave(page) {
  const res = await fetch(baseURL + page);
  const html = await res.text();
  const filePath = path.join('data/raw/swgr_restoration', `${page}.html`);
  fs.writeFileSync(filePath, html);
  console.log(`Saved ${page}`);
}

async function run() {
  for (const page of pages) {
    await fetchAndSave(page);
  }
}

run();
