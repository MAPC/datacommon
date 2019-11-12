import types from '../actions/types';

const defaultContext = {
  query: '',
  results: [],
  hovering: null,
};

const defaultState = {
  dataset: defaultContext,
  municipality: defaultContext,
};

export default function search(state = defaultState, action) {
  let newState = {};

  switch(action.type) {
    case types.SEARCH.SET_RESULTS:
      const newContext = {
        results: action.results.sort(),
        query: action.query,
      };

      newState = { [action.contextKey]: { ...state[action.contextKey], ...newContext }};
      break;

    case types.SEARCH.SET_HOVERING:
      newState = { [action.contextKey]: { ...state[action.contextKey], ...{ hovering: action.value }}};
      break;

    case types.SEARCH.CLEAR_CONTEXT:
      newState = { [action.contextKey]: { ...state[action.contextKey], ...defaultContext }};
      break;
  }

  return { ...defaultState, ...state, ...newState };
}
