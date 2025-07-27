import fs from 'fs';
import path from 'path';

const baseURL = 'https://swgr.org/wiki/';

const pages = [
  'Legacy_Quest',
  'Professions',
  'Kashyyyk',
  'Heroics'
];

async function fetchAndSave(page) {
  try {
    const res = await fetch(baseURL + page);
    if (!res.ok) {
      console.error(`Failed to fetch ${page}: ${res.status} ${res.statusText}`);
      return;
    }
    const html = await res.text();
    const filePath = path.join('data/raw/swgr_restoration', `${page}.html`);
    fs.writeFileSync(filePath, html);
    console.log(`Saved ${page}`);
  } catch (err) {
    console.error(`Error fetching ${page}:`, err);
  }
}

async function run() {
  for (const page of pages) {
    await fetchAndSave(page);
  }
}

run();
