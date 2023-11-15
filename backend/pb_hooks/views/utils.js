/// <reference path="../../pb_data/types.d.ts" />

/**
 * Cleans and trims a query string by removing extra whitespace.
 * @param {string} inputQuery - The input query string.
 * @returns {string} - The cleaned and trimmed query string.
 */
function cleanAndTrimQuery(inputQuery) {
  const queryCleaner = /\s+/g;
  return inputQuery.replace(queryCleaner, " ").trim();
}

module.exports = {
  cleanAndTrimQuery,
};
