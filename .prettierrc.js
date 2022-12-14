module.exports = {
  plugins: [require('./merged-prettier-plugin.js')],
  printWidth: 100,
  singleQuote: true,
  importOrder: ['tw-react-components', '^[./]'],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
};
