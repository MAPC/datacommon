import types from '../actions/types';


const defaultState = {
  query: '',
};

export default function searchBar(state = defaultState, action) {

  switch(action.type) {
    case types.SEARCH_BAR.SEARCH:
      return { ...state, ...{ query: action.query } };
    default:
      return state;
  }

};
