import nunjucks from 'nunjucks';
import fs from 'fs';
import { slugifyCategory } from '../.eleventy.js';

class NullLoader extends nunjucks.Loader {
  getSource(name) {
    return { src: '', path: name, noCache: true };
  }
}

test('sidebar renders when a page lacks category', () => {
  const tpl = fs.readFileSync('src/_includes/sidebar.njk', 'utf8');
  const env = new nunjucks.Environment(new NullLoader());
  env.addFilter('categorySlug', slugifyCategory);
  const html = env.renderString(tpl, {
    collections: {
      all: [
        { data: { category: 'Guides', title: 'With Category' }, url: '/guides/with-category/' },
        { data: { title: 'No Category' }, url: '/no-category/' }
      ]
    }
  });
  expect(html).toContain('With Category');
  expect(html).not.toContain('No Category');
});
