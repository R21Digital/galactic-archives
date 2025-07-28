import fs from 'fs';

// Ensure categories layout includes searchbox and breadcrumbs partials
// to verify that common components are rendered.

test('categories layout includes common partials', () => {
  const tpl = fs.readFileSync('src/layouts/categories/index.njk', 'utf8');
  expect(tpl).toMatch('searchbox.njk');
  expect(tpl).toMatch('breadcrumbs.njk');
});

// Ensure homepage layout includes core shared partials and category grid markup
test('homepage layout includes sidebar, head partials and category grid', () => {
  const tpl = fs.readFileSync('src/layouts/homepage.njk', 'utf8');
  expect(tpl).toMatch('head.njk');
  expect(tpl).toMatch('sidebar.njk');
  // Verify the layout loops through categories
  expect(tpl).toMatch('category-grid');
});
