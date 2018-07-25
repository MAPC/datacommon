import { connect } from 'react-redux';

import SearchBar from '~/app/components/SearchBar';
import { setResults, clear } from '~/app/actions/search';


const mapStateToProps = (state, props) => ({
    items: state[props.model].searchable,
    ...state.search[props.model],
});

const mapDispatchToProps = (dispatch, props) => ({
  setResults: (results, query) => dispatch(setResults(props.model, results, query)),
  clear: () => dispatch(clear(props.model)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);
