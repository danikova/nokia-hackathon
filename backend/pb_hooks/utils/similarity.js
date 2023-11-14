/// <reference path="../../pb_data/types.d.ts" />

/**
 * Generates n-grams from a given string.
 * @param {string} str - The input string.
 * @param {number} n - The size of n-grams.
 * @returns {string[]} - An array of n-grams.
 */
function generateNGrams(str, n) {
  const nGrams = [];
  for (let i = 0; i < str.length - n + 1; i++) {
    nGrams.push(str.slice(i, i + n));
  }
  return nGrams;
}

/**
 * Calculates the Jaccard similarity coefficient between two strings.
 * @param {string} str1 - The first input string.
 * @param {string} str2 - The second input string.
 * @param {number} n - The size of n-grams (default is 2).
 * @returns {number} - The Jaccard similarity coefficient.
 */
function jaccardSimilarity(str1, str2, n = 2) {
  const nGrams1 = generateNGrams(str1, n);
  const nGrams2 = generateNGrams(str2, n);

  const set1 = new Set(nGrams1);
  const set2 = new Set(nGrams2);

  const intersection = new Set([...set1].filter((gram) => set2.has(gram)));
  const union = new Set([...set1, ...set2]);

  const similarity = intersection.size / union.size;
  return similarity;
}

module.exports = {
  jaccardSimilarity,
};
