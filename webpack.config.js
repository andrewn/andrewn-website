const fs = require("fs");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const StaticSiteGeneratorPlugin = require("static-site-generator-webpack-plugin");
const WebpackNotifierPlugin = require("webpack-notifier");
const WebpackOnBuildPlugin = require("on-build-webpack");

const isProduction =
  process.env.NODE_ENV === "development" ? "development" : "production";

const config = require("./config");

const renames = require("./lib/routes").renames;

// Probably not the right place for this
process.on("unhandledRejection", error => {
  console.log("unhandledRejection", error);
  process.exit(1);
});

const createServerConfig = async function() {
  const routes = await require("./lib/routes").paths();

  return {
    entry: { pages: config.mainEntryPath },

    mode: isProduction ? "production" : "development",

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

    // optimization: {
    //   splitChunks: {
    //     cacheGroups: {
    //       styles: {
    //         name: "styles",
    //         test: /\.css$/,
    //         chunks: "all",
    //         enforce: true
    //       }
    //     }
    //   }
    // },

    module: {
      rules: [
        {
          test: /\.js$/,
          include: [config.libRoot, config.configPath],
          use: ["cache-loader", "babel-loader"]
        },
        {
          test: /\.css$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : "style-loader",
            "cache-loader",
            { loader: "css-loader", options: { modules: true } },
            "postcss-loader"
          ]
        }
      ]
    },

    plugins: [
      new MiniCssExtractPlugin({
        filename: "styles.css"
      }),
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

const createClientConfig = async function() {
  return {
    entry: { client: config.clientEntryPath },
    target: "web",

    mode: isProduction ? "production" : "development",

    // node: { __dirname: true },
    stats: "minimal",

    output: {
      filename: "assets/js/[name].js",
      path: config.outputRoot
      // /* IMPORTANT!
      //  * You must compile to UMD or CommonJS
      //  * so it can be required in a Node context: */
      // libraryTarget: "umd"
    },

    // optimization: {
    //   splitChunks: {
    //     cacheGroups: {
    //       styles: {
    //         name: "styles",
    //         test: /\.css$/,
    //         chunks: "all",
    //         enforce: true
    //       }
    //     }
    //   }
    // },

    module: {
      rules: [
        {
          test: /\.js$/,
          include: [config.libRoot, config.configPath],
          use: ["cache-loader", "babel-loader"]
        },
        {
          test: /\.css$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : "style-loader",
            "cache-loader",
            { loader: "css-loader", options: { modules: true } },
            "postcss-loader"
          ]
        }
      ]
    },

    plugins: [
      new MiniCssExtractPlugin({
        filename: "client-styles.css"
      })
    ]
  };
};

module.exports = async () => {
  // The statically rendered site
  const serverConfig = await createServerConfig();

  // JS to run on the client
  const clientConfig = await createClientConfig();

  return [serverConfig, clientConfig];
};
