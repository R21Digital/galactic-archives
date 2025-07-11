module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("public");

  return {
    dir: {
      input: "src",
      includes: "_includes",
      output: "dist"
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk"
  };
};
