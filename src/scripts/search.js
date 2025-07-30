/* global lunr */

document.addEventListener('DOMContentLoaded', async() => {
  let pages;
  try {
    const res = await fetch('/search-index.json');
    pages = await res.json();
  } catch (err) {
    console.error('Failed to load search index:', err);
    return;
  }

  const idx = lunr(function() {
    this.ref('url');
    this.field('title');
    this.field('category');
    this.field('tags');
    this.field('content');

    pages.forEach(page => this.add(page));
  });

  const input = document.getElementById('search-input');
  const resultsList = document.getElementById('search-results');

  if (!input) return;

  input.addEventListener('input', () => {
    const query = input.value.trim();
    resultsList.innerHTML = '';

    if (query.length > 1) {
      const results = idx.search(query).slice(0, 10);
      results.forEach(({ ref }) => {
        const page = pages.find(p => p.url === ref);
        if (page) {
          const li = document.createElement('li');
          li.innerHTML = `<a href="${page.url}">${page.title}</a>`;
          resultsList.appendChild(li);
        }
      });
    }
  });
});
