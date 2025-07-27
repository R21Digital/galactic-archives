document.addEventListener("DOMContentLoaded", async () => {
  const response = await fetch("/search-index.json");
  const pages = await response.json();

  const fuse = new Fuse(pages, {
    keys: ["title", "category", "tags"],
    threshold: 0.3
  });

  const input = document.getElementById("search-input");
  const resultsList = document.getElementById("search-results");

  input.addEventListener("input", () => {
    const query = input.value.trim();
    resultsList.innerHTML = "";

    if (query.length > 1) {
      const results = fuse.search(query).slice(0, 10);
      results.forEach(({ item }) => {
        const li = document.createElement("li");
        li.innerHTML = `<a href="${item.url}">${item.title}</a>`;
        resultsList.appendChild(li);
      });
    }
  });
});
