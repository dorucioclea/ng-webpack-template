const commons               = require("./constants");
const {
        DefinePlugin,
        NoErrorsPlugin,
        ProgressPlugin
      }                     = require("webpack");
const UglifyJsPlugin        = require("webpack/lib/optimize/UglifyJsPlugin");
const OccurrenceOrderPlugin = require("webpack/lib/optimize/OccurrenceOrderPlugin");

const {AotPlugin}           = require("@ngtools/webpack");
const {ForkCheckerPlugin}   = require("awesome-typescript-loader");
const BundleAnalyzerPlugin  = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const ExtractTextPlugin     = require("extract-text-webpack-plugin");

// See https://github.com/webpack/webpack/issues/2254#issuecomment-203528744 for this kind of style.
module.exports = function (env) {
  env                            = env || {};
  // Eval configurable parts.
  const USE_AOT                  = env.aot === true;
  const NO_ANALYZE_PLUGIN_CONFIG = process.env.NO_ANALYZE_PLUGIN === "true";

  const plugins = [
    new DefinePlugin({
      ENV: JSON.stringify(process.env.NODE_ENV || "production")
    }),
    new ProgressPlugin(),
    new NoErrorsPlugin(),
    new OccurrenceOrderPlugin(true),
    new UglifyJsPlugin({
      beautify: false,
      comments: false
    }),
    commons.getHtmlTemplatePlugin(false),
    commons.getLoaderOptionsPlugin(false),
    new ExtractTextPlugin("[name].[chunkhash].css"),
  ];

  let outputRoot;
  const rules = [
    commons.RULE_LIB_SOURCE_MAP_LOADING,
    commons.RULE_HTML_LOADING,
    commons.RULE_MAIN_SASS_LOADING(false),
    commons.RULE_COMPONENT_SASS_LOADING
  ];

  if (USE_AOT) {
    // Add AOT plugin.
    plugins.push(
      new AotPlugin({
        tsConfigPath: commons.root("tsconfig.aot.json")
      })
    );
    // Put the build into ${root}/dist-aot .
    outputRoot = commons.root("dist-aot");
    // Add the AoT loader rule.
    rules.unshift(
      {
        test: /\.ts$/,
        loader: "@ngtools/webpack",
      }
    )
  } else {
    // Add context replacement and fork checker.
    plugins.push(
      commons.getDefaultContextReplacementPlugin(),
      new ForkCheckerPlugin()
    );

    // Put the build into ${root}/dist-aot .
    outputRoot = commons.root("dist");
    // Add the default angular 2 typescript processing stuff.
    rules.unshift(commons.RULE_TS_LOADING);
  }

  // In this case, the example dist server fires up, thus, we should not block that one here...
  if (!NO_ANALYZE_PLUGIN_CONFIG) {
    plugins.push(new BundleAnalyzerPlugin({analyzerPort: 5000}));
  }

  return {
    entry: commons.root("src/main.ts"),
    output: {
      path: outputRoot,
      filename: "bundle.[hash].js",
      chunkFilename: "[id].bundle.[chunkhash].js"
    },
    devtool: false,
    resolve: {
      extensions: commons.DEFAULT_RESOLVE_EXTENSIONS
    },
    module: {
      rules: rules
    },
    plugins: plugins,
    node: commons.NODE_CONFIG
  };
};