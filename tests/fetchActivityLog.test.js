import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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

