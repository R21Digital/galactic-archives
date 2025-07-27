export default function(eleventyConfig) {
  // Copy assets from `public` directly to the site root so paths like
  // `/styles/main.css` work without the `public/` prefix.
  eleventyConfig.addPassthroughCopy({ "public": "." });

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
