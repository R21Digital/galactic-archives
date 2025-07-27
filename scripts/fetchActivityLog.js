import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { load } from 'cheerio';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const WIKI_URL = process.env.WIKI_URL || 'https://swgr.org/wiki/special/activity/';
const OUTPUT_PATH = process.env.OUTPUT_PATH || path.join(__dirname, '../data/recent-activity.json');

export async function fetchActivity() {
  try {
    const { data } = await axios.get(WIKI_URL);
    const $ = load(data);
    const changes = [];

    $('.mw-changeslist-title').each((_, el) => {
      const link = $(el).find('a').attr('href');
      const title = $(el).text().trim();
      if (title && link) {
        changes.push({
          title,
          link: `https://swgr.org${link}`,
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

export { OUTPUT_PATH };

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  fetchActivity();
}
