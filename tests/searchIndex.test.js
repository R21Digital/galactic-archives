import { jest } from '@jest/globals';

jest.unstable_mockModule('glob', () => ({
  globSync: jest.fn(),
}));

jest.unstable_mockModule('fs', () => ({
  default: {
    readFileSync: jest.fn(),
  },
}));

let searchIndexFn, globSync, readFileSync;

beforeAll(async () => {
  const glob = await import('glob');
  globSync = glob.globSync;
  const fsMod = await import('fs');
  readFileSync = fsMod.default.readFileSync;
  const mod = await import('../src/_data/searchIndex.js');
  searchIndexFn = mod.default;
});

test('search index excludes eleventyExcludeFromCollections items', () => {
  globSync.mockReturnValue(['src/a.md', 'src/b.md']);
  readFileSync.mockImplementation((file) => {
    if (file === 'src/a.md') {
      return `---\ntitle: Visible\n---\nVisible content`;
    }
    if (file === 'src/b.md') {
      return `---\ntitle: Hidden\neleventyExcludeFromCollections: true\n---\nHidden content`;
    }
  });

  const result = searchIndexFn();
  expect(result).toEqual([
    {
      title: 'Visible',
      category: undefined,
      tags: undefined,
      url: '/a/',
      last_updated: undefined,
      content: 'Visible content',
    },
  ]);
});
