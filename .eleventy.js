const { DateTime } = require("luxon");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const fs = require("fs");
const postcss = require("postcss");
const tailwindcss =require ("tailwindcss");

module.exports = function (eleventyConfig) {
  // eleventyConfig.addPassthroughCopy("./src/styles/styles.css");
  eleventyConfig.addPassthroughCopy("./src/img/");
  eleventyConfig.addPassthroughCopy("./src/fonts");
  eleventyConfig.addPassthroughCopy({ "./src/favicon/": "/" });
  eleventyConfig.addFilter("postDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_FULL);
  });
  eleventyConfig.on("eleventy.after", async () => {
    const cssSourceFile = "./src/css/tailwind.css";
    const cssDestinationFile = "./_site/css/styles.css";

    fs.readFile(cssSourceFile, (err, css) => {
      postcss([tailwindcss, autoprefixer, cssnano])
        .process(css, { from: cssSourceFile, to: cssDestinationFile })
        .then((result) => {
          fs.writeFile(cssDestinationFile, result.css, () => true);
        });
    });
  });
  eleventyConfig.setServerOptions({
    watch: ["_site/**/*.css"]
  });

  return {
    markdownTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dir: {
      input: "src",
      output: "_site",
    },
  };
};
