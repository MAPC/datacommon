import { connect } from 'react-redux';

import { fetchAll } from '../actions/dataset';
import SearchBar from '../components/SearchBar';


const mapStateToProps = ({ dataset }, props) => {
  return {
    results: dataset.cache,
  };
}

const mapDispatchToProps = (dispatch, props) => ({
  fetchDatasets: () => dispatch(fetchAll()),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);
