import { connect } from 'react-redux';

import MuniSelect from '~/app/components/MuniSelect';
import { fetchAll } from '../actions/municipal';


const mapStateToProps = ({ muniSelect }, props) => ({
  options: muniSelect.cache,
});

const mapDispatchToProps = (dispatch, props) => ({
  fetchOptions: () => dispatch(fetchAll()),
});

export default connect(mapStateToProps, mapDispatchToProps)(MuniSelect);
