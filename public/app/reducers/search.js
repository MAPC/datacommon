import types from '../actions/types';

const defaultModel = {
  query: '',
  results: [],
};

const defaultState = {
  dataset: defaultModel,
  municipality: defaultModel,
};

export default function search(state = defaultState, action) {
  let newState = {};

  switch(action.type) {
    case types.SEARCH.SET_RESULTS:
      const newModel = {
        results: action.results.sort(),
        query: action.query,
      };

      newState = { [action.model]: { ...state[action.model], ...newModel }};
      break;

    case types.SEARCH.CLEAR_MODEL:
      newState = { [action.model]: { ...state[action.model], ...defaultModel }};
      break;
  }

  return { ...defaultState, ...state, ...newState };
}
