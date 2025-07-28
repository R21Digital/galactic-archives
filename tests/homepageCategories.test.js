import nunjucks from 'nunjucks';
import fs from 'fs';
import { slugifyCategory } from '../.eleventy.js';

class NullLoader extends nunjucks.Loader {
  getSource(name) {
    return { src: '', path: name, noCache: true };
  }
}

test('homepage category list excludes eleventyExcludeFromCollections pages', () => {
  const tpl = fs.readFileSync('src/layouts/homepage.njk', 'utf8');
  const env = new nunjucks.Environment(new NullLoader());
  env.addFilter('categorySlug', slugifyCategory);
  const html = env.renderString(tpl, {
    title: 'Test',
    collections: {
      all: [
        { data: { category: 'Visible' } },
        { data: { category: 'Hidden', eleventyExcludeFromCollections: true } }
      ]
    }
  });
  expect(html).toContain('<a href="/visible/">Visible</a>');
  expect(html).not.toContain('Hidden');
});

test('homepage categories are sorted alphabetically', () => {
  const tpl = fs.readFileSync('src/layouts/homepage.njk', 'utf8');
  const env = new nunjucks.Environment(new NullLoader());
  env.addFilter('categorySlug', slugifyCategory);
  const html = env.renderString(tpl, {
    collections: {
      all: [
        { data: { category: 'Bananas' } },
        { data: { category: 'Apples' } },
        { data: { category: 'Citrus' } }
      ]
    }
  });
  const idxApples = html.indexOf('>Apples<');
  const idxBananas = html.indexOf('>Bananas<');
  const idxCitrus = html.indexOf('>Citrus<');
  expect(idxApples).toBeLessThan(idxBananas);
  expect(idxBananas).toBeLessThan(idxCitrus);
});
