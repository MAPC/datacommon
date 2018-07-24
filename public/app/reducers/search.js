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
        results: action.results,
        query: action.query,
      };

      newState = { [action.model]: { ...state[action.model], ...newModel }};
      break;
  }

  return { ...defaultState, ...state, ...newState };
}
