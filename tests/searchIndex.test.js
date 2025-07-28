import { jest } from '@jest/globals';
import eleventyConfigFn from '../.eleventy.js';

test('search index excludes eleventyExcludeFromCollections items', () => {
  const collections = {};
  const mockConfig = {
    addPassthroughCopy: jest.fn(),
    addFilter: jest.fn(),
    addCollection: (name, fn) => {
      collections[name] = fn;
    },
  };

  eleventyConfigFn(mockConfig);

  const items = [
    { data: { title: 'Visible', eleventyExcludeFromCollections: false } , url: '/visible/' },
    { data: { title: 'Hidden', eleventyExcludeFromCollections: true }, url: '/hidden/' },
  ];

  const collectionApi = {
    getAll: () => items,
  };

  const result = collections['searchIndex'](collectionApi);
  expect(result).toEqual([
    {
      title: 'Visible',
      category: undefined,
      tags: undefined,
      url: '/visible/',
    },
  ]);
});
