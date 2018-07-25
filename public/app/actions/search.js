import types from './types';

export function setResults(model, results, query) {
  return {
    type: types.SEARCH.SET_RESULTS,
    model,
    query,
    results,
  };
};

export function setHovering(model, value) {
  return {
    type: types.SEARCH.SET_HOVERING,
    model,
    value,
  };
}

export function clear(model) {
  return {
    type: types.SEARCH.CLEAR_MODEL,
    model
  };
}
