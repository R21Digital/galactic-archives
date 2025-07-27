const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { load } = require('cheerio');

const WIKI_URL = 'https://swgr.org/wiki/special/activity/';
const OUTPUT_PATH = path.join(__dirname, '../data/recent-activity.json');

async function fetchActivity() {
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

module.exports = { fetchActivity, OUTPUT_PATH };

if (require.main === module) {
  fetchActivity();
}
