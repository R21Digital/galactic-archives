import nunjucks from 'nunjucks';
import fs from 'fs';
import matter from 'gray-matter';

class NullLoader extends nunjucks.Loader {
  getSource(name) {
    return { src: '', path: name, noCache: true };
  }
}

test('seo partial outputs default meta tags', () => {
  const tpl = fs.readFileSync('src/_includes/seo.njk', 'utf8');
  const env = new nunjucks.Environment(new NullLoader());
  const html = env.renderString(tpl, {
    metadata: {
      siteName: 'Site',
      siteUrl: 'https://example.com',
      siteDescription: 'Desc',
      siteImage: '/img.png'
    },
    title: 'Home',
    description: 'Custom',
    page: { url: '/' }
  });
  expect(html).toContain('<title>Home | Site</title>');
  expect(html).toContain('meta name="description"');
  expect(html).toContain('og:title');
  expect(html).toContain('twitter:card');
});

test('seo partial uses provided image', () => {
  const tpl = fs.readFileSync('src/_includes/seo.njk', 'utf8');
  const env = new nunjucks.Environment(new NullLoader());
  const html = env.renderString(tpl, {
    metadata: {
      siteName: 'Site',
      siteUrl: 'https://example.com',
      siteDescription: 'Desc',
      siteImage: '/default.png'
    },
    title: 'Post',
    image: '/custom.png',
    page: { url: '/post/' }
  });
  expect(html).toContain('<meta property="og:image" content="/custom.png" />');
  expect(html).toContain('<meta name="twitter:image" content="/custom.png" />');
});

test('sitemap template lists provided pages', () => {
  const file = fs.readFileSync('src/sitemap.xml.njk', 'utf8');
  const { data, content } = matter(file);
  expect(data.eleventyExcludeFromCollections).toBe(true);
  const env = new nunjucks.Environment(new NullLoader());
  const xml = env.renderString(content, {
    collections: {
      all: [ { url: '/page-one/', data: {} } ]
    },
    metadata: { siteUrl: 'https://example.com' }
  });
  expect(xml).toContain('<loc>https://example.com/page-one/</loc>');
});
