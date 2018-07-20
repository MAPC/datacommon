import { connect } from 'react-redux';

import { fetchAll } from '../actions/dataset';
import { search } from '../actions/searchBar';
import SearchBar from '../components/SearchBar';


const mapStateToProps = ({ dataset, searchBar }, props) => {
  let results = dataset.cache.map(row => ({ id: row.cartodb_id, title: row.menu3 }));
  const { query } = searchBar;

  if (query.length) {
    results = wordSearch(results, query, 'title');
  }

  return { results, query };
}

const mapDispatchToProps = (dispatch, props) => ({
  fetchDatasets: () => dispatch(fetchAll()),
  search: (query) => dispatch(search(query)),
});


function wordSearch(dataset, query, column) {
  let results = [];

  if (Array.isArray(dataset)) {
    const queryWords = query.toLowerCase().split(' ');

    results = dataset.filter(row => {
      const keywords = (row[column] || '').toLowerCase().split(' ');

      const matchesKeywords = queryWords.every(queryWord => (
        keywords.some(keyword => keyword.startsWith(queryWord))
      ));

      return matchesKeywords;
    });
  }

  return results;
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);
