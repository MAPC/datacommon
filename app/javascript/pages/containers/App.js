import { connect } from 'react-redux';

import App from '../components/App';
import tabs from './../constants/tabs';

const mapStateToProps = (state, props) => {
  return {
    muniOptions: Object.keys(state.municipality.cache),
    tabOptions: tabs.map(opt => opt.value),
  }
};
const mapDispatchToProps = (dispatch, props) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(App);
