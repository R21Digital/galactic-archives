async function initSearch() {
  try {
    const response = await fetch('/index.json');
    if (!response.ok) {
      console.error(`Failed to fetch search index: ${response.status} ${response.statusText}`);
      return;
    }
    const config = await response.json();
    if (typeof docsearch === 'function') {
      docsearch(config);
    }
  } catch (err) {
    console.error('Search initialization failed:', err);
  }
}

document.addEventListener('DOMContentLoaded', initSearch);
