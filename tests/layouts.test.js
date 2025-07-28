import fs from 'fs';

// Ensure categories layout includes searchbox and breadcrumbs partials
// to verify that common components are rendered.

test('categories layout includes common partials', () => {
  const tpl = fs.readFileSync('src/layouts/categories/index.njk', 'utf8');
  expect(tpl).toMatch('searchbox.njk');
  expect(tpl).toMatch('breadcrumbs.njk');
});
