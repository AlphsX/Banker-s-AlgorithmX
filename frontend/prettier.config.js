/** @type {import('prettier').Config} */
const config = {
  tabWidth: 2,
  useTabs: false,
  printWidth: 80,
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  bracketSpacing: false,
  arrowParens: 'always',
  jsxSingleQuote: false,
  plugins: [],
};

try {
  require.resolve('prettier-plugin-tailwindcss');
  config.plugins.push('prettier-plugin-tailwindcss');
} catch {
  // Plugin not found, skipping
}

module.exports = config;
