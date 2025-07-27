export default function(eleventyConfig) {
  // Copy assets from `public` directly to the site root
  eleventyConfig.addPassthroughCopy({ "public": "." });

  eleventyConfig.addFilter("json", value => JSON.stringify(value));

  // Pass through compiled styles from `src/styles` so `dist/styles/main.css`
  // is generated from that directory rather than `public`.
  eleventyConfig.addPassthroughCopy({ "src/styles": "styles" });

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
