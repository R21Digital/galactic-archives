import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { jest } from '@jest/globals';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = path.join(__dirname, '../data/recent-activity.json');

let original;
let envWiki;
let envMode;

beforeEach(() => {
  envWiki = process.env.WIKI_URL;
  envMode = process.env.USE_OFFLINE_MODE;
  if (fs.existsSync(OUTPUT_PATH)) {
    original = fs.readFileSync(OUTPUT_PATH, 'utf-8');
    fs.unlinkSync(OUTPUT_PATH);
  } else {
    original = null;
  }
});

afterEach(() => {
  process.env.WIKI_URL = envWiki;
  process.env.USE_OFFLINE_MODE = envMode;
  if (original) {
    fs.writeFileSync(OUTPUT_PATH, original);
  } else if (fs.existsSync(OUTPUT_PATH)) {
    fs.unlinkSync(OUTPUT_PATH);
  }
});

// Offline mode
test('fetchActivityOffline writes expected JSON', async () => {
  jest.resetModules();
  const { fetchActivityOffline } = await import('../scripts/fetchActivityLog.js');
  fetchActivityOffline();
  const content = fs.readFileSync(OUTPUT_PATH, 'utf-8');
  const data = JSON.parse(content);
  expect(data).toEqual([
    {
      title: 'Legacy Quest',
      link: 'https://swgr.org/wiki/legacy/',
      timestamp: expect.any(String)
    },
    {
      title: 'Ranger',
      link: 'https://swgr.org/wiki/ranger/',
      timestamp: expect.any(String)
    }
  ]);
});

// Online mode with custom URL
test('fetchActivityOnline uses custom WIKI_URL', async () => {
  process.env.WIKI_URL = 'http://example.com/activity';
  jest.resetModules();
  const { fetchActivityOnline } = await import('../scripts/fetchActivityLog.js');
  const html = fs.readFileSync(path.join(__dirname, '../data/sample-activity.html'), 'utf-8');
  const fetchMock = jest.fn(() => Promise.resolve({ text: () => Promise.resolve(html) }));
  const originalFetch = global.fetch;
  global.fetch = fetchMock;

  await fetchActivityOnline();

  const content = fs.readFileSync(OUTPUT_PATH, 'utf-8');
  const data = JSON.parse(content);
  expect(fetchMock).toHaveBeenCalledWith('http://example.com/activity');
  expect(data).toEqual([
    {
      title: 'Legacy Quest',
      link: 'http://example.com/wiki/legacy/',
      timestamp: expect.any(String)
    },
    {
      title: 'Ranger',
      link: 'http://example.com/wiki/ranger/',
      timestamp: expect.any(String)
    }
  ]);

  global.fetch = originalFetch;
});
