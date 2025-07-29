import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { load } from 'cheerio';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const USE_OFFLINE_MODE = process.env.USE_OFFLINE_MODE !== 'false';
const DEFAULT_WIKI_URL = 'https://swgr.org/wiki/special/activity/';
const SAMPLE_PATH = path.join(__dirname, '../data/sample-activity.html');
const OUTPUT_PATH = process.env.OUTPUT_PATH || path.join(__dirname, '../data/recent-activity.json');

export function fetchActivityOffline() {
  try {
    const html = fs.readFileSync(SAMPLE_PATH, 'utf-8');
    const $ = load(html);
    const changes = [];

    $('.mw-changeslist-title').each((_, el) => {
      const link = $(el).find('a').attr('href');
      const title = $(el).text().trim();
      if (title && link) {
        const baseUrl = process.env.WIKI_URL || DEFAULT_WIKI_URL;
        changes.push({
          title,
          link: new URL(link, baseUrl).href,
          timestamp: new Date().toISOString()
        });
      }
    });

    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(changes, null, 2));
    console.log(`✅ Updated ${changes.length} items to recent-activity.json`);
  } catch (err) {
    console.error('❌ Failed to fetch activity log:', err);
  }
}

export async function fetchActivityOnline() {
  try {
    const wikiUrl = process.env.WIKI_URL || DEFAULT_WIKI_URL;
    const res = await fetch(wikiUrl);
    const html = await res.text();
    const $ = load(html);
    const changes = [];

    $('.mw-changeslist-title').each((_, el) => {
      const link = $(el).find('a').attr('href');
      const title = $(el).text().trim();
      if (title && link) {
        changes.push({
          title,
          link: new URL(link, wikiUrl).href,
          timestamp: new Date().toISOString()
        });
      }
    });

    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(changes, null, 2));
    console.log(`✅ Updated ${changes.length} items to recent-activity.json`);
  } catch (err) {
    console.error('❌ Failed to fetch activity log:', err);
  }
}

export { OUTPUT_PATH, USE_OFFLINE_MODE };

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  if (USE_OFFLINE_MODE) {
    fetchActivityOffline();
  } else {
    await fetchActivityOnline();
  }
}
