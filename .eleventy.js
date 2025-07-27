export default function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("public");

  return {
    dir: {
      input: "src",
      includes: "includes",
      layouts: "layouts",
      data: "../data",
      output: "dist"
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk"
  };
}
