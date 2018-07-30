import types from './types';

export function setResults(contextKey, results, query) {
  return {
    type: types.SEARCH.SET_RESULTS,
    contextKey,
    query,
    results,
  };
};

export function setHovering(contextKey, value) {
  return {
    type: types.SEARCH.SET_HOVERING,
    contextKey,
    value,
  };
}

export function clear(contextKey) {
  return {
    type: types.SEARCH.CLEAR_CONTEXT,
    contextKey
  };
}
