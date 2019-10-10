import { connect } from 'react-redux';

import SearchBar from '../components/SearchBar';
import { setResults, setHovering, clear } from '../actions/search';


const mapStateToProps = (state, props) => ({
  items: state[props.contextKey].searchable,
  ...state.search[props.contextKey],
});

const mapDispatchToProps = (dispatch, props) => ({
  setResults: (results, query) => dispatch(setResults(props.contextKey, results, query)),
  setHovering: (value) => dispatch(setHovering(props.contextKey, value)),
  clear: () => dispatch(clear(props.contextKey)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);
