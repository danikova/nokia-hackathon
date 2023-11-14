/// <reference path="../../pb_data/types.d.ts" />

function generateNGrams(str, n) {
  const nGrams = [];
  for (let i = 0; i < str.length - n + 1; i++) {
    nGrams.push(str.slice(i, i + n));
  }
  return nGrams;
}

// calculateJaccardSimilarity
function calculate(str1, str2, n = 2) {
  // Generate n-grams for each string
  const nGrams1 = generateNGrams(str1, n);
  const nGrams2 = generateNGrams(str2, n);

  // Convert n-grams to sets
  const set1 = new Set(nGrams1);
  const set2 = new Set(nGrams2);

  // Calculate intersection and union of sets
  const intersection = new Set([...set1].filter((gram) => set2.has(gram)));
  const union = new Set([...set1, ...set2]);

  // Calculate Jaccard similarity coefficient
  const similarity = intersection.size / union.size;

  return similarity;
}

module.exports = {
  calculate,
};
