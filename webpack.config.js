const path = require("path");
const StaticSiteGeneratorPlugin = require("static-site-generator-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const routes = require("./lib/routes").paths();

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
        test: /\.module.css$/,
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
      locals: {
        // Properties here are merged into `locals`
        // passed to the exported render function
        greet: "Hello"
      }
    })
  ]
};
