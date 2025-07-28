import { globSync } from "glob";
import fs from "fs";
import matter from "gray-matter";

function slugifyCategory(name) {
  return name.toLowerCase().replace(/\s+/g, "-");
}

export default function (eleventyConfig) {
  // Copy assets from `public` directly to the site root
  eleventyConfig.addPassthroughCopy({ public: "." });

  eleventyConfig.addFilter("json", (value) => JSON.stringify(value));

  // Discover unique categories by scanning content files
  const files = globSync("src/**/*.md", {
    ignore: [
      "src/_includes/**",
      "src/layouts/**",
      "src/styles/**",
      "src/scripts/**",
    ],
  });

  const categories = new Set();
  for (const file of files) {
    const { data } = matter(fs.readFileSync(file, "utf-8"));
    if (data && data.category) {
      categories.add(data.category);
    }
  }

  for (const cat of categories) {
    const key = slugifyCategory(cat);
    eleventyConfig.addCollection(key, (collectionApi) =>
      collectionApi
        .getAll()
        .filter((item) => item.data.category === cat)
    );
  }

  eleventyConfig.addCollection("searchIndex", function (collectionApi) {
    return collectionApi.getAll().map((item) => {
      return {
        title: item.data.title,
        category: item.data.category,
        tags: item.data.tags,
        url: item.url
      };
    });
  });

  // Pass through compiled styles from `src/styles` so `dist/styles/main.css`
  // is generated from that directory rather than `public`.
  eleventyConfig.addPassthroughCopy({ "src/styles": "styles" });
  eleventyConfig.addPassthroughCopy({ "src/scripts": "scripts" });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      layouts: "layouts",
      data: "../data",
      output: "dist"
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk"
  };
}

export { slugifyCategory };
