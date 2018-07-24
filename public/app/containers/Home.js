import { connect } from 'react-redux';

import Home from '~/app/components/Home';
import { fetchAll } from '~/app/actions/dataset';
import { storeSearchResults } from '~/app/actions/search';


const mapStateToProps = ({ dataset, search }, props) => ({
  datasets: dataset.cache.map(row => ({ id: row.cartodb_id, title: row.menu3 })),
  datasetsResults: search.dataset.results,
  datasetsQuery: search.dataset.query
});

const mapDispatchToProps = (dispatch, props) => ({
  fetchDatasets: () => dispatch(fetchAll()),
  storeDatasetSearchResults: (results, query) => dispatch(storeSearchResults('dataset', results, query)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
