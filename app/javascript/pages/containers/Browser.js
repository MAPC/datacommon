import { connect } from 'react-redux';

import Browser from '../components/Browser';
import { fetchAll } from '../actions/dataset';


const mapStateToProps = ({ dataset, search }, props) => ({
  datasets: dataset.cache,
});

const mapDispatchToProps = (dispatch, props) => ({
  fetchDatasets: () => dispatch(fetchAll()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Browser);
