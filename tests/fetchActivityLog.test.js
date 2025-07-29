import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { jest } from '@jest/globals';

import { fetchActivityOffline, OUTPUT_PATH } from '../scripts/fetchActivityLog.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let original;

beforeEach(() => {
  if (fs.existsSync(OUTPUT_PATH)) {
    original = fs.readFileSync(OUTPUT_PATH, 'utf-8');
    fs.unlinkSync(OUTPUT_PATH);
  } else {
    original = null;
  }
});

afterEach(() => {
  if (original) {
    fs.writeFileSync(OUTPUT_PATH, original);
  } else if (fs.existsSync(OUTPUT_PATH)) {
    fs.unlinkSync(OUTPUT_PATH);
  }
});

test('fetchActivityOffline writes expected JSON', () => {
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

test('USE_OFFLINE_MODE=false triggers online fetch', async () => {
  const html = fs.readFileSync(path.join(__dirname, '../data/sample-activity.html'), 'utf-8');
  const fetchMock = jest.fn(() => Promise.resolve({ text: () => Promise.resolve(html) }));
  const originalFetch = global.fetch;
  global.fetch = fetchMock;

  process.env.USE_OFFLINE_MODE = 'false';
  process.env.WIKI_URL = 'https://example.com/activity/';

  const moduleUrl = new URL('../scripts/fetchActivityLog.js', import.meta.url);
  moduleUrl.search = `?t=${Date.now()}`;
  const mod = await import(moduleUrl.href);
  await mod.fetchActivityOnline();

  expect(fetchMock).toHaveBeenCalledWith('https://example.com/activity/');
  const data = JSON.parse(fs.readFileSync(mod.OUTPUT_PATH, 'utf-8'));
  expect(data).toEqual([
    {
      title: 'Legacy Quest',
      link: 'https://example.com/wiki/legacy/',
      timestamp: expect.any(String)
    },
    {
      title: 'Ranger',
      link: 'https://example.com/wiki/ranger/',
      timestamp: expect.any(String)
    }
  ]);

  global.fetch = originalFetch;
});

