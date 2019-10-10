export default function wordSearch(dataset, query, column = null) {
  let results = [];

  if (Array.isArray(dataset)) {
    const queryWords = query.toLowerCase().split(' ');

    results = dataset.filter(row => {
      var value = column ? row[column] : row;
      const keywords = (value || '').toLowerCase().split(' ');

      const matchesKeywords = queryWords.every(queryWord => (
        keywords.some(keyword => keyword.startsWith(queryWord))
      ));

      return matchesKeywords;
    });
  }

  return results;
}
