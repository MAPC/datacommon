import { connect } from 'react-redux';

import SearchBar from '~/app/components/SearchBar';
import { setResults } from '~/app/actions/search';


const mapStateToProps = (state, props) => ({
    items: state[props.model].cache,
    ...state.search[props.model],
});

const mapDispatchToProps = (dispatch, props) => ({
  setResults: (results, query) => dispatch(setResults(props.model, results, query))
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);
