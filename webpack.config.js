const fs = require("fs");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const StaticSiteGeneratorPlugin = require("static-site-generator-webpack-plugin");
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
      client: "./lib/client.js", // JS to run on the client
      pages: "./main.js" // The statically rendered site
    },

    target: "node",
    node: { __dirname: true },

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
        { test: /\.js$/, use: "babel-loader" },
        {
          test: /\.css$/,
          use: ExtractTextPlugin.extract({
            fallback: "style-loader",
            use: [
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
      new WebpackOnBuildPlugin(async stats => {
        console.log("done");
        (await renames()).map(({ from, to }) => fs.renameSync(from, to));
      })
    ]
  };
};
