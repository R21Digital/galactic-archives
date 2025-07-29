import fs from 'fs';
import matter from 'gray-matter';

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

// Footer should be included in all primary layouts
test('layouts include footer partial', () => {
  const baseTpl = fs.readFileSync('src/layouts/base.njk', 'utf8');
  const homeTpl = fs.readFileSync('src/layouts/homepage.njk', 'utf8');
  const internalTpl = fs.readFileSync('src/layouts/internal.njk', 'utf8');
  expect(baseTpl).toMatch('footer.njk');
  expect(homeTpl).toMatch('footer.njk');
  expect(internalTpl).toMatch('footer.njk');
});

// The static pages should use the new layout and parse correctly
test('static pages render with static layout', () => {
  const files = [
    'src/pages/privacy-policy.md',
    'src/pages/terms-of-use.md',
    'src/pages/mission.md',
    'src/pages/what-is-this-site.md'
  ];
  files.forEach((file) => {
    const { data } = matter(fs.readFileSync(file, 'utf8'));
    expect(data.layout).toBe('static.njk');
  });
});
