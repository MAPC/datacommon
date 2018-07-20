import types from './types';

export function search(query) {
  return {
    type: types.SEARCH_BAR.SEARCH,
    query
  };
}
