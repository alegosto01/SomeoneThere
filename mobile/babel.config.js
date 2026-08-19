// Path aliases (`@/*`) come from tsconfig.json — Expo SDK 50+ resolves them
// natively through Metro, and Jest maps them via moduleNameMapper, so no
// module-resolver plugin is needed here.
module.exports = function (api) {
  api.cache(true);
  return { presets: ['babel-preset-expo'] };
};
