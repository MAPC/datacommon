import { connect } from 'react-redux';

import MuniSelect from '../components/MuniSelect';
import { fetchAll } from '../actions/municipality';


const mapStateToProps = ({ municipality }, props) => ({
  options: municipality.cache,
});

const mapDispatchToProps = (dispatch, props) => ({
  fetchOptions: () => dispatch(fetchAll()),
});

export default connect(mapStateToProps, mapDispatchToProps)(MuniSelect);
