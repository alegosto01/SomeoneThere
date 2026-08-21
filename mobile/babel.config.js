// Path aliases (`@/*`) come from tsconfig.json — Expo SDK 50+ resolves them
// natively through Metro, and Jest maps them via moduleNameMapper, so no
// module-resolver plugin is needed here.

/**
 * Rewrites `import.meta` to a plain object.
 *
 * Expo serves the web bundle as a classic <script>, where `import.meta` is a
 * syntax error — the browser refuses to parse the file and the page renders
 * blank with nothing in the Metro log. Zustand's middleware bundle contains
 * `import.meta.env.MODE` inside its devtools middleware, which we never use but
 * which ships in the same module as `persist`.
 *
 * Bundlers that emit ES modules do not need this; Metro's classic-script output
 * does.
 */
function transformImportMeta() {
  return {
    name: 'transform-import-meta',
    visitor: {
      MetaProperty(path) {
        path.replaceWithSourceString('({ env: { MODE: process.env.NODE_ENV } })');
      },
    },
  };
}

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [transformImportMeta],
  };
};
