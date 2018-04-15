const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const StaticSiteGeneratorPlugin = require("static-site-generator-webpack-plugin");

const routes = require("./lib/routes").paths();

// Probably not the right place for this
process.on("unhandledRejection", error => {
  console.log("unhandledRejection", error);
  process.exit(1);
});

module.exports = {
  entry: "./main.js",

  target: "node",
  node: { __dirname: true },

  output: {
    filename: "index.js",
    path: path.join(__dirname, "dist"),
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
    new CopyWebpackPlugin([{ from: "static" }])
  ]
};
