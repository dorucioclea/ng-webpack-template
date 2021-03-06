const { ContextReplacementPlugin } = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

const paths = require("../../paths");
const { ensureEndingSlash } = require("../util");

exports.PLUGIN_CONTEXT_REPLACEMENT_ANGULAR_CORE = function PLUGIN_CONTEXT_REPLACEMENT_ANGULAR_CORE(
  src
) {
  src = src || "src";
  return new ContextReplacementPlugin(
    /(.+)?angular(\\|\/)core(.+)?/, // Same as for universal rendering atm.
    paths.resolveApp(src)
  );
};

/**
 * Creates a version information based on the environment configuration.
 * It is displayed in the footer.
 *
 * @param env The current configuration, either from `config/dev.config.js` or `build.config.js`.
 */
function createVersionString(env) {
  const src = [process.env.NODE_ENV];
  src[0] = src[0].charAt(0).toUpperCase() + src[0].slice(1);
  if (env.useAot) {
    src.push("AoT mode");
  }
  if (env.useBuildOptimizer) {
    src.push("with build optimization");
  }
  if (env.withServiceWorker) {
    src.push("with service worker");
  }
  return src.join(", ");
}

exports.PLUGIN_INDEX_HTML = function PLUGIN_INDEX_HTML(env) {
  const minify = env.isDev
    ? false
    : {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      };

  return new HtmlWebpackPlugin({
    template: paths.appHtml,
    filename: "index.html", // Keep in mind that the output path gets prepended to this name automatically.
    inject: "body",
    minify,
    // Custom config.
    title: "Demo App",
    devMode: env.isDev,
    baseHref: env.baseHref,
    publicPath: ensureEndingSlash(env.publicPath, false),
    polyfillFile: "polyfills.dll.js",
    vendorFile: "vendor.dll.js",
    versionInfo: createVersionString(env)
  });
};

exports.PLUGIN_TS_CHECKER = function PLUGIN_TS_CHECKER(env, log) {
  // Plugin to improve build and type checking speed; Will be included by default in the next major version.
  return new ForkTsCheckerWebpackPlugin({
    watch: paths.appSrc,
    async: env.isWatch,
    tsconfig: paths.resolveApp("tsconfig.json"),
    tslint: paths.resolveApp("tslint.json"),
    memoryLimit: process.env.APPVEYOR ? 1024 : 2048, // 2048 is too much for appveyor...,
    formatter: "codeframe",
    logger: {
      info: (...args) => {
        // Filter messages that are not that interesting in our case.
        if (
          args.length > 0 &&
          !/^(Starting|Version|Using|Watching)/.test(args[0])
        ) {
          log.info(...args);
        }
      },
      warn: (...args) => log.warn(...args),
      error: (...args) => log.error(...args)
    }
  });
};
