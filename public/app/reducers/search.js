import types from '../actions/types';

const defaultSearchResult = {
  query: '',
  results: [],
};

const defaultState = {
  dataset: defaultSearchResult,
  municipality: defaultSearchResult,
};

export default function search(state = defaultState, action) {
  let newState = {};

  switch(action.type) {
    case types.SEARCH.STORE_RESULTS:
      newState = {
        [action.store]: {
          results: action.results,
          query: action.query,
        }
      };
      break;
  }

  return { ...defaultState, ...state, ...newState };
}
