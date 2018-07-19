import { connect } from 'react-redux';

import SearchBar from '../components/SearchBar';
import { fetchAll } from '../actions/dataset';


const mapStateToProps = ({ dataset }, props) => {
  return {
    results: dataset.cache,
  };
}

const mapDispatchToProps = (dispatch, props) => ({
  fetchDatasets: () => dispatch(fetchAll()),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);
