import Eleventy from '@11ty/eleventy';
import fs from 'fs';

// Basic smoke test to ensure the Eleventy build succeeds
// when pages lack a `category` front matter value.

test('eleventy build completes without errors', async () => {
  const elev = new Eleventy('.', 'test-dist', { configPath: '.eleventy.js' });
  await elev.init();
  await expect(elev.write()).resolves.toBeDefined();
  fs.rmSync('test-dist', { recursive: true, force: true });
});
