import { connect } from 'react-redux';
import DataViewer from '../components/DataViewer';
import { fetchAll } from '../actions/dataset';

const mapStateToProps = ({ dataset, search }, props) => ({
  datasets: dataset.cache,
});

const mapDispatchToProps = (dispatch, props) => ({
  fetchDatasets: () => dispatch(fetchAll()),
});

export default connect(mapStateToProps, mapDispatchToProps)(DataViewer);
