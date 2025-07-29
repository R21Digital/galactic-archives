import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { jest } from '@jest/globals';

const htmlSnippet = `
<li class="mw-changeslist-title"><a href="/wiki/Page1">Page 1</a></li>
<li class="mw-changeslist-title"><a href="/wiki/Page2">Page 2</a></li>
`;

import { fetchActivityOffline, OUTPUT_PATH } from '../scripts/fetchActivityLog.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const samplePath = path.join(__dirname, '../data/sample-activity.html');

beforeEach(() => {
  if (fs.existsSync(OUTPUT_PATH)) fs.unlinkSync(OUTPUT_PATH);
  fs.writeFileSync(samplePath, htmlSnippet);
});

test('fetchActivityOffline writes expected JSON', () => {
  fetchActivityOffline();
  const content = fs.readFileSync(OUTPUT_PATH, 'utf-8');
  const data = JSON.parse(content);
  expect(data).toEqual([
    {
      title: 'Page 1',
      link: 'https://swgr.org/wiki/Page1',
      timestamp: expect.any(String)
    },
    {
      title: 'Page 2',
      link: 'https://swgr.org/wiki/Page2',
      timestamp: expect.any(String)
    }
  ]);
});

