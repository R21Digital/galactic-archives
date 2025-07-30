/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals';

test('search results sanitize HTML in page titles', async () => {
  document.body.innerHTML = '<input id="search-input"><ul id="search-results"></ul>';

  const pages = [{ url: '/foo/', title: '<img src=x onerror=alert(1)>' }];

  const originalFetch = global.fetch;
  global.fetch = jest.fn(() => Promise.resolve({ json: () => Promise.resolve(pages) }));

  const originalLunr = global.lunr;
  global.lunr = function(fn) {
    const ctx = { ref: jest.fn(), field: jest.fn(), pages: [], add(page) { this.pages.push(page); } };
    fn.call(ctx);
    return { search: jest.fn(() => ctx.pages.map(p => ({ ref: p.url }))) };
  };

  await import('../src/scripts/search.js');

  document.dispatchEvent(new Event('DOMContentLoaded'));
  await new Promise(res => setTimeout(res, 0));

  const input = document.getElementById('search-input');
  input.value = 'foo';
  input.dispatchEvent(new Event('input'));

  const resultsList = document.getElementById('search-results');
  const link = resultsList.querySelector('a');

  expect(link).not.toBeNull();
  expect(resultsList.querySelector('img')).toBeNull();
  expect(link.textContent).toBe('<img src=x onerror=alert(1)>');

  if (originalFetch) global.fetch = originalFetch; else delete global.fetch;
  if (originalLunr) global.lunr = originalLunr; else delete global.lunr;
});
