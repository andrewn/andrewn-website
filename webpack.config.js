const fs = require("fs");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const StaticSiteGeneratorPlugin = require("static-site-generator-webpack-plugin");
const WebpackNotifierPlugin = require("webpack-notifier");
const WebpackOnBuildPlugin = require("on-build-webpack");

const config = require("./config");

const renames = require("./lib/routes").renames;

// Probably not the right place for this
process.on("unhandledRejection", error => {
  console.log("unhandledRejection", error);
  process.exit(1);
});

module.exports = async () => {
  const routes = await require("./lib/routes").paths();

  return {
    entry: {
      client: config.clientEntryPath, // JS to run on the client
      pages: config.mainEntryPath // The statically rendered site
    },

    target: "node",
    node: { __dirname: true },
    stats: "minimal",

    output: {
      filename: "assets/js/[name].js",
      path: config.outputRoot,
      /* IMPORTANT!
     * You must compile to UMD or CommonJS
     * so it can be required in a Node context: */
      libraryTarget: "umd"
    },

    module: {
      rules: [
        {
          test: /\.js$/,
          include: [config.libRoot, config.configPath],
          use: ["cache-loader", "babel-loader"]
        },
        {
          test: /\.css$/,
          use: ExtractTextPlugin.extract({
            fallback: "style-loader",
            use: [
              "cache-loader",
              { loader: "css-loader", options: { modules: true } },
              "postcss-loader"
            ]
          })
        }
      ]
    },

    plugins: [
      new ExtractTextPlugin("styles.css"),
      new StaticSiteGeneratorPlugin({
        paths: routes,
        locals: {}
      }),
      new CopyWebpackPlugin([{ from: "static" }]),
      new WebpackNotifierPlugin({ excludeWarnings: true, alwaysNotify: true }),
      new WebpackOnBuildPlugin(async stats => {
        (await renames()).map(({ from, to }) => fs.renameSync(from, to));
        console.log(`Done in ${(stats.endTime - stats.startTime) / 1000}s`);
      })
    ]
  };
};
